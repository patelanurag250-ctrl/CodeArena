import { GoogleGenAI } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

function getAi(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

export interface AssistantRequest {
  action: 'explain_problem' | 'hint' | 'debug' | 'complexity' | 'concept' | 'solution_explanation' | 'chat';
  problemTitle: string;
  problemDescription: string;
  problemConstraints?: string[];
  userCode: string;
  language: string;
  executionError?: string;
  userMessage?: string;
  hintLevel?: number; // 1, 2, or 3
}

export async function generateAIAssistance(req: AssistantRequest): Promise<{ text: string; error?: string }> {
  const ai = getAi();
  if (!ai) {
    return {
      text: 'Gemini API Key is not configured on the server. Please ensure GEMINI_API_KEY is set in your environment or Secrets settings to enable intelligent AI mentorship.',
      error: 'API_KEY_MISSING'
    };
  }

  let prompt = '';
  const context = `Problem: ${req.problemTitle}
Problem Description:
${req.problemDescription}
Constraints: ${(req.problemConstraints || []).join('; ')}
User's Current Language: ${req.language}
User's Code:
\`\`\`${req.language}
${req.userCode || '// No code written yet'}
\`\`\`
${req.executionError ? `Execution Error/Test Failure:\n${req.executionError}\n` : ''}`;

  switch (req.action) {
    case 'explain_problem':
      prompt = `You are an expert, encouraging programming mentor on CodeArena.
Context:
${context}

Task: Explain this problem in beginner-friendly language.
Guidelines:
1. Use an intuitive real-world analogy.
2. Break down the inputs, expected outputs, and key constraints.
3. Highlight potential edge cases (e.g., empty inputs, negatives, duplicates).
4. Do NOT reveal code or full solutions. Focus purely on understanding the problem. Keep it structured and scannable with bullet points.`;
      break;

    case 'hint':
      const level = req.hintLevel || 1;
      prompt = `You are a coding mentor on CodeArena giving progressive hints.
Context:
${context}

Task: Provide Hint Level ${level} out of 3.
Guidelines:
- Level 1: Gentle nudge on the overall high-level approach or pattern (e.g., "Think about whether sorting or a hash map helps").
- Level 2: More concrete data structure recommendation and pointer/iteration strategy without code.
- Level 3: Step-by-step pseudo-logic walkthrough of the optimal algorithm.
CRITICAL: Do NOT give the raw solution code! Guide the user to discover it themselves. Keep it concise.`;
      break;

    case 'debug':
      prompt = `You are a senior debugging assistant on CodeArena.
Context:
${context}

Task: Analyze the user's code and identify why it might be failing or throwing errors.
Guidelines:
1. Point out specific logical flaws, boundary conditions (off-by-one, null checks), or syntax issues.
2. Explain the mechanism of the error clearly and constructively.
3. Suggest the conceptual fix or check they need to add.
4. Do NOT dump the entire solution code; show only targeted 1-2 line fixes or explain the logic fix clearly.`;
      break;

    case 'complexity':
      prompt = `You are an algorithmic complexity analyst on CodeArena.
Context:
${context}

Task: Analyze the time and space complexity of the user's current code.
Guidelines:
1. State the Big-O Time Complexity (best, average, worst case) and explain which loops/operations dominate it.
2. State the Big-O Space / Auxiliary Memory Complexity and explain what data structures contribute to it.
3. Mention the optimal theoretical time and space complexity achievable for this problem and whether the user's code achieves it.`;
      break;

    case 'concept':
      prompt = `You are a Computer Science educator on CodeArena.
Context:
${context}

Task: Explain the core DSA concepts relevant to solving this problem efficiently.
Guidelines:
1. Explain the underlying algorithm/data structure (e.g. Two Pointers, Monotonic Stack, Dynamic Programming memoization, Breadth-First Search).
2. Explain why this concept fits this specific problem pattern.
3. Provide a quick mental model or mnemonic for recognizing similar problems in tech interviews.`;
      break;

    case 'solution_explanation':
      prompt = `You are a staff engineer on CodeArena.
Context:
${context}

Task: Explain the accepted optimal approach step-by-step.
Guidelines:
1. Outline the optimal algorithm intuition.
2. Walk through the logic step-by-step with a concrete dry-run trace on a small example.
3. Show clean, well-commented implementation in ${req.language}.
4. Conclude with time and space complexity summary.`;
      break;

    case 'chat':
    default:
      prompt = `You are the CodeArena AI Mentor, helping a developer solve an algorithmic problem.
Context:
${context}

Developer's message: "${req.userMessage || 'How can I solve this?'}"

Guidelines:
1. Answer the question directly and educationally.
2. Prioritize conceptual understanding and hints over immediate full answers unless specifically asked for full solutions.
3. Keep formatting clean with markdown.`;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return {
      text: response.text || 'I analyzed your request, but received an empty response. Please try again.',
    };
  } catch (err: unknown) {
    console.error('Gemini API Error:', err);
    const msg = err instanceof Error ? err.message : String(err);
    return {
      text: `AI Assistant unavailable: ${msg}. Please verify your GEMINI_API_KEY in Settings.`,
      error: msg,
    };
  }
}
