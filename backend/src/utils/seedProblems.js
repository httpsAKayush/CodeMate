// problemsData.js
// 30 DSA interview problems across 11 topics — production-ready for PeerPrep / Next.js

export const TOPICS = [
  "Arrays",
  "Strings",
  "Linked Lists",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Backtracking",
  "Bit Manipulation",
  "Sliding Window",
  "Binary Search",
  "Heap / Priority Queue",
];

export const QUESTIONS = {
  // ─────────────────────────────────────────────
  // ARRAYS  (3 problems)
  // ─────────────────────────────────────────────
  1: {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Arrays",
    description:
      "Given an array of integers `nums` and an integer `target`, return the **indices** of the two numbers such that they add up to `target`.\n\nYou may assume that each input has **exactly one solution**, and you may not use the same element twice. You can return the answer in any order.",
    examples: [
      {
        input: "nums = [2, 7, 11, 15], target = 9",
        output: "[0, 1]",
        explanation: "nums[0] + nums[1] = 2 + 7 = 9, so we return [0, 1].",
      },
      {
        input: "nums = [3, 2, 4], target = 6",
        output: "[1, 2]",
        explanation: "nums[1] + nums[2] = 2 + 4 = 6.",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    starterCode: {
      javascript:
        "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Write your solution here\n        pass",
      cpp:
        "#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "var twoSum = function(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) return [map.get(complement), i];\n        map.set(nums[i], i);\n    }\n};",
      python:
        "class Solution:\n    def twoSum(self, nums, target):\n        seen = {}\n        for i, n in enumerate(nums):\n            if target - n in seen:\n                return [seen[target - n], i]\n            seen[n] = i",
      cpp:
        "vector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int,int> m;\n    for (int i = 0; i < nums.size(); i++) {\n        int c = target - nums[i];\n        if (m.count(c)) return {m[c], i};\n        m[nums[i]] = i;\n    }\n    return {};\n}",
    },
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[3, 2, 4], 6], expected: [1, 2] },
      { input: [[3, 3], 6], expected: [0, 1] },
    ],
  },

  2: {
    id: 2,
    title: "Merge Intervals",
    difficulty: "Medium",
    topic: "Arrays",
    description:
      "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    examples: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
        explanation: "Intervals [1,3] and [2,6] overlap → merged to [1,6].",
      },
      {
        input: "intervals = [[1,4],[4,5]]",
        output: "[[1,5]]",
        explanation: "Intervals [1,4] and [4,5] are considered overlapping.",
      },
    ],
    constraints: [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i <= end_i <= 10^4",
    ],
    starterCode: {
      javascript:
        "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nvar merge = function(intervals) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def merge(self, intervals: List[List[int]]) -> List[List[int]]:\n        # Write your solution here\n        pass",
      cpp:
        "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "var merge = function(intervals) {\n    intervals.sort((a, b) => a[0] - b[0]);\n    const res = [intervals[0]];\n    for (let i = 1; i < intervals.length; i++) {\n        const last = res[res.length - 1];\n        if (intervals[i][0] <= last[1]) last[1] = Math.max(last[1], intervals[i][1]);\n        else res.push(intervals[i]);\n    }\n    return res;\n};",
      python:
        "class Solution:\n    def merge(self, intervals):\n        intervals.sort()\n        res = [intervals[0]]\n        for s, e in intervals[1:]:\n            if s <= res[-1][1]:\n                res[-1][1] = max(res[-1][1], e)\n            else:\n                res.append([s, e])\n        return res",
      cpp:
        "vector<vector<int>> merge(vector<vector<int>>& intervals) {\n    sort(intervals.begin(), intervals.end());\n    vector<vector<int>> res = {intervals[0]};\n    for (auto& iv : intervals) {\n        if (iv[0] <= res.back()[1]) res.back()[1] = max(res.back()[1], iv[1]);\n        else res.push_back(iv);\n    }\n    return res;\n}",
    },
    testCases: [
      { input: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
      { input: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
      { input: [[[1, 4], [0, 0]]], expected: [[0, 0], [1, 4]] },
    ],
  },

  3: {
    id: 3,
    title: "Product of Array Except Self",
    difficulty: "Medium",
    topic: "Arrays",
    description:
      "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\n\nThe product of any prefix or suffix of `nums` is **guaranteed** to fit in a 32-bit integer.\n\nYou must write an algorithm that runs in **O(n)** time and **without using the division operation**.",
    examples: [
      {
        input: "nums = [1, 2, 3, 4]",
        output: "[24, 12, 8, 6]",
        explanation:
          "answer[0] = 2*3*4 = 24, answer[1] = 1*3*4 = 12, answer[2] = 1*2*4 = 8, answer[3] = 1*2*3 = 6.",
      },
      {
        input: "nums = [-1, 1, 0, -3, 3]",
        output: "[0, 0, 9, 0, 0]",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^5",
      "-30 <= nums[i] <= 30",
      "The product of any prefix or suffix fits in a 32-bit integer.",
    ],
    starterCode: {
      javascript:
        "/**\n * @param {number[]} nums\n * @return {number[]}\n */\nvar productExceptSelf = function(nums) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def productExceptSelf(self, nums: List[int]) -> List[int]:\n        # Write your solution here\n        pass",
      cpp:
        "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "var productExceptSelf = function(nums) {\n    const n = nums.length, res = new Array(n).fill(1);\n    let prefix = 1;\n    for (let i = 0; i < n; i++) { res[i] = prefix; prefix *= nums[i]; }\n    let suffix = 1;\n    for (let i = n - 1; i >= 0; i--) { res[i] *= suffix; suffix *= nums[i]; }\n    return res;\n};",
      python:
        "class Solution:\n    def productExceptSelf(self, nums):\n        n = len(nums)\n        res = [1] * n\n        pre = 1\n        for i in range(n):\n            res[i] = pre\n            pre *= nums[i]\n        suf = 1\n        for i in range(n - 1, -1, -1):\n            res[i] *= suf\n            suf *= nums[i]\n        return res",
      cpp:
        "vector<int> productExceptSelf(vector<int>& nums) {\n    int n = nums.size();\n    vector<int> res(n, 1);\n    int pre = 1;\n    for (int i = 0; i < n; i++) { res[i] = pre; pre *= nums[i]; }\n    int suf = 1;\n    for (int i = n-1; i >= 0; i--) { res[i] *= suf; suf *= nums[i]; }\n    return res;\n}",
    },
    testCases: [
      { input: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] },
      { input: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] },
      // two elements
      { input: [[3, 4]], expected: [4, 3] },
      // array with two zeros — all products are 0
      { input: [[0, 0, 2]], expected: [0, 0, 0] },
    ],
  },

  // ─────────────────────────────────────────────
  // STRINGS  (3 problems)
  // ─────────────────────────────────────────────
  4: {
    id: 4,
    title: "Valid Anagram",
    difficulty: "Easy",
    topic: "Strings",
    description:
      "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn **anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: "true" },
      { input: 's = "rat", t = "car"', output: "false" },
    ],
    constraints: [
      "1 <= s.length, t.length <= 5 * 10^4",
      "s and t consist of lowercase English letters.",
    ],
    starterCode: {
      javascript:
        "/**\n * @param {string} s\n * @param {string} t\n * @return {boolean}\n */\nvar isAnagram = function(s, t) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        # Write your solution here\n        pass",
      cpp:
        "#include <string>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "var isAnagram = function(s, t) {\n    if (s.length !== t.length) return false;\n    const count = {};\n    for (const c of s) count[c] = (count[c] || 0) + 1;\n    for (const c of t) {\n        if (!count[c]) return false;\n        count[c]--;\n    }\n    return true;\n};",
      python:
        "from collections import Counter\nclass Solution:\n    def isAnagram(self, s, t):\n        return Counter(s) == Counter(t)",
      cpp:
        "bool isAnagram(string s, string t) {\n    if (s.size() != t.size()) return false;\n    int c[26] = {};\n    for (char x : s) c[x-'a']++;\n    for (char x : t) if (--c[x-'a'] < 0) return false;\n    return true;\n}",
    },
    testCases: [
      { input: ["anagram", "nagaram"], expected: true },
      { input: ["rat", "car"], expected: false },
      { input: ["a", "a"], expected: true },
    ],
  },

  5: {
    id: 5,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    topic: "Strings",
    description:
      "Given a string `s`, return the **longest palindromic substring** in `s`.\n\nA string is a palindrome when it reads the same backward as forward.",
    examples: [
      {
        input: 's = "babad"',
        output: '"bab"',
        explanation: '"aba" is also a valid answer.',
      },
      { input: 's = "cbbd"', output: '"bb"' },
    ],
    constraints: ["1 <= s.length <= 1000", "s consists of only digits and English letters."],
    starterCode: {
      javascript:
        "/**\n * @param {string} s\n * @return {string}\n */\nvar longestPalindrome = function(s) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def longestPalindrome(self, s: str) -> str:\n        # Write your solution here\n        pass",
      cpp:
        "#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    string longestPalindrome(string s) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "var longestPalindrome = function(s) {\n    let res = '';\n    const expand = (l, r) => {\n        while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }\n        return s.slice(l + 1, r);\n    };\n    for (let i = 0; i < s.length; i++) {\n        const odd = expand(i, i), even = expand(i, i + 1);\n        if (odd.length > res.length) res = odd;\n        if (even.length > res.length) res = even;\n    }\n    return res;\n};",
      python:
        "class Solution:\n    def longestPalindrome(self, s):\n        res = ''\n        for i in range(len(s)):\n            for l, r in [(i, i), (i, i+1)]:\n                while l >= 0 and r < len(s) and s[l] == s[r]:\n                    l -= 1; r += 1\n                if r - l - 1 > len(res):\n                    res = s[l+1:r]\n        return res",
      cpp:
        "string longestPalindrome(string s) {\n    string res;\n    auto expand = [&](int l, int r) {\n        while (l >= 0 && r < s.size() && s[l] == s[r]) { l--; r++; }\n        string sub = s.substr(l+1, r-l-1);\n        if (sub.size() > res.size()) res = sub;\n    };\n    for (int i = 0; i < s.size(); i++) { expand(i,i); expand(i,i+1); }\n    return res;\n}",
    },
    testCases: [
      { input: ["babad"], expected: "bab" },
      { input: ["cbbd"], expected: "bb" },
      { input: ["a"], expected: "a" },
      // all same characters — entire string is palindrome
      { input: ["aaaa"], expected: "aaaa" },
      // no palindrome longer than 1 — return first char
      { input: ["abcd"], expected: "a" },
    ],
  },

  6: {
    id: 6,
    title: "Group Anagrams",
    difficulty: "Medium",
    topic: "Strings",
    description:
      "Given an array of strings `strs`, group the **anagrams** together. You can return the answer in **any order**.\n\nAn anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
      },
      { input: 'strs = [""]', output: '[[""]]' },
      { input: 'strs = ["a"]', output: '[["a"]]' },
    ],
    constraints: [
      "1 <= strs.length <= 10^4",
      "0 <= strs[i].length <= 100",
      "strs[i] consists of lowercase English letters.",
    ],
    starterCode: {
      javascript:
        "/**\n * @param {string[]} strs\n * @return {string[][]}\n */\nvar groupAnagrams = function(strs) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:\n        # Write your solution here\n        pass",
      cpp:
        "#include <vector>\n#include <string>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<string>> groupAnagrams(vector<string>& strs) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "var groupAnagrams = function(strs) {\n    const map = new Map();\n    for (const s of strs) {\n        const key = s.split('').sort().join('');\n        if (!map.has(key)) map.set(key, []);\n        map.get(key).push(s);\n    }\n    return [...map.values()];\n};",
      python:
        "from collections import defaultdict\nclass Solution:\n    def groupAnagrams(self, strs):\n        m = defaultdict(list)\n        for s in strs:\n            m[tuple(sorted(s))].append(s)\n        return list(m.values())",
      cpp:
        "vector<vector<string>> groupAnagrams(vector<string>& strs) {\n    unordered_map<string, vector<string>> m;\n    for (auto& s : strs) {\n        string key = s; sort(key.begin(), key.end());\n        m[key].push_back(s);\n    }\n    vector<vector<string>> res;\n    for (auto& p : m) res.push_back(p.second);\n    return res;\n}",
    },
    testCases: [
      {
        input: [["eat", "tea", "tan", "ate", "nat", "bat"]],
        expected: [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]],
      },
      { input: [[""]], expected: [[""]] },
    ],
  },

  // ─────────────────────────────────────────────
  // LINKED LISTS  (3 problems)
  // ─────────────────────────────────────────────
  7: {
    id: 7,
    title: "Reverse Linked List",
    difficulty: "Easy",
    topic: "Linked Lists",
    description:
      "Given the `head` of a singly linked list, reverse the list, and return the **reversed list**.",
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
      { input: "head = [1,2]", output: "[2,1]" },
      { input: "head = []", output: "[]" },
    ],
    constraints: [
      "The number of nodes in the list is in the range [0, 5000].",
      "-5000 <= Node.val <= 5000",
    ],
    starterCode: {
      javascript:
        "/**\n * @param {ListNode} head\n * @return {ListNode}\n */\nvar reverseList = function(head) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        # Write your solution here\n        pass",
      cpp:
        "class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "var reverseList = function(head) {\n    let prev = null, curr = head;\n    while (curr) {\n        const next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n};",
      python:
        "class Solution:\n    def reverseList(self, head):\n        prev, curr = None, head\n        while curr:\n            curr.next, prev, curr = prev, curr, curr.next\n        return prev",
      cpp:
        "ListNode* reverseList(ListNode* head) {\n    ListNode* prev = nullptr;\n    while (head) {\n        ListNode* next = head->next;\n        head->next = prev;\n        prev = head;\n        head = next;\n    }\n    return prev;\n}",
    },
    testCases: [
      { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
      { input: [[1, 2]], expected: [2, 1] },
      { input: [[]], expected: [] },
    ],
  },

  8: {
    id: 8,
    title: "Linked List Cycle",
    difficulty: "Easy",
    topic: "Linked Lists",
    description:
      "Given `head`, the head of a linked list, determine if the linked list has a **cycle** in it.\n\nA cycle exists in a linked list if there is some node in the list that can be reached again by continuously following the `next` pointer.\n\nReturn `true` if there is a cycle in the linked list. Otherwise, return `false`.",
    examples: [
      {
        input: "head = [3,2,0,-4], pos = 1",
        output: "true",
        explanation: "There is a cycle; tail connects to node at index 1.",
      },
      {
        input: "head = [1,2], pos = 0",
        output: "true",
        explanation: "Tail connects to node at index 0.",
      },
      { input: "head = [1], pos = -1", output: "false" },
    ],
    constraints: [
      "The number of nodes in the list is in the range [0, 10^4].",
      "-10^5 <= Node.val <= 10^5",
      "pos is -1 or a valid index in the linked list.",
    ],
    starterCode: {
      javascript:
        "/**\n * @param {ListNode} head\n * @return {boolean}\n */\nvar hasCycle = function(head) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def hasCycle(self, head: Optional[ListNode]) -> bool:\n        # Write your solution here\n        pass",
      cpp:
        "class Solution {\npublic:\n    bool hasCycle(ListNode *head) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "var hasCycle = function(head) {\n    let slow = head, fast = head;\n    while (fast && fast.next) {\n        slow = slow.next;\n        fast = fast.next.next;\n        if (slow === fast) return true;\n    }\n    return false;\n};",
      python:
        "class Solution:\n    def hasCycle(self, head):\n        slow = fast = head\n        while fast and fast.next:\n            slow = slow.next\n            fast = fast.next.next\n            if slow is fast:\n                return True\n        return False",
      cpp:
        "bool hasCycle(ListNode *head) {\n    ListNode *slow = head, *fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if (slow == fast) return true;\n    }\n    return false;\n}",
    },
    testCases: [
      { input: [[3, 2, 0, -4], 1], expected: true },
      { input: [[1, 2], 0], expected: true },
      { input: [[1], -1], expected: false },
    ],
  },

  9: {
    id: 9,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    topic: "Linked Lists",
    description:
      "You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.",
    examples: [
      {
        input: "list1 = [1,2,4], list2 = [1,3,4]",
        output: "[1,1,2,3,4,4]",
      },
      { input: "list1 = [], list2 = []", output: "[]" },
      { input: "list1 = [], list2 = [0]", output: "[0]" },
    ],
    constraints: [
      "The number of nodes in both lists is in the range [0, 50].",
      "-100 <= Node.val <= 100",
      "Both list1 and list2 are sorted in non-decreasing order.",
    ],
    starterCode: {
      javascript:
        "/**\n * @param {ListNode} list1\n * @param {ListNode} list2\n * @return {ListNode}\n */\nvar mergeTwoLists = function(list1, list2) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:\n        # Write your solution here\n        pass",
      cpp:
        "class Solution {\npublic:\n    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "var mergeTwoLists = function(list1, list2) {\n    const dummy = new ListNode(0);\n    let cur = dummy;\n    while (list1 && list2) {\n        if (list1.val <= list2.val) { cur.next = list1; list1 = list1.next; }\n        else { cur.next = list2; list2 = list2.next; }\n        cur = cur.next;\n    }\n    cur.next = list1 || list2;\n    return dummy.next;\n};",
      python:
        "class Solution:\n    def mergeTwoLists(self, list1, list2):\n        dummy = cur = ListNode(0)\n        while list1 and list2:\n            if list1.val <= list2.val:\n                cur.next, list1 = list1, list1.next\n            else:\n                cur.next, list2 = list2, list2.next\n            cur = cur.next\n        cur.next = list1 or list2\n        return dummy.next",
      cpp:
        "ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {\n    ListNode dummy(0); ListNode* cur = &dummy;\n    while (l1 && l2) {\n        if (l1->val <= l2->val) { cur->next = l1; l1 = l1->next; }\n        else { cur->next = l2; l2 = l2->next; }\n        cur = cur->next;\n    }\n    cur->next = l1 ? l1 : l2;\n    return dummy.next;\n}",
    },
    testCases: [
      { input: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4] },
      { input: [[], []], expected: [] },
      { input: [[], [0]], expected: [0] },
    ],
  },

  // ─────────────────────────────────────────────
  // TREES  (3 problems)
  // ─────────────────────────────────────────────
  10: {
    id: 10,
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    topic: "Trees",
    description:
      "Given the `root` of a binary tree, return its **maximum depth**.\n\nA binary tree's **maximum depth** is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "3" },
      { input: "root = [1,null,2]", output: "2" },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 10^4].",
      "-100 <= Node.val <= 100",
    ],
    starterCode: {
      javascript:
        "/**\n * @param {TreeNode} root\n * @return {number}\n */\nvar maxDepth = function(root) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def maxDepth(self, root: Optional[TreeNode]) -> int:\n        # Write your solution here\n        pass",
      cpp:
        "class Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "var maxDepth = function(root) {\n    if (!root) return 0;\n    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n};",
      python:
        "class Solution:\n    def maxDepth(self, root):\n        if not root: return 0\n        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))",
      cpp:
        "int maxDepth(TreeNode* root) {\n    if (!root) return 0;\n    return 1 + max(maxDepth(root->left), maxDepth(root->right));\n}",
    },
    testCases: [
      { input: [[3, 9, 20, null, null, 15, 7]], expected: 3 },
      { input: [[1, null, 2]], expected: 2 },
      { input: [[]], expected: 0 },
    ],
  },

  11: {
    id: 11,
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    topic: "Trees",
    description:
      "Given the `root` of a binary tree, return the **level order traversal** of its nodes' values (i.e., from left to right, level by level).",
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "[[3],[9,20],[15,7]]",
      },
      { input: "root = [1]", output: "[[1]]" },
      { input: "root = []", output: "[]" },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 2000].",
      "-1000 <= Node.val <= 1000",
    ],
    starterCode: {
      javascript:
        "/**\n * @param {TreeNode} root\n * @return {number[][]}\n */\nvar levelOrder = function(root) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:\n        # Write your solution here\n        pass",
      cpp:
        "#include <queue>\nclass Solution {\npublic:\n    vector<vector<int>> levelOrder(TreeNode* root) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "var levelOrder = function(root) {\n    if (!root) return [];\n    const res = [], queue = [root];\n    while (queue.length) {\n        const level = [], size = queue.length;\n        for (let i = 0; i < size; i++) {\n            const node = queue.shift();\n            level.push(node.val);\n            if (node.left) queue.push(node.left);\n            if (node.right) queue.push(node.right);\n        }\n        res.push(level);\n    }\n    return res;\n};",
      python:
        "from collections import deque\nclass Solution:\n    def levelOrder(self, root):\n        if not root: return []\n        res, q = [], deque([root])\n        while q:\n            level = []\n            for _ in range(len(q)):\n                node = q.popleft()\n                level.append(node.val)\n                if node.left: q.append(node.left)\n                if node.right: q.append(node.right)\n            res.append(level)\n        return res",
      cpp:
        "vector<vector<int>> levelOrder(TreeNode* root) {\n    if (!root) return {};\n    vector<vector<int>> res;\n    queue<TreeNode*> q;\n    q.push(root);\n    while (!q.empty()) {\n        int sz = q.size();\n        vector<int> level;\n        for (int i = 0; i < sz; i++) {\n            auto node = q.front(); q.pop();\n            level.push_back(node->val);\n            if (node->left) q.push(node->left);\n            if (node->right) q.push(node->right);\n        }\n        res.push_back(level);\n    }\n    return res;\n}",
    },
    testCases: [
      { input: [[3, 9, 20, null, null, 15, 7]], expected: [[3], [9, 20], [15, 7]] },
      { input: [[1]], expected: [[1]] },
      { input: [[]], expected: [] },
    ],
  },

  12: {
    id: 12,
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    topic: "Trees",
    description:
      "Given the `root` of a binary tree, determine if it is a valid **binary search tree (BST)**.\n\nA valid BST is defined as follows:\n- The left subtree of a node contains only nodes with keys **less than** the node's key.\n- The right subtree of a node contains only nodes with keys **greater than** the node's key.\n- Both the left and right subtrees must also be binary search trees.",
    examples: [
      { input: "root = [2,1,3]", output: "true" },
      {
        input: "root = [5,1,4,null,null,3,6]",
        output: "false",
        explanation: "The root node's value is 5 but its right child's value is 4.",
      },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [1, 10^4].",
      "-2^31 <= Node.val <= 2^31 - 1",
    ],
    starterCode: {
      javascript:
        "/**\n * @param {TreeNode} root\n * @return {boolean}\n */\nvar isValidBST = function(root) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def isValidBST(self, root: Optional[TreeNode]) -> bool:\n        # Write your solution here\n        pass",
      cpp:
        "class Solution {\npublic:\n    bool isValidBST(TreeNode* root) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "var isValidBST = function(root) {\n    const validate = (node, min, max) => {\n        if (!node) return true;\n        if (node.val <= min || node.val >= max) return false;\n        return validate(node.left, min, node.val) && validate(node.right, node.val, max);\n    };\n    return validate(root, -Infinity, Infinity);\n};",
      python:
        "class Solution:\n    def isValidBST(self, root):\n        def validate(node, lo, hi):\n            if not node: return True\n            if not (lo < node.val < hi): return False\n            return validate(node.left, lo, node.val) and validate(node.right, node.val, hi)\n        return validate(root, float('-inf'), float('inf'))",
      cpp:
        "bool validate(TreeNode* node, long lo, long hi) {\n    if (!node) return true;\n    if (node->val <= lo || node->val >= hi) return false;\n    return validate(node->left, lo, node->val) && validate(node->right, node->val, hi);\n}\nbool isValidBST(TreeNode* root) { return validate(root, LONG_MIN, LONG_MAX); }",
    },
    testCases: [
      { input: [[2, 1, 3]], expected: true },
      { input: [[5, 1, 4, null, null, 3, 6]], expected: false },
    ],
  },

  // ─────────────────────────────────────────────
  // GRAPHS  (3 problems)
  // ─────────────────────────────────────────────
  13: {
    id: 13,
    title: "Number of Islands",
    difficulty: "Medium",
    topic: "Graphs",
    description:
      'Given an `m x n` 2D binary grid which represents a map of `\'1\'`s (land) and `\'0\'`s (water), return the **number of islands**.\n\nAn **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.',
    examples: [
      {
        input:
          'grid = [\n  ["1","1","1","1","0"],\n  ["1","1","0","1","0"],\n  ["1","1","0","0","0"],\n  ["0","0","0","0","0"]\n]',
        output: "1",
      },
      {
        input:
          'grid = [\n  ["1","1","0","0","0"],\n  ["1","1","0","0","0"],\n  ["0","0","1","0","0"],\n  ["0","0","0","1","1"]\n]',
        output: "3",
      },
    ],
    constraints: [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      'grid[i][j] is \'0\' or \'1\'.',
    ],
    starterCode: {
      javascript:
        "/**\n * @param {character[][]} grid\n * @return {number}\n */\nvar numIslands = function(grid) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def numIslands(self, grid: List[List[str]]) -> int:\n        # Write your solution here\n        pass",
      cpp:
        "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "var numIslands = function(grid) {\n    let count = 0;\n    const dfs = (r, c) => {\n        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] !== '1') return;\n        grid[r][c] = '0';\n        dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);\n    };\n    for (let r = 0; r < grid.length; r++)\n        for (let c = 0; c < grid[0].length; c++)\n            if (grid[r][c] === '1') { count++; dfs(r, c); }\n    return count;\n};",
      python:
        "class Solution:\n    def numIslands(self, grid):\n        def dfs(r, c):\n            if r < 0 or r >= len(grid) or c < 0 or c >= len(grid[0]) or grid[r][c] != '1': return\n            grid[r][c] = '0'\n            dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1)\n        count = 0\n        for r in range(len(grid)):\n            for c in range(len(grid[0])):\n                if grid[r][c] == '1':\n                    dfs(r, c); count += 1\n        return count",
      cpp:
        "void dfs(vector<vector<char>>& g, int r, int c) {\n    if (r<0||r>=g.size()||c<0||c>=g[0].size()||g[r][c]!='1') return;\n    g[r][c]='0';\n    dfs(g,r+1,c); dfs(g,r-1,c); dfs(g,r,c+1); dfs(g,r,c-1);\n}\nint numIslands(vector<vector<char>>& grid) {\n    int cnt=0;\n    for(int r=0;r<grid.size();r++) for(int c=0;c<grid[0].size();c++) if(grid[r][c]=='1'){dfs(grid,r,c);cnt++;}\n    return cnt;\n}",
    },
    testCases: [
      {
        input: [
          [
            ["1", "1", "1", "1", "0"],
            ["1", "1", "0", "1", "0"],
            ["1", "1", "0", "0", "0"],
            ["0", "0", "0", "0", "0"],
          ],
        ],
        expected: 1,
      },
      {
        input: [
          [
            ["1", "1", "0", "0", "0"],
            ["1", "1", "0", "0", "0"],
            ["0", "0", "1", "0", "0"],
            ["0", "0", "0", "1", "1"],
          ],
        ],
        expected: 3,
      },
    ],
  },

  14: {
    id: 14,
    title: "Course Schedule",
    difficulty: "Medium",
    topic: "Graphs",
    description:
      "There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [a_i, b_i]` indicates that you **must** take course `b_i` first if you want to take course `a_i`.\n\nReturn `true` if you can finish all courses. Otherwise, return `false`.\n\nThis is essentially a **cycle detection** problem in a directed graph.",
    examples: [
      {
        input: "numCourses = 2, prerequisites = [[1,0]]",
        output: "true",
        explanation: "Take course 0 first, then course 1.",
      },
      {
        input: "numCourses = 2, prerequisites = [[1,0],[0,1]]",
        output: "false",
        explanation: "There is a cycle between courses 0 and 1.",
      },
    ],
    constraints: [
      "1 <= numCourses <= 2000",
      "0 <= prerequisites.length <= 5000",
      "prerequisites[i].length == 2",
      "0 <= a_i, b_i < numCourses",
      "All the pairs prerequisites[i] are unique.",
    ],
    starterCode: {
      javascript:
        "/**\n * @param {number} numCourses\n * @param {number[][]} prerequisites\n * @return {boolean}\n */\nvar canFinish = function(numCourses, prerequisites) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:\n        # Write your solution here\n        pass",
      cpp:
        "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "var canFinish = function(numCourses, prerequisites) {\n    const adj = Array.from({length: numCourses}, () => []);\n    for (const [a, b] of prerequisites) adj[b].push(a);\n    const visited = new Array(numCourses).fill(0);\n    const dfs = (node) => {\n        if (visited[node] === 1) return false;\n        if (visited[node] === 2) return true;\n        visited[node] = 1;\n        for (const nb of adj[node]) if (!dfs(nb)) return false;\n        visited[node] = 2;\n        return true;\n    };\n    for (let i = 0; i < numCourses; i++) if (!dfs(i)) return false;\n    return true;\n};",
      python:
        "class Solution:\n    def canFinish(self, numCourses, prerequisites):\n        adj = [[] for _ in range(numCourses)]\n        for a, b in prerequisites: adj[b].append(a)\n        visited = [0] * numCourses\n        def dfs(node):\n            if visited[node] == 1: return False\n            if visited[node] == 2: return True\n            visited[node] = 1\n            for nb in adj[node]:\n                if not dfs(nb): return False\n            visited[node] = 2\n            return True\n        return all(dfs(i) for i in range(numCourses))",
      cpp:
        "bool canFinish(int n, vector<vector<int>>& pre) {\n    vector<vector<int>> adj(n);\n    for (auto& p : pre) adj[p[1]].push_back(p[0]);\n    vector<int> vis(n, 0);\n    function<bool(int)> dfs = [&](int u) -> bool {\n        if (vis[u] == 1) return false;\n        if (vis[u] == 2) return true;\n        vis[u] = 1;\n        for (int v : adj[u]) if (!dfs(v)) return false;\n        vis[u] = 2; return true;\n    };\n    for (int i = 0; i < n; i++) if (!dfs(i)) return false;\n    return true;\n}",
    },
    testCases: [
      { input: [2, [[1, 0]]], expected: true },
      { input: [2, [[1, 0], [0, 1]]], expected: false },
      { input: [1, []], expected: true },
    ],
  },

  15: {
    id: 15,
    title: "Clone Graph",
    difficulty: "Medium",
    topic: "Graphs",
    description:
      "Given a reference of a node in a **connected** undirected graph, return a **deep copy** (clone) of the graph.\n\nEach node in the graph contains a value (`int`) and a list of its neighbors (`List[Node]`).\n\nThe graph is represented in the test case as an adjacency list where `adjList[i]` is a list of all nodes adjacent to node `i + 1`.",
    examples: [
      {
        input: "adjList = [[2,4],[1,3],[2,4],[1,3]]",
        output: "[[2,4],[1,3],[2,4],[1,3]]",
        explanation: "A deep clone of the 4-node cycle graph.",
      },
      { input: "adjList = [[]]", output: "[[]]" },
    ],
    constraints: [
      "The number of nodes in the graph is in the range [0, 100].",
      "1 <= Node.val <= 100",
      "Node.val is unique for each node.",
      "There are no repeated edges and no self-loops in the graph.",
    ],
    starterCode: {
      javascript:
        "/**\n * @param {Node} node\n * @return {Node}\n */\nvar cloneGraph = function(node) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def cloneGraph(self, node: Optional['Node']) -> Optional['Node']:\n        # Write your solution here\n        pass",
      cpp:
        "class Solution {\npublic:\n    Node* cloneGraph(Node* node) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "var cloneGraph = function(node) {\n    if (!node) return null;\n    const map = new Map();\n    const dfs = (n) => {\n        if (map.has(n)) return map.get(n);\n        const clone = new Node(n.val);\n        map.set(n, clone);\n        for (const nb of n.neighbors) clone.neighbors.push(dfs(nb));\n        return clone;\n    };\n    return dfs(node);\n};",
      python:
        "class Solution:\n    def cloneGraph(self, node):\n        if not node: return None\n        cloned = {}\n        def dfs(n):\n            if n in cloned: return cloned[n]\n            copy = Node(n.val)\n            cloned[n] = copy\n            for nb in n.neighbors: copy.neighbors.append(dfs(nb))\n            return copy\n        return dfs(node)",
      cpp:
        "unordered_map<Node*, Node*> mp;\nNode* cloneGraph(Node* node) {\n    if (!node) return nullptr;\n    if (mp.count(node)) return mp[node];\n    Node* clone = new Node(node->val);\n    mp[node] = clone;\n    for (auto nb : node->neighbors) clone->neighbors.push_back(cloneGraph(nb));\n    return clone;\n}",
    },
    testCases: [
      { input: [[[2, 4], [1, 3], [2, 4], [1, 3]]], expected: [[2, 4], [1, 3], [2, 4], [1, 3]] },
      { input: [[[]]], expected: [[]] },
    ],
  },

  // ─────────────────────────────────────────────
  // DYNAMIC PROGRAMMING  (3 problems)
  // ─────────────────────────────────────────────
  16: {
    id: 16,
    title: "Climbing Stairs",
    difficulty: "Easy",
    topic: "Dynamic Programming",
    description:
      "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?",
    examples: [
      { input: "n = 2", output: "2", explanation: "Two ways: (1+1) or (2)." },
      {
        input: "n = 3",
        output: "3",
        explanation: "Three ways: (1+1+1), (1+2), (2+1).",
      },
    ],
    constraints: ["1 <= n <= 45"],
    starterCode: {
      javascript:
        "/**\n * @param {number} n\n * @return {number}\n */\nvar climbStairs = function(n) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def climbStairs(self, n: int) -> int:\n        # Write your solution here\n        pass",
      cpp:
        "class Solution {\npublic:\n    int climbStairs(int n) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "var climbStairs = function(n) {\n    let a = 1, b = 1;\n    for (let i = 2; i <= n; i++) [a, b] = [b, a + b];\n    return b;\n};",
      python:
        "class Solution:\n    def climbStairs(self, n):\n        a = b = 1\n        for _ in range(n - 1):\n            a, b = b, a + b\n        return b",
      cpp:
        "int climbStairs(int n) {\n    int a = 1, b = 1;\n    for (int i = 2; i <= n; i++) { int c = a + b; a = b; b = c; }\n    return b;\n}",
    },
    testCases: [
      { input: [2], expected: 2 },
      { input: [3], expected: 3 },
      { input: [5], expected: 8 },
    ],
  },

  17: {
    id: 17,
    title: "Longest Common Subsequence",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    description:
      "Given two strings `text1` and `text2`, return the length of their **longest common subsequence**. If there is no common subsequence, return `0`.\n\nA **subsequence** of a string is a new string generated from the original string with some characters deleted (can be none) without changing the relative order of the remaining characters.\n\nA **common subsequence** of two strings is a subsequence that is common to both strings.",
    examples: [
      {
        input: 'text1 = "abcde", text2 = "ace"',
        output: "3",
        explanation: 'LCS is "ace".',
      },
      { input: 'text1 = "abc", text2 = "abc"', output: "3" },
      { input: 'text1 = "abc", text2 = "def"', output: "0" },
    ],
    constraints: [
      "1 <= text1.length, text2.length <= 1000",
      "text1 and text2 consist of only lowercase English characters.",
    ],
    starterCode: {
      javascript:
        "/**\n * @param {string} text1\n * @param {string} text2\n * @return {number}\n */\nvar longestCommonSubsequence = function(text1, text2) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def longestCommonSubsequence(self, text1: str, text2: str) -> int:\n        # Write your solution here\n        pass",
      cpp:
        "#include <string>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int longestCommonSubsequence(string text1, string text2) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "var longestCommonSubsequence = function(text1, text2) {\n    const m = text1.length, n = text2.length;\n    const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));\n    for (let i = 1; i <= m; i++)\n        for (let j = 1; j <= n; j++)\n            dp[i][j] = text1[i-1] === text2[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1]);\n    return dp[m][n];\n};",
      python:
        "class Solution:\n    def longestCommonSubsequence(self, text1, text2):\n        m, n = len(text1), len(text2)\n        dp = [[0]*(n+1) for _ in range(m+1)]\n        for i in range(1, m+1):\n            for j in range(1, n+1):\n                dp[i][j] = dp[i-1][j-1]+1 if text1[i-1]==text2[j-1] else max(dp[i-1][j], dp[i][j-1])\n        return dp[m][n]",
      cpp:
        "int longestCommonSubsequence(string t1, string t2) {\n    int m=t1.size(), n=t2.size();\n    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));\n    for(int i=1;i<=m;i++) for(int j=1;j<=n;j++)\n        dp[i][j] = t1[i-1]==t2[j-1] ? dp[i-1][j-1]+1 : max(dp[i-1][j],dp[i][j-1]);\n    return dp[m][n];\n}",
    },
    testCases: [
      { input: ["abcde", "ace"], expected: 3 },
      { input: ["abc", "abc"], expected: 3 },
      { input: ["abc", "def"], expected: 0 },
    ],
  },

  18: {
    id: 18,
    title: "Coin Change",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    description:
      "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the **fewest number of coins** that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.\n\nYou may assume that you have an **infinite number** of each kind of coin.",
    examples: [
      {
        input: "coins = [1,2,5], amount = 11",
        output: "3",
        explanation: "11 = 5 + 5 + 1",
      },
      { input: "coins = [2], amount = 3", output: "-1" },
      { input: "coins = [1], amount = 0", output: "0" },
    ],
    constraints: [
      "1 <= coins.length <= 12",
      "1 <= coins[i] <= 2^31 - 1",
      "0 <= amount <= 10^4",
    ],
    starterCode: {
      javascript:
        "/**\n * @param {number[]} coins\n * @param {number} amount\n * @return {number}\n */\nvar coinChange = function(coins, amount) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def coinChange(self, coins: List[int], amount: int) -> int:\n        # Write your solution here\n        pass",
      cpp:
        "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "var coinChange = function(coins, amount) {\n    const dp = new Array(amount + 1).fill(Infinity);\n    dp[0] = 0;\n    for (let i = 1; i <= amount; i++)\n        for (const c of coins)\n            if (c <= i) dp[i] = Math.min(dp[i], dp[i - c] + 1);\n    return dp[amount] === Infinity ? -1 : dp[amount];\n};",
      python:
        "class Solution:\n    def coinChange(self, coins, amount):\n        dp = [float('inf')] * (amount + 1)\n        dp[0] = 0\n        for i in range(1, amount + 1):\n            for c in coins:\n                if c <= i:\n                    dp[i] = min(dp[i], dp[i - c] + 1)\n        return dp[amount] if dp[amount] != float('inf') else -1",
      cpp:
        "int coinChange(vector<int>& coins, int amount) {\n    vector<int> dp(amount+1, INT_MAX);\n    dp[0]=0;\n    for(int i=1;i<=amount;i++) for(int c:coins) if(c<=i && dp[i-c]!=INT_MAX) dp[i]=min(dp[i],dp[i-c]+1);\n    return dp[amount]==INT_MAX?-1:dp[amount];\n}",
    },
    testCases: [
      { input: [[1, 2, 5], 11], expected: 3 },
      { input: [[2], 3], expected: -1 },
      { input: [[1], 0], expected: 0 },
    ],
  },

  // ─────────────────────────────────────────────
  // BACKTRACKING  (2 problems)
  // ─────────────────────────────────────────────
  19: {
    id: 19,
    title: "Subsets",
    difficulty: "Medium",
    topic: "Backtracking",
    description:
      "Given an integer array `nums` of **unique** elements, return all possible subsets (the power set).\n\nThe solution set **must not** contain duplicate subsets. Return the solution in **any order**.",
    examples: [
      {
        input: "nums = [1,2,3]",
        output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]",
      },
      { input: "nums = [0]", output: "[[],[0]]" },
    ],
    constraints: [
      "1 <= nums.length <= 10",
      "-10 <= nums[i] <= 10",
      "All the numbers of nums are unique.",
    ],
    starterCode: {
      javascript:
        "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nvar subsets = function(nums) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def subsets(self, nums: List[int]) -> List[List[int]]:\n        # Write your solution here\n        pass",
      cpp:
        "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> subsets(vector<int>& nums) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "var subsets = function(nums) {\n    const res = [];\n    const bt = (start, curr) => {\n        res.push([...curr]);\n        for (let i = start; i < nums.length; i++) {\n            curr.push(nums[i]);\n            bt(i + 1, curr);\n            curr.pop();\n        }\n    };\n    bt(0, []);\n    return res;\n};",
      python:
        "class Solution:\n    def subsets(self, nums):\n        res = []\n        def bt(start, curr):\n            res.append(list(curr))\n            for i in range(start, len(nums)):\n                curr.append(nums[i])\n                bt(i+1, curr)\n                curr.pop()\n        bt(0, [])\n        return res",
      cpp:
        "vector<vector<int>> subsets(vector<int>& nums) {\n    vector<vector<int>> res;\n    vector<int> cur;\n    function<void(int)> bt = [&](int start) {\n        res.push_back(cur);\n        for (int i = start; i < nums.size(); i++) {\n            cur.push_back(nums[i]); bt(i+1); cur.pop_back();\n        }\n    };\n    bt(0); return res;\n}",
    },
    testCases: [
      {
        input: [[1, 2, 3]],
        expected: [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]],
      },
      { input: [[0]], expected: [[], [0]] },
    ],
  },

  20: {
    id: 20,
    title: "Combination Sum",
    difficulty: "Medium",
    topic: "Backtracking",
    description:
      "Given an array of **distinct** integers `candidates` and a target integer `target`, return a list of all **unique combinations** of `candidates` where the chosen numbers sum to `target`. You may return the combinations in any order.\n\nThe **same** number may be chosen from `candidates` an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.",
    examples: [
      {
        input: "candidates = [2,3,6,7], target = 7",
        output: "[[2,2,3],[7]]",
      },
      {
        input: "candidates = [2,3,5], target = 8",
        output: "[[2,2,2,2],[2,3,3],[3,5]]",
      },
    ],
    constraints: [
      "1 <= candidates.length <= 30",
      "2 <= candidates[i] <= 40",
      "All elements of candidates are distinct.",
      "1 <= target <= 40",
    ],
    starterCode: {
      javascript:
        "/**\n * @param {number[]} candidates\n * @param {number} target\n * @return {number[][]}\n */\nvar combinationSum = function(candidates, target) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:\n        # Write your solution here\n        pass",
      cpp:
        "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "var combinationSum = function(candidates, target) {\n    const res = [];\n    const bt = (start, curr, rem) => {\n        if (rem === 0) { res.push([...curr]); return; }\n        for (let i = start; i < candidates.length; i++) {\n            if (candidates[i] > rem) continue;\n            curr.push(candidates[i]);\n            bt(i, curr, rem - candidates[i]);\n            curr.pop();\n        }\n    };\n    bt(0, [], target);\n    return res;\n};",
      python:
        "class Solution:\n    def combinationSum(self, candidates, target):\n        res = []\n        def bt(start, curr, rem):\n            if rem == 0: res.append(list(curr)); return\n            for i in range(start, len(candidates)):\n                if candidates[i] > rem: continue\n                curr.append(candidates[i])\n                bt(i, curr, rem - candidates[i])\n                curr.pop()\n        bt(0, [], target)\n        return res",
      cpp:
        "vector<vector<int>> combinationSum(vector<int>& cands, int target) {\n    vector<vector<int>> res; vector<int> cur;\n    function<void(int,int)> bt = [&](int s, int rem) {\n        if (!rem) { res.push_back(cur); return; }\n        for (int i=s;i<cands.size();i++) {\n            if(cands[i]>rem) continue;\n            cur.push_back(cands[i]); bt(i,rem-cands[i]); cur.pop_back();\n        }\n    };\n    bt(0,target); return res;\n}",
    },
    testCases: [
      { input: [[2, 3, 6, 7], 7], expected: [[2, 2, 3], [7]] },
      { input: [[2, 3, 5], 8], expected: [[2, 2, 2, 2], [2, 3, 3], [3, 5]] },
    ],
  },

  // ─────────────────────────────────────────────
  // BIT MANIPULATION  (2 problems)
  // ─────────────────────────────────────────────
  21: {
    id: 21,
    title: "Single Number",
    difficulty: "Easy",
    topic: "Bit Manipulation",
    description:
      "Given a **non-empty** array of integers `nums`, every element appears twice except for one. Find that single one.\n\nYou must implement a solution with a **linear runtime complexity** and use only **constant extra space**.",
    examples: [
      { input: "nums = [2,2,1]", output: "1" },
      { input: "nums = [4,1,2,1,2]", output: "4" },
      { input: "nums = [1]", output: "1" },
    ],
    constraints: [
      "1 <= nums.length <= 3 * 10^4",
      "-3 * 10^4 <= nums[i] <= 3 * 10^4",
      "Each element in the array appears twice except for one element which appears only once.",
    ],
    starterCode: {
      javascript:
        "/**\n * @param {number[]} nums\n * @return {number}\n */\nvar singleNumber = function(nums) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def singleNumber(self, nums: List[int]) -> int:\n        # Write your solution here\n        pass",
      cpp:
        "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int singleNumber(vector<int>& nums) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "var singleNumber = function(nums) {\n    return nums.reduce((xor, n) => xor ^ n, 0);\n};",
      python:
        "from functools import reduce\nfrom operator import xor\nclass Solution:\n    def singleNumber(self, nums):\n        return reduce(xor, nums)",
      cpp:
        "int singleNumber(vector<int>& nums) {\n    int x = 0;\n    for (int n : nums) x ^= n;\n    return x;\n}",
    },
    testCases: [
      { input: [[2, 2, 1]], expected: 1 },
      { input: [[4, 1, 2, 1, 2]], expected: 4 },
      { input: [[1]], expected: 1 },
    ],
  },

  22: {
    id: 22,
    title: "Counting Bits",
    difficulty: "Easy",
    topic: "Bit Manipulation",
    description:
      "Given an integer `n`, return an array `ans` of length `n + 1` such that for each `i` (where `0 <= i <= n`), `ans[i]` is the **number of 1's** in the binary representation of `i`.\n\nYou must write an algorithm with **linear time complexity** and without using any built-in function.",
    examples: [
      {
        input: "n = 2",
        output: "[0,1,1]",
        explanation: "0 → 0, 1 → 1, 2 → 10 → 1 set bit.",
      },
      {
        input: "n = 5",
        output: "[0,1,1,2,1,2]",
      },
    ],
    constraints: ["0 <= n <= 10^5"],
    starterCode: {
      javascript:
        "/**\n * @param {number} n\n * @return {number[]}\n */\nvar countBits = function(n) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def countBits(self, n: int) -> List[int]:\n        # Write your solution here\n        pass",
      cpp:
        "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> countBits(int n) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "var countBits = function(n) {\n    const dp = new Array(n + 1).fill(0);\n    for (let i = 1; i <= n; i++) dp[i] = dp[i >> 1] + (i & 1);\n    return dp;\n};",
      python:
        "class Solution:\n    def countBits(self, n):\n        dp = [0] * (n + 1)\n        for i in range(1, n + 1):\n            dp[i] = dp[i >> 1] + (i & 1)\n        return dp",
      cpp:
        "vector<int> countBits(int n) {\n    vector<int> dp(n+1, 0);\n    for (int i=1;i<=n;i++) dp[i]=dp[i>>1]+(i&1);\n    return dp;\n}",
    },
    testCases: [
      { input: [2], expected: [0, 1, 1] },
      { input: [5], expected: [0, 1, 1, 2, 1, 2] },
    ],
  },

  // ─────────────────────────────────────────────
  // SLIDING WINDOW  (3 problems)
  // ─────────────────────────────────────────────
  23: {
    id: 23,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topic: "Sliding Window",
    description:
      "Given a string `s`, find the length of the **longest substring** without repeating characters.",
    examples: [
      { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc".' },
      { input: 's = "bbbbb"', output: "1", explanation: 'The answer is "b".' },
      { input: 's = "pwwkew"', output: "3", explanation: 'The answer is "wke".' },
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces.",
    ],
    starterCode: {
      javascript:
        "/**\n * @param {string} s\n * @return {number}\n */\nvar lengthOfLongestSubstring = function(s) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        # Write your solution here\n        pass",
      cpp:
        "#include <string>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "var lengthOfLongestSubstring = function(s) {\n    const map = new Map();\n    let max = 0, left = 0;\n    for (let right = 0; right < s.length; right++) {\n        if (map.has(s[right])) left = Math.max(left, map.get(s[right]) + 1);\n        map.set(s[right], right);\n        max = Math.max(max, right - left + 1);\n    }\n    return max;\n};",
      python:
        "class Solution:\n    def lengthOfLongestSubstring(self, s):\n        seen = {}\n        left = res = 0\n        for right, c in enumerate(s):\n            if c in seen and seen[c] >= left:\n                left = seen[c] + 1\n            seen[c] = right\n            res = max(res, right - left + 1)\n        return res",
      cpp:
        "int lengthOfLongestSubstring(string s) {\n    unordered_map<char,int> m;\n    int l=0, res=0;\n    for(int r=0;r<s.size();r++) {\n        if(m.count(s[r]) && m[s[r]]>=l) l=m[s[r]]+1;\n        m[s[r]]=r;\n        res=max(res,r-l+1);\n    }\n    return res;\n}",
    },
    testCases: [
      { input: ["abcabcbb"], expected: 3 },
      { input: ["bbbbb"], expected: 1 },
      { input: ["pwwkew"], expected: 3 },
    ],
  },

  24: {
    id: 24,
    title: "Maximum Average Subarray I",
    difficulty: "Easy",
    topic: "Sliding Window",
    description:
      "You are given an integer array `nums` consisting of `n` elements, and an integer `k`.\n\nFind a contiguous subarray whose **length is equal to `k`** that has the maximum average value and return this value. Any answer with a calculation error less than `10^-5` will be accepted.",
    examples: [
      {
        input: "nums = [1,12,-5,-6,50,3], k = 4",
        output: "12.75000",
        explanation: "Maximum average is (12 - 5 - 6 + 50) / 4 = 51 / 4 = 12.75.",
      },
      { input: "nums = [5], k = 1", output: "5.00000" },
    ],
    constraints: [
      "n == nums.length",
      "1 <= k <= n <= 10^5",
      "-10^4 <= nums[i] <= 10^4",
    ],
    starterCode: {
      javascript:
        "/**\n * @param {number[]} nums\n * @param {number} k\n * @return {number}\n */\nvar findMaxAverage = function(nums, k) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def findMaxAverage(self, nums: List[int], k: int) -> float:\n        # Write your solution here\n        pass",
      cpp:
        "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    double findMaxAverage(vector<int>& nums, int k) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "var findMaxAverage = function(nums, k) {\n    let sum = nums.slice(0, k).reduce((a, b) => a + b, 0);\n    let max = sum;\n    for (let i = k; i < nums.length; i++) {\n        sum += nums[i] - nums[i - k];\n        max = Math.max(max, sum);\n    }\n    return max / k;\n};",
      python:
        "class Solution:\n    def findMaxAverage(self, nums, k):\n        s = sum(nums[:k])\n        mx = s\n        for i in range(k, len(nums)):\n            s += nums[i] - nums[i-k]\n            mx = max(mx, s)\n        return mx / k",
      cpp:
        "double findMaxAverage(vector<int>& nums, int k) {\n    int s=0;\n    for(int i=0;i<k;i++) s+=nums[i];\n    int mx=s;\n    for(int i=k;i<nums.size();i++){s+=nums[i]-nums[i-k];mx=max(mx,s);}\n    return (double)mx/k;\n}",
    },
    testCases: [
      { input: [[1, 12, -5, -6, 50, 3], 4], expected: 12.75 },
      { input: [[5], 1], expected: 5.0 },
    ],
  },

  25: {
    id: 25,
    title: "Minimum Window Substring",
    difficulty: "Hard",
    topic: "Sliding Window",
    description:
      "Given two strings `s` and `t` of lengths `m` and `n` respectively, return the **minimum window substring** of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string `\"\"`.\n\nThe test cases will be generated such that the answer is **unique**.",
    examples: [
      {
        input: 's = "ADOBECODEBANC", t = "ABC"',
        output: '"BANC"',
        explanation: 'The minimum window is "BANC".',
      },
      { input: 's = "a", t = "a"', output: '"a"' },
      {
        input: 's = "a", t = "aa"',
        output: '""',
        explanation: "Both 'a's from t must be in the window. No such window exists.",
      },
    ],
    constraints: [
      "m == s.length",
      "n == t.length",
      "1 <= m, n <= 10^5",
      "s and t consist of uppercase and lowercase English letters.",
    ],
    starterCode: {
      javascript:
        "/**\n * @param {string} s\n * @param {string} t\n * @return {string}\n */\nvar minWindow = function(s, t) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def minWindow(self, s: str, t: str) -> str:\n        # Write your solution here\n        pass",
      cpp:
        "#include <string>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    string minWindow(string s, string t) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "var minWindow = function(s, t) {\n    const need = {}, have = {};\n    for (const c of t) need[c] = (need[c] || 0) + 1;\n    let formed = 0, required = Object.keys(need).length;\n    let l = 0, res = '', minLen = Infinity;\n    for (let r = 0; r < s.length; r++) {\n        const c = s[r];\n        have[c] = (have[c] || 0) + 1;\n        if (need[c] && have[c] === need[c]) formed++;\n        while (formed === required) {\n            if (r - l + 1 < minLen) { minLen = r - l + 1; res = s.slice(l, r + 1); }\n            have[s[l]]--;\n            if (need[s[l]] && have[s[l]] < need[s[l]]) formed--;\n            l++;\n        }\n    }\n    return res;\n};",
      python:
        "from collections import Counter\nclass Solution:\n    def minWindow(self, s, t):\n        need = Counter(t)\n        have, formed = {}, 0\n        required = len(need)\n        l, res, mn = 0, '', float('inf')\n        for r, c in enumerate(s):\n            have[c] = have.get(c, 0) + 1\n            if c in need and have[c] == need[c]: formed += 1\n            while formed == required:\n                if r-l+1 < mn: mn = r-l+1; res = s[l:r+1]\n                have[s[l]] -= 1\n                if s[l] in need and have[s[l]] < need[s[l]]: formed -= 1\n                l += 1\n        return res",
      cpp:
        "string minWindow(string s, string t) {\n    unordered_map<char,int> need, have;\n    for(char c:t) need[c]++;\n    int formed=0, required=need.size(), l=0, mn=INT_MAX, start=0;\n    for(int r=0;r<s.size();r++){\n        have[s[r]]++;\n        if(need.count(s[r])&&have[s[r]]==need[s[r]]) formed++;\n        while(formed==required){\n            if(r-l+1<mn){mn=r-l+1;start=l;}\n            have[s[l]]--;\n            if(need.count(s[l])&&have[s[l]]<need[s[l]]) formed--;\n            l++;\n        }\n    }\n    return mn==INT_MAX?\"\":s.substr(start,mn);\n}",
    },
    testCases: [
      { input: ["ADOBECODEBANC", "ABC"], expected: "BANC" },
      { input: ["a", "a"], expected: "a" },
      { input: ["a", "aa"], expected: "" },
    ],
  },

  // ─────────────────────────────────────────────
  // BINARY SEARCH  (3 problems)
  // ─────────────────────────────────────────────
  26: {
    id: 26,
    title: "Binary Search",
    difficulty: "Easy",
    topic: "Binary Search",
    description:
      "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with **O(log n)** runtime complexity.",
    examples: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" },
      { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1" },
    ],
    constraints: [
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4",
      "All the integers in nums are unique.",
      "nums is sorted in ascending order.",
    ],
    starterCode: {
      javascript:
        "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number}\n */\nvar search = function(nums, target) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        # Write your solution here\n        pass",
      cpp:
        "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "var search = function(nums, target) {\n    let lo = 0, hi = nums.length - 1;\n    while (lo <= hi) {\n        const mid = (lo + hi) >> 1;\n        if (nums[mid] === target) return mid;\n        else if (nums[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return -1;\n};",
      python:
        "class Solution:\n    def search(self, nums, target):\n        lo, hi = 0, len(nums)-1\n        while lo <= hi:\n            mid = (lo+hi)//2\n            if nums[mid] == target: return mid\n            elif nums[mid] < target: lo = mid+1\n            else: hi = mid-1\n        return -1",
      cpp:
        "int search(vector<int>& nums, int target) {\n    int lo=0, hi=nums.size()-1;\n    while(lo<=hi){\n        int mid=(lo+hi)/2;\n        if(nums[mid]==target) return mid;\n        else if(nums[mid]<target) lo=mid+1;\n        else hi=mid-1;\n    }\n    return -1;\n}",
    },
    testCases: [
      { input: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
      { input: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
      { input: [[5], 5], expected: 0 },
    ],
  },

  27: {
    id: 27,
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    topic: "Binary Search",
    description:
      "Suppose an array of length `n` sorted in ascending order is **rotated** between `1` and `n` times. For example, the array `nums = [0,1,2,4,5,6,7]` might become `[4,5,6,7,0,1,2]`.\n\nGiven the sorted rotated array `nums` of **unique** elements, return the **minimum element** of this array.\n\nYou must write an algorithm that runs in **O(log n)** time.",
    examples: [
      { input: "nums = [3,4,5,1,2]", output: "1" },
      { input: "nums = [4,5,6,7,0,1,2]", output: "0" },
      { input: "nums = [11,13,15,17]", output: "11" },
    ],
    constraints: [
      "n == nums.length",
      "1 <= n <= 5000",
      "-5000 <= nums[i] <= 5000",
      "All the integers of nums are unique.",
      "nums is sorted and rotated between 1 and n times.",
    ],
    starterCode: {
      javascript:
        "/**\n * @param {number[]} nums\n * @return {number}\n */\nvar findMin = function(nums) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def findMin(self, nums: List[int]) -> int:\n        # Write your solution here\n        pass",
      cpp:
        "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findMin(vector<int>& nums) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "var findMin = function(nums) {\n    let lo = 0, hi = nums.length - 1;\n    while (lo < hi) {\n        const mid = (lo + hi) >> 1;\n        if (nums[mid] > nums[hi]) lo = mid + 1;\n        else hi = mid;\n    }\n    return nums[lo];\n};",
      python:
        "class Solution:\n    def findMin(self, nums):\n        lo, hi = 0, len(nums)-1\n        while lo < hi:\n            mid = (lo+hi)//2\n            if nums[mid] > nums[hi]: lo = mid+1\n            else: hi = mid\n        return nums[lo]",
      cpp:
        "int findMin(vector<int>& nums) {\n    int lo=0, hi=nums.size()-1;\n    while(lo<hi){\n        int mid=(lo+hi)/2;\n        if(nums[mid]>nums[hi]) lo=mid+1;\n        else hi=mid;\n    }\n    return nums[lo];\n}",
    },
    testCases: [
      { input: [[3, 4, 5, 1, 2]], expected: 1 },
      { input: [[4, 5, 6, 7, 0, 1, 2]], expected: 0 },
      { input: [[11, 13, 15, 17]], expected: 11 },
    ],
  },

  28: {
    id: 28,
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    topic: "Binary Search",
    description:
      "There is an integer array `nums` sorted in ascending order (with **distinct** values) that has been possibly rotated at an unknown pivot index.\n\nGiven the array `nums` after the possible rotation and an integer `target`, return the **index** of `target` if it is in `nums`, or `-1` if it is not in `nums`.\n\nYou must write an algorithm with **O(log n)** runtime complexity.",
    examples: [
      { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" },
      { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1" },
      { input: "nums = [1], target = 0", output: "-1" },
    ],
    constraints: [
      "1 <= nums.length <= 5000",
      "-10^4 <= nums[i] <= 10^4",
      "All values of nums are unique.",
      "nums is an ascending array that is possibly rotated.",
      "-10^4 <= target <= 10^4",
    ],
    starterCode: {
      javascript:
        "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number}\n */\nvar search = function(nums, target) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        # Write your solution here\n        pass",
      cpp:
        "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "var search = function(nums, target) {\n    let lo = 0, hi = nums.length - 1;\n    while (lo <= hi) {\n        const mid = (lo + hi) >> 1;\n        if (nums[mid] === target) return mid;\n        if (nums[lo] <= nums[mid]) {\n            if (target >= nums[lo] && target < nums[mid]) hi = mid - 1;\n            else lo = mid + 1;\n        } else {\n            if (target > nums[mid] && target <= nums[hi]) lo = mid + 1;\n            else hi = mid - 1;\n        }\n    }\n    return -1;\n};",
      python:
        "class Solution:\n    def search(self, nums, target):\n        lo, hi = 0, len(nums)-1\n        while lo <= hi:\n            mid = (lo+hi)//2\n            if nums[mid] == target: return mid\n            if nums[lo] <= nums[mid]:\n                if nums[lo] <= target < nums[mid]: hi = mid-1\n                else: lo = mid+1\n            else:\n                if nums[mid] < target <= nums[hi]: lo = mid+1\n                else: hi = mid-1\n        return -1",
      cpp:
        "int search(vector<int>& nums, int target) {\n    int lo=0,hi=nums.size()-1;\n    while(lo<=hi){\n        int mid=(lo+hi)/2;\n        if(nums[mid]==target) return mid;\n        if(nums[lo]<=nums[mid]){\n            if(target>=nums[lo]&&target<nums[mid]) hi=mid-1;\n            else lo=mid+1;\n        } else {\n            if(target>nums[mid]&&target<=nums[hi]) lo=mid+1;\n            else hi=mid-1;\n        }\n    }\n    return -1;\n}",
    },
    testCases: [
      { input: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
      { input: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 },
      { input: [[1], 0], expected: -1 },
    ],
  },

  // ─────────────────────────────────────────────
  // HEAP / PRIORITY QUEUE  (3 problems)
  // ─────────────────────────────────────────────
  29: {
    id: 29,
    title: "Kth Largest Element in an Array",
    difficulty: "Medium",
    topic: "Heap / Priority Queue",
    description:
      "Given an integer array `nums` and an integer `k`, return the **k-th largest element** in the array.\n\nNote that it is the k-th largest element in the sorted order, not the k-th distinct element.\n\nCan you solve it without sorting? Aim for **O(n log k)** using a min-heap.",
    examples: [
      { input: "nums = [3,2,1,5,6,4], k = 2", output: "5" },
      { input: "nums = [3,2,3,1,2,4,5,5,6], k = 4", output: "4" },
    ],
    constraints: [
      "1 <= k <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4",
    ],
    starterCode: {
      javascript:
        "/**\n * @param {number[]} nums\n * @param {number} k\n * @return {number}\n */\nvar findKthLargest = function(nums, k) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def findKthLargest(self, nums: List[int], k: int) -> int:\n        # Write your solution here\n        pass",
      cpp:
        "#include <vector>\n#include <queue>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findKthLargest(vector<int>& nums, int k) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "// Min-heap simulation via sorted array (O(n log k) conceptually)\nvar findKthLargest = function(nums, k) {\n    nums.sort((a, b) => b - a);\n    return nums[k - 1];\n};",
      python:
        "import heapq\nclass Solution:\n    def findKthLargest(self, nums, k):\n        return heapq.nlargest(k, nums)[-1]",
      cpp:
        "int findKthLargest(vector<int>& nums, int k) {\n    priority_queue<int, vector<int>, greater<int>> minH;\n    for (int n : nums) {\n        minH.push(n);\n        if ((int)minH.size() > k) minH.pop();\n    }\n    return minH.top();\n}",
    },
    testCases: [
      { input: [[3, 2, 1, 5, 6, 4], 2], expected: 5 },
      { input: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expected: 4 },
    ],
  },

  30: {
    id: 30,
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    topic: "Heap / Priority Queue",
    description:
      "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in **any order**.\n\nYour algorithm's time complexity must be **better than O(n log n)**, where `n` is the array's size.",
    examples: [
      { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" },
      { input: "nums = [1], k = 1", output: "[1]" },
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4",
      "k is in the range [1, the number of unique elements in the array].",
      "It is guaranteed that the answer is unique.",
    ],
    starterCode: {
      javascript:
        "/**\n * @param {number[]} nums\n * @param {number} k\n * @return {number[]}\n */\nvar topKFrequent = function(nums, k) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def topKFrequent(self, nums: List[int], k: int) -> List[int]:\n        # Write your solution here\n        pass",
      cpp:
        "#include <vector>\n#include <unordered_map>\n#include <queue>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> topKFrequent(vector<int>& nums, int k) {\n        // Write your solution here\n    }\n};",
    },
    solution: {
      javascript:
        "var topKFrequent = function(nums, k) {\n    const freq = new Map();\n    for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);\n    // Bucket sort for O(n)\n    const buckets = Array.from({length: nums.length + 1}, () => []);\n    for (const [num, cnt] of freq) buckets[cnt].push(num);\n    const res = [];\n    for (let i = buckets.length - 1; i >= 0 && res.length < k; i--)\n        res.push(...buckets[i]);\n    return res.slice(0, k);\n};",
      python:
        "from collections import Counter\nclass Solution:\n    def topKFrequent(self, nums, k):\n        return [x for x, _ in Counter(nums).most_common(k)]",
      cpp:
        "vector<int> topKFrequent(vector<int>& nums, int k) {\n    unordered_map<int,int> freq;\n    for(int n:nums) freq[n]++;\n    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;\n    for(auto& [n,f]:freq){\n        pq.push({f,n});\n        if((int)pq.size()>k) pq.pop();\n    }\n    vector<int> res;\n    while(!pq.empty()){res.push_back(pq.top().second);pq.pop();}\n    return res;\n}",
    },
    testCases: [
      { input: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2] },
      { input: [[1], 1], expected: [1] },
    ],
  },
  // ─────────────────────────────────────────────
  // 31. ARRAYS — Best Time to Buy and Sell Stock
  // Difficulty: Easy
  // ─────────────────────────────────────────────
  31: {
    id: 31,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    topic: "Arrays",

    description:
      "You are given an array prices where prices[i] is the price of a stock on the i-th day. Return the maximum profit you can achieve by buying and selling one stock.",

    examples: [
      {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation: "Buy at 1 and sell at 6.",
      },
    ],

    constraints: [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4",
    ],

    starterCode: {
      javascript:
        "/**\n * @param {number[]} prices\n * @return {number}\n */\nvar maxProfit = function(prices) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def maxProfit(self, prices: List[int]) -> int:\n        # Write your solution here\n        pass",
      cpp:
        "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        // Write your solution here\n    }\n};",
    },

    solution: {
      javascript:
        "var maxProfit = function(prices) {\n    let min = Infinity;\n    let profit = 0;\n\n    for (const price of prices) {\n        min = Math.min(min, price);\n        profit = Math.max(profit, price - min);\n    }\n\n    return profit;\n};",
      python:
        "class Solution:\n    def maxProfit(self, prices):\n        min_price = float('inf')\n        profit = 0\n        for p in prices:\n            min_price = min(min_price, p)\n            profit = max(profit, p - min_price)\n        return profit",
      cpp:
        "int maxProfit(vector<int>& prices) {\n    int mn = INT_MAX, profit = 0;\n    for (int p : prices) {\n        mn = min(mn, p);\n        profit = max(profit, p - mn);\n    }\n    return profit;\n}",
    },

    testCases: [
      { input: [[7, 1, 5, 3, 6, 4]], expected: 5 },
      { input: [[7, 6, 4, 3, 1]], expected: 0 },
      { input: [[2, 4, 1]], expected: 2 },
      { input: [[1, 2]], expected: 1 },
      // edge: single element — no transaction possible
      { input: [[5]], expected: 0 },
    ],
  },

  // ─────────────────────────────────────────────
  // 32. STRINGS — Longest Common Prefix
  // Difficulty: Easy
  // ─────────────────────────────────────────────
  32: {
    id: 32,
    title: "Longest Common Prefix",
    difficulty: "Easy",
    topic: "Strings",

    description:
      "Write a function to find the longest common prefix string amongst an array of strings.",

    examples: [
      {
        input: 'strs = ["flower","flow","flight"]',
        output: '"fl"',
      },
    ],

    constraints: [
      "1 <= strs.length <= 200",
      "0 <= strs[i].length <= 200",
    ],

    starterCode: {
      javascript:
        "/**\n * @param {string[]} strs\n * @return {string}\n */\nvar longestCommonPrefix = function(strs) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def longestCommonPrefix(self, strs: List[str]) -> str:\n        # Write your solution here\n        pass",
      cpp:
        "#include <string>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    string longestCommonPrefix(vector<string>& strs) {\n        // Write your solution here\n    }\n};",
    },

    solution: {
      javascript:
        "var longestCommonPrefix = function(strs) {\n    let prefix = strs[0];\n\n    for (let i = 1; i < strs.length; i++) {\n        while (!strs[i].startsWith(prefix)) {\n            prefix = prefix.slice(0, -1);\n        }\n    }\n\n    return prefix;\n};",
      python:
        "class Solution:\n    def longestCommonPrefix(self, strs):\n        prefix = strs[0]\n        for s in strs[1:]:\n            while not s.startswith(prefix):\n                prefix = prefix[:-1]\n        return prefix",
      cpp:
        "string longestCommonPrefix(vector<string>& strs) {\n    string prefix = strs[0];\n    for (int i = 1; i < strs.size(); i++)\n        while (strs[i].find(prefix) != 0)\n            prefix = prefix.substr(0, prefix.size() - 1);\n    return prefix;\n}",
    },

    testCases: [
      { input: [["flower", "flow", "flight"]], expected: "fl" },
      { input: [["dog", "racecar", "car"]], expected: "" },
      { input: [["interspecies", "interstellar", "interstate"]], expected: "inters" },
      { input: [["a"]], expected: "a" },
      // edge: empty string in list forces empty prefix
      { input: [["", "b"]], expected: "" },
    ],
  },

  // ─────────────────────────────────────────────
  // 33. LINKED LISTS — Remove Nth Node From End
  // Difficulty: Medium
  // ─────────────────────────────────────────────
  33: {
    id: 33,
    title: "Remove Nth Node From End of List",
    difficulty: "Medium",
    topic: "Linked Lists",

    description:
      "Given the `head` of a linked list, remove the **n-th node from the end** of the list and return its head.\n\nUse a **two-pointer (fast/slow)** technique to solve this in one pass.",

    examples: [
      {
        input: "head = [1,2,3,4,5], n = 2",
        output: "[1,2,3,5]",
        explanation: "The 2nd node from the end is 4. Remove it.",
      },
      { input: "head = [1], n = 1", output: "[]" },
      { input: "head = [1,2], n = 1", output: "[1]" },
    ],

    constraints: [
      "The number of nodes in the list is sz.",
      "1 <= sz <= 30",
      "0 <= Node.val <= 100",
      "1 <= n <= sz",
    ],

    starterCode: {
      javascript:
        "/**\n * @param {ListNode} head\n * @param {number} n\n * @return {ListNode}\n */\nvar removeNthFromEnd = function(head, n) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:\n        # Write your solution here\n        pass",
      cpp:
        "class Solution {\npublic:\n    ListNode* removeNthFromEnd(ListNode* head, int n) {\n        // Write your solution here\n    }\n};",
    },

    solution: {
      javascript:
        "var removeNthFromEnd = function(head, n) {\n    const dummy = new ListNode(0, head);\n    let slow = dummy;\n    let fast = dummy;\n\n    for (let i = 0; i <= n; i++) {\n        fast = fast.next;\n    }\n\n    while (fast) {\n        slow = slow.next;\n        fast = fast.next;\n    }\n\n    slow.next = slow.next.next;\n\n    return dummy.next;\n};",
      python:
        "class Solution:\n    def removeNthFromEnd(self, head, n):\n        dummy = ListNode(0, head)\n        slow = fast = dummy\n        for _ in range(n + 1):\n            fast = fast.next\n        while fast:\n            slow = slow.next\n            fast = fast.next\n        slow.next = slow.next.next\n        return dummy.next",
      cpp:
        "ListNode* removeNthFromEnd(ListNode* head, int n) {\n    ListNode dummy(0, head);\n    ListNode* slow = &dummy;\n    ListNode* fast = &dummy;\n    for (int i = 0; i <= n; i++) fast = fast->next;\n    while (fast) { slow = slow->next; fast = fast->next; }\n    slow->next = slow->next->next;\n    return dummy.next;\n}",
    },

    testCases: [
      { input: [[1, 2, 3, 4, 5], 2], expected: [1, 2, 3, 5] },
      { input: [[1], 1], expected: [] },
      { input: [[1, 2], 1], expected: [1] },
      { input: [[1, 2], 2], expected: [2] },
      // edge: remove head (n == length)
      { input: [[1, 2, 3], 3], expected: [2, 3] },
    ],
  },

  // ─────────────────────────────────────────────
  // 34. TREES — Same Tree
  // Difficulty: Easy
  // ─────────────────────────────────────────────
  34: {
    id: 34,
    title: "Same Tree",
    difficulty: "Easy",
    topic: "Trees",

    description:
      "Given the roots of two binary trees `p` and `q`, write a function to check if they are the **same** tree.\n\nTwo binary trees are considered the same if they are structurally identical, and the nodes have the same value.",

    examples: [
      {
        input: "p = [1,2,3], q = [1,2,3]",
        output: "true",
      },
      {
        input: "p = [1,2], q = [1,null,2]",
        output: "false",
        explanation: "Different structure — left vs right child.",
      },
      {
        input: "p = [1,2,1], q = [1,1,2]",
        output: "false",
      },
    ],

    constraints: [
      "The number of nodes in both trees is in the range [0, 100].",
      "-10^4 <= Node.val <= 10^4",
    ],

    starterCode: {
      javascript:
        "/**\n * @param {TreeNode} p\n * @param {TreeNode} q\n * @return {boolean}\n */\nvar isSameTree = function(p, q) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:\n        # Write your solution here\n        pass",
      cpp:
        "class Solution {\npublic:\n    bool isSameTree(TreeNode* p, TreeNode* q) {\n        // Write your solution here\n    }\n};",
    },

    solution: {
      javascript:
        "var isSameTree = function(p, q) {\n    if (!p && !q) return true;\n    if (!p || !q) return false;\n    if (p.val !== q.val) return false;\n\n    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);\n};",
      python:
        "class Solution:\n    def isSameTree(self, p, q):\n        if not p and not q: return True\n        if not p or not q: return False\n        if p.val != q.val: return False\n        return self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right)",
      cpp:
        "bool isSameTree(TreeNode* p, TreeNode* q) {\n    if (!p && !q) return true;\n    if (!p || !q) return false;\n    if (p->val != q->val) return false;\n    return isSameTree(p->left, q->left) && isSameTree(p->right, q->right);\n}",
    },

    testCases: [
      { input: [[1, 2, 3], [1, 2, 3]], expected: true },
      { input: [[1, 2], [1, null, 2]], expected: false },
      { input: [[1, 2, 1], [1, 1, 2]], expected: false },
      { input: [[], []], expected: true },
      // edge: one empty, one non-empty
      { input: [[], [1]], expected: false },
    ],
  },

  // ─────────────────────────────────────────────
  // 35. GRAPHS — Pacific Atlantic Water Flow
  // Difficulty: Hard
  // ─────────────────────────────────────────────
  35: {
    id: 35,
    title: "Pacific Atlantic Water Flow",
    difficulty: "Hard",
    topic: "Graphs",

    description:
      "There is an `m x n` rectangular island that borders both the **Pacific Ocean** (top/left edges) and the **Atlantic Ocean** (bottom/right edges).\n\nRain water can flow to a neighboring cell (north, south, east, west) only if the neighboring cell's height is **less than or equal to** the current cell's height.\n\nReturn a list of grid coordinates where water can flow to **both** the Pacific and Atlantic ocean.",

    examples: [
      {
        input: "heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]",
        output: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]",
      },
      {
        input: "heights = [[1]]",
        output: "[[0,0]]",
        explanation: "Single cell borders both oceans.",
      },
    ],

    constraints: [
      "m == heights.length",
      "n == heights[r].length",
      "1 <= m, n <= 200",
      "0 <= heights[r][c] <= 10^5",
    ],

    starterCode: {
      javascript:
        "/**\n * @param {number[][]} heights\n * @return {number[][]}\n */\nvar pacificAtlantic = function(heights) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:\n        # Write your solution here\n        pass",
      cpp:
        "#include <vector>\n#include <set>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {\n        // Write your solution here\n    }\n};",
    },

    solution: {
      javascript:
        "var pacificAtlantic = function(heights) {\n    const rows = heights.length;\n    const cols = heights[0].length;\n\n    const pac = new Set();\n    const atl = new Set();\n\n    const dfs = (r, c, visit, prev) => {\n        const key = `${r},${c}`;\n\n        if (\n            r < 0 || c < 0 ||\n            r >= rows || c >= cols ||\n            visit.has(key) ||\n            heights[r][c] < prev\n        ) return;\n\n        visit.add(key);\n\n        dfs(r + 1, c, visit, heights[r][c]);\n        dfs(r - 1, c, visit, heights[r][c]);\n        dfs(r, c + 1, visit, heights[r][c]);\n        dfs(r, c - 1, visit, heights[r][c]);\n    };\n\n    for (let c = 0; c < cols; c++) {\n        dfs(0, c, pac, 0);\n        dfs(rows - 1, c, atl, 0);\n    }\n\n    for (let r = 0; r < rows; r++) {\n        dfs(r, 0, pac, 0);\n        dfs(r, cols - 1, atl, 0);\n    }\n\n    const res = [];\n\n    for (let r = 0; r < rows; r++) {\n        for (let c = 0; c < cols; c++) {\n            const key = `${r},${c}`;\n            if (pac.has(key) && atl.has(key)) {\n                res.push([r, c]);\n            }\n        }\n    }\n\n    return res;\n};",
      python:
        "class Solution:\n    def pacificAtlantic(self, heights):\n        rows, cols = len(heights), len(heights[0])\n        pac, atl = set(), set()\n\n        def dfs(r, c, visit, prev):\n            if (r, c) in visit or r < 0 or c < 0 or r >= rows or c >= cols or heights[r][c] < prev:\n                return\n            visit.add((r, c))\n            for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:\n                dfs(r+dr, c+dc, visit, heights[r][c])\n\n        for c in range(cols):\n            dfs(0, c, pac, 0)\n            dfs(rows-1, c, atl, 0)\n        for r in range(rows):\n            dfs(r, 0, pac, 0)\n            dfs(r, cols-1, atl, 0)\n\n        return [[r, c] for r in range(rows) for c in range(cols) if (r,c) in pac and (r,c) in atl]",
      cpp:
        "vector<vector<int>> pacificAtlantic(vector<vector<int>>& h) {\n    int R=h.size(), C=h[0].size();\n    vector<vector<bool>> pac(R,vector<bool>(C,false)), atl(R,vector<bool>(C,false));\n    function<void(int,int,vector<vector<bool>>&,int)> dfs=[&](int r,int c,vector<vector<bool>>& vis,int prev){\n        if(r<0||c<0||r>=R||c>=C||vis[r][c]||h[r][c]<prev) return;\n        vis[r][c]=true;\n        dfs(r+1,c,vis,h[r][c]); dfs(r-1,c,vis,h[r][c]);\n        dfs(r,c+1,vis,h[r][c]); dfs(r,c-1,vis,h[r][c]);\n    };\n    for(int c=0;c<C;c++){dfs(0,c,pac,0);dfs(R-1,c,atl,0);}\n    for(int r=0;r<R;r++){dfs(r,0,pac,0);dfs(r,C-1,atl,0);}\n    vector<vector<int>> res;\n    for(int r=0;r<R;r++) for(int c=0;c<C;c++) if(pac[r][c]&&atl[r][c]) res.push_back({r,c});\n    return res;\n}",
    },

    testCases: [
      {
        // Full 5-row example from the problem description
        input: [
          [
            [1, 2, 2, 3, 5],
            [3, 2, 3, 4, 4],
            [2, 4, 5, 3, 1],
            [6, 7, 1, 4, 5],
            [5, 1, 1, 2, 4]
          ]
        ],
        expected: [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]]
      },
      {
        // Single cell borders both oceans
        input: [[[1]]],
        expected: [[0, 0]]
      },
      {
        // Uniform grid — every cell reaches both oceans
        input: [[[1, 1], [1, 1]]],
        expected: [[0, 0], [0, 1], [1, 0], [1, 1]]
      },
      {
        // Strictly increasing row — only top-right corner reaches Pacific,
        // only bottom-left corner reaches Atlantic; [0,2] and [1,0] reach both
        input: [[[1, 2, 3], [4, 5, 6]]],
        expected: [[0, 2], [1, 0], [1, 1], [1, 2]]
      },
    ],
  },
  // ─────────────────────────────────────────────
  // 36. SLIDING WINDOW — Minimum Size Subarray Sum
  // Difficulty: Medium
  // ─────────────────────────────────────────────
  36: {
    id: 36,
    title: "Minimum Size Subarray Sum",
    difficulty: "Medium",
    topic: "Sliding Window",

    description:
      "Given an array of positive integers nums and a positive integer target, return the minimal length of a subarray whose sum is greater than or equal to target.",

    examples: [
      {
        input: "target = 7, nums = [2,3,1,2,4,3]",
        output: "2",
        explanation: "[4,3] has the minimal length.",
      },
    ],

    constraints: [
      "1 <= target <= 10^9",
      "1 <= nums.length <= 10^5",
    ],

    starterCode: {
      javascript:
        "/**\n * @param {number} target\n * @param {number[]} nums\n * @return {number}\n */\nvar minSubArrayLen = function(target, nums) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def minSubArrayLen(self, target: int, nums: List[int]) -> int:\n        # Write your solution here\n        pass",
      cpp:
        "#include <vector>\n#include <climits>\nusing namespace std;\n\nclass Solution {\npublic:\n    int minSubArrayLen(int target, vector<int>& nums) {\n        // Write your solution here\n    }\n};",
    },

    solution: {
      javascript:
        "var minSubArrayLen = function(target, nums) {\n    let left = 0;\n    let sum = 0;\n    let res = Infinity;\n\n    for (let right = 0; right < nums.length; right++) {\n        sum += nums[right];\n\n        while (sum >= target) {\n            res = Math.min(res, right - left + 1);\n            sum -= nums[left];\n            left++;\n        }\n    }\n\n    return res === Infinity ? 0 : res;\n};",
      python:
        "class Solution:\n    def minSubArrayLen(self, target, nums):\n        left = 0\n        total = 0\n        res = float('inf')\n        for right in range(len(nums)):\n            total += nums[right]\n            while total >= target:\n                res = min(res, right - left + 1)\n                total -= nums[left]\n                left += 1\n        return 0 if res == float('inf') else res",
      cpp:
        "int minSubArrayLen(int target, vector<int>& nums) {\n    int left = 0, sum = 0, res = INT_MAX;\n    for (int right = 0; right < (int)nums.size(); right++) {\n        sum += nums[right];\n        while (sum >= target) {\n            res = min(res, right - left + 1);\n            sum -= nums[left++];\n        }\n    }\n    return res == INT_MAX ? 0 : res;\n}",
    },

    testCases: [
      { input: [7, [2, 3, 1, 2, 4, 3]], expected: 2 },
      { input: [4, [1, 4, 4]], expected: 1 },
      // sum never reaches target → return 0
      { input: [11, [1, 1, 1, 1, 1, 1, 1, 1]], expected: 0 },
      // single element equals target
      { input: [4, [4]], expected: 1 },
      // entire array needed
      { input: [15, [1, 2, 3, 4, 5]], expected: 5 },
    ],
  },

  // ─────────────────────────────────────────────
  // 37. BINARY SEARCH — Search Insert Position
  // Difficulty: Easy
  // ─────────────────────────────────────────────
  37: {
    id: 37,
    title: "Search Insert Position",
    difficulty: "Easy",
    topic: "Binary Search",

    description:
      "Given a sorted array of distinct integers and a target value, return the index if found. If not, return the index where it would be inserted.",

    examples: [
      {
        input: "nums = [1,3,5,6], target = 5",
        output: "2",
      },
    ],

    constraints: [
      "1 <= nums.length <= 10^4",
      "-10^4 <= nums[i], target <= 10^4",
    ],

    starterCode: {
      javascript:
        "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number}\n */\nvar searchInsert = function(nums, target) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def searchInsert(self, nums: List[int], target: int) -> int:\n        # Write your solution here\n        pass",
      cpp:
        "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int searchInsert(vector<int>& nums, int target) {\n        // Write your solution here\n    }\n};",
    },

    solution: {
      javascript:
        "var searchInsert = function(nums, target) {\n    let left = 0;\n    let right = nums.length - 1;\n\n    while (left <= right) {\n        const mid = Math.floor((left + right) / 2);\n\n        if (nums[mid] === target) return mid;\n\n        if (nums[mid] < target) {\n            left = mid + 1;\n        } else {\n            right = mid - 1;\n        }\n    }\n\n    return left;\n};",
      python:
        "class Solution:\n    def searchInsert(self, nums, target):\n        lo, hi = 0, len(nums) - 1\n        while lo <= hi:\n            mid = (lo + hi) // 2\n            if nums[mid] == target: return mid\n            elif nums[mid] < target: lo = mid + 1\n            else: hi = mid - 1\n        return lo",
      cpp:
        "int searchInsert(vector<int>& nums, int target) {\n    int lo = 0, hi = (int)nums.size() - 1;\n    while (lo <= hi) {\n        int mid = (lo + hi) / 2;\n        if (nums[mid] == target) return mid;\n        else if (nums[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return lo;\n}",
    },

    testCases: [
      { input: [[1, 3, 5, 6], 5], expected: 2 },
      { input: [[1, 3, 5, 6], 2], expected: 1 },
      { input: [[1, 3, 5, 6], 7], expected: 4 },
      // insert at beginning
      { input: [[1, 3, 5, 6], 0], expected: 0 },
      // single-element array, target absent
      { input: [[1], 0], expected: 0 },
    ],
  },

  // ─────────────────────────────────────────────
  // 38. HEAP — Last Stone Weight
  // Difficulty: Easy
  // ─────────────────────────────────────────────
  38: {
    id: 38,
    title: "Last Stone Weight",
    difficulty: "Easy",
    topic: "Heap / Priority Queue",

    description:
      "You are given an array of integers `stones` where `stones[i]` is the weight of the `i`-th stone.\n\nWe are playing a game with the stones. On each turn, we choose the **two heaviest** stones and smash them together. Suppose the heaviest two stones have weights `x` and `y` where `x <= y`:\n\n- If `x == y`, both stones are destroyed.\n- If `x != y`, the stone of weight `x` is destroyed and the stone of weight `y` has new weight `y - x`.\n\nAt the end of the game, there is **at most one** stone left. Return the weight of the last remaining stone. If there are no stones left, return `0`.",

    examples: [
      {
        input: "stones = [2,7,4,1,8,1]",
        output: "1",
        explanation: "Smash 8 and 7 → 1; smash 4 and 2 → 2; smash 2 and 1 → 1; smash 1 and 1 → 0; one stone (1) remains.",
      },
      {
        input: "stones = [1]",
        output: "1",
        explanation: "Only one stone, no smashing needed.",
      },
    ],

    constraints: [
      "1 <= stones.length <= 30",
      "1 <= stones[i] <= 1000",
    ],

    starterCode: {
      javascript:
        "/**\n * @param {number[]} stones\n * @return {number}\n */\nvar lastStoneWeight = function(stones) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def lastStoneWeight(self, stones: List[int]) -> int:\n        # Write your solution here\n        pass",
      cpp:
        "#include <vector>\n#include <queue>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lastStoneWeight(vector<int>& stones) {\n        // Write your solution here\n    }\n};",
    },

    solution: {
      javascript:
        "var lastStoneWeight = function(stones) {\n    while (stones.length > 1) {\n        stones.sort((a, b) => b - a);\n\n        let y = stones.shift();\n        let x = stones.shift();\n\n        if (y !== x) {\n            stones.push(y - x);\n        }\n    }\n\n    return stones.length ? stones[0] : 0;\n};",
      python:
        "import heapq\nclass Solution:\n    def lastStoneWeight(self, stones):\n        # Python's heapq is a min-heap; negate values to simulate max-heap\n        heap = [-s for s in stones]\n        heapq.heapify(heap)\n        while len(heap) > 1:\n            y = -heapq.heappop(heap)\n            x = -heapq.heappop(heap)\n            if y != x:\n                heapq.heappush(heap, -(y - x))\n        return -heap[0] if heap else 0",
      cpp:
        "int lastStoneWeight(vector<int>& stones) {\n    priority_queue<int> pq(stones.begin(), stones.end());\n    while (pq.size() > 1) {\n        int y = pq.top(); pq.pop();\n        int x = pq.top(); pq.pop();\n        if (y != x) pq.push(y - x);\n    }\n    return pq.empty() ? 0 : pq.top();\n}",
    },

    testCases: [
      { input: [[2, 7, 4, 1, 8, 1]], expected: 1 },
      // single stone — returned as-is
      { input: [[1]], expected: 1 },
      // two equal stones — both destroyed
      { input: [[9, 3, 2, 10]], expected: 0 },
      // all equal — 4 stones smash down to 0
      { input: [[5, 5, 5, 5]], expected: 0 },
      // two unequal stones — difference remains
      { input: [[3, 7]], expected: 4 },
    ],
  },

  // ─────────────────────────────────────────────
  // 39. DYNAMIC PROGRAMMING — Unique Paths
  // Difficulty: Medium
  // ─────────────────────────────────────────────
  39: {
    id: 39,
    title: "Unique Paths",
    difficulty: "Medium",
    topic: "Dynamic Programming",

    description:
      "A robot is located at the **top-left corner** of a `m x n` grid (marked 'Start' in the diagram below).\n\nThe robot can only move either **down** or **right** at any point in time. The robot is trying to reach the **bottom-right corner** of the grid (marked 'Finish').\n\nHow many possible **unique paths** are there?",

    examples: [
      {
        input: "m = 3, n = 7",
        output: "28",
      },
      {
        input: "m = 3, n = 2",
        output: "3",
        explanation: "Three paths: right→down→down, down→right→down, down→down→right.",
      },
    ],

    constraints: [
      "1 <= m, n <= 100",
    ],

    starterCode: {
      javascript:
        "/**\n * @param {number} m\n * @param {number} n\n * @return {number}\n */\nvar uniquePaths = function(m, n) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def uniquePaths(self, m: int, n: int) -> int:\n        # Write your solution here\n        pass",
      cpp:
        "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int uniquePaths(int m, int n) {\n        // Write your solution here\n    }\n};",
    },

    solution: {
      javascript:
        "var uniquePaths = function(m, n) {\n    const dp = Array(n).fill(1);\n\n    for (let i = 1; i < m; i++) {\n        for (let j = 1; j < n; j++) {\n            dp[j] += dp[j - 1];\n        }\n    }\n\n    return dp[n - 1];\n};",
      python:
        "class Solution:\n    def uniquePaths(self, m, n):\n        dp = [1] * n\n        for _ in range(1, m):\n            for j in range(1, n):\n                dp[j] += dp[j - 1]\n        return dp[-1]",
      cpp:
        "int uniquePaths(int m, int n) {\n    vector<int> dp(n, 1);\n    for (int i = 1; i < m; i++)\n        for (int j = 1; j < n; j++)\n            dp[j] += dp[j - 1];\n    return dp[n - 1];\n}",
    },

    testCases: [
      { input: [3, 7], expected: 28 },
      { input: [3, 2], expected: 3 },
      // single cell — only one trivial path
      { input: [1, 1], expected: 1 },
      // single row — only one path (all right)
      { input: [1, 5], expected: 1 },
      // single column — only one path (all down)
      { input: [5, 1], expected: 1 },
    ],
  },

  // ─────────────────────────────────────────────
  // 40. BACKTRACKING — Letter Combinations of Phone Number
  // Difficulty: Medium
  // ─────────────────────────────────────────────
  40: {
    id: 40,
    title: "Letter Combinations of a Phone Number",
    difficulty: "Medium",
    topic: "Backtracking",

    description:
      "Given a string containing digits from `2-9` inclusive, return all possible letter combinations that the number could represent. Return the answer in **any order**.\n\nA mapping of digits to letters (just like on telephone buttons) is given below. Note that `1` does not map to any letters.\n\n```\n2 → abc   3 → def   4 → ghi   5 → jkl\n6 → mno   7 → pqrs  8 → tuv   9 → wxyz\n```",

    examples: [
      {
        input: 'digits = "23"',
        output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]',
      },
      {
        input: 'digits = ""',
        output: "[]",
        explanation: "Empty input returns an empty array.",
      },
      {
        input: 'digits = "2"',
        output: '["a","b","c"]',
      },
    ],

    constraints: [
      "0 <= digits.length <= 4",
      "digits[i] is a digit in the range ['2', '9'].",
    ],

    starterCode: {
      javascript:
        "/**\n * @param {string} digits\n * @return {string[]}\n */\nvar letterCombinations = function(digits) {\n    // Write your solution here\n};",
      python:
        "class Solution:\n    def letterCombinations(self, digits: str) -> List[str]:\n        # Write your solution here\n        pass",
      cpp:
        "#include <string>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<string> letterCombinations(string digits) {\n        // Write your solution here\n    }\n};",
    },

    solution: {
      javascript:
        "var letterCombinations = function(digits) {\n    if (!digits.length) return [];\n\n    const map = {\n        2: 'abc',\n        3: 'def',\n        4: 'ghi',\n        5: 'jkl',\n        6: 'mno',\n        7: 'pqrs',\n        8: 'tuv',\n        9: 'wxyz'\n    };\n\n    const res = [];\n\n    const backtrack = (i, str) => {\n        if (str.length === digits.length) {\n            res.push(str);\n            return;\n        }\n\n        for (const ch of map[digits[i]]) {\n            backtrack(i + 1, str + ch);\n        }\n    };\n\n    backtrack(0, '');\n\n    return res;\n};",
      python:
        "class Solution:\n    def letterCombinations(self, digits):\n        if not digits: return []\n        phone = {\n            '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',\n            '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'\n        }\n        res = []\n        def bt(i, curr):\n            if i == len(digits):\n                res.append(curr); return\n            for ch in phone[digits[i]]:\n                bt(i + 1, curr + ch)\n        bt(0, '')\n        return res",
      cpp:
        "vector<string> letterCombinations(string digits) {\n    if (digits.empty()) return {};\n    unordered_map<char, string> phone = {\n        {'2',\"abc\"},{'3',\"def\"},{'4',\"ghi\"},{'5',\"jkl\"},\n        {'6',\"mno\"},{'7',\"pqrs\"},{'8',\"tuv\"},{'9',\"wxyz\"}\n    };\n    vector<string> res;\n    string curr;\n    function<void(int)> bt = [&](int i) {\n        if (i == (int)digits.size()) { res.push_back(curr); return; }\n        for (char ch : phone[digits[i]]) {\n            curr += ch; bt(i + 1); curr.pop_back();\n        }\n    };\n    bt(0);\n    return res;\n}",
    },

    testCases: [
      {
        input: ["23"],
        expected: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]
      },
      // empty digits → empty result
      {
        input: [""],
        expected: []
      },
      // single digit
      {
        input: ["2"],
        expected: ["a", "b", "c"]
      },
      // digit 7 maps to 4 letters (pqrs)
      {
        input: ["7"],
        expected: ["p", "q", "r", "s"]
      },
      // digit 9 maps to 4 letters (wxyz)
      {
        input: ["9"],
        expected: ["w", "x", "y", "z"]
      },
    ],
  },
  41: {
    id: 41,
    title: "First Missing Positive",
    difficulty: "Hard",
    topic: "Arrays",

    description:
      "Given an unsorted integer array `nums`, return the smallest missing positive integer.\n\nYou must implement an algorithm that runs in **O(n)** time and uses **constant extra space**.",

    examples: [
      {
        input: "nums = [1,2,0]",
        output: "3",
      },
      {
        input: "nums = [3,4,-1,1]",
        output: "2",
      },
      {
        input: "nums = [7,8,9,11,12]",
        output: "1",
      },
    ],

    constraints: [
      "1 <= nums.length <= 10^5",
      "-2^31 <= nums[i] <= 2^31 - 1",
    ],

    starterCode: {
      javascript:
        "/**\n * @param {number[]} nums\n * @return {number}\n */\nvar firstMissingPositive = function(nums) {\n    // Write your solution here\n};",

      python:
        "class Solution:\n    def firstMissingPositive(self, nums: List[int]) -> int:\n        # Write your solution here\n        pass",

      cpp:
        "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int firstMissingPositive(vector<int>& nums) {\n        // Write your solution here\n    }\n};",
    },

    solution: {
      javascript:
        "var firstMissingPositive = function(nums) {\n    const n = nums.length;\n\n    for (let i = 0; i < n; i++) {\n        while (\n            nums[i] > 0 &&\n            nums[i] <= n &&\n            nums[nums[i] - 1] !== nums[i]\n        ) {\n            let temp = nums[i];\n            nums[i] = nums[temp - 1];\n            nums[temp - 1] = temp;\n        }\n    }\n\n    for (let i = 0; i < n; i++) {\n        if (nums[i] !== i + 1) {\n            return i + 1;\n        }\n    }\n\n    return n + 1;\n};",

      python:
        "class Solution:\n    def firstMissingPositive(self, nums):\n        n = len(nums)\n\n        for i in range(n):\n            while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:\n                correct = nums[i] - 1\n                nums[i], nums[correct] = nums[correct], nums[i]\n\n        for i in range(n):\n            if nums[i] != i + 1:\n                return i + 1\n\n        return n + 1",

      cpp:
        "int firstMissingPositive(vector<int>& nums) {\n    int n = nums.size();\n\n    for (int i = 0; i < n; i++) {\n        while (\n            nums[i] > 0 &&\n            nums[i] <= n &&\n            nums[nums[i] - 1] != nums[i]\n        ) {\n            swap(nums[i], nums[nums[i] - 1]);\n        }\n    }\n\n    for (int i = 0; i < n; i++) {\n        if (nums[i] != i + 1) {\n            return i + 1;\n        }\n    }\n\n    return n + 1;\n}",
    },

    testCases: [
      {
        input: [[1, 2, 0]],
        expected: 3
      },
      {
        input: [[3, 4, -1, 1]],
        expected: 2
      },
      {
        input: [[7, 8, 9, 11, 12]],
        expected: 1
      },
      // array already contains 1..n
      {
        input: [[1, 2, 3]],
        expected: 4
      },
      // duplicates
      {
        input: [[1, 1]],
        expected: 2
      },
      // single element
      {
        input: [[2]],
        expected: 1
      },
      // negatives only
      {
        input: [[-1, -2, -3]],
        expected: 1
      },
      // mixed values
      {
        input: [[2, 3, 7, 6, 8, -1, -10, 15]],
        expected: 1
      },
      // missing in middle
      {
        input: [[1, 2, 4, 5]],
        expected: 3
      },
      // empty-like positive gap
      {
        input: [[0]],
        expected: 1
      },
    ],
  },
};


