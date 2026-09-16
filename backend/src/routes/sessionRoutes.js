import express from "express";
import protect from "../middleware/authMiddleware.js";
import Session from "../models/Session.js";
import { QUESTIONS } from "../utils/seedProblems.js";
import codeExecutionService from "../services/codeExecutionService.js";
import aiService from "../services/aiService.js";

const router = express.Router();

router.get("/:id", protect, async (req, res) => {
  try {
    // Solo session support
    if (req.params.id.startsWith("solo-")) {
      const problemId = parseInt(req.params.id.replace("solo-", ""), 10);
      const problemData = QUESTIONS[problemId];
      
      if (!problemData) {
        return res.status(404).json({ message: "Problem not found" });
      }
      
      const sessionData = {
        _id: req.params.id,
        users: [{ _id: req.user._id, name: req.user.name, email: req.user.email }],
        problem: problemData,
      };
      
      return res.status(200).json({ session: sessionData });
    }

    const session = await Session.findById(req.params.id)
      .populate("users", "name email");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Security: Check if current authenticated user belongs to this session
    const isMember = session.users.some(
      (user) => user._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: "You are not authorized to access this session room." });
    }

    // Fetch the static problem data
    const problemData = QUESTIONS[session.problem];

    if (!problemData) {
      return res.status(404).json({ message: "Invalid or missing problem associated with this session." });
    }

    // Convert Mongoose document to plain object to attach problem details
    const sessionData = session.toObject();
    sessionData.problem = problemData;

    return res.status(200).json({ session: sessionData });
  } catch (error) {
    console.error("Error fetching session:", error);
    return res.status(500).json({ message: "Server error retrieving session details" });
  }
});

router.post("/:id/run", protect, async (req, res) => {
  const { code, language } = req.body;
  if (!code || !language) {
    return res.status(400).json({ message: "Code and language are required" });
  }

  try {
    let problem;

    if (req.params.id.startsWith("solo-")) {
      const problemId = parseInt(req.params.id.replace("solo-", ""), 10);
      problem = QUESTIONS[problemId];
      if (!problem) {
        return res.status(404).json({ message: "No problem found" });
      }
    } else {
      const session = await Session.findById(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      // Security: Check if user belongs to session
      const isMember = session.users.some(
        (userId) => userId.toString() === req.user._id.toString()
      );
      if (!isMember) {
        return res.status(403).json({ message: "You are not authorized to run code in this session room." });
      }

      problem = QUESTIONS[session.problem];
      if (!problem) {
        return res.status(404).json({ message: "No problem found associated with this session." });
      }
    }

    const report = await codeExecutionService.execute(code, language, problem);
    return res.status(200).json(report);
  } catch (error) {
    console.error("Error executing code:", error);
    return res.status(500).json({ message: "Server error executing code" });
  }
});

router.post("/:id/submit", protect, async (req, res) => {
  const { code, language } = req.body;
  if (!code || !language) {
    return res.status(400).json({ message: "Code and language are required" });
  }

  try {
    let problem;

    if (req.params.id.startsWith("solo-")) {
      const problemId = parseInt(req.params.id.replace("solo-", ""), 10);
      problem = QUESTIONS[problemId];
      if (!problem) {
        return res.status(404).json({ message: "No problem found" });
      }
    } else {
      const session = await Session.findById(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      // Security: Check if user belongs to session
      const isMember = session.users.some(
        (userId) => userId.toString() === req.user._id.toString()
      );
      if (!isMember) {
        return res.status(403).json({ message: "You are not authorized to submit code in this session room." });
      }

      problem = QUESTIONS[session.problem];
      if (!problem) {
        return res.status(404).json({ message: "No problem found associated with this session." });
      }
    }

    const report = await codeExecutionService.execute(code, language, problem);
    return res.status(200).json(report);
  } catch (error) {
    console.error("Error submitting code:", error);
    return res.status(500).json({ message: "Server error submitting code" });
  }
});

router.post("/:id/hint", protect, async (req, res) => {
  const { code, language } = req.body;
  if (code === undefined || !language) {
    return res.status(400).json({ message: "Code and language are required" });
  }

  try {
    let problem;

    if (req.params.id.startsWith("solo-")) {
      const problemId = parseInt(req.params.id.replace("solo-", ""), 10);
      problem = QUESTIONS[problemId];
      if (!problem) {
        return res.status(404).json({ message: "No problem found" });
      }
    } else {
      const session = await Session.findById(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      // Security: Check if user belongs to session
      const isMember = session.users.some(
        (userId) => userId.toString() === req.user._id.toString()
      );
      if (!isMember) {
        return res.status(403).json({ message: "You are not authorized to request AI hints in this session room." });
      }

      problem = QUESTIONS[session.problem];
      if (!problem) {
        return res.status(404).json({ message: "No problem found associated with this session." });
      }
    }

    const hint = await aiService.generateHint(problem, code, language);
    return res.status(200).json({ hint });
  } catch (error) {
    console.error("Error generating AI hint:", error);
    return res.status(500).json({ message: error.message || "Server error generating AI hint" });
  }
});

export default router;
