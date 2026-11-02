export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type ProgrammingLanguage = 'cpp' | 'python' | 'java' | 'javascript';

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  explanation?: string;
  isHidden?: boolean;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  topicTags: string[];
  acceptanceRate: number; // e.g. 74.2
  estimatedMinutes: number;
  description: string;
  inputDescription?: string;
  outputDescription?: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterCode: Record<ProgrammingLanguage, string>;
  hints: string[];
  testCases: TestCase[]; // Contains visible and hidden test cases
}

export type SubmissionStatus =
  | 'Accepted'
  | 'Wrong Answer'
  | 'Time Limit Exceeded'
  | 'Runtime Error'
  | 'Compilation Error'
  | 'Pending'
  | 'Unconfigured';

export interface TestResult {
  testCaseId: string;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  error?: string;
  executionTimeMs?: number;
  memoryKb?: number;
  isHidden?: boolean;
}

export interface Submission {
  id: string;
  userId: string;
  username: string;
  problemId: string;
  problemTitle: string;
  difficulty: Difficulty;
  language: ProgrammingLanguage;
  code: string;
  status: SubmissionStatus;
  executionTimeMs: number;
  memoryKb: number;
  passedTestCases: number;
  totalTestCases: number;
  errorDetails?: string;
  testResults?: TestResult[];
  createdAt: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Competitive';
  rating: number;
  streak: number;
  lastActiveDate: string;
  createdAt: string;
  favoriteLanguages?: string[];
  problemsSolvedCount: number;
  easySolvedCount: number;
  mediumSolvedCount: number;
  hardSolvedCount: number;
  totalSubmissionsCount: number;
  bookmarkedProblemIds: string[];
  solvedProblemIds: string[];
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'All Levels' | 'Advanced';
  status: 'upcoming' | 'active' | 'completed';
  startTime: string;
  endTime: string;
  durationMinutes: number;
  problemIds: string[];
  participantCount: number;
  registeredUserIds: string[];
  leaderboard: ContestRank[];
}

export interface ContestRank {
  rank: number;
  userId: string;
  username: string;
  score: number;
  solvedCount: number;
  penaltyMinutes: number;
}

export interface LeaderboardUser {
  rank: number;
  userId: string;
  username: string;
  rating: number;
  solvedCount: number;
  streak: number;
  experienceLevel: string;
  country?: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  type?: string;
}

export interface ExecutionResponse {
  success: boolean;
  status: SubmissionStatus;
  output?: string;
  stderr?: string;
  compileOutput?: string;
  executionTimeMs: number;
  memoryKb: number;
  testResults: TestResult[];
  passedTestCases: number;
  totalTestCases: number;
  engine: 'judge0' | 'local_sandbox' | 'unconfigured';
  message?: string;
}
