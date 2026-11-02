import { Request, Response, Router } from 'express';
import { dbInstance } from './db';
import { generateAIAssistance, AssistantRequest } from './gemini';
import { executeCodeOnTestCases, isJudge0Configured } from './judge0';
import { ProgrammingLanguage } from '../src/types';

export const apiRouter = Router();

// Middleware to extract user from Authorization header
function getAuthUser(req: Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/i, '');
  // For demo/session, token is userId
  return dbInstance.getUserById(token);
}

// ----------------- SYSTEM STATUS -----------------
apiRouter.get('/system/status', (_req: Request, res: Response) => {
  const geminiConfigured = Boolean(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' &&
    process.env.GEMINI_API_KEY.trim() !== ''
  );
  const judge0Configured = isJudge0Configured();

  res.json({
    gemini: {
      configured: geminiConfigured,
      model: 'gemini-3.8-flash',
    },
    judge0: {
      configured: judge0Configured,
      host: process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com',
      supportedLanguages: ['cpp', 'python', 'java', 'javascript'],
    },
    localSandbox: {
      available: true,
      supportedLanguages: ['javascript'],
    }
  });
});

// ----------------- AUTHENTICATION -----------------
apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { username, email, password, experienceLevel } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required.' });
  }

  const existing = dbInstance.getUserWithAuth(email);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const newUser = dbInstance.createUser({
    username,
    email,
    password,
    experienceLevel: experienceLevel || 'Beginner',
  });

  res.status(201).json({
    user: newUser,
    token: newUser.id,
  });
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = dbInstance.getUserWithAuth(email);
  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const { passwordHash, ...profile } = user;
  res.json({
    user: profile,
    token: profile.id,
  });
});

// Quick demo login switch
apiRouter.post('/auth/demo', (req: Request, res: Response) => {
  const { demoType } = req.body; // 'alex' or 'sarah'
  const userId = demoType === 'sarah' ? 'usr_sarah' : 'usr_alex';
  const user = dbInstance.getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'Demo user not found.' });
  }
  res.json({
    user,
    token: user.id,
  });
});

apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({ user });
});

apiRouter.post('/auth/update-profile', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const updated = dbInstance.updateUserProfile(user.id, req.body);
  res.json({ user: updated });
});

apiRouter.post('/auth/reset-password', (req: Request, res: Response) => {
  const { email } = req.body;
  const user = dbInstance.getUserWithAuth(email);
  if (!user) {
    return res.status(404).json({ error: 'No account found with this email.' });
  }
  // For demo app: respond with success instruction
  res.json({
    message: `Password reset link simulated for ${email}. Temporary password is: password123`,
  });
});

// ----------------- PROBLEMS -----------------
apiRouter.get('/problems', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const problems = dbInstance.getProblems();

  // Strip hidden test cases from problem listing
  const sanitized = problems.map(p => ({
    ...p,
    testCases: p.testCases.filter(tc => !tc.isHidden),
    isSolved: user ? user.solvedProblemIds.includes(p.id) : false,
    isBookmarked: user ? user.bookmarkedProblemIds.includes(p.id) : false,
  }));

  res.json({ problems: sanitized });
});

apiRouter.get('/problems/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const user = getAuthUser(req);
  const problem = dbInstance.getProblemById(id);

  if (!problem) {
    return res.status(404).json({ error: 'Problem not found' });
  }

  // Hide hidden test cases from the client
  const sanitized = {
    ...problem,
    testCases: problem.testCases.filter(tc => !tc.isHidden),
    isSolved: user ? user.solvedProblemIds.includes(problem.id) : false,
    isBookmarked: user ? user.bookmarkedProblemIds.includes(problem.id) : false,
  };

  res.json({ problem: sanitized });
});

