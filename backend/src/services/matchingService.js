import Session from "../models/Session.js";
import { QUESTIONS } from "../utils/seedProblems.js";

// In-memory queue: Array of { socketId, userId, criteria, timerId }
let queue = [];

// In-memory friend queue: Map of code -> { socketId, userId, criteria }
const friendQueue = new Map();

function generateAlphanumericCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const TOPICS = [
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

// Helper to normalize topics (e.g. "Array" -> "Arrays", case insensitivity)
function normalizeTopic(topic) {
  if (!topic) return "";
  const t = topic.toLowerCase().trim();
  
  if (t === "array" || t === "arrays") return "Arrays";
  if (t === "string" || t === "strings") return "Strings";
  if (t === "linked list" || t === "linked lists") return "Linked Lists";
  if (t === "tree" || t === "trees") return "Trees";
  if (t === "graph" || t === "graphs") return "Graphs";
  if (t === "dynamic programming" || t === "dp") return "Dynamic Programming";
  if (t === "backtracking") return "Backtracking";
  if (t === "bit manipulation") return "Bit Manipulation";
  if (t === "sliding window") return "Sliding Window";
  if (t === "binary search") return "Binary Search";
  if (t === "heap" || t === "priority queue" || t === "heap / priority queue") return "Heap / Priority Queue";

  const found = TOPICS.find((top) => top.toLowerCase() === t);
  return found || topic;
}

// ─── Pick the best matching problem ──────────────────────────────────────────
// STRICTLY match normalized topic and difficulty. No fallbacks to other topics/difficulties.
function pickProblem(difficulty, topic) {
  const allQuestions = Object.values(QUESTIONS);
  if (allQuestions.length === 0) {
    return null;
  }

  const diff = (difficulty || "").toLowerCase().trim();
  const top = normalizeTopic(topic).toLowerCase().trim();

  // Find exact match only
  const exactMatches = allQuestions.filter(
    (q) =>
      q.difficulty.toLowerCase().trim() === diff &&
      normalizeTopic(q.topic).toLowerCase().trim() === top
  );

  if (exactMatches.length > 0) {
    return exactMatches[Math.floor(Math.random() * exactMatches.length)];
  }

  return null;
}

// ─── Create session and notify both users ────────────────────────────────────
const createMatch = async (io, entry1, entry2, matchedProblem) => {
  try {
    const session = new Session({
      users:      [entry1.userId, entry2.userId],
      difficulty: matchedProblem.difficulty,
      topic:      matchedProblem.topic,
      problem:    matchedProblem.id,
      status:     "active",
    });

    await session.save();

    console.log(
      `Match found! Session ${session._id} — ` +
      `"${matchedProblem.title}" (${matchedProblem.difficulty} · ${matchedProblem.topic})`
    );

    io.to(entry1.socketId).emit("match_found", { sessionId: session._id, problemId: matchedProblem.id });
    io.to(entry2.socketId).emit("match_found", { sessionId: session._id, problemId: matchedProblem.id });
  } catch (err) {
    console.error("Error creating match session:", err);
    io.to(entry1.socketId).emit("match_error", { message: err.message || "Failed to create match session" });
    io.to(entry2.socketId).emit("match_error", { message: err.message || "Failed to create match session" });
  }
};

const matchingService = {
  handleFindMatch: async (io, socket, criteria) => {
    // 1. Remove any stale entry for this user to prevent duplicates
    matchingService.removeFromQueue(socket.id, socket.userId);

    const normDifficulty = (criteria.difficulty || "").toLowerCase().trim();
    const normTopic = normalizeTopic(criteria.topic);

    // 2. Find a partner who selected the EXACT same difficulty and normalized topic
    const exactPartnerIndex = queue.findIndex(
      (entry) =>
        (entry.criteria.difficulty || "").toLowerCase().trim() === normDifficulty &&
        normalizeTopic(entry.criteria.topic) === normTopic &&
        entry.userId !== socket.userId
    );

    const matchedProblem = pickProblem(normDifficulty, normTopic);

    if (exactPartnerIndex !== -1 && matchedProblem) {
      // 3. Exact partner AND matching question exists in database -> match immediately!
      const partner = queue[exactPartnerIndex];
      if (partner.timerId) clearTimeout(partner.timerId);
      queue.splice(exactPartnerIndex, 1);

      const userEntry = { socketId: socket.id, userId: socket.userId, criteria };
      await createMatch(io, userEntry, partner, matchedProblem);
      return;
    }

    // 4. No partner found OR no matching question exists in database -> add to queue
    // Show a loading/searching state to the user and wait for up to 15 seconds.
    console.log(`Queuing ${socket.userId} for ${normDifficulty} · ${normTopic} (exact match required)`);

    const newEntry = {
      socketId: socket.id,
      userId:   socket.userId,
      criteria,
      timerId:  null,
    };

    newEntry.timerId = setTimeout(() => {
      const myIndex = queue.findIndex((e) => e.userId === socket.userId);
      if (myIndex === -1) return; // Already matched or cancelled

      console.log(`Match timeout reached for ${socket.userId} after 15 seconds.`);
      
      // Remove from queue
      queue.splice(myIndex, 1);

      // Notify the user that no exact matching question/partner was found
      socket.emit("match_error", {
        message: `No exact matching question was found for topic: ${criteria.topic}, difficulty: ${criteria.difficulty}. Please try again or select another configuration.`,
      });
    }, 15000); // Wait for exactly 15 seconds

    queue.push(newEntry);
  },

  removeFromQueue: (socketId, userId = null) => {
    queue = queue.filter((entry) => {
      const isMatch =
        entry.socketId === socketId || (userId && entry.userId === userId);
      if (isMatch) {
        if (entry.timerId) clearTimeout(entry.timerId);
        console.log(`Removed ${entry.userId} from matching queue`);
      }
      return !isMatch;
    });

    // Also remove from friend queue
    for (const [code, creator] of friendQueue.entries()) {
      if (creator.socketId === socketId || (userId && creator.userId === userId)) {
        friendQueue.delete(code);
        console.log(`Removed ${creator.userId} from friend queue (code ${code})`);
      }
    }
  },

  handleCreateFriendMatch: (io, socket, criteria) => {
    // 1. Remove any stale entry
    matchingService.removeFromQueue(socket.id, socket.userId);

    const normDifficulty = (criteria.difficulty || "").toLowerCase().trim();
    const normTopic = normalizeTopic(criteria.topic);

    // Make sure a problem exists before giving a code
    const matchedProblem = pickProblem(normDifficulty, normTopic);
    if (!matchedProblem) {
      socket.emit("match_error", {
        message: `No matching question found for topic: ${criteria.topic}, difficulty: ${criteria.difficulty}.`,
      });
      return;
    }

    const code = generateAlphanumericCode();
    friendQueue.set(code, {
      socketId: socket.id,
      userId: socket.userId,
      criteria,
      problem: matchedProblem
    });

    console.log(`Created friend match code ${code} for ${socket.userId}`);
    socket.emit("friend_match_created", { code });
  },

  handleJoinFriendMatch: async (io, socket, code) => {
    const creator = friendQueue.get(code.toUpperCase());
    if (!creator) {
      socket.emit("match_error", { message: "Invalid or expired code." });
      return;
    }

    // Prevent joining own room directly (though logic would handle it, better to block)
    if (creator.userId === socket.userId) {
      socket.emit("match_error", { message: "Cannot join your own room from the same account." });
      return;
    }

    friendQueue.delete(code.toUpperCase());

    const userEntry = { socketId: socket.id, userId: socket.userId, criteria: creator.criteria };
    await createMatch(io, creator, userEntry, creator.problem);
  },
};

export default matchingService;
