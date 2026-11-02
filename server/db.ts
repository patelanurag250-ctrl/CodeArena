import fs from 'node:fs';
import path from 'node:path';
import { Problem, Submission, Contest, UserProfile, LeaderboardUser } from '../src/types';
import { SEED_PROBLEMS } from '../src/data/seedProblems';
import { SEED_CONTESTS } from '../src/data/seedContests';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'arena_db.json');

export interface DatabaseSchema {
  users: Record<string, UserProfile & { passwordHash: string }>;
  problems: Record<string, Problem>;
  submissions: Record<string, Submission>;
  bookmarks: Record<string, { id: string; userId: string; problemId: string; createdAt: string }>;
  contests: Record<string, Contest>;
  userActivity: Record<string, Record<string, number>>; // userId -> { "YYYY-MM-DD": count }
}

class ArenaDB {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadFromDisk();
  }

  private loadFromDisk(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Failed to read db file, creating initial state', err);
    }
    return this.createInitialData();
  }

  private saveToDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save db to disk', err);
    }
  }

  private createInitialData(): DatabaseSchema {
    const problemsMap: Record<string, Problem> = {};
    for (const p of SEED_PROBLEMS) {
      problemsMap[p.id] = p;
    }

    const contestsMap: Record<string, Contest> = {};
    for (const c of SEED_CONTESTS) {
      contestsMap[c.id] = c;
    }

    // Default seed users
    const defaultUser1: UserProfile & { passwordHash: string } = {
      id: 'usr_alex',
      username: 'AlexChen',
      email: 'alex@codearena.dev',
      passwordHash: 'password123', // In real production use bcrypt; simple hash for demo server
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Competitive programmer & Full-stack engineer. Target: Grandmaster.',
      experienceLevel: 'Advanced',
      rating: 1845,
      streak: 12,
      lastActiveDate: new Date().toISOString().split('T')[0],
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      favoriteLanguages: ['javascript', 'python', 'cpp'],
      problemsSolvedCount: 9,
      easySolvedCount: 5,
      mediumSolvedCount: 3,
      hardSolvedCount: 1,
      totalSubmissionsCount: 24,
      bookmarkedProblemIds: ['course-schedule', 'trapping-rain-water', 'lru-cache'],
      solvedProblemIds: [
        'two-sum',
        'valid-parentheses',
        'reverse-linked-list',
        'best-time-to-buy-and-sell-stock',
        'valid-palindrome',
        'binary-search',
        'maximum-subarray',
        'longest-substring-without-repeating-characters',
        'merge-k-sorted-lists'
      ]
    };

    const defaultUser2: UserProfile & { passwordHash: string } = {
      id: 'usr_sarah',
      username: 'SarahLin',
      email: 'sarah@codearena.dev',
      passwordHash: 'password123',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      bio: 'CS Student preparing for technical SWE interviews. Loving graphs & DP!',
      experienceLevel: 'Intermediate',
      rating: 1610,
      streak: 6,
      lastActiveDate: new Date().toISOString().split('T')[0],
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      favoriteLanguages: ['python', 'javascript'],
      problemsSolvedCount: 6,
      easySolvedCount: 4,
      mediumSolvedCount: 2,
      hardSolvedCount: 0,
      totalSubmissionsCount: 15,
      bookmarkedProblemIds: ['3sum', 'coin-change'],
      solvedProblemIds: [
        'two-sum',
        'valid-parentheses',
        'valid-palindrome',
        'binary-search',
        'maximum-subarray',
        'container-with-most-water'
      ]
    };

    // Initial activity map for Alex
    const alexActivity: Record<string, number> = {};
    const now = new Date();
    for (let i = 0; i < 45; i++) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dStr = d.toISOString().split('T')[0];
      // Random activity count for heatmap
      if (i % 2 === 0 || i % 3 === 0) {
        alexActivity[dStr] = (i % 4) + 1;
      }
    }

    const submissions: Record<string, Submission> = {};
    const sampleSub1: Submission = {
      id: 'sub_init_1',
      userId: 'usr_alex',
      username: 'AlexChen',
      problemId: 'two-sum',
      problemTitle: 'Two Sum',
      difficulty: 'Easy',
      language: 'javascript',
      code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      status: 'Accepted',
      executionTimeMs: 4,
      memoryKb: 12040,
      passedTestCases: 5,
      totalTestCases: 5,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    };
    submissions[sampleSub1.id] = sampleSub1;

    const initial: DatabaseSchema = {
      users: {
        [defaultUser1.id]: defaultUser1,
        [defaultUser2.id]: defaultUser2,
      },
      problems: problemsMap,
      submissions,
      bookmarks: {
        'bm_1': { id: 'bm_1', userId: 'usr_alex', problemId: 'course-schedule', createdAt: new Date().toISOString() },
        'bm_2': { id: 'bm_2', userId: 'usr_alex', problemId: 'trapping-rain-water', createdAt: new Date().toISOString() },
        'bm_3': { id: 'bm_3', userId: 'usr_alex', problemId: 'lru-cache', createdAt: new Date().toISOString() },
      },
      contests: contestsMap,
      userActivity: {
        'usr_alex': alexActivity,
      }
    };

    return initial;
  }

  // --- Users ---
  getUserById(id: string): UserProfile | null {
    const user = this.data.users[id];
    if (!user) return null;
    const { passwordHash, ...profile } = user;
    return profile;
  }

  getUserWithAuth(email: string) {
    const found = Object.values(this.data.users).find(u => u.email.toLowerCase() === email.toLowerCase());
    return found || null;
  }

  createUser(userData: {
    username: string;
    email: string;
    password: string;
    experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Competitive';
  }): UserProfile {
    const id = 'usr_' + Math.random().toString(36).substring(2, 10);
    const today = new Date().toISOString().split('T')[0];

    const newUser: UserProfile & { passwordHash: string } = {
      id,
      username: userData.username,
      email: userData.email,
      passwordHash: userData.password,
      experienceLevel: userData.experienceLevel,
      rating: 1200,
      streak: 1,
      lastActiveDate: today,
      createdAt: new Date().toISOString(),
      favoriteLanguages: ['javascript', 'python'],
      problemsSolvedCount: 0,
      easySolvedCount: 0,
      mediumSolvedCount: 0,
      hardSolvedCount: 0,
      totalSubmissionsCount: 0,
      bookmarkedProblemIds: [],
      solvedProblemIds: [],
      bio: 'New developer ready to climb the arena rankings!',
    };

    this.data.users[id] = newUser;
    this.data.userActivity[id] = { [today]: 1 };
    this.saveToDisk();

    const { passwordHash, ...profile } = newUser;
    return profile;
  }

  updateUserProfile(userId: string, updates: Partial<UserProfile>): UserProfile | null {
    const user = this.data.users[userId];
    if (!user) return null;

    if (updates.username) user.username = updates.username;
    if (updates.avatarUrl !== undefined) user.avatarUrl = updates.avatarUrl;
    if (updates.bio !== undefined) user.bio = updates.bio;
    if (updates.experienceLevel) user.experienceLevel = updates.experienceLevel;
    if (updates.favoriteLanguages) user.favoriteLanguages = updates.favoriteLanguages;

    this.saveToDisk();
    const { passwordHash, ...profile } = user;
    return profile;
  }

  // --- Problems ---
  getProblems(): Problem[] {
    return Object.values(this.data.problems);
  }

  getProblemById(id: string): Problem | null {
    return this.data.problems[id] || null;
  }

  // --- Bookmarks ---
  getBookmarks(userId: string): Problem[] {
    const user = this.data.users[userId];
    if (!user) return [];
    return (user.bookmarkedProblemIds || [])
      .map(pid => this.data.problems[pid])
      .filter(Boolean);
  }

  toggleBookmark(userId: string, problemId: string): { isBookmarked: boolean } {
    const user = this.data.users[userId];
    if (!user) throw new Error('User not found');

    const index = user.bookmarkedProblemIds.indexOf(problemId);
    let isBookmarked = false;

    if (index >= 0) {
      user.bookmarkedProblemIds.splice(index, 1);
      isBookmarked = false;
      const bKey = Object.keys(this.data.bookmarks).find(
        k => this.data.bookmarks[k].userId === userId && this.data.bookmarks[k].problemId === problemId
      );
      if (bKey) delete this.data.bookmarks[bKey];
    } else {
      user.bookmarkedProblemIds.push(problemId);
      isBookmarked = true;
      const bmId = 'bm_' + Date.now();
      this.data.bookmarks[bmId] = {
        id: bmId,
        userId,
        problemId,
        createdAt: new Date().toISOString(),
      };
    }

    this.saveToDisk();
    return { isBookmarked };
  }

  // --- Submissions ---
  createSubmission(submission: Omit<Submission, 'id' | 'createdAt'>): Submission {
    const id = 'sub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const fullSubmission: Submission = {
      ...submission,
      id,
      createdAt: new Date().toISOString(),
    };

    this.data.submissions[id] = fullSubmission;

    // Update user stats
    const user = this.data.users[submission.userId];
    if (user) {
      user.totalSubmissionsCount = (user.totalSubmissionsCount || 0) + 1;

      // Update activity date
      const today = new Date().toISOString().split('T')[0];
      if (!this.data.userActivity[user.id]) {
        this.data.userActivity[user.id] = {};
      }
      this.data.userActivity[user.id][today] = (this.data.userActivity[user.id][today] || 0) + 1;

      // Update streak
      if (user.lastActiveDate !== today) {
        const lastDate = new Date(user.lastActiveDate);
        const currDate = new Date(today);
        const diffDays = Math.round((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          user.streak = (user.streak || 0) + 1;
        } else if (diffDays > 1) {
          user.streak = 1;
        }
        user.lastActiveDate = today;
      }

      // If accepted and not solved previously
      if (submission.status === 'Accepted' && !user.solvedProblemIds.includes(submission.problemId)) {
        user.solvedProblemIds.push(submission.problemId);
        user.problemsSolvedCount = user.solvedProblemIds.length;

        if (submission.difficulty === 'Easy') user.easySolvedCount = (user.easySolvedCount || 0) + 1;
        else if (submission.difficulty === 'Medium') user.mediumSolvedCount = (user.mediumSolvedCount || 0) + 1;
        else if (submission.difficulty === 'Hard') user.hardSolvedCount = (user.hardSolvedCount || 0) + 1;

        // Rating increment
        const pts = submission.difficulty === 'Easy' ? 10 : submission.difficulty === 'Medium' ? 25 : 50;
        user.rating = (user.rating || 1200) + pts;
      }
    }

    this.saveToDisk();
    return fullSubmission;
  }

  getSubmissions(filter?: { userId?: string; problemId?: string }): Submission[] {
    let list = Object.values(this.data.submissions);
    if (filter?.userId) {
      list = list.filter(s => s.userId === filter.userId);
    }
    if (filter?.problemId) {
      list = list.filter(s => s.problemId === filter.problemId);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // --- Activity & Stats ---
  getUserActivity(userId: string): Record<string, number> {
    return this.data.userActivity[userId] || {};
  }

  // --- Contests ---
  getContests(): Contest[] {
    return Object.values(this.data.contests);
  }

  getContestById(id: string): Contest | null {
    return this.data.contests[id] || null;
  }

  joinContest(contestId: string, userId: string): boolean {
    const contest = this.data.contests[contestId];
    if (!contest) return false;
    if (!contest.registeredUserIds.includes(userId)) {
      contest.registeredUserIds.push(userId);
      contest.participantCount += 1;
      this.saveToDisk();
    }
    return true;
  }

  // --- Leaderboard ---
  getLeaderboard(period: 'weekly' | 'monthly' | 'all-time'): LeaderboardUser[] {
    const allUsers = Object.values(this.data.users);
    const sorted = allUsers.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return sorted.map((u, idx) => ({
      rank: idx + 1,
      userId: u.id,
      username: u.username,
      rating: u.rating || 1200,
      solvedCount: u.problemsSolvedCount || 0,
      streak: u.streak || 1,
      experienceLevel: u.experienceLevel || 'Intermediate',
    }));
  }
}

export const dbInstance = new ArenaDB();
