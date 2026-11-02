import { Contest } from '../types';

export const SEED_CONTESTS: Contest[] = [
  {
    id: 'arena-weekly-42',
    title: 'CodeArena Weekly Challenge #42',
    description: 'Weekly algorithmic contest featuring 4 problems ranging from Easy to Hard. Solve as quickly as possible with minimal penalties to climb the global leaderboard.',
    difficulty: 'All Levels',
    status: 'active',
    startTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // started 45 min ago
    endTime: new Date(Date.now() + 75 * 60 * 1000).toISOString(),   // 75 min remaining (2 hr total)
    durationMinutes: 120,
    problemIds: ['two-sum', 'valid-parentheses', 'maximum-subarray', 'coin-change'],
    participantCount: 412,
    registeredUserIds: ['user-demo-1', 'user-demo-2', 'user-alex-dev'],
    leaderboard: [
      { rank: 1, userId: 'user-top-1', username: 'AlgorithmKing', score: 400, solvedCount: 4, penaltyMinutes: 48 },
      { rank: 2, userId: 'user-top-2', username: 'ByteMaster_99', score: 400, solvedCount: 4, penaltyMinutes: 62 },
      { rank: 3, userId: 'user-top-3', username: 'CodeNinja_X', score: 300, solvedCount: 3, penaltyMinutes: 34 },
      { rank: 4, userId: 'user-top-4', username: 'DevAstronaut', score: 300, solvedCount: 3, penaltyMinutes: 45 },
      { rank: 5, userId: 'user-top-5', username: 'QuantumCoder', score: 200, solvedCount: 2, penaltyMinutes: 28 },
      { rank: 6, userId: 'user-top-6', username: 'PixelHacker', score: 200, solvedCount: 2, penaltyMinutes: 39 },
      { rank: 7, userId: 'user-top-7', username: 'RecursionQueen', score: 100, solvedCount: 1, penaltyMinutes: 12 }
    ]
  },
  {
    id: 'arena-sprint-2026',
    title: 'Algorithmic Speed Sprint 2026',
    description: 'Rapid-fire 60-minute programming sprint focusing on strings, hashing, and arrays. High intensity and fast scoring.',
    difficulty: 'Beginner',
    status: 'upcoming',
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
    durationMinutes: 60,
    problemIds: ['valid-palindrome', 'binary-search', 'best-time-to-buy-and-sell-stock'],
    participantCount: 840,
    registeredUserIds: ['user-demo-1', 'user-demo-3'],
    leaderboard: []
  },
  {
    id: 'arena-masters-dp',
    title: 'Dynamic Programming & Graphs Masters',
    description: 'Hard-tier tournament for advanced competitive programmers. Focuses on multidimensional DP, topological sorting, and shortest path algorithms.',
    difficulty: 'Advanced',
    status: 'completed',
    startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 150 * 60 * 1000).toISOString(),
    durationMinutes: 150,
    problemIds: ['coin-change', 'course-schedule', 'trapping-rain-water', 'merge-k-sorted-lists'],
    participantCount: 520,
    registeredUserIds: ['user-demo-1', 'user-demo-2', 'user-demo-4'],
    leaderboard: [
      { rank: 1, userId: 'user-top-1', username: 'AlgorithmKing', score: 400, solvedCount: 4, penaltyMinutes: 94 },
      { rank: 2, userId: 'user-top-8', username: 'GraphGuru', score: 400, solvedCount: 4, penaltyMinutes: 110 },
      { rank: 3, userId: 'user-top-2', username: 'ByteMaster_99', score: 300, solvedCount: 3, penaltyMinutes: 78 },
      { rank: 4, userId: 'user-top-3', username: 'CodeNinja_X', score: 300, solvedCount: 3, penaltyMinutes: 89 },
      { rank: 5, userId: 'user-top-9', username: 'DP_Sorcerer', score: 200, solvedCount: 2, penaltyMinutes: 52 }
    ]
  }
];
