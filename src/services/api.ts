import {
  Problem,
  Submission,
  Contest,
  UserProfile,
  LeaderboardUser,
  ExecutionResponse,
  AIMessage,
} from '../types';

const TOKEN_KEY = 'codearena_auth_token';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `Request failed (${response.status})`;
      try {
        const errorData = await response.json();
        if (errorData.error) errorMessage = errorData.error;
      } catch {
        // ignore json parse fail
      }
      throw new Error(errorMessage);
    }

    return response.json() as Promise<T>;
  }

  // System
  async getSystemStatus() {
    return this.request<{
      gemini: { configured: boolean; model: string };
      judge0: { configured: boolean; host: string; supportedLanguages: string[] };
      localSandbox: { available: boolean; supportedLanguages: string[] };
    }>('/api/system/status');
  }

  // Auth
  async register(data: {
    username: string;
    email: string;
    password: string;
    experienceLevel: string;
  }) {
    const res = await this.request<{ user: UserProfile; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(res.token);
    return res;
  }

  async login(email: string, password: string) {
    const res = await this.request<{ user: UserProfile; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(res.token);
    return res;
  }

  async demoLogin(demoType: 'alex' | 'sarah') {
    const res = await this.request<{ user: UserProfile; token: string }>('/api/auth/demo', {
      method: 'POST',
      body: JSON.stringify({ demoType }),
    });
    this.setToken(res.token);
    return res;
  }

  async getMe() {
    return this.request<{ user: UserProfile }>('/api/auth/me');
  }

  async updateProfile(updates: Partial<UserProfile>) {
    return this.request<{ user: UserProfile }>('/api/auth/update-profile', {
      method: 'POST',
      body: JSON.stringify(updates),
    });
  }

  async resetPassword(email: string) {
    return this.request<{ message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Problems
  async getProblems() {
    return this.request<{ problems: (Problem & { isSolved?: boolean; isBookmarked?: boolean })[] }>('/api/problems');
  }

  async getProblem(id: string) {
    return this.request<{ problem: Problem & { isSolved?: boolean; isBookmarked?: boolean } }>(`/api/problems/${id}`);
  }

  // Execution
  async runCode(problemId: string, language: string, code: string, customTestCases?: any[]) {
    return this.request<ExecutionResponse>('/api/execute/run', {
      method: 'POST',
      body: JSON.stringify({ problemId, language, code, customTestCases }),
    });
  }

  async submitCode(problemId: string, language: string, code: string) {
    return this.request<{
      submission: Submission;
      execution: ExecutionResponse;
      user: UserProfile;
    }>('/api/execute/submit', {
      method: 'POST',
      body: JSON.stringify({ problemId, language, code }),
    });
  }

  // AI Assistant
  async getAIAssistance(payload: {
    action: 'explain_problem' | 'hint' | 'debug' | 'complexity' | 'concept' | 'solution_explanation' | 'chat';
    problemTitle: string;
    problemDescription: string;
    problemConstraints?: string[];
    userCode: string;
    language: string;
    executionError?: string;
    userMessage?: string;
    hintLevel?: number;
  }) {
    return this.request<{ text: string; error?: string }>('/api/ai/assist', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Submissions
  async getSubmissions(problemId?: string, all?: boolean) {
    const params = new URLSearchParams();
    if (problemId) params.append('problemId', problemId);
    if (all) params.append('all', 'true');
    const qs = params.toString() ? `?${params.toString()}` : '';
    return this.request<{ submissions: Submission[] }>(`/api/submissions${qs}`);
  }

  // Bookmarks
  async getBookmarks() {
    return this.request<{ bookmarks: Problem[] }>('/api/bookmarks');
  }

  async toggleBookmark(problemId: string) {
    return this.request<{ isBookmarked: boolean }>('/api/bookmarks/toggle', {
      method: 'POST',
      body: JSON.stringify({ problemId }),
    });
  }

  // Contests
  async getContests() {
    return this.request<{ contests: Contest[] }>('/api/contests');
  }

  async getContest(id: string) {
    return this.request<{ contest: Contest }>(`/api/contests/${id}`);
  }

  async joinContest(id: string) {
    return this.request<{ success: boolean }>(`/api/contests/${id}/join`, {
      method: 'POST',
    });
  }

  // Leaderboard
  async getLeaderboard(period: 'weekly' | 'monthly' | 'all-time' = 'all-time') {
    return this.request<{ leaderboard: LeaderboardUser[] }>(`/api/leaderboard?period=${period}`);
  }

  // User Activity
  async getUserActivity(userId: string) {
    return this.request<{ activity: Record<string, number> }>(`/api/users/${userId}/activity`);
  }
}

export const api = new ApiService();
