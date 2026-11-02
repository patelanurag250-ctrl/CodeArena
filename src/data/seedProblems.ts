import { Problem } from '../types';

export const SEED_PROBLEMS: Problem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    topicTags: ['Arrays', 'Hashing'],
    acceptanceRate: 52.8,
    estimatedMinutes: 15,
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    inputDescription: 'An array of integers `nums` and an integer `target`.',
    outputDescription: 'An array of two integers representing indices `[i, j]`.',
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      },
      {
        input: 'nums = [3, 3], target = 6',
        output: '[0, 1]'
      }
    ],
    hints: [
      'A brute-force approach checks every pair using nested loops in O(n^2). Can we do better?',
      'Can we use a Hash Map to store previously seen numbers and their indices in O(1) lookup?',
      'For each number x, check if (target - x) is already present in your map.'
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Write your code here
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
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Write your code here
        seen = {}
        for i, num in enumerate(nums):
            diff = target - num
            if diff in seen:
                return [seen[diff], i]
            seen[num] = i
        return []`,
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (seen.count(complement)) {
                return {seen[complement], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};`,
      java: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`
    },
    testCases: [
      {
        id: 'tc1',
        input: '{"nums": [2, 7, 11, 15], "target": 9}',
        expectedOutput: '[0, 1]',
        explanation: '2 + 7 = 9'
      },
      {
        id: 'tc2',
        input: '{"nums": [3, 2, 4], "target": 6}',
        expectedOutput: '[1, 2]',
        explanation: '2 + 4 = 6'
      },
      {
        id: 'tc3',
        input: '{"nums": [3, 3], "target": 6}',
        expectedOutput: '[0, 1]'
      },
      {
        id: 'tc4',
        input: '{"nums": [-1, -2, -3, -4, -5], "target": -8}',
        expectedOutput: '[2, 4]',
        isHidden: true
      },
      {
        id: 'tc5',
        input: '{"nums": [0, 4, 3, 0], "target": 0}',
        expectedOutput: '[0, 3]',
        isHidden: true
      }
    ]
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    topicTags: ['Stacks', 'Strings'],
    acceptanceRate: 41.5,
    estimatedMinutes: 15,
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only: ()[]{}'],
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
      { input: 's = "([)]"', output: 'false' }
    ],
    hints: [
      'Use a Stack data structure (LIFO: Last-In First-Out).',
      'When you encounter an opening bracket, push its matching closing bracket onto the stack.',
      'When you encounter a closing bracket, pop from stack and check if it matches.'
    ],
    starterCode: {
      javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.length === 0 || stack.pop() !== map[char]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {')': '(', '}': '{', ']': '['}
        for char in s:
            if char in mapping.values():
                stack.append(char)
            elif char in mapping:
                if not stack or stack.pop() != mapping[char]:
                    return False
        return len(stack) == 0`,
      cpp: `#include <string>
#include <stack>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for (char c : s) {
            if (c == '(' || c == '{' || c == '[') st.push(c);
            else {
                if (st.empty()) return false;
                if (c == ')' && st.top() != '(') return false;
                if (c == '}' && st.top() != '{') return false;
                if (c == ']' && st.top() != '[') return false;
                st.pop();
            }
        }
        return st.empty();
    }
};`,
      java: `import java.util.Stack;

class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`
    },
    testCases: [
      { id: 'tc1', input: '{"s": "()"}', expectedOutput: 'true' },
      { id: 'tc2', input: '{"s": "()[]{}"}', expectedOutput: 'true' },
      { id: 'tc3', input: '{"s": "(]"}', expectedOutput: 'false' },
      { id: 'tc4', input: '{"s": "{[]}"}', expectedOutput: 'true', isHidden: true },
      { id: 'tc5', input: '{"s": "((((("}', expectedOutput: 'false', isHidden: true }
    ]
  },
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    topicTags: ['Linked Lists'],
    acceptanceRate: 76.1,
    estimatedMinutes: 15,
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list.`,
    constraints: ['The number of nodes in the list is the range [0, 5000].', '-5000 <= Node.val <= 5000'],
    examples: [
      { input: 'head = [1, 2, 3, 4, 5]', output: '[5, 4, 3, 2, 1]' },
      { input: 'head = [1, 2]', output: '[2, 1]' },
      { input: 'head = []', output: '[]' }
    ],
    hints: [
      'Iterative approach: Keep three pointers: prev, curr, and next.',
      'At each node, save curr.next, redirect curr.next to prev, then advance prev and curr.'
    ],
    starterCode: {
      javascript: `function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr) {
    const nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}`,
      python: `class Solution:
    def reverseList(self, head):
        prev = None
        curr = head
        while curr:
            next_node = curr.next
            curr.next = prev
            prev = curr
            curr = next_node
        return prev`,
      cpp: `class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* curr = head;
        while (curr != nullptr) {
            ListNode* nextTemp = curr->next;
            curr->next = prev;
            prev = curr;
            curr = nextTemp;
        }
        return prev;
    }
};`,
      java: `class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode nextTemp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextTemp;
        }
        return prev;
    }
}`
    },
    testCases: [
      { id: 'tc1', input: '{"head": [1, 2, 3, 4, 5]}', expectedOutput: '[5, 4, 3, 2, 1]' },
      { id: 'tc2', input: '{"head": [1, 2]}', expectedOutput: '[2, 1]' },
      { id: 'tc3', input: '{"head": []}', expectedOutput: '[]' },
      { id: 'tc4', input: '{"head": [42]}', expectedOutput: '[42]', isHidden: true }
    ]
  },
  {
    id: 'best-time-to-buy-and-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    topicTags: ['Arrays', 'Greedy', 'Dynamic Programming'],
    acceptanceRate: 54.4,
    estimatedMinutes: 20,
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i-th\` day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.`,
    constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    examples: [
      {
        input: 'prices = [7, 1, 5, 3, 6, 4]',
        output: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.'
      },
      {
        input: 'prices = [7, 6, 4, 3, 1]',
        output: '0',
        explanation: 'In this case, no transactions are done and max profit = 0.'
      }
    ],
    hints: [
      'Maintain the minimum price seen so far as you iterate through the days.',
      'On each day, calculate the profit if you sold today (price - minPrice) and update maxProfit.'
    ],
    starterCode: {
      javascript: `function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;
  for (let i = 0; i < prices.length; i++) {
    if (prices[i] < minPrice) {
      minPrice = prices[i];
    } else if (prices[i] - minPrice > maxProfit) {
      maxProfit = prices[i] - minPrice;
    }
  }
  return maxProfit;
}`,
      python: `class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        min_price = float('inf')
        max_profit = 0
        for price in prices:
            if price < min_price:
                min_price = price
            elif price - min_price > max_profit:
                max_profit = price - min_price
        return max_profit`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minPrice = 1e9, maxProfit = 0;
        for (int p : prices) {
            minPrice = min(minPrice, p);
            maxProfit = max(maxProfit, p - minPrice);
        }
        return maxProfit;
    }
};`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;
        for (int price : prices) {
            if (price < minPrice) minPrice = price;
            else if (price - minPrice > maxProfit) maxProfit = price - minPrice;
        }
        return maxProfit;
    }
}`
    },
    testCases: [
      { id: 'tc1', input: '{"prices": [7, 1, 5, 3, 6, 4]}', expectedOutput: '5' },
      { id: 'tc2', input: '{"prices": [7, 6, 4, 3, 1]}', expectedOutput: '0' },
      { id: 'tc3', input: '{"prices": [2, 4, 1]}', expectedOutput: '2', isHidden: true },
      { id: 'tc4', input: '{"prices": [1, 2, 3, 4, 5]}', expectedOutput: '4', isHidden: true }
    ]
  },
  {
    id: 'valid-palindrome',
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    topicTags: ['Strings', 'Two Pointers'],
    acceptanceRate: 47.9,
    estimatedMinutes: 15,
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.`,
    constraints: ['1 <= s.length <= 2 * 10^5', 's consists only of printable ASCII characters.'],
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: 'true',
        explanation: '"amanaplanacanalpanama" is a palindrome.'
      },
      {
        input: 's = "race a car"',
        output: 'false',
        explanation: '"raceacar" is not a palindrome.'
      },
      {
        input: 's = " "',
        output: 'true',
        explanation: 's is an empty string "" after removing non-alphanumeric characters.'
      }
    ],
    hints: [
      'Two pointers moving towards the center from left and right.',
      'Skip non-alphanumeric characters on both sides before comparing characters in lowercase.'
    ],
    starterCode: {
      javascript: `function isPalindrome(s) {
  let left = 0, right = s.length - 1;
  const isAlphanumeric = (c) => /[a-zA-Z0-9]/.test(c);
  while (left < right) {
    while (left < right && !isAlphanumeric(s[left])) left++;
    while (left < right && !isAlphanumeric(s[right])) right--;
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left++;
    right--;
  }
  return true;
}`,
      python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        filtered = [c.lower() for c in s if c.isalnum()]
        return filtered == filtered[::-1]`,
      cpp: `#include <string>
#include <cctype>
using namespace std;

class Solution {
public:
    bool isPalindrome(string s) {
        int left = 0, right = s.size() - 1;
        while (left < right) {
            while (left < right && !isalnum(s[left])) left++;
            while (left < right && !isalnum(s[right])) right--;
            if (tolower(s[left]) != tolower(s[right])) return false;
            left++; right--;
        }
        return true;
    }
};`,
      java: `class Solution {
    public boolean isPalindrome(String s) {
        int left = 0, right = s.length() - 1;
        while (left < right) {
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;
            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) return false;
            left++; right--;
        }
        return true;
    }
}`
    },
    testCases: [
      { id: 'tc1', input: '{"s": "A man, a plan, a canal: Panama"}', expectedOutput: 'true' },
      { id: 'tc2', input: '{"s": "race a car"}', expectedOutput: 'false' },
      { id: 'tc3', input: '{"s": " "}', expectedOutput: 'true' },
      { id: 'tc4', input: '{"s": "0P"}', expectedOutput: 'false', isHidden: true }
    ]
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    topicTags: ['Binary Search', 'Arrays'],
    acceptanceRate: 57.3,
    estimatedMinutes: 15,
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    constraints: ['1 <= nums.length <= 10^4', '-10^4 < nums[i], target < 10^4', 'All elements in nums are unique and sorted in ascending order.'],
    examples: [
      { input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4' },
      { input: 'nums = [-1, 0, 3, 5, 9, 12], target = 2', output: '-1', explanation: '2 does not exist in nums so return -1' }
    ],
    hints: [
      'Initialize left = 0 and right = nums.length - 1.',
      'Calculate mid = left + Math.floor((right - left) / 2) to avoid overflow.',
      'Compare nums[mid] with target and narrow the search boundary.'
    ],
    starterCode: {
      javascript: `function search(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
      python: `class Solution:
    def search(self, nums: list[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        while left <= right:
            mid = (left + right) // 2
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return -1`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int search(vector<int>& nums, int target) {
        int l = 0, r = nums.size() - 1;
        while (l <= r) {
            int m = l + (r - l) / 2;
            if (nums[m] == target) return m;
            if (nums[m] < target) l = m + 1;
            else r = m - 1;
        }
        return -1;
    }
};`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
}`
    },
    testCases: [
      { id: 'tc1', input: '{"nums": [-1, 0, 3, 5, 9, 12], "target": 9}', expectedOutput: '4' },
      { id: 'tc2', input: '{"nums": [-1, 0, 3, 5, 9, 12], "target": 2}', expectedOutput: '-1' },
      { id: 'tc3', input: '{"nums": [5], "target": 5}', expectedOutput: '0', isHidden: true }
    ]
  },
  {
    id: 'maximum-subarray',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    topicTags: ['Arrays', 'Dynamic Programming'],
    acceptanceRate: 50.8,
    estimatedMinutes: 20,
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

A subarray is a contiguous non-empty sequence of elements within an array.`,
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    examples: [
      {
        input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
        output: '6',
        explanation: 'The subarray [4, -1, 2, 1] has the largest sum 6.'
      },
      {
        input: 'nums = [1]',
        output: '1'
      },
      {
        input: 'nums = [5, 4, -1, 7, 8]',
        output: '23'
      }
    ],
    hints: [
      "Kadane's Algorithm: As you iterate through the array, at each index you decide whether to add nums[i] to current sum or start a new subarray with nums[i].",
      'currentMax = Math.max(nums[i], currentMax + nums[i])'
    ],
    starterCode: {
      javascript: `function maxSubArray(nums) {
  let maxSoFar = nums[0];
  let currMax = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currMax = Math.max(nums[i], currMax + nums[i]);
    maxSoFar = Math.max(maxSoFar, currMax);
  }
  return maxSoFar;
}`,
      python: `class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        max_so_far = current_max = nums[0]
        for x in nums[1:]:
            current_max = max(x, current_max + x)
            max_so_far = max(max_so_far, current_max)
        return max_so_far`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int maxSoFar = nums[0], currMax = nums[0];
        for (size_t i = 1; i < nums.size(); i++) {
            currMax = max(nums[i], currMax + nums[i]);
            maxSoFar = max(maxSoFar, currMax);
        }
        return maxSoFar;
    }
};`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        int maxSoFar = nums[0], currMax = nums[0];
        for (int i = 1; i < nums.length; i++) {
            currMax = Math.max(nums[i], currMax + nums[i]);
            maxSoFar = Math.max(maxSoFar, currMax);
        }
        return maxSoFar;
    }
}`
    },
    testCases: [
      { id: 'tc1', input: '{"nums": [-2, 1, -3, 4, -1, 2, 1, -5, 4]}', expectedOutput: '6' },
      { id: 'tc2', input: '{"nums": [1]}', expectedOutput: '1' },
      { id: 'tc3', input: '{"nums": [5, 4, -1, 7, 8]}', expectedOutput: '23' },
      { id: 'tc4', input: '{"nums": [-1, -2, -3]}', expectedOutput: '-1', isHidden: true }
    ]
  },
  {
    id: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    topicTags: ['Strings', 'Hashing'],
    acceptanceRate: 34.6,
    estimatedMinutes: 25,
    description: `Given a string \`s\`, find the length of the longest substring without repeating characters.`,
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
      { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with length 3 ("pwke" is a subsequence, not substring).' }
    ],
    hints: [
      'Use a Sliding Window with two pointers: left and right.',
      'Use a Map to track the most recent index where each character appeared.',
      'When you see a repeating character, jump the left pointer forward past its last occurrence.'
    ],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {
  let maxLength = 0;
  let left = 0;
  const lastSeen = new Map();
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (lastSeen.has(char) && lastSeen.get(char) >= left) {
      left = lastSeen.get(char) + 1;
    }
    lastSeen.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
}`,
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        last_seen = {}
        left = 0
        max_len = 0
        for right, char in enumerate(s):
            if char in last_seen and last_seen[char] >= left:
                left = last_seen[char] + 1
            last_seen[char] = right
            max_len = max(max_len, right - left + 1)
        return max_len`,
      cpp: `#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> lastSeen;
        int maxLen = 0, left = 0;
        for (int right = 0; right < s.length(); right++) {
            if (lastSeen.count(s[right]) && lastSeen[s[right]] >= left) {
                left = lastSeen[s[right]] + 1;
            }
            lastSeen[s[right]] = right;
            maxLen = max(maxLen, right - left + 1);
        }
        return maxLen;
    }
};`,
      java: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> lastSeen = new HashMap<>();
        int maxLen = 0, left = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (lastSeen.containsKey(c) && lastSeen.get(c) >= left) {
                left = lastSeen.get(c) + 1;
            }
            lastSeen.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}`
    },
    testCases: [
      { id: 'tc1', input: '{"s": "abcabcbb"}', expectedOutput: '3' },
      { id: 'tc2', input: '{"s": "bbbbb"}', expectedOutput: '1' },
      { id: 'tc3', input: '{"s": "pwwkew"}', expectedOutput: '3' },
      { id: 'tc4', input: '{"s": ""}', expectedOutput: '0', isHidden: true },
      { id: 'tc5', input: '{"s": "tmmzuxt"}', expectedOutput: '5', isHidden: true }
    ]
  },
  {
    id: '3sum',
    title: '3Sum',
    difficulty: 'Medium',
    topicTags: ['Arrays', 'Sorting'],
    acceptanceRate: 33.7,
    estimatedMinutes: 30,
    description: `Given an integer array nums, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.`,
    constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    examples: [
      {
        input: 'nums = [-1, 0, 1, 2, -1, -4]',
        output: '[[-1, -1, 2], [-1, 0, 1]]',
        explanation: 'nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0. The distinct triplets are [-1, -1, 2] and [-1, 0, 1].'
      },
      {
        input: 'nums = [0, 1, 1]',
        output: '[]'
      },
      {
        input: 'nums = [0, 0, 0]',
        output: '[[0, 0, 0]]'
      }
    ],
    hints: [
      'Sort the array first in O(n log n).',
      'Iterate through the array with index i. For each i, use two pointers (left = i + 1, right = n - 1) to find pairs that sum to -nums[i].',
      'Be careful to skip duplicate values for i, left, and right to avoid duplicate triplets.'
    ],
    starterCode: {
      javascript: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) left++;
      else right--;
    }
  }
  return result;
}`,
      python: `class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        nums.sort()
        res = []
        for i in range(len(nums) - 2):
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            l, r = i + 1, len(nums) - 1
            while l < r:
                s = nums[i] + nums[l] + nums[r]
                if s == 0:
                    res.append([nums[i], nums[l], nums[r]])
                    while l < r and nums[l] == nums[l + 1]: l += 1
                    while l < r and nums[r] == nums[r - 1]: r -= 1
                    l += 1; r -= 1
                elif s < 0: l += 1
                else: r -= 1
        return res`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> res;
        for (int i = 0; i < (int)nums.size() - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = nums.size() - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum == 0) {
                    res.push_back({nums[i], nums[l], nums[r]});
                    while (l < r && nums[l] == nums[l + 1]) l++;
                    while (l < r && nums[r] == nums[r - 1]) r--;
                    l++; r--;
                } else if (sum < 0) l++;
                else r--;
            }
        }
        return res;
    }
};`,
      java: `import java.util.*;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = nums.length - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum == 0) {
                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));
                    while (l < r && nums[l] == nums[l + 1]) l++;
                    while (l < r && nums[r] == nums[r - 1]) r--;
                    l++; r--;
                } else if (sum < 0) l++;
                else r--;
            }
        }
        return res;
    }
}`
    },
    testCases: [
      { id: 'tc1', input: '{"nums": [-1, 0, 1, 2, -1, -4]}', expectedOutput: '[[-1, -1, 2], [-1, 0, 1]]' },
      { id: 'tc2', input: '{"nums": [0, 1, 1]}', expectedOutput: '[]' },
      { id: 'tc3', input: '{"nums": [0, 0, 0]}', expectedOutput: '[[0, 0, 0]]' }
    ]
  },
  {
    id: 'container-with-most-water',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    topicTags: ['Arrays', 'Greedy'],
    acceptanceRate: 54.8,
    estimatedMinutes: 20,
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i-th\` line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store. Notice that you may not slant the container.`,
    constraints: ['n == height.length', '2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
    examples: [
      {
        input: 'height = [1, 8, 6, 2, 5, 4, 8, 3, 7]',
        output: '49',
        explanation: 'The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, max area = 49.'
      },
      {
        input: 'height = [1, 1]',
        output: '1'
      }
    ],
    hints: [
      'The area is width * min(height[left], height[right]).',
      'Start with the widest container: left = 0, right = n - 1.',
      'To increase area with smaller width, we must move the pointer with the shorter height.'
    ],
    starterCode: {
      javascript: `function maxArea(height) {
  let left = 0, right = height.length - 1;
  let maxWater = 0;
  while (left < right) {
    const currentWater = Math.min(height[left], height[right]) * (right - left);
    maxWater = Math.max(maxWater, currentWater);
    if (height[left] < height[right]) left++;
    else right--;
  }
  return maxWater;
}`,
      python: `class Solution:
    def maxArea(self, height: list[int]) -> int:
        l, r = 0, len(height) - 1
        res = 0
        while l < r:
            res = max(res, min(height[l], height[r]) * (r - l))
            if height[l] < height[r]:
                l += 1
            else:
                r -= 1
        return res`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxArea(vector<int>& height) {
        int l = 0, r = height.size() - 1, res = 0;
        while (l < r) {
            res = max(res, min(height[l], height[r]) * (r - l));
            if (height[l] < height[r]) l++;
            else r--;
        }
        return res;
    }
};`,
      java: `class Solution {
    public int maxArea(int[] height) {
        int l = 0, r = height.length - 1, max = 0;
        while (l < r) {
            max = Math.max(max, Math.min(height[l], height[r]) * (r - l));
            if (height[l] < height[r]) l++;
            else r--;
        }
        return max;
    }
}`
    },
    testCases: [
      { id: 'tc1', input: '{"height": [1, 8, 6, 2, 5, 4, 8, 3, 7]}', expectedOutput: '49' },
      { id: 'tc2', input: '{"height": [1, 1]}', expectedOutput: '1' },
      { id: 'tc3', input: '{"height": [4, 3, 2, 1, 4]}', expectedOutput: '16', isHidden: true }
    ]
  },
  {
    id: 'group-anagrams',
    title: 'Group Anagrams',
    difficulty: 'Medium',
    topicTags: ['Strings', 'Hashing', 'Sorting'],
    acceptanceRate: 67.2,
    estimatedMinutes: 20,
    description: `Given an array of strings \`strs\`, group the anagrams together. You can return the answer in any order.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] consists of lowercase English letters.'],
    examples: [
      {
        input: 'strs = ["eat", "tea", "tan", "ate", "nat", "bat"]',
        output: '[["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]'
      },
      {
        input: 'strs = [""]',
        output: '[[""]]'
      },
      {
        input: 'strs = ["a"]',
        output: '[["a"]]'
      }
    ],
    hints: [
      'Two strings are anagrams if and only if their sorted versions are identical.',
      'Use the sorted string or character frequency count as the key in a Hash Map.'
    ],
    starterCode: {
      javascript: `function groupAnagrams(strs) {
  const map = new Map();
  for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }
  return Array.from(map.values());
}`,
      python: `from collections import defaultdict

