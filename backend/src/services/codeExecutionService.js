import axios from "axios";

// ─── Helper: parse legacy string-form inputs ─────────────────────────────────
function parseInputToArgs(inputStr) {
  try {
    let depth = 0;
    let inQuote = null;
    let assignment = "";
    const vars = [];
    for (let i = 0; i < inputStr.length; i++) {
      const char = inputStr[i];
      if (char === '"' || char === "'") {
        if (!inQuote) inQuote = char;
        else if (inQuote === char) inQuote = null;
      }
      if (!inQuote) {
        if (char === "[" || char === "{" || char === "(") depth++;
        if (char === "]" || char === "}" || char === ")") depth--;
        if (char === "," && depth === 0) {
          vars.push(assignment.trim());
          assignment = "";
          continue;
        }
      }
      assignment += char;
    }
    if (assignment) vars.push(assignment.trim());
    const varNames = vars.map((v) => v.split("=")[0].trim());
    const evalCode = "var " + vars.join(", ") + "; [" + varNames.join(", ") + "]";
    return eval(evalCode);
  } catch (err) {
    console.error("Failed to parse input string:", err);
    return [];
  }
}

// ─── Extract JS function name from starterCode ───────────────────────────────
function extractJsFunctionName(starterCode) {
  if (!starterCode) return null;
  // Matches: var functionName = function(...)
  const m1 = starterCode.match(/var\s+(\w+)\s*=/);
  if (m1) return m1[1];
  // Matches: function functionName(...)
  const m2 = starterCode.match(/function\s+(\w+)\s*\(/);
  if (m2) return m2[1];
  return null;
}

// ─── Extract C++ function name from starterCode ───────────────────────────────
function extractCppSignature(starterCode) {
  if (!starterCode) return { functionName: null, returnType: null, params: [] };
  // Focus on the body after "public:"
  const publicIdx = starterCode.indexOf("public:");
  const searchStr = publicIdx !== -1 ? starterCode.substring(publicIdx) : starterCode;

  // Match return_type functionName(params)
  // e.g. "    int twoSum(vector<int>& nums, int target)"
  const funcRegex = /\s*([\w<>\[\]:*& ]+?)\s+(\w+)\s*\(([^)]*)\)\s*\{/;
  const m = searchStr.match(funcRegex);
  if (!m) return { functionName: null, returnType: null, params: [] };

  const returnType = m[1].trim();
  const functionName = m[2].trim();
  const params = parseCppParams(m[3].trim());
  return { functionName, returnType, params };
}

// ─── Parse comma-separated C++ param list respecting templates ────────────────
function parseCppParams(paramsStr) {
  if (!paramsStr) return [];
  const params = [];
  let depth = 0;
  let current = "";
  for (const char of paramsStr) {
    if (char === "<") depth++;
    else if (char === ">") depth--;
    else if (char === "," && depth === 0) {
      params.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }
  if (current.trim()) params.push(current.trim());

  return params.map((p) => {
    // Remove qualifiers: const, &, * from the name part only
    p = p.replace(/\s*=\s*\S+$/, ""); // remove default values
    const tokens = p.trim().split(/\s+/);
    let name = tokens[tokens.length - 1].replace(/[*&]/g, "");
    let type = tokens.slice(0, -1).join(" ");
    // Handle cases like "ListNode*" or "vector<int>&" where * or & is on the name
    if (/[*&]/.test(tokens[tokens.length - 1])) {
      type += tokens[tokens.length - 1].replace(/\w+/, "");
      name = tokens[tokens.length - 1].replace(/[*&]/g, "");
    }
    return { type: type.replace(/\s+/g, " ").trim(), name };
  });
}

// ─── Convert a JS test-case value to a C++ literal ───────────────────────────
function jsToCppLiteral(val, cppType) {
  const t = (cppType || "").replace(/\s*(const|&)\s*/g, "").trim();

  if (val === null || val === undefined) {
    if (t.includes("*")) return "nullptr";
    return "{}";
  }

  // bool
  if (typeof val === "boolean") return val ? "true" : "false";
  // number
  if (typeof val === "number") {
    if (t === "char") return `'${String.fromCharCode(val)}'`;
    return String(val);
  }
  // string → std::string or char
  if (typeof val === "string") {
    if (t === "char" || t === "char&") return `'${val[0] || " "}'`;
    return `"${val.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  // array
  if (Array.isArray(val)) {
    // ListNode* ─ build linked list from array
    if (t.includes("ListNode")) {
      const inner = val.map((v) => String(v)).join(",");
      return `buildList({${inner}})`;
    }
    // TreeNode* ─ build tree from level-order array
    if (t.includes("TreeNode")) {
      const inner = val
        .map((v) => (v === null || v === undefined ? "INT_MIN" : String(v)))
        .join(",");
      return `buildTree({${inner}})`;
    }
    // Nested array  vector<vector<...>>
    if (t.startsWith("vector<vector<")) {
      const innerType = t.replace(/^vector<(vector<.+>)>$/, "$1");
      const rows = val.map((row) => jsToCppLiteral(row, innerType));
      return `{${rows.join(",")}}`;
    }
    // Flat array  vector<T>
    const elemType = t.replace(/^vector<(.+)>$/, "$1");
    const elems = val.map((v) => jsToCppLiteral(v, elemType));
    return `{${elems.join(",")}}`;
  }
  return String(val);
}

// ─── Determine clean declaration type (strips & for declarations) ─────────────
function declType(cppType) {
  return cppType
    .replace(/&/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ─── C++ boilerplate (structs + builders + toJson) ────────────────────────────
const CPP_BOILERPLATE = `
#include <iostream>
#include <vector>
#include <string>
#include <queue>
#include <stack>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
#include <functional>
#include <climits>
#include <sstream>
using namespace std;

// ── Data structures ───────────────────────────────────────────────────────────
struct ListNode {
    int val; ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *n) : val(x), next(n) {}
};

struct TreeNode {
    int val; TreeNode *left, *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *l, TreeNode *r) : val(x), left(l), right(r) {}
};

// ── Builders ──────────────────────────────────────────────────────────────────
ListNode* buildList(vector<int> v) {
    if (v.empty()) return nullptr;
    ListNode *head = new ListNode(v[0]), *cur = head;
    for (size_t i = 1; i < v.size(); ++i) { cur->next = new ListNode(v[i]); cur = cur->next; }
    return head;
}

TreeNode* buildTree(vector<int> v) {
    if (v.empty() || v[0] == INT_MIN) return nullptr;
    TreeNode *root = new TreeNode(v[0]);
    queue<TreeNode*> q; q.push(root);
    for (size_t i = 1; i < v.size(); ) {
        TreeNode *cur = q.front(); q.pop();
        if (i < v.size() && v[i] != INT_MIN) { cur->left = new TreeNode(v[i]); q.push(cur->left); } ++i;
        if (i < v.size() && v[i] != INT_MIN) { cur->right = new TreeNode(v[i]); q.push(cur->right); } ++i;
    }
    return root;
}

// ── Serialisers ───────────────────────────────────────────────────────────────
string toJson(int x)         { return to_string(x); }
string toJson(long long x)   { return to_string(x); }
string toJson(double x)      { ostringstream o; o << x; return o.str(); }
string toJson(bool x)        { return x ? "true" : "false"; }
string toJson(char x)        { return string(1, '"') + x + '"'; }
string toJson(const string& x) {
    string r = "\\"";
    for (char c : x) { if (c == '"') r += "\\\\\\""; else if (c == '\\\\') r += "\\\\\\\\"; else r += c; }
    return r + "\\"";
}
string toJson(ListNode* h) {
    string r = "["; bool f = true;
    while (h) { if (!f) r += ","; r += to_string(h->val); h = h->next; f = false; }
    return r + "]";
}
string toJson(TreeNode* root) {
    if (!root) return "[]";
    string r = "["; queue<TreeNode*> q; q.push(root); bool f = true;
    while (!q.empty()) {
        TreeNode* n = q.front(); q.pop();
        if (!f) r += ",";
        if (n) { r += to_string(n->val); q.push(n->left); q.push(n->right); }
        else r += "null";
        f = false;
    }
    // trim trailing nulls
    while (r.size() > 1 && r.substr(r.size()-5) == ",null") r.erase(r.size()-5);
    while (r.size() > 1 && r.substr(r.size()-4) == "null" && r[r.size()-5] == '[') r.erase(r.size()-4);
    return r + "]";
}
template<typename T>
string toJson(const vector<T>& v) {
    string r = "[";
    for (size_t i = 0; i < v.size(); ++i) { if (i) r += ","; r += toJson(v[i]); }
    return r + "]";
}
`;

// ─── JS runtime boilerplate (ListNode + TreeNode helpers) ─────────────────────
const JS_BOILERPLATE = `
function ListNode(val, next) { this.val = val ?? 0; this.next = next ?? null; }
function TreeNode(val, left, right) { this.val = val ?? 0; this.left = left ?? null; this.right = right ?? null; }

function buildList(arr) {
  if (!arr || !arr.length) return null;
  const head = new ListNode(arr[0]);
  let cur = head;
  for (let i = 1; i < arr.length; i++) { cur.next = new ListNode(arr[i]); cur = cur.next; }
  return head;
}
function listToArr(head) { const r = []; while (head) { r.push(head.val); head = head.next; } return r; }
function buildTree(arr) {
  if (!arr || !arr.length || arr[0] === null) return null;
  const root = new TreeNode(arr[0]); const q = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const cur = q.shift();
    if (arr[i] !== null && arr[i] !== undefined) { cur.left = new TreeNode(arr[i]); q.push(cur.left); } i++;
    if (i < arr.length && arr[i] !== null && arr[i] !== undefined) { cur.right = new TreeNode(arr[i]); q.push(cur.right); } i++;
  }
  return root;
}
function treeToArr(root) {
  if (!root) return [];
  const res = [], q = [root];
  while (q.length) {
    const cur = q.shift();
    if (cur) { res.push(cur.val); q.push(cur.left); q.push(cur.right); } else res.push(null);
  }
  while (res.length && res[res.length-1] === null) res.pop();
  return res;
}
function normalise(val) {
  if (val && typeof val === 'object') {
    if ('next' in val) return listToArr(val);
    if ('left' in val || 'right' in val) return treeToArr(val);
  }
  return val;
}
`;

// ─── Python runtime boilerplate ───────────────────────────────────────────────
const PY_BOILERPLATE = `
from typing import Optional, List
import json, collections

class ListNode:
    def __init__(self, val=0, next=None): self.val = val; self.next = next

class TreeNode:
    def __init__(self, val=0, left=None, right=None): self.val = val; self.left = left; self.right = right

def build_list(arr):
    if not arr: return None
    head = ListNode(arr[0]); cur = head
    for v in arr[1:]: cur.next = ListNode(v); cur = cur.next
    return head

def list_to_arr(head):
    r = []
    while head: r.append(head.val); head = head.next
    return r

def build_tree(arr):
    if not arr or arr[0] is None: return None
    root = TreeNode(arr[0]); q = collections.deque([root]); i = 1
    while q and i < len(arr):
        cur = q.popleft()
        if arr[i] is not None: cur.left = TreeNode(arr[i]); q.append(cur.left)
        i += 1
        if i < len(arr) and arr[i] is not None: cur.right = TreeNode(arr[i]); q.append(cur.right)
        i += 1
    return root

def tree_to_arr(root):
    if not root: return []
    res, q = [], [root]
    while q:
        cur = q.pop(0)
        if cur: res.append(cur.val); q.append(cur.left); q.append(cur.right)
        else: res.append(None)
    while res and res[-1] is None: res.pop()
    return res

def normalise(val):
    if isinstance(val, ListNode): return list_to_arr(val)
    if isinstance(val, TreeNode): return tree_to_arr(val)
    return val
`;

// ─── Convert JS args to JS-runtime-aware values ───────────────────────────────
function buildJsArgs(args, topic) {
  return args.map((arg) => {
    if (Array.isArray(arg)) {
      if (topic === "Linked Lists") return `buildList(${JSON.stringify(arg)})`;
      if (topic === "Trees") return `buildTree(${JSON.stringify(arg)})`;
    }
    return JSON.stringify(arg);
  });
}

// ─── Convert JS args to Python-runtime-aware values ──────────────────────────
function buildPyArgs(args, topic) {
  return args.map((arg) => {
    if (Array.isArray(arg)) {
      if (topic === "Linked Lists") return `build_list(${JSON.stringify(arg)})`;
      if (topic === "Trees") return `build_tree(${JSON.stringify(arg)})`;
    }
    return JSON.stringify(arg);
  });
}

// ─── Main service ─────────────────────────────────────────────────────────────
const codeExecutionService = {
  execute: async (code, language, problem) => {
    const judge0Url = process.env.JUDGE0_API_URL || "https://ce.judge0.com";
    const firstTestCase = problem.testCases[0];

    // ── Parse args ────────────────────────────────────────────────────────────
    let args = firstTestCase.input;
    if (typeof args === "string") args = parseInputToArgs(args);
    if (!Array.isArray(args)) args = [args];

    // ── Derive function names ─────────────────────────────────────────────────
    const jsFnName =
      extractJsFunctionName(problem.starterCode?.javascript) || "solve";
    const { functionName: cppFnName, returnType: cppReturn, params: cppParams } =
      extractCppSignature(problem.starterCode?.cpp);

    const topic = problem.topic || "";
    let wrapperCode = "";
    let languageId = 63;

    // ─────────────────────────────────────────────────────────────────────────
    // JAVASCRIPT
    // ─────────────────────────────────────────────────────────────────────────
    if (language === "javascript") {
      languageId = 63;
      const jsArgs = buildJsArgs(args, topic);
      wrapperCode = `
${JS_BOILERPLATE}

// ── User code ─────────────────────────────────────────────────────────────────
${code}

// ── Runner ────────────────────────────────────────────────────────────────────
try {
  const result = normalise(${jsFnName}(${jsArgs.join(", ")}));
  console.log(JSON.stringify(result));
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
`;

      // ─────────────────────────────────────────────────────────────────────────
      // PYTHON
      // ─────────────────────────────────────────────────────────────────────────
    } else if (language === "python") {
      languageId = 71;
      const pyArgs = buildPyArgs(args, topic);

      // Extract Python method name from starterCode
      const pyMatch = (problem.starterCode?.python || "").match(
        /def\s+(\w+)\s*\(/
      );
      const pyFnName = pyMatch ? pyMatch[1] : jsFnName;

      wrapperCode = `
${PY_BOILERPLATE}

# ── User code ──────────────────────────────────────────────────────────────────
${code}

# ── Runner ─────────────────────────────────────────────────────────────────────
import sys
try:
    sol = Solution()
    result = normalise(sol.${pyFnName}(${pyArgs.join(", ")}))
    print(json.dumps(result))
except Exception as e:
    print(str(e), file=sys.stderr)
    sys.exit(1)
`;

      // ─────────────────────────────────────────────────────────────────────────
      // C++
      // ─────────────────────────────────────────────────────────────────────────
    } else if (language === "cpp") {
      languageId = 54;

      // Build typed declarations for each parameter
      const varDecls = [];
      const varNames = [];

      if (cppParams && cppParams.length > 0) {
        cppParams.forEach((param, idx) => {
          const dt = declType(param.type);
          const literal = jsToCppLiteral(args[idx], param.type);
          varDecls.push(`${dt} p${idx} = ${literal};`);
          varNames.push(`p${idx}`);
        });
      } else {
        // Fallback: pass args as-is if signature couldn't be parsed
        args.forEach((arg, idx) => {
          const literal = JSON.stringify(arg);
          varDecls.push(`auto p${idx} = ${literal};`);
          varNames.push(`p${idx}`);
        });
      }

      const callArgs = varNames.join(", ");
      let runnerBlock;
      if (cppReturn === "void") {
        // void return: call then print the first (mutated) param
        runnerBlock = `
        sol.${cppFnName}(${callArgs});
        cout << toJson(p0) << endl;`;
      } else {
        runnerBlock = `
        auto res = sol.${cppFnName}(${callArgs});
        cout << toJson(res) << endl;`;
      }

      wrapperCode = `
${CPP_BOILERPLATE}

// ── User code ─────────────────────────────────────────────────────────────────
${code}

// ── Runner ────────────────────────────────────────────────────────────────────
int main() {
    Solution sol;
    try {
        ${varDecls.join("\n        ")}
        ${runnerBlock}
    } catch (const exception& e) {
        cerr << e.what() << endl;
        return 1;
    } catch (...) {
        cerr << "Runtime error" << endl;
        return 1;
    }
    return 0;
}
`;

      // ─────────────────────────────────────────────────────────────────────────
      // UNSUPPORTED
      // ─────────────────────────────────────────────────────────────────────────
    } else {
      return {
        success: false,
        stdout: "",
        stderr: `Language '${language}' is not supported.`,
        compile_output: "",
        status: "Unsupported Language",
        execution_time: "0",
      };
    }

    // ── Submit to Judge0 ──────────────────────────────────────────────────────
    const url = `${judge0Url.replace(/\/$/, "")}/submissions?base64_encoded=false&wait=true`;
    const headers = { "Content-Type": "application/json" };
    if (process.env.JUDGE0_API_KEY)
      headers["x-rapidapi-key"] = process.env.JUDGE0_API_KEY;
    if (process.env.JUDGE0_API_HOST)
      headers["x-rapidapi-host"] = process.env.JUDGE0_API_HOST;

    try {
      const res = await axios.post(
        url,
        { source_code: wrapperCode, language_id: languageId, cpu_time_limit: 3 },
        { headers }
      );

      const data = res.data;
      const { status, stdout, stderr, compile_output, time } = data;

      // ── Derive expected string ──────────────────────────────────────────────
      let expectedStr = "";
      if (firstTestCase.expected !== undefined) {
        expectedStr =
          typeof firstTestCase.expected === "string"
            ? firstTestCase.expected
            : JSON.stringify(firstTestCase.expected);
      } else if (firstTestCase.expectedOutput !== undefined) {
        expectedStr = String(firstTestCase.expectedOutput);
      }

      // ── Smart multi-strategy output comparison ─────────────────────────────
      // Handles all edge cases regardless of whether wrappers print raw or JSON values.
      const clean = (s) =>
        (s || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();

      // actual = raw stdout from Judge0; expected = value from test case
      const cleanActual   = clean(stdout);
      const cleanExpected = clean(expectedStr);

      function outputsMatch(a, e) {
        // Strategy 1: exact
        if (a === e) return true;

        // Strategy 2: actual is JSON-quoted ("BANC"), expected is raw (BANC)
        const isJsonStr = (s) => s.length >= 2 && s[0] === '"' && s[s.length - 1] === '"';
        if (isJsonStr(a) && !isJsonStr(e)) {
          try {
            const parsed = JSON.parse(a);
            if (typeof parsed === "string" && parsed === e) return true;
          } catch (_) { /* keep going */ }
        }
        // Strategy 3: expected is JSON-quoted, actual is raw (reverse)
        if (isJsonStr(e) && !isJsonStr(a)) {
          try {
            const parsed = JSON.parse(e);
            if (typeof parsed === "string" && parsed === a) return true;
          } catch (_) { /* keep going */ }
        }

        // Strategy 4: parse both as JSON and deep-compare serialised forms
        //             "[1, 2]" vs "[1,2]" → both parse to [1,2]
        try {
          const pa = JSON.parse(a);
          const pe = JSON.parse(e);
          if (JSON.stringify(pa) === JSON.stringify(pe)) return true;

          // Strategy 6: order-insensitive comparison for arrays of arrays
          // e.g. Pacific Atlantic returns coords in any order; [[0,4],[1,3]]
          // should match regardless of outer-array order.
          if (Array.isArray(pa) && Array.isArray(pe) && pa.length === pe.length) {
            const canonicalise = (arr) => {
              // Sort each inner element (if array), then sort the outer array
              return arr
                .map((item) =>
                  Array.isArray(item)
                    ? JSON.stringify([...item].sort((x, y) => x - y))
                    : JSON.stringify(item)
                )
                .sort()
                .join("|");
            };
            if (canonicalise(pa) === canonicalise(pe)) return true;
          }
        } catch (_) { /* keep going */ }

        // Strategy 5: strip all whitespace + lowercase
        const norm = (s) => s.replace(/\s+/g, "").toLowerCase();
        if (norm(a) === norm(e)) return true;

        return false;
      }

      let statusDescription = status.description;
      let success = false;

      if (status.id === 3) {
        if (outputsMatch(cleanActual, cleanExpected)) {
          statusDescription = "Accepted";
          success = true;
        } else {
          statusDescription = "Wrong Answer";
        }
      }

      return {
        success,
        stdout: stdout || "",
        stderr: stderr || "",
        compile_output: compile_output || "",
        status: statusDescription || "Unknown",
        execution_time: time ? `${Math.round(parseFloat(time) * 1000)} ms` : "0 ms",
      };
    } catch (err) {
      console.error("Judge0 request failed:", err);
      const errMsg = err.response?.data
        ? JSON.stringify(err.response.data)
        : err.message;
      return {
        success: false,
        stdout: "",
        stderr: `Failed to connect to execution API: ${errMsg}`,
        compile_output: "",
        status: "Connection Failed",
        execution_time: "0",
      };
    }
  },
};

export default codeExecutionService;
