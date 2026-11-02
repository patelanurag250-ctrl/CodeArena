import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import confetti from 'canvas-confetti';
import {
  Play,
  Send,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  HardDrive,
  Cpu,
  ChevronDown,
  ChevronRight,
  Bookmark,
  ArrowLeft,
  Settings,
  HelpCircle,
  Bug,
  Brain,
  MessageSquare,
  BookOpen,
  SendHorizonal,
  Maximize2,
  Minimize2,
  Flame,
  Check,
  Code2,
} from 'lucide-react';
import { Problem, ProgrammingLanguage, TestResult, SubmissionStatus, ExecutionResponse, AIMessage } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface WorkspaceProps {
  problemId: string;
  onNavigate: (page: any) => void;
  onSelectProblem: (id: string) => void;
}

type BottomTab = 'testcases' | 'output' | 'results' | 'ai';

export const CodingWorkspace: React.FC<WorkspaceProps> = ({
  problemId,
  onNavigate,
  onSelectProblem,
}) => {
  const { user, refreshUser } = useAuth();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [allProblems, setAllProblems] = useState<Problem[]>([]);
  const [loadingProblem, setLoadingProblem] = useState(true);

  // Editor State
  const [language, setLanguage] = useState<ProgrammingLanguage>('javascript');
  const [code, setCode] = useState<string>('');
  const [fontSize, setFontSize] = useState<number>(14);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  // Active Bottom Tab & Split sizing
  const [activeTab, setActiveTab] = useState<BottomTab>('testcases');
  const [leftWidthPercent, setLeftWidthPercent] = useState<number>(45); // Left/Right split %
  const [bottomHeightPx, setBottomHeightPx] = useState<number>(240); // Bottom panel height in px

  // Test Cases & Custom Tests
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState<number>(0);

  // Execution & Submissions
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResponse | null>(null);
  const [submissionVerdict, setSubmissionVerdict] = useState<SubmissionStatus | null>(null);
  const [lastSubmissionTime, setLastSubmissionTime] = useState<number>(0);
  const [lastSubmissionMemory, setLastSubmissionMemory] = useState<number>(0);

  // AI Assistant State
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I am your CodeArena Gemini AI Mentor. Click any action below or ask me questions to guide your problem solving.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [aiInput, setAiInput] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [hintLevel, setHintLevel] = useState<number>(1);
  const aiChatEndRef = useRef<HTMLDivElement>(null);

  // Load problem details
  useEffect(() => {
    async function fetchProblem() {
      setLoadingProblem(true);
      try {
        const [probRes, allRes] = await Promise.all([
          api.getProblem(problemId),
          api.getProblems(),
        ]);
        setProblem(probRes.problem);
        setIsBookmarked(Boolean(probRes.problem.isBookmarked));
        setAllProblems(allRes.problems);

        // Check local storage for draft code
        const savedKey = `code_${probRes.problem.id}_${language}`;
        const draft = localStorage.getItem(savedKey);
        if (draft) {
          setCode(draft);
        } else {
          setCode(probRes.problem.starterCode[language] || '');
        }
      } catch (err) {
        console.error('Failed to load problem', err);
      } finally {
        setLoadingProblem(false);
      }
    }
    fetchProblem();
  }, [problemId]);

  // When language changes, update starter code or restore draft
  const handleLanguageChange = (newLang: ProgrammingLanguage) => {
    if (!problem) return;
    // Save current
    localStorage.setItem(`code_${problem.id}_${language}`, code);

    setLanguage(newLang);
    const draft = localStorage.getItem(`code_${problem.id}_${newLang}`);
    if (draft) {
      setCode(draft);
    } else {
      setCode(problem.starterCode[newLang] || '');
    }
  };

  // Save code changes to localStorage
  const handleCodeChange = (value?: string) => {
    const val = value || '';
    setCode(val);
    if (problem) {
      localStorage.setItem(`code_${problem.id}_${language}`, val);
    }
  };

  const handleResetCode = () => {
    if (!problem) return;
    const defaultCode = problem.starterCode[language] || '';
    setCode(defaultCode);
    localStorage.setItem(`code_${problem.id}_${language}`, defaultCode);
  };

  const handleToggleBookmark = async () => {
    if (!problem) return;
    try {
      const res = await api.toggleBookmark(problem.id);
      setIsBookmarked(res.isBookmarked);
    } catch (err) {
      console.error('Failed to bookmark', err);
    }
  };

  // Run against sample visible test cases
  const handleRun = async () => {
    if (!problem) return;
    setIsRunning(true);
    setActiveTab('output');
    try {
      const result = await api.runCode(problem.id, language, code);
      setExecutionResult(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setExecutionResult({
        success: false,
        status: 'Runtime Error',
        stderr: msg,
        executionTimeMs: 0,
        memoryKb: 0,
        testResults: [],
        passedTestCases: 0,
        totalTestCases: 0,
        engine: 'local_sandbox',
        message: msg,
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Submit against ALL test cases (including hidden)
  const handleSubmit = async () => {
    if (!problem) return;
    setIsSubmitting(true);
    setActiveTab('results');
    try {
      const response = await api.submitCode(problem.id, language, code);
      setExecutionResult(response.execution);
      setSubmissionVerdict(response.submission.status);
      setLastSubmissionTime(response.submission.executionTimeMs);
      setLastSubmissionMemory(response.submission.memoryKb);

      // Trigger confetti if Accepted!
      if (response.submission.status === 'Accepted') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#B8F36B', '#69D5C5', '#FFB800'],
        });
      }

      await refreshUser();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSubmissionVerdict('Runtime Error');
      setExecutionResult({
        success: false,
        status: 'Runtime Error',
        stderr: msg,
        executionTimeMs: 0,
        memoryKb: 0,
        testResults: [],
        passedTestCases: 0,
        totalTestCases: 0,
        engine: 'local_sandbox',
        message: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // AI Assistant Trigger Helper
  const handleAiAction = async (action: 'explain_problem' | 'hint' | 'debug' | 'complexity' | 'concept' | 'solution_explanation', userText?: string) => {
    if (!problem) return;
    setActiveTab('ai');
    setAiLoading(true);

    const userLabelMap: Record<string, string> = {
      explain_problem: 'Explain this problem in simple terms',
      hint: `Give me Hint #${hintLevel}`,
      debug: 'Analyze my code for potential bugs or errors',
      complexity: 'Analyze the time and space complexity',
      concept: 'Explain the core algorithmic concepts used here',
      solution_explanation: 'Explain the optimal solution approach',
    };

    const userDisplayMsg: AIMessage = {
      id: String(Date.now()),
      role: 'user',
      content: userText || userLabelMap[action] || 'AI Request',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setAiMessages(prev => [...prev, userDisplayMsg]);

    try {
      const res = await api.getAIAssistance({
        action,
        problemTitle: problem.title,
        problemDescription: problem.description,
        problemConstraints: problem.constraints,
        userCode: code,
        language,
        executionError: executionResult?.compileOutput || executionResult?.stderr,
        userMessage: userText,
        hintLevel,
      });

      if (action === 'hint') {
        setHintLevel(prev => (prev < 3 ? prev + 1 : 1));
      }

      const assistantMsg: AIMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: action,
      };

      setAiMessages(prev => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setAiMessages(prev => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: `Unable to contact Gemini AI: ${msg}. Please ensure GEMINI_API_KEY is configured.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setAiLoading(false);
      setTimeout(() => {
        aiChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleCustomAiChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    const msg = aiInput;
    setAiInput('');
    handleAiAction('chat' as any, msg);
  };

  if (loadingProblem || !problem) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0B0D0F] text-[#929B9C]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#B8F36B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono">Loading Coding Workspace...</p>
        </div>
      </div>
    );
  }

  const sampleCases = problem.testCases.filter(tc => !tc.isHidden);
  const currentCase = sampleCases[selectedTestCaseIndex] || sampleCases[0];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[#0B0D0F] overflow-hidden select-none">
      {/* Workspace Top Toolbar */}
      <div className="h-11 px-4 bg-[#111417] border-b border-[#252C2E] flex items-center justify-between shrink-0">
        {/* Left: Back & Problem Selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('problems')}
            className="p-1 rounded-lg text-[#929B9C] hover:text-[#F3F5F2] hover:bg-[#151A1E] transition-colors"
            title="Back to Problems"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#929B9C] font-mono">Problem:</span>
            <select
              value={problem.id}
              onChange={e => onSelectProblem(e.target.value)}
              className="bg-[#151A1E] border border-[#252C2E] text-xs font-bold text-[#F3F5F2] rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#B8F36B]"
            >
              {allProblems.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.difficulty})
                </option>
              ))}
            </select>
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
              problem.difficulty === 'Easy'
                ? 'bg-[#69D5C5]/10 text-[#69D5C5]'
                : problem.difficulty === 'Medium'
                ? 'bg-[#FFB800]/10 text-[#FFB800]'
                : 'bg-[#FF5C5C]/10 text-[#FF5C5C]'
            }`}
          >
            {problem.difficulty}
          </span>

          <button
            onClick={handleToggleBookmark}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark problem'}
            className="p-1 text-[#929B9C] hover:text-[#B8F36B] transition-colors"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#B8F36B] text-[#B8F36B]' : ''}`} />
          </button>
        </div>

        {/* Right: Language Selector, Font Size, Reset, Run, Submit */}
        <div className="flex items-center gap-2.5">
          {/* Language Selector */}
          <select
            value={language}
            onChange={e => handleLanguageChange(e.target.value as ProgrammingLanguage)}
            className="bg-[#151A1E] border border-[#252C2E] text-xs font-mono font-medium text-[#F3F5F2] rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#B8F36B]"
          >
            <option value="javascript">JavaScript (Node.js)</option>
            <option value="python">Python 3</option>
            <option value="cpp">C++ (GCC)</option>
            <option value="java">Java 17</option>
          </select>

          {/* Font Size Selector */}
          <select
            value={fontSize}
            onChange={e => setFontSize(Number(e.target.value))}
            className="bg-[#151A1E] border border-[#252C2E] text-xs font-mono text-[#929B9C] rounded-lg px-2 py-1 focus:outline-none"
            title="Editor Font Size"
          >
            <option value={12}>12px</option>
            <option value={14}>14px</option>
            <option value={16}>16px</option>
            <option value={18}>18px</option>
          </select>

          {/* Reset Code */}
          <button
            onClick={handleResetCode}
            title="Reset code to default starter template"
            className="p-1.5 rounded-lg text-[#929B9C] hover:text-[#F3F5F2] hover:bg-[#151A1E] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Run Button (sample test cases) */}
          <button
            onClick={handleRun}
            disabled={isRunning || isSubmitting}
            className="px-3 py-1 bg-[#1A2024] hover:bg-[#252C2E] border border-[#252C2E] hover:border-[#B8F36B]/40 text-[#F3F5F2] font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin text-[#B8F36B]' : 'text-[#B8F36B] fill-[#B8F36B]'}`} />
            {isRunning ? 'Running...' : 'Run'}
          </button>

          {/* Submit Button (hidden test cases & scoring) */}
          <button
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
            className="px-3.5 py-1 bg-[#B8F36B] hover:bg-[#a5db5f] text-[#0B0D0F] font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-[0_0_12px_rgba(184,243,107,0.25)]"
          >
            <Send className="w-3.5 h-3.5 stroke-[2.5]" />
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>

      {/* Main Workspace Body: Horizontal Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: Problem Description, Constraints, Examples, Hints */}
        <div
          style={{ width: `${leftWidthPercent}%` }}
          className="h-full border-r border-[#252C2E] bg-[#111417] flex flex-col overflow-y-auto select-text p-6 space-y-6"
        >
          {/* Title & Metadata */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-[#929B9C]">#{problem.id}</span>
              <span className="text-xs text-[#929B9C]">•</span>
              <span className="text-xs text-[#929B9C]">{problem.acceptanceRate}% Acceptance</span>
              <span className="text-xs text-[#929B9C]">•</span>
              <span className="text-xs text-[#929B9C]">Est. {problem.estimatedMinutes} mins</span>
            </div>
            <h2 className="text-xl font-extrabold text-[#F3F5F2] tracking-tight">{problem.title}</h2>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {problem.topicTags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-[#151A1E] border border-[#252C2E] text-[11px] font-mono text-[#929B9C]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 text-sm text-[#F3F5F2]/90 leading-relaxed font-sans whitespace-pre-wrap">
            {problem.description}
          </div>

          {/* Examples */}
          <div className="space-y-4 pt-2 border-t border-[#252C2E]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#929B9C] font-mono">
              Examples
            </h4>
            {problem.examples.map((ex, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#151A1E] border border-[#252C2E] space-y-2">
                <div className="text-xs font-bold text-[#B8F36B] font-mono">Example {idx + 1}:</div>
                <div className="space-y-1 font-mono text-xs">
                  <div>
                    <span className="text-[#929B9C]">Input: </span>
                    <span className="text-[#F3F5F2]">{ex.input}</span>
                  </div>
                  <div>
                    <span className="text-[#929B9C]">Output: </span>
                    <span className="text-[#69D5C5] font-semibold">{ex.output}</span>
                  </div>
                  {ex.explanation && (
                    <div className="pt-1 text-[#929B9C] font-sans text-xs">
                      <span className="font-semibold text-[#F3F5F2]">Explanation: </span>
                      {ex.explanation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Constraints */}
          <div className="space-y-2 pt-2 border-t border-[#252C2E]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#929B9C] font-mono">
              Constraints
            </h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-[#929B9C] font-mono">
              {problem.constraints.map((c, idx) => (
                <li key={idx} className="text-[#F3F5F2]/80">
                  <code className="bg-[#151A1E] px-1.5 py-0.5 rounded text-[#B8F36B]">{c}</code>
                </li>
              ))}
            </ul>
          </div>

          {/* Hints Accordion */}
          {problem.hints && problem.hints.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#252C2E]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#929B9C] font-mono flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-[#FFB800]" /> Editorial Hints
              </h4>
              <div className="space-y-2">
                {problem.hints.map((hint, idx) => (
                  <details
                    key={idx}
                    className="group rounded-xl bg-[#151A1E] border border-[#252C2E] p-3 text-xs text-[#929B9C]"
                  >
                    <summary className="font-semibold text-[#F3F5F2] cursor-pointer hover:text-[#B8F36B] flex items-center justify-between">
                      <span>Hint {idx + 1}</span>
                      <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-2 text-[#929B9C] font-sans leading-relaxed">{hint}</p>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Monaco Editor + Bottom Tab Panels */}
        <div
          style={{ width: `${100 - leftWidthPercent}%` }}
          className="h-full flex flex-col bg-[#0B0D0F] overflow-hidden"
        >
          {/* Monaco Editor Container */}
          <div className="flex-1 relative overflow-hidden">
            <Editor
              height="100%"
              language={language === 'cpp' ? 'cpp' : language === 'python' ? 'python' : language === 'java' ? 'java' : 'javascript'}
              theme="vs-dark"
              value={code}
              onChange={handleCodeChange}
              loading={
                <div className="h-full flex items-center justify-center bg-[#0B0D0F] text-[#929B9C] text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-[#B8F36B] border-t-transparent rounded-full animate-spin" />
                    <span>Initializing Monaco Code Editor...</span>
                  </div>
                </div>
              }
              options={{
                fontSize,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontLigatures: true,
                automaticLayout: true,
                tabSize: 2,
                cursorBlinking: 'smooth',
                renderLineHighlight: 'all',
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>

          {/* Bottom Tabs Bar */}
          <div className="h-10 bg-[#111417] border-t border-[#252C2E] px-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('testcases')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'testcases'
                    ? 'bg-[#151A1E] text-[#B8F36B] border border-[#252C2E]'
                    : 'text-[#929B9C] hover:text-[#F3F5F2]'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" /> Test Cases
              </button>

              <button
                onClick={() => setActiveTab('output')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'output'
                    ? 'bg-[#151A1E] text-[#69D5C5] border border-[#252C2E]'
                    : 'text-[#929B9C] hover:text-[#F3F5F2]'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" /> Output
                {executionResult && (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      executionResult.success ? 'bg-[#B8F36B]' : 'bg-red-400'
                    }`}
                  />
                )}
              </button>

              <button
                onClick={() => setActiveTab('results')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'results'
                    ? 'bg-[#151A1E] text-[#FFB800] border border-[#252C2E]'
                    : 'text-[#929B9C] hover:text-[#F3F5F2]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Submission Results
                {submissionVerdict && (
                  <span
                    className={`text-[10px] px-1 rounded font-mono ${
                      submissionVerdict === 'Accepted'
                        ? 'bg-[#B8F36B]/20 text-[#B8F36B]'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {submissionVerdict}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('ai')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'ai'
                    ? 'bg-[#151A1E] text-[#B8F36B] border border-[#B8F36B]/30'
                    : 'text-[#929B9C] hover:text-[#F3F5F2]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#B8F36B]" /> AI Assistant
              </button>
            </div>

            {/* Height adjuster toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBottomHeightPx(prev => (prev === 240 ? 380 : 240))}
                className="text-xs text-[#929B9C] hover:text-[#F3F5F2] p-1 rounded hover:bg-[#151A1E]"
                title="Toggle bottom panel size"
              >
                {bottomHeightPx === 240 ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Bottom Panel Content */}
          <div
            style={{ height: `${bottomHeightPx}px` }}
            className="border-t border-[#252C2E] bg-[#111417] overflow-y-auto p-4 select-text font-mono text-xs"
          >
            {/* TAB 1: Test Cases */}
            {activeTab === 'testcases' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {sampleCases.map((tc, idx) => (
                    <button
                      key={tc.id}
                      onClick={() => setSelectedTestCaseIndex(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                        selectedTestCaseIndex === idx
                          ? 'bg-[#1A2024] text-[#B8F36B] border border-[#B8F36B]/40'
                          : 'bg-[#151A1E] text-[#929B9C] border border-[#252C2E] hover:text-[#F3F5F2]'
                      }`}
                    >
                      Case {idx + 1}
                    </button>
                  ))}
                </div>

                {currentCase && (
                  <div className="space-y-3 bg-[#151A1E] p-3 rounded-xl border border-[#252C2E]">
                    <div>
                      <span className="text-[11px] text-[#929B9C] uppercase block mb-1">
                        Input
                      </span>
                      <pre className="p-2.5 rounded-lg bg-[#0B0D0F] border border-[#252C2E] text-[#F3F5F2] overflow-x-auto">
                        {currentCase.input}
                      </pre>
                    </div>

                    <div>
                      <span className="text-[11px] text-[#929B9C] uppercase block mb-1">
                        Expected Output
                      </span>
                      <pre className="p-2.5 rounded-lg bg-[#0B0D0F] border border-[#252C2E] text-[#69D5C5] overflow-x-auto">
                        {currentCase.expectedOutput}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Output */}
            {activeTab === 'output' && (
              <div className="space-y-3">
                {!executionResult ? (
                  <div className="p-8 text-center text-[#929B9C] text-xs">
                    No run results yet. Click the "Run" button to execute against sample test cases.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Execution Header Banner */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#151A1E] border border-[#252C2E]">
                      <div className="flex items-center gap-2">
                        {executionResult.success ? (
                          <CheckCircle2 className="w-5 h-5 text-[#B8F36B]" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <div>
                          <div
                            className={`font-bold ${
                              executionResult.success ? 'text-[#B8F36B]' : 'text-red-400'
                            }`}
                          >
                            {executionResult.status}
                          </div>
                          <div className="text-[11px] text-[#929B9C]">
                            Passed {executionResult.passedTestCases} /{' '}
                            {executionResult.totalTestCases} sample cases
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#929B9C]">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-[#B8F36B]" />
                          {executionResult.executionTimeMs}ms
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <HardDrive className="w-3.5 h-3.5 text-[#69D5C5]" />
                          {Math.round(executionResult.memoryKb / 1024)}MB
                        </span>
                      </div>
                    </div>

                    {/* Unconfigured / Service Notice */}
                    {executionResult.message && (
                      <div className="p-2.5 rounded-lg bg-[#1A2024] border border-[#252C2E] text-[11px] text-[#929B9C]">
                        <span className="font-semibold text-[#B8F36B]">Execution Info: </span>
                        {executionResult.message}
                      </div>
                    )}

                    {/* Compilation / Stderr error */}
                    {(executionResult.compileOutput || executionResult.stderr) && (
                      <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 text-red-300">
                        <span className="text-[11px] font-bold text-red-400 uppercase block mb-1">
                          Compiler / Runtime Diagnostics:
                        </span>
                        <pre className="whitespace-pre-wrap font-mono text-xs">
                          {executionResult.compileOutput || executionResult.stderr}
                        </pre>
                      </div>
                    )}

                    {/* Per-test case result tiles */}
                    <div className="space-y-2">
                      {executionResult.testResults.map((tr, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-[#151A1E] border border-[#252C2E] space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#F3F5F2]">Case {idx + 1}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                tr.passed ? 'bg-[#B8F36B]/15 text-[#B8F36B]' : 'bg-red-500/15 text-red-400'
                              }`}
                            >
                              {tr.passed ? 'PASSED' : 'WRONG ANSWER'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <span className="text-[#929B9C] block">Expected:</span>
                              <pre className="p-1.5 rounded bg-[#0B0D0F] text-[#69D5C5] overflow-x-auto">
                                {tr.expectedOutput}
                              </pre>
                            </div>
                            <div>
                              <span className="text-[#929B9C] block">Your Output:</span>
                              <pre
                                className={`p-1.5 rounded bg-[#0B0D0F] overflow-x-auto ${
                                  tr.passed ? 'text-[#B8F36B]' : 'text-red-300'
                                }`}
                              >
                                {tr.actualOutput || tr.error || 'No output produced'}
                              </pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Submission Results */}
            {activeTab === 'results' && (
              <div className="space-y-3">
                {!submissionVerdict ? (
                  <div className="p-8 text-center text-[#929B9C] text-xs">
                    Click "Submit" to test your solution against all hidden & visible test cases and record your rating.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Big Verdict Header */}
                    <div
                      className={`p-4 rounded-xl border flex items-center justify-between ${
                        submissionVerdict === 'Accepted'
                          ? 'bg-[#B8F36B]/10 border-[#B8F36B]/40 text-[#B8F36B]'
                          : 'bg-red-500/10 border-red-500/40 text-red-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {submissionVerdict === 'Accepted' ? (
                          <CheckCircle2 className="w-7 h-7" />
                        ) : (
                          <XCircle className="w-7 h-7" />
                        )}
                        <div>
                          <div className="text-base font-extrabold tracking-tight">
                            {submissionVerdict}
                          </div>
                          <div className="text-xs text-[#929B9C]">
                            Passed {executionResult?.passedTestCases} / {executionResult?.totalTestCases} test cases
                          </div>
                        </div>
                      </div>

                      {submissionVerdict === 'Accepted' && (
                        <div className="flex items-center gap-2 bg-[#B8F36B]/20 px-3 py-1.5 rounded-lg text-xs font-bold text-[#B8F36B]">
                          <Flame className="w-4 h-4 fill-[#B8F36B]" /> +XP Awarded
                        </div>
                      )}
                    </div>

                    {/* Stats Tiles: Runtime & Memory Percentiles */}
                    <div className="grid grid-cols-2 gap-3 font-mono">
                      <div className="p-3.5 rounded-xl bg-[#151A1E] border border-[#252C2E]">
                        <span className="text-[11px] text-[#929B9C] block mb-1">Execution Time</span>
                        <div className="text-lg font-bold text-[#F3F5F2]">{lastSubmissionTime} ms</div>
                        <div className="text-[10px] text-[#B8F36B] mt-0.5">Beats ~84.2% of submissions</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#151A1E] border border-[#252C2E]">
                        <span className="text-[11px] text-[#929B9C] block mb-1">Memory Usage</span>
                        <div className="text-lg font-bold text-[#F3F5F2]">
                          {Math.round(lastSubmissionMemory / 1024) || 12} MB
                        </div>
                        <div className="text-[10px] text-[#69D5C5] mt-0.5">Beats ~78.5% of submissions</div>
                      </div>
                    </div>

                    {/* Ask AI to explain bugs if not accepted */}
                    {submissionVerdict !== 'Accepted' && (
                      <div className="p-3.5 rounded-xl bg-[#1A2024] border border-[#252C2E] flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-[#F3F5F2]">Need help fixing this?</div>
                          <div className="text-[11px] text-[#929B9C]">
                            Gemini AI can diagnose failure points without giving away the full answer.
                          </div>
                        </div>
                        <button
                          onClick={() => handleAiAction('debug')}
                          className="px-3 py-1.5 bg-[#B8F36B] hover:bg-[#a5db5f] text-[#0B0D0F] font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> Debug with AI
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Gemini AI Assistant */}
            {activeTab === 'ai' && (
              <div className="h-full flex flex-col justify-between font-sans">
                {/* AI Action Buttons Toolbar */}
                <div className="flex flex-wrap gap-1.5 pb-3 border-b border-[#252C2E] shrink-0">
                  <button
                    onClick={() => handleAiAction('explain_problem')}
                    disabled={aiLoading}
                    className="px-2.5 py-1 rounded-lg bg-[#151A1E] hover:bg-[#1A2024] border border-[#252C2E] text-xs font-semibold text-[#F3F5F2] hover:border-[#B8F36B]/40 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#B8F36B]" /> Explain Problem
                  </button>

                  <button
                    onClick={() => handleAiAction('hint')}
                    disabled={aiLoading}
                    className="px-2.5 py-1 rounded-lg bg-[#151A1E] hover:bg-[#1A2024] border border-[#252C2E] text-xs font-semibold text-[#F3F5F2] hover:border-[#FFB800]/40 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Brain className="w-3.5 h-3.5 text-[#FFB800]" /> Hint #{hintLevel}
                  </button>

                  <button
                    onClick={() => handleAiAction('debug')}
                    disabled={aiLoading}
                    className="px-2.5 py-1 rounded-lg bg-[#151A1E] hover:bg-[#1A2024] border border-[#252C2E] text-xs font-semibold text-[#F3F5F2] hover:border-red-400/40 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Bug className="w-3.5 h-3.5 text-red-400" /> Debug Code
                  </button>

                  <button
                    onClick={() => handleAiAction('complexity')}
                    disabled={aiLoading}
                    className="px-2.5 py-1 rounded-lg bg-[#151A1E] hover:bg-[#1A2024] border border-[#252C2E] text-xs font-semibold text-[#F3F5F2] hover:border-[#69D5C5]/40 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Clock className="w-3.5 h-3.5 text-[#69D5C5]" /> Complexity Analysis
                  </button>

                  <button
                    onClick={() => handleAiAction('concept')}
                    disabled={aiLoading}
                    className="px-2.5 py-1 rounded-lg bg-[#151A1E] hover:bg-[#1A2024] border border-[#252C2E] text-xs font-semibold text-[#F3F5F2] hover:border-[#B8F36B]/40 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#B8F36B]" /> Concept Breakdown
                  </button>

                  <button
                    onClick={() => handleAiAction('solution_explanation')}
                    disabled={aiLoading}
                    className="px-2.5 py-1 rounded-lg bg-[#151A1E] hover:bg-[#1A2024] border border-[#252C2E] text-xs font-semibold text-[#F3F5F2] hover:border-[#B8F36B]/40 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B8F36B]" /> Solution Walkthrough
                  </button>
                </div>

                {/* Messages Stream */}
                <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
                  {aiMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-6 h-6 rounded-lg bg-[#B8F36B]/20 text-[#B8F36B] flex items-center justify-center shrink-0 mt-0.5">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-[#B8F36B] text-[#0B0D0F] font-semibold'
                            : 'bg-[#151A1E] text-[#F3F5F2] border border-[#252C2E] whitespace-pre-wrap'
                        }`}
                      >
                        {msg.content}
                        <div
                          className={`text-[9px] mt-1 font-mono text-right ${
                            msg.role === 'user' ? 'text-[#0B0D0F]/60' : 'text-[#929B9C]'
                          }`}
                        >
                          {msg.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}

                  {aiLoading && (
                    <div className="flex items-center gap-2 text-xs text-[#B8F36B] p-2">
                      <div className="w-3.5 h-3.5 border-2 border-[#B8F36B] border-t-transparent rounded-full animate-spin" />
                      <span>Gemini is analyzing your code and drafting guidance...</span>
                    </div>
                  )}
                  <div ref={aiChatEndRef} />
                </div>

                {/* Follow-up question input */}
                <form onSubmit={handleCustomAiChatSubmit} className="pt-2 border-t border-[#252C2E] flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask Gemini follow-up questions about this problem or code..."
                    value={aiInput}
                    onChange={e => setAiInput(e.target.value)}
                    disabled={aiLoading}
                    className="flex-1 px-3 py-2 bg-[#151A1E] border border-[#252C2E] rounded-xl text-xs text-[#F3F5F2] placeholder-[#929B9C]/50 focus:outline-none focus:border-[#B8F36B]"
                  />
                  <button
                    type="submit"
                    disabled={aiLoading || !aiInput.trim()}
                    className="px-3 py-2 bg-[#B8F36B] hover:bg-[#a5db5f] text-[#0B0D0F] font-bold rounded-xl text-xs flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <SendHorizonal className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