class Solution:
    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:
        groups = defaultdict(list)
        for s in strs:
            key = ''.join(sorted(s))
            groups[key].append(s)
        return list(groups.values())`,
      cpp: `#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> map;
        for (const string& s : strs) {
            string key = s;
            sort(key.begin(), key.end());
            map[key].push_back(s);
        }
        vector<vector<string>> res;
        for (auto& pair : map) res.push_back(pair.second);
        return res;
    }
};`,
      java: `import java.util.*;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            char[] chars = s.toCharArray();
            Arrays.sort(chars);
            String key = String.valueOf(chars);
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(map.values());
    }
}`
    },
    testCases: [
      { id: 'tc1', input: '{"strs": ["eat", "tea", "tan", "ate", "nat", "bat"]}', expectedOutput: '[["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]' },
      { id: 'tc2', input: '{"strs": [""]}', expectedOutput: '[[""]]' },
      { id: 'tc3', input: '{"strs": ["a"]}', expectedOutput: '[["a"]]' }
    ]
  },
  {
    id: 'number-of-islands',
    title: 'Number of Islands',
    difficulty: 'Medium',
    topicTags: ['Graphs'],
    acceptanceRate: 58.1,
    estimatedMinutes: 25,
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300', 'grid[i][j] is "0" or "1"'],
    examples: [
      {
        input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        output: '1'
      },
      {
        input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        output: '3'
      }
    ],
    hints: [
      'Iterate through every cell in the grid.',
      'When you encounter a "1", increment islandCount and trigger a BFS or DFS traversal to sink the island (turn connected "1"s into "0"s).'
    ],
    starterCode: {
      javascript: `function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;
  let count = 0;
  const rows = grid.length, cols = grid[0].length;
  
  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] === '0') return;
    grid[r][c] = '0';
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}`,
      python: `class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        if not grid: return 0
        rows, cols = len(grid), len(grid[0])
        count = 0

        def dfs(r, c):
            if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] == '0':
                return
            grid[r][c] = '0'
            dfs(r + 1, c)
            dfs(r - 1, c)
            dfs(r, c + 1)
            dfs(r, c - 1)

        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == '1':
                    count += 1
                    dfs(r, c)
        return count`,
      cpp: `#include <vector>