// ----------------- EXECUTION & SUBMISSIONS -----------------
// 1. Run against visible/sample test cases
apiRouter.post('/execute/run', async (req: Request, res: Response) => {
  const { problemId, language, code, customTestCases } = req.body;
  const problem = dbInstance.getProblemById(problemId);

  if (!problem) {
    return res.status(404).json({ error: 'Problem not found' });
  }

  // Use visible test cases or custom user provided cases
  const casesToRun = customTestCases && customTestCases.length > 0
    ? customTestCases
    : problem.testCases.filter(tc => !tc.isHidden);

  try {
    const execResult = await executeCodeOnTestCases(language, code, casesToRun);
    res.json(execResult);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// 2. Submit against ALL test cases (including hidden) and persist submission
apiRouter.post('/execute/submit', async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Must be logged in to submit code.' });
  }

  const { problemId, language, code } = req.body;
  const problem = dbInstance.getProblemById(problemId);

  if (!problem) {
    return res.status(404).json({ error: 'Problem not found' });
  }

  try {
    // Run against ALL test cases (visible + hidden)
    const execResult = await executeCodeOnTestCases(language, code, problem.testCases);

    // Save submission to database
    const submission = dbInstance.createSubmission({
      userId: user.id,
      username: user.username,
      problemId: problem.id,
      problemTitle: problem.title,
      difficulty: problem.difficulty,
      language: language as ProgrammingLanguage,
      code,
      status: execResult.status,
      executionTimeMs: execResult.executionTimeMs,
      memoryKb: execResult.memoryKb,
      passedTestCases: execResult.passedTestCases,
      totalTestCases: execResult.totalTestCases,
      errorDetails: execResult.compileOutput || execResult.stderr,
      testResults: execResult.testResults.map(tr => ({
        ...tr,
        // Mask inputs/outputs for hidden test cases
        input: tr.isHidden ? '[Hidden Test Case]' : tr.input,
        expectedOutput: tr.isHidden ? '[Hidden Output]' : tr.expectedOutput,
        actualOutput: tr.isHidden && !tr.passed ? '[Hidden Output]' : tr.actualOutput,
      })),
    });

    // Fetch updated user profile
    const updatedUser = dbInstance.getUserById(user.id);

    res.json({
      submission,
      execution: execResult,
      user: updatedUser,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

apiRouter.get('/submissions', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { problemId, all } = req.query;

  // If user requested all submissions or specific problem, filter accordingly
  let filter: { userId?: string; problemId?: string } = {};
  if (!all && user) {
    filter.userId = user.id;
  }
  if (problemId) {
    filter.problemId = String(problemId);
  }

  const submissions = dbInstance.getSubmissions(filter);
  res.json({ submissions });
});

// ----------------- AI CODING ASSISTANT -----------------
apiRouter.post('/ai/assist', async (req: Request, res: Response) => {
  const {
    action,
    problemTitle,
    problemDescription,
    problemConstraints,
    userCode,
    language,
    executionError,
    userMessage,
    hintLevel,
  } = req.body as AssistantRequest;

  if (!action || !problemTitle) {
    return res.status(400).json({ error: 'Missing required action or problem information.' });
  }

  try {
    const result = await generateAIAssistance({
      action,
      problemTitle,
      problemDescription,
      problemConstraints,
      userCode,
      language,
      executionError,
      userMessage,
      hintLevel,
    });

    res.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// ----------------- BOOKMARKS -----------------
apiRouter.get('/bookmarks', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const bookmarkedProblems = dbInstance.getBookmarks(user.id);
  res.json({ bookmarks: bookmarkedProblems });
});

apiRouter.post('/bookmarks/toggle', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { problemId } = req.body;
  if (!problemId) {
    return res.status(400).json({ error: 'problemId is required' });
  }

  const result = dbInstance.toggleBookmark(user.id, problemId);
  res.json(result);
});

// ----------------- CONTESTS -----------------
apiRouter.get('/contests', (req: Request, res: Response) => {
  const contests = dbInstance.getContests();
  res.json({ contests });
});

apiRouter.get('/contests/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const contest = dbInstance.getContestById(id);
  if (!contest) {
    return res.status(404).json({ error: 'Contest not found' });
  }
  res.json({ contest });
});

apiRouter.post('/contests/:id/join', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { id } = req.params;
  const success = dbInstance.joinContest(id, user.id);
  res.json({ success });
});

// ----------------- LEADERBOARD -----------------
apiRouter.get('/leaderboard', (req: Request, res: Response) => {
  const period = (req.query.period as 'weekly' | 'monthly' | 'all-time') || 'all-time';
  const leaderboard = dbInstance.getLeaderboard(period);
  res.json({ leaderboard });
});

// ----------------- USER ACTIVITY & STATS -----------------
apiRouter.get('/users/:id/activity', (req: Request, res: Response) => {
  const { id } = req.params;
  const activity = dbInstance.getUserActivity(id);
  res.json({ activity });
});
