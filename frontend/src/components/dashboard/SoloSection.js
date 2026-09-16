"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, Reorder, useDragControls } from "framer-motion";
import { GripVertical, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

/* ── Full problem list ─────────────────────────────────── */
const ALL_PROBLEMS = [
  { id: 1,  title: "Two Sum",                                        difficulty: "Easy",   tags: ["Arrays"] },
  { id: 2,  title: "Merge Intervals",                                difficulty: "Medium", tags: ["Arrays"] },
  { id: 3,  title: "Product of Array Except Self",                   difficulty: "Medium", tags: ["Arrays"] },
  { id: 4,  title: "Valid Anagram",                                  difficulty: "Easy",   tags: ["Strings"] },
  { id: 5,  title: "Longest Palindromic Substring",                  difficulty: "Medium", tags: ["Strings"] },
  { id: 6,  title: "Group Anagrams",                                 difficulty: "Medium", tags: ["Strings"] },
  { id: 7,  title: "Reverse Linked List",                            difficulty: "Easy",   tags: ["Linked Lists"] },
  { id: 8,  title: "Linked List Cycle",                              difficulty: "Easy",   tags: ["Linked Lists"] },
  { id: 9,  title: "Merge Two Sorted Lists",                         difficulty: "Easy",   tags: ["Linked Lists"] },
  { id: 10, title: "Maximum Depth of Binary Tree",                   difficulty: "Easy",   tags: ["Trees"] },
  { id: 11, title: "Binary Tree Level Order Traversal",              difficulty: "Medium", tags: ["Trees"] },
  { id: 12, title: "Validate Binary Search Tree",                    difficulty: "Medium", tags: ["Trees"] },
  { id: 13, title: "Number of Islands",                              difficulty: "Medium", tags: ["Graphs"] },
  { id: 14, title: "Course Schedule",                                difficulty: "Medium", tags: ["Graphs"] },
  { id: 15, title: "Clone Graph",                                    difficulty: "Medium", tags: ["Graphs"] },
  { id: 16, title: "Climbing Stairs",                                difficulty: "Easy",   tags: ["Dynamic Programming"] },
  { id: 17, title: "Longest Common Subsequence",                     difficulty: "Medium", tags: ["Dynamic Programming"] },
  { id: 18, title: "Coin Change",                                    difficulty: "Medium", tags: ["Dynamic Programming"] },
  { id: 19, title: "Subsets",                                        difficulty: "Medium", tags: ["Backtracking"] },
  { id: 20, title: "Combination Sum",                                difficulty: "Medium", tags: ["Backtracking"] },
  { id: 21, title: "Single Number",                                  difficulty: "Easy",   tags: ["Bit Manipulation"] },
  { id: 22, title: "Counting Bits",                                  difficulty: "Easy",   tags: ["Bit Manipulation"] },
  { id: 23, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", tags: ["Sliding Window"] },
  { id: 24, title: "Maximum Average Subarray I",                     difficulty: "Easy",   tags: ["Sliding Window"] },
  { id: 25, title: "Minimum Window Substring",                       difficulty: "Hard",   tags: ["Sliding Window"] },
  { id: 26, title: "Binary Search",                                  difficulty: "Easy",   tags: ["Binary Search"] },
  { id: 27, title: "Find Minimum in Rotated Sorted Array",           difficulty: "Medium", tags: ["Binary Search"] },
  { id: 28, title: "Search in Rotated Sorted Array",                 difficulty: "Medium", tags: ["Binary Search"] },
  { id: 29, title: "Kth Largest Element in an Array",                difficulty: "Medium", tags: ["Heap / Priority Queue"] },
  { id: 30, title: "Top K Frequent Elements",                        difficulty: "Medium", tags: ["Heap / Priority Queue"] },
  { id: 31, title: "Best Time to Buy and Sell Stock",                difficulty: "Easy",   tags: ["Arrays"] },
  { id: 32, title: "Longest Common Prefix",                          difficulty: "Easy",   tags: ["Strings"] },
  { id: 33, title: "Remove Nth Node From End of List",               difficulty: "Medium", tags: ["Linked Lists"] },
  { id: 34, title: "Same Tree",                                      difficulty: "Easy",   tags: ["Trees"] },
  { id: 35, title: "Pacific Atlantic Water Flow",                    difficulty: "Hard",   tags: ["Graphs"] },
  { id: 36, title: "Minimum Size Subarray Sum",                      difficulty: "Medium", tags: ["Sliding Window"] },
  { id: 37, title: "Search Insert Position",                         difficulty: "Easy",   tags: ["Binary Search"] },
  { id: 38, title: "Last Stone Weight",                              difficulty: "Easy",   tags: ["Heap / Priority Queue"] },
  { id: 39, title: "Unique Paths",                                   difficulty: "Medium", tags: ["Dynamic Programming"] },
  { id: 40, title: "Letter Combinations of a Phone Number",          difficulty: "Medium", tags: ["Backtracking"] },
  { id: 41, title: "First Missing Positive",                         difficulty: "Hard",   tags: ["Arrays"] },
];

const PAGE_SIZE = 8;

export default function SoloSection() {
  const [visible,  setVisible]  = useState(ALL_PROBLEMS.slice(0, PAGE_SIZE));
  const [loading,  setLoading]  = useState(false);
  const [hasMore,  setHasMore]  = useState(ALL_PROBLEMS.length > PAGE_SIZE);
  const loaderRef              = useRef(null);

  // Reorder state is separate — only over the currently visible slice
  const [problems, setProblems] = useState(visible);

  // Sync when visible changes (initial or on load-more)
  useEffect(() => { setProblems(visible); }, [visible]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    setTimeout(() => {
      const next = ALL_PROBLEMS.slice(0, problems.length + PAGE_SIZE);
      setVisible(next);
      setHasMore(next.length < ALL_PROBLEMS.length);
      setLoading(false);
    }, 600); // simulate async fetch
  }, [loading, hasMore, problems.length]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  return (
    <div>
      {/* Section header */}
      <div style={{ display:"flex", alignItems:"baseline", gap:"14px", marginBottom:"40px" }}>
        <h2 style={{
          fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
          fontWeight: 700,
          color: "#f4f4f5",
          letterSpacing: "-0.03em",
          margin: 0,
        }}>
          Solve Solo
        </h2>
        <span style={{ fontSize:"0.8rem", color:"rgba(255,255,255,0.2)", fontWeight:500 }}>
          {ALL_PROBLEMS.length} problems
        </span>
      </div>

      {/* Problems outer card */}
      <div style={{
        background: "rgba(255,255,255,0.015)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: "24px",
        overflow: "hidden",
      }}>

        {/* Column header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "44px 52px 1fr 300px 160px 48px",
          alignItems: "center",
          padding: "14px 36px",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}>
          <span />
          <span style={{ fontSize:"0.7rem", fontWeight:600, color:"rgba(255,255,255,0.2)", letterSpacing:"0.08em", textTransform:"uppercase" }}>#</span>
          <span style={{ fontSize:"0.7rem", fontWeight:600, color:"rgba(255,255,255,0.2)", letterSpacing:"0.08em", textTransform:"uppercase" }}>Title</span>
          <span style={{ fontSize:"0.7rem", fontWeight:600, color:"rgba(255,255,255,0.2)", letterSpacing:"0.08em", textTransform:"uppercase" }}>Tags</span>
          <span />
          <span />
        </div>

        {/* Reorderable rows */}
        <Reorder.Group
          axis="y"
          values={problems}
          onReorder={setProblems}
          style={{ listStyle:"none", padding:0, margin:0 }}
        >
          {problems.map((p, i) => (
            <ProblemRow key={p.id} problem={p} index={i} isLast={i === problems.length - 1} />
          ))}
        </Reorder.Group>

        {/* Infinite scroll loader */}
        <div ref={loaderRef} style={{ padding:"32px", display:"flex", justifyContent:"center" }}>
          {loading && (
            <svg style={{ animation:"cm-spin 0.8s linear infinite", width:20, height:20 }} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          )}
          {!hasMore && !loading && (
            <span style={{ fontSize:"0.8rem", color:"rgba(255,255,255,0.15)", letterSpacing:"0.05em" }}>
              · · · all problems loaded · · ·
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Problem Row ───────────────────────────────────────── */
function ProblemRow({ problem, index, isLast }) {
  const controls   = useDragControls();
  const router     = useRouter();
  const [hov, setHov] = useState(false);
  const [btn, setBtn] = useState(false);

  return (
    <Reorder.Item
      value={problem}
      dragListener={false}
      dragControls={controls}
      style={{ listStyle:"none" }}
      initial={{ opacity:0, y:12 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.35, delay: Math.min(index * 0.04, 0.32), ease:[0.22,1,0.36,1] }}
      whileDrag={{
        scale: 1.01,
        boxShadow: "0 16px 60px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.12)",
        zIndex: 50,
        backgroundColor: "rgba(255,255,255,0.04)",
      }}
    >
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: "grid",
          gridTemplateColumns: "44px 52px 1fr 300px 160px 48px",
          alignItems: "center",
          padding: "22px 36px",
          borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.03)",
          background: hov ? "rgba(255,255,255,0.025)" : "transparent",
          transition: "background 200ms ease",
          cursor: "default",
        }}
      >
        {/* Drag handle */}
        <div
          onPointerDown={e => controls.start(e)}
          style={{
            display:"flex", alignItems:"center", cursor:"grab", touchAction:"none",
            color: hov ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.12)",
            transition:"color 200ms",
          }}
        >
          <GripVertical size={20} strokeWidth={1.5} />
        </div>

        {/* Number */}
        <span style={{
          fontSize:"1rem", fontWeight:500,
          color: hov ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)",
          fontFamily:"var(--font-geist-mono, monospace)",
          transition:"color 200ms",
        }}>
          {problem.id}
        </span>

        {/* Title */}
        <span style={{
          fontSize:"1.05rem", fontWeight:500,
          color: hov ? "#f4f4f5" : "#d4d4d8",
          letterSpacing:"-0.02em",
          paddingRight:"24px",
          transition:"color 200ms",
        }}>
          {problem.title}
        </span>

        {/* Tags */}
        <div style={{ display:"flex", gap:"8px", alignItems:"center", flexWrap:"wrap" }}>
          <DifficultyBadge level={problem.difficulty} />
          {problem.tags.map(t => (
            <span key={t} style={{
              fontSize:"0.78rem", fontWeight:500,
              color:"rgba(255,255,255,0.28)",
              background:"rgba(255,255,255,0.03)",
              border:"1px solid rgba(255,255,255,0.06)",
              borderRadius:"8px",
              padding:"4px 12px",
              letterSpacing:"-0.01em",
              whiteSpace:"nowrap",
            }}>{t}</span>
          ))}
        </div>

        {/* Solve Solo btn */}
        <button
          onMouseEnter={() => setBtn(true)}
          onMouseLeave={() => setBtn(false)}
          onClick={() => router.push(`/session/solo-${problem.id}`)}
          style={{
            display:"flex", alignItems:"center", justifyContent:"center",
            padding:"10px 22px",
            background: btn ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.025)",
            border:"1px solid",
            borderColor: btn ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)",
            borderRadius:"12px",
            color: btn ? "#f4f4f5" : "#a1a1aa",
            fontSize:"0.9rem", fontWeight:600,
            cursor:"pointer", whiteSpace:"nowrap",
            letterSpacing:"-0.01em",
            fontFamily:"inherit",
            transition:"all 180ms ease",
            outline:"none",
          }}
        >
          Solve Solo
        </button>

        {/* Arrow */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"flex-end",
          color: hov ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)",
          transition:"color 200ms",
        }}>
          <ArrowRight size={20} strokeWidth={1.5} />
        </div>
      </div>
    </Reorder.Item>
  );
}

/* ── Difficulty Badge ──────────────────────────────────── */
function DifficultyBadge({ level }) {
  const map = {
    Easy:   { color:"#71717a", border:"rgba(255,255,255,0.07)" },
    Medium: { color:"#52525b", border:"rgba(255,255,255,0.05)" },
    Hard:   { color:"#3f3f46", border:"rgba(255,255,255,0.04)" },
  };
  const s = map[level] || map.Easy;
  return (
    <span style={{
      fontSize:"0.78rem", fontWeight:600,
      color: s.color,
      background:"rgba(255,255,255,0.02)",
      border:`1px solid ${s.border}`,
      borderRadius:"8px",
      padding:"4px 12px",
      letterSpacing:"0.01em",
      whiteSpace:"nowrap",
      flexShrink:0,
    }}>
      {level}
    </span>
  );
}