using namespace std;

class Solution {
    void dfs(vector<vector<char>>& grid, int r, int c) {
        if (r < 0 || c < 0 || r >= grid.size() || c >= grid[0].size() || grid[r][c] == '0') return;
        grid[r][c] = '0';
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }
public:
    int numIslands(vector<vector<char>>& grid) {
        if (grid.empty()) return 0;
        int count = 0;
        for (int r = 0; r < grid.size(); r++) {
            for (int c = 0; c < grid[0].size(); c++) {
                if (grid[r][c] == '1') {
                    count++;
                    dfs(grid, r, c);
                }
            }
        }
        return count;
    }
};`,
      java: `class Solution {
    private void dfs(char[][] grid, int r, int c) {
        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] == '0') return;
        grid[r][c] = '0';
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int count = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == '1') {
                    count++;
                    dfs(grid, r, c);
                }
            }
        }
        return count;
    }
}`
    },
    testCases: [
      {
        id: 'tc1',
        input: '{"grid": [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]}',
        expectedOutput: '1'
      },
      {
        id: 'tc2',
        input: '{"grid": [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]}',
        expectedOutput: '3'
      }
    ]
  },
  {
    id: 'coin-change',
    title: 'Coin Change',
    difficulty: 'Medium',
    topicTags: ['Dynamic Programming'],
    acceptanceRate: 43.1,
    estimatedMinutes: 25,
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
    examples: [
      { input: 'coins = [1, 2, 5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1' },
      { input: 'coins = [2], amount = 3', output: '-1' },
      { input: 'coins = [1], amount = 0', output: '0' }
    ],
    hints: [
      'Define dp[i] as the minimum coins needed to make amount i.',
      'Initialize dp array with Infinity, dp[0] = 0.',
      'For each amount i from 1 to amount, dp[i] = min(dp[i], dp[i - coin] + 1) for coin in coins.'
    ],
    starterCode: {
      javascript: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      python: `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        dp = [float('inf')] * (amount + 1)
        dp[0] = 0
        for i in range(1, amount + 1):
            for c in coins:
                if i - c >= 0:
                    dp[i] = min(dp[i], dp[i - c] + 1)
        return dp[amount] if dp[amount] != float('inf') else -1`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, 1e9);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int c : coins) {
                if (i - c >= 0) dp[i] = min(dp[i], dp[i - c] + 1);
            }
        }
        return dp[amount] > 1e8 ? -1 : dp[amount];
    }
};`,
      java: `import java.util.Arrays;

class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (i - coin >= 0) dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`
    },
    testCases: [
      { id: 'tc1', input: '{"coins": [1, 2, 5], "amount": 11}', expectedOutput: '3' },
      { id: 'tc2', input: '{"coins": [2], "amount": 3}', expectedOutput: '-1' },
      { id: 'tc3', input: '{"coins": [1], "amount": 0}', expectedOutput: '0' },
      { id: 'tc4', input: '{"coins": [186, 419, 83, 408], "amount": 6249}', expectedOutput: '20', isHidden: true }
    ]
  },
  {
    id: 'course-schedule',
    title: 'Course Schedule',
    difficulty: 'Medium',
    topicTags: ['Graphs', 'Topological Sort'],
    acceptanceRate: 46.8,
    estimatedMinutes: 30,
    description: `There are a total of \`numCourses\` courses you have to take, labeled from \`0\` to \`numCourses - 1\`. You are given an array \`prerequisites\` where \`prerequisites[i] = [ai, bi]\` indicates that you must take course \`bi\` first if you want to take course \`ai\`.

Return \`true\` if you can finish all courses. Otherwise, return \`false\`.`,
    constraints: ['1 <= numCourses <= 2000', '0 <= prerequisites.length <= 5000', 'prerequisites[i].length == 2', 'All pairs are unique.'],
    examples: [
      { input: 'numCourses = 2, prerequisites = [[1, 0]]', output: 'true', explanation: 'Take course 0 then course 1.' },
      { input: 'numCourses = 2, prerequisites = [[1, 0], [0, 1]]', output: 'false', explanation: 'Course 0 requires 1 and course 1 requires 0. Cycle detected.' }
    ],
    hints: [
      'This problem is equivalent to detecting a cycle in a directed graph.',
      "Kahn's algorithm: calculate indegrees for all nodes, push nodes with indegree 0 to a queue.",
      'Process the queue, decrement indegrees of neighbors. If processed node count == numCourses, there is no cycle.'
    ],
    starterCode: {
      javascript: `function canFinish(numCourses, prerequisites) {
  const inDegree = new Array(numCourses).fill(0);
  const adj = Array.from({ length: numCourses }, () => []);
  for (const [course, pre] of prerequisites) {
    adj[pre].push(course);
    inDegree[course]++;
  }
  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }
  let count = 0;
  while (queue.length > 0) {
    const node = queue.shift();
    count++;
    for (const next of adj[node]) {
      inDegree[next]--;
      if (inDegree[next] === 0) queue.push(next);
    }
  }
  return count === numCourses;
}`,
      python: `from collections import deque

class Solution:
    def canFinish(self, numCourses: int, prerequisites: list[list[int]]) -> bool:
        indegree = [0] * numCourses
        adj = [[] for _ in range(numCourses)]
        for course, pre in prerequisites:
            adj[pre].append(course)
            indegree[course] += 1
        queue = deque([i for i in range(numCourses) if indegree[i] == 0])
        count = 0
        while queue:
            curr = queue.popleft()
            count += 1
            for nxt in adj[curr]:
                indegree[nxt] -= 1
                if indegree[nxt] == 0:
                    queue.append(nxt)
        return count == numCourses`,
      cpp: `#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<int> indegree(numCourses, 0);
        vector<vector<int>> adj(numCourses);
        for (auto& p : prerequisites) {
            adj[p[1]].push_back(p[0]);
            indegree[p[0]]++;
        }
        queue<int> q;
        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) q.push(i);
        }
        int count = 0;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            count++;
            for (int v : adj[u]) {
                if (--indegree[v] == 0) q.push(v);
            }
        }
        return count == numCourses;
    }
};`,
      java: `import java.util.*;

class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        int[] inDegree = new int[numCourses];
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        for (int[] p : prerequisites) {
            adj.get(p[1]).add(p[0]);
            inDegree[p[0]]++;
        }
        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) q.offer(i);
        int count = 0;
        while (!q.isEmpty()) {
            int curr = q.poll();
            count++;
            for (int next : adj.get(curr)) {
                if (--inDegree[next] == 0) q.offer(next);
            }
        }
        return count == numCourses;
    }
}`
    },
    testCases: [
      { id: 'tc1', input: '{"numCourses": 2, "prerequisites": [[1, 0]]}', expectedOutput: 'true' },
      { id: 'tc2', input: '{"numCourses": 2, "prerequisites": [[1, 0], [0, 1]]}', expectedOutput: 'false' },
      { id: 'tc3', input: '{"numCourses": 3, "prerequisites": [[0, 1], [0, 2], [1, 2]]}', expectedOutput: 'true', isHidden: true }
    ]
  },
  {
    id: 'implement-queue-using-stacks',
    title: 'Implement Queue using Stacks',
    difficulty: 'Easy',
    topicTags: ['Queues', 'Stacks'],
    acceptanceRate: 64.9,
    estimatedMinutes: 15,
    description: `Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (\`push\`, \`peek\`, \`pop\`, and \`empty\`).

Methods:
- \`push(x)\`: Pushes element x to the back of the queue.
- \`pop()\`: Removes the element from the front of the queue and returns it.
- \`peek()\`: Returns the element at the front of the queue.
- \`empty()\`: Returns true if the queue is empty, false otherwise.`,
    constraints: ['1 <= x <= 9', 'At most 100 calls will be made to push, pop, peek, and empty.'],
    examples: [
      {
        input: 'commands = ["push", "push", "peek", "pop", "empty"], values = [[1], [2], [], [], []]',
        output: '[null, null, 1, 1, false]'
      }
    ],
    hints: [
      'Use an input stack and an output stack.',
      'When pop() or peek() is requested, if output stack is empty, transfer all elements from input stack to output stack.'
    ],
    starterCode: {
      javascript: `class MyQueue {
  constructor() {
    this.inStack = [];
    this.outStack = [];
  }
  push(x) {
    this.inStack.push(x);
  }
  pop() {
    this.peek();
    return this.outStack.pop();
  }
  peek() {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop());
      }
    }
    return this.outStack[this.outStack.length - 1];
  }
  empty() {
    return this.inStack.length === 0 && this.outStack.length === 0;
  }
}`,
      python: `class MyQueue:
    def __init__(self):
        self.in_stack = []
        self.out_stack = []

    def push(self, x: int) -> None:
        self.in_stack.append(x)

    def pop(self) -> int:
        self.peek()
        return self.out_stack.pop()

    def peek(self) -> int:
        if not self.out_stack:
            while self.in_stack:
                self.out_stack.append(self.in_stack.pop())
        return self.out_stack[-1]

    def empty(self) -> bool:
        return not self.in_stack and not self.out_stack`,
      cpp: `#include <stack>
using namespace std;

class MyQueue {
    stack<int> inSt, outSt;
public:
    MyQueue() {}
    void push(int x) { inSt.push(x); }
    int pop() {
        peek();
        int val = outSt.top(); outSt.pop();
        return val;
    }
    int peek() {
        if (outSt.empty()) {
            while (!inSt.empty()) {
                outSt.push(inSt.top());
                inSt.pop();
            }
        }
        return outSt.top();
    }
    bool empty() { return inSt.empty() && outSt.empty(); }
};`,
      java: `import java.util.Stack;

class MyQueue {
    private Stack<Integer> inSt = new Stack<>();
    private Stack<Integer> outSt = new Stack<>();
    public void push(int x) { inSt.push(x); }
    public int pop() {
        peek();
        return outSt.pop();
    }
    public int peek() {
        if (outSt.isEmpty()) {
            while (!inSt.isEmpty()) outSt.push(inSt.pop());
        }
        return outSt.peek();
    }
    public boolean empty() { return inSt.isEmpty() && outSt.isEmpty(); }
}`
    },
    testCases: [
      { id: 'tc1', input: '{"ops": ["push 1", "push 2", "peek", "pop", "empty"]}', expectedOutput: '[null, null, 1, 1, false]' },
      { id: 'tc2', input: '{"ops": ["push 10", "pop", "empty"]}', expectedOutput: '[null, 10, true]' }
    ]
  },
  {
    id: 'maximum-depth-of-binary-tree',
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    topicTags: ['Trees'],
    acceptanceRate: 75.3,
    estimatedMinutes: 15,
    description: `Given the root of a binary tree, return its maximum depth.

A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.`,
    constraints: ['The number of nodes in the tree is in the range [0, 10^4].', '-100 <= Node.val <= 100'],
    examples: [
      { input: 'root = [3, 9, 20, null, null, 15, 7]', output: '3' },
      { input: 'root = [1, null, 2]', output: '2' },
      { input: 'root = []', output: '0' }
    ],
    hints: [
      'If root is null, return 0.',
      'Otherwise, the depth is 1 + max(depth(root.left), depth(root.right)).'
    ],
    starterCode: {
      javascript: `function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
      python: `class Solution:
    def maxDepth(self, root) -> int:
        if not root:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))`,
      cpp: `#include <algorithm>
using namespace std;

class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (!root) return 0;
        return 1 + max(maxDepth(root->left), maxDepth(root->right));
    }
};`,
      java: `class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}`
    },
    testCases: [
      { id: 'tc1', input: '{"root": [3, 9, 20, null, null, 15, 7]}', expectedOutput: '3' },
      { id: 'tc2', input: '{"root": [1, null, 2]}', expectedOutput: '2' },
      { id: 'tc3', input: '{"root": []}', expectedOutput: '0' }
    ]
  },
  {
    id: 'validate-binary-search-tree',
    title: 'Validate Binary Search Tree',
    difficulty: 'Medium',
    topicTags: ['Trees'],
    acceptanceRate: 32.7,
    estimatedMinutes: 25,
    description: `Given the root of a binary tree, determine if it is a valid binary search tree (BST).

A valid BST is defined as follows:
- The left subtree of a node contains only nodes with keys strictly less than the node's key.
- The right subtree of a node contains only nodes with keys strictly greater than the node's key.
- Both the left and right subtrees must also be binary search trees.`,
    constraints: ['The number of nodes in the tree is in the range [1, 10^4].', '-2^31 <= Node.val <= 2^31 - 1'],
    examples: [
      { input: 'root = [2, 1, 3]', output: 'true' },
      { input: 'root = [5, 1, 4, null, null, 3, 6]', output: 'false', explanation: 'Root is 5, but its right child has value 4.' }
    ],
    hints: [
      'Simply checking if left.val < root.val and right.val > root.val is not enough.',
      'Pass down a valid range [min, max] that every node value must satisfy.',
      'For root.left, the range becomes [min, root.val]. For root.right, the range becomes [root.val, max].'
    ],
    starterCode: {
      javascript: `function isValidBST(root, min = -Infinity, max = Infinity) {
  if (!root) return true;
  if (root.val <= min || root.val >= max) return false;
  return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);
}`,
      python: `class Solution:
    def isValidBST(self, root) -> bool:
        def validate(node, low=-float('inf'), high=float('inf')):
            if not node:
                return True
            if node.val <= low or node.val >= high:
                return False
            return validate(node.left, low, node.val) and validate(node.right, node.val, high)
        return validate(root)`,
      cpp: `class Solution {
    bool validate(TreeNode* root, long low, long high) {
        if (!root) return true;
        if (root->val <= low || root->val >= high) return false;
        return validate(root->left, low, root->val) && validate(root->right, root->val, high);
    }
public:
    bool isValidBST(TreeNode* root) {
        return validate(root, -2147483649L, 2147483648L);
    }
};`,
      java: `class Solution {
    private boolean validate(TreeNode root, Long min, Long max) {
        if (root == null) return true;
        if (min != null && root.val <= min) return false;
        if (max != null && root.val >= max) return false;
        return validate(root.left, min, (long)root.val) && validate(root.right, (long)root.val, max);
    }
    public boolean isValidBST(TreeNode root) {
        return validate(root, null, null);
    }
}`
    },
    testCases: [
      { id: 'tc1', input: '{"root": [2, 1, 3]}', expectedOutput: 'true' },
      { id: 'tc2', input: '{"root": [5, 1, 4, null, null, 3, 6]}', expectedOutput: 'false' },
      { id: 'tc3', input: '{"root": [10, 5, 15, null, null, 6, 20]}', expectedOutput: 'false', isHidden: true }
    ]
  },
  {
    id: 'word-search',
    title: 'Word Search',
    difficulty: 'Medium',
    topicTags: ['Backtracking', 'Matrix'],
    acceptanceRate: 41.2,
    estimatedMinutes: 30,
    description: `Given an \`m x n\` grid of characters \`board\` and a string \`word\`, return \`true\` if \`word\` exists in the grid.

The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.`,
    constraints: ['m == board.length', 'n = board[i].length', '1 <= m, n <= 6', '1 <= word.length <= 15', 'board and word consist of only lowercase and uppercase English letters.'],
    examples: [
      {
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"',
        output: 'true'
      },
      {
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"',
        output: 'true'
      },
      {
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"',
        output: 'false'
      }
    ],
    hints: [
      'Iterate through each cell. If board[r][c] matches word[0], start DFS backtracking.',
      'Mark the current cell as visited (e.g. replace with "#") before recursing to neighbors.',
      'Restore the original character after recursion finishes (backtracking step).'
    ],
    starterCode: {
      javascript: `function exist(board, word) {
  const rows = board.length, cols = board[0].length;
  function dfs(r, c, index) {
    if (index === word.length) return true;
    if (r < 0 || c < 0 || r >= rows || c >= cols || board[r][c] !== word[index]) return false;
    const temp = board[r][c];
    board[r][c] = '#';
    const found = dfs(r + 1, c, index + 1) ||
                  dfs(r - 1, c, index + 1) ||
                  dfs(r, c + 1, index + 1) ||
                  dfs(r, c - 1, index + 1);
    board[r][c] = temp;
    return found;
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }
  return false;
}`,
      python: `class Solution:
    def exist(self, board: list[list[str]], word: str) -> bool:
        rows, cols = len(board), len(board[0])
        def dfs(r, c, i):
            if i == len(word): return True
            if r < 0 or c < 0 or r >= rows or c >= cols or board[r][c] != word[i]:
                return False
            temp = board[r][c]
            board[r][c] = '#'
            found = (dfs(r + 1, c, i + 1) or dfs(r - 1, c, i + 1) or
                     dfs(r, c + 1, i + 1) or dfs(r, c - 1, i + 1))
            board[r][c] = temp
            return found
        for r in range(rows):
            for c in range(cols):
                if dfs(r, c, 0): return True
        return False`,
      cpp: `#include <vector>
#include <string>
using namespace std;

class Solution {
    bool dfs(vector<vector<char>>& b, const string& w, int r, int c, int i) {
        if (i == w.size()) return true;
        if (r < 0 || c < 0 || r >= b.size() || c >= b[0].size() || b[r][c] != w[i]) return false;
        char temp = b[r][c];
        b[r][c] = '#';
        bool found = dfs(b, w, r + 1, c, i + 1) || dfs(b, w, r - 1, c, i + 1) ||
                    dfs(b, w, r, c + 1, i + 1) || dfs(b, w, r, c - 1, i + 1);
        b[r][c] = temp;
        return found;
    }
public:
    bool exist(vector<vector<char>>& board, string word) {
        for (int r = 0; r < board.size(); r++) {
            for (int c = 0; c < board[0].size(); c++) {
                if (dfs(board, word, r, c, 0)) return true;
            }
        }
        return false;
    }
};`,
      java: `class Solution {
    private boolean dfs(char[][] board, String word, int r, int c, int i) {
        if (i == word.length()) return true;
        if (r < 0 || c < 0 || r >= board.length || c >= board[0].length || board[r][c] != word.charAt(i)) return false;
        char temp = board[r][c];
        board[r][c] = '#';
        boolean found = dfs(board, word, r + 1, c, i + 1) ||
                        dfs(board, word, r - 1, c, i + 1) ||
                        dfs(board, word, r, c + 1, i + 1) ||
                        dfs(board, word, r, c - 1, i + 1);
        board[r][c] = temp;
        return found;
    }
    public boolean exist(char[][] board, String word) {
        for (int r = 0; r < board.length; r++) {
            for (int c = 0; c < board[0].length; c++) {
                if (dfs(board, word, r, c, 0)) return true;
            }
        }
        return false;
    }
}`
    },
    testCases: [
      { id: 'tc1', input: '{"board": [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "word": "ABCCED"}', expectedOutput: 'true' },
      { id: 'tc2', input: '{"board": [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "word": "SEE"}', expectedOutput: 'true' },
      { id: 'tc3', input: '{"board": [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "word": "ABCB"}', expectedOutput: 'false' }
    ]
  },
  {
    id: 'merge-k-sorted-lists',
    title: 'Merge k Sorted Lists',
    difficulty: 'Hard',
    topicTags: ['Linked Lists', 'Sorting'],
    acceptanceRate: 51.6,
    estimatedMinutes: 35,
    description: `You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.`,
    constraints: ['k == lists.length', '0 <= k <= 10^4', '0 <= lists[i].length <= 500', '-10^4 <= lists[i][j] <= 10^4', 'lists[i] is sorted in ascending order.'],
    examples: [
      {
        input: 'lists = [[1, 4, 5], [1, 3, 4], [2, 6]]',
        output: '[1, 1, 2, 3, 4, 4, 5, 6]',
        explanation: 'The linked-lists are: [1->4->5, 1->3->4, 2->6]. Merging them produces 1->1->2->3->4->4->5->6.'
      },
      {
        input: 'lists = []',
        output: '[]'
      },
      {
        input: 'lists = [[]]',
        output: '[]'
      }
    ],
    hints: [
      'Divide and conquer: Pair up k lists and merge each pair, reducing k to k/2 at each step.',
      'Alternatively, use a Min-Heap (Priority Queue) to always extract the smallest node among the k current list heads in O(log k).'
    ],
    starterCode: {
      javascript: `function mergeKLists(lists) {
  if (!lists || lists.length === 0) return null;
  function mergeTwoLists(l1, l2) {
    const dummy = { val: 0, next: null };
    let curr = dummy;
    while (l1 && l2) {
      if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }
      else { curr.next = l2; l2 = l2.next; }
      curr = curr.next;
    }
    curr.next = l1 || l2;
    return dummy.next;
  }
  let step = 1;
  while (step < lists.length) {
    for (let i = 0; i + step < lists.length; i += step * 2) {
      lists[i] = mergeTwoLists(lists[i], lists[i + step]);
    }
    step *= 2;
  }
  return lists[0] || null;
}`,
      python: `import heapq

class Solution:
    def mergeKLists(self, lists):
        dummy = ListNode(0)
        curr = dummy
        heap = []
        for i, l in enumerate(lists):
            if l:
                heapq.heappush(heap, (l.val, i, l))
        while heap:
            val, i, node = heapq.heappop(heap)
            curr.next = node
            curr = curr.next
            if node.next:
                heapq.heappush(heap, (node.next.val, i, node.next))
        return dummy.next`,
      cpp: `#include <vector>
#include <queue>
using namespace std;

class Solution {
    struct compare {
        bool operator()(ListNode* a, ListNode* b) { return a->val > b->val; }
    };
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        priority_queue<ListNode*, vector<ListNode*>, compare> pq;
        for (auto l : lists) if (l) pq.push(l);
        ListNode dummy(0);
        ListNode* tail = &dummy;
        while (!pq.empty()) {
            ListNode* top = pq.top(); pq.pop();
            tail->next = top;
            tail = tail->next;
            if (top->next) pq.push(top->next);
        }
        return dummy.next;
    }
};`,
      java: `import java.util.PriorityQueue;

class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> a.val - b.val);
        for (ListNode node : lists) if (node != null) pq.offer(node);
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        while (!pq.isEmpty()) {
            ListNode top = pq.poll();
            tail.next = top;
            tail = tail.next;
            if (top.next != null) pq.offer(top.next);
        }
        return dummy.next;
    }
}`
    },
    testCases: [
      { id: 'tc1', input: '{"lists": [[1, 4, 5], [1, 3, 4], [2, 6]]}', expectedOutput: '[1, 1, 2, 3, 4, 4, 5, 6]' },
      { id: 'tc2', input: '{"lists": []}', expectedOutput: '[]' },
      { id: 'tc3', input: '{"lists": [[]]}', expectedOutput: '[]' }
    ]
  },
  {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    topicTags: ['Arrays', 'Two Pointers', 'Stacks'],
    acceptanceRate: 61.4,
    estimatedMinutes: 35,
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    examples: [
      {
        input: 'height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]',
        output: '6',
        explanation: 'The elevation map traps 6 units of rain water.'
      },
      {
        input: 'height = [4, 2, 0, 3, 2, 5]',
        output: '9'
      }
    ],
    hints: [
      'For any position i, trapped water = min(max_left[i], max_right[i]) - height[i].',
      'Can we solve this in O(1) space with two pointers (left, right) and tracking leftMax, rightMax?'
    ],
    starterCode: {
      javascript: `function trap(height) {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0;
  let totalWater = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) leftMax = height[left];
      else totalWater += leftMax - height[left];
      left++;
    } else {
      if (height[right] >= rightMax) rightMax = height[right];
      else totalWater += rightMax - height[right];
      right--;
    }
  }
  return totalWater;
}`,
      python: `class Solution:
    def trap(self, height: list[int]) -> int:
        l, r = 0, len(height) - 1
        left_max, right_max = 0, 0
        water = 0
        while l < r:
            if height[l] < height[r]:
                if height[l] >= left_max:
                    left_max = height[l]
                else:
                    water += left_max - height[l]
                l += 1
            else:
                if height[r] >= right_max:
                    right_max = height[r]
                else:
                    water += right_max - height[r]
                r -= 1
        return water`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int trap(vector<int>& height) {
        int l = 0, r = height.size() - 1;
        int leftMax = 0, rightMax = 0, water = 0;
        while (l < r) {
            if (height[l] < height[r]) {
                if (height[l] >= leftMax) leftMax = height[l];
                else water += leftMax - height[l];
                l++;
            } else {
                if (height[r] >= rightMax) rightMax = height[r];
                else water += rightMax - height[r];
                r--;
            }
        }
        return water;
    }
};`,
      java: `class Solution {
    public int trap(int[] height) {
        int l = 0, r = height.length - 1;
        int leftMax = 0, rightMax = 0, water = 0;
        while (l < r) {
            if (height[l] < height[r]) {
                if (height[l] >= leftMax) leftMax = height[l];
                else water += leftMax - height[l];
                l++;
            } else {
                if (height[r] >= rightMax) rightMax = height[r];
                else water += rightMax - height[r];
                r--;
            }
        }
        return water;
    }
}`
    },
    testCases: [
      { id: 'tc1', input: '{"height": [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]}', expectedOutput: '6' },
      { id: 'tc2', input: '{"height": [4, 2, 0, 3, 2, 5]}', expectedOutput: '9' },
      { id: 'tc3', input: '{"height": [3, 0, 2, 0, 4]}', expectedOutput: '7', isHidden: true }
    ]
  },
  {
    id: 'lru-cache',
    title: 'LRU Cache',
    difficulty: 'Medium',
    topicTags: ['Hashing', 'Linked Lists'],
    acceptanceRate: 42.0,
    estimatedMinutes: 30,
    description: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the LRUCache class:
- \`LRUCache(int capacity)\`: Initialize the LRU cache with positive size capacity.
- \`int get(int key)\`: Return the value of the key if the key exists, otherwise return -1.
- \`void put(int key, int value)\`: Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.

The functions \`get\` and \`put\` must each run in \`O(1)\` average time complexity.`,
    constraints: ['1 <= capacity <= 3000', '0 <= key <= 10^4', '0 <= value <= 10^5', 'At most 2 * 10^5 calls will be made to get and put.'],
    examples: [
      {
        input: 'commands = ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"], values = [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
        output: '[null, null, null, 1, null, -1, null, -1, 3, 4]'
      }
    ],
    hints: [
      'Combine a Hash Map with a Doubly Linked List.',
      'The Doubly Linked List maintains access order: newest node at head, least recently used node at tail.',
      'Hash Map stores key -> Node for O(1) lookups and node deletion.'
    ],
    starterCode: {
      javascript: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }
  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }
}`,
      python: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)`,
      cpp: `#include <unordered_map>
#include <list>
using namespace std;

class LRUCache {
    int cap;
    list<pair<int, int>> lru;
    unordered_map<int, list<pair<int, int>>::iterator> map;
public:
    LRUCache(int capacity) : cap(capacity) {}
    int get(int key) {
        if (!map.count(key)) return -1;
        lru.splice(lru.begin(), lru, map[key]);
        return map[key]->second;
    }
    void put(int key, int value) {
        if (map.count(key)) {
            lru.splice(lru.begin(), lru, map[key]);
            map[key]->second = value;
            return;
        }
        if (lru.size() >= cap) {
            map.erase(lru.back().first);
            lru.pop_back();
        }
        lru.emplace_front(key, value);
        map[key] = lru.begin();
    }
};`,
      java: `import java.util.LinkedHashMap;
import java.util.Map;

class LRUCache extends LinkedHashMap<Integer, Integer> {
    private int capacity;
    public LRUCache(int capacity) {
        super(capacity, 0.75f, true);
        this.capacity = capacity;
    }
    public int get(int key) {
        return super.getOrDefault(key, -1);
    }
    public void put(int key, int value) {
        super.put(key, value);
    }
    @Override
    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
        return size() > capacity;
    }
}`
    },
    testCases: [
      { id: 'tc1', input: '{"ops": ["put 1 1", "put 2 2", "get 1", "put 3 3", "get 2", "put 4 4", "get 1", "get 3", "get 4"]}', expectedOutput: '[null, null, 1, null, -1, null, -1, 3, 4]' }
    ]
  }
];
