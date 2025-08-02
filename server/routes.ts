import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertMeditationSessionSchema,
  insertStressLogSchema,
  insertJournalEntrySchema,
  insertBreathingExerciseSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Healing App Features API Routes
  
  // Meditation Sessions
  app.get("/api/meditation-sessions", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const sessions = await storage.getMeditationSessions(userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch meditation sessions" });
    }
  });

  app.post("/api/meditation-sessions", async (req, res) => {
    try {
      const sessionData = insertMeditationSessionSchema.parse(req.body);
      const userId = req.body.userId;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const session = await storage.createMeditationSession({ ...sessionData, userId });
      res.status(201).json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid meditation session data" });
    }
  });

  app.patch("/api/meditation-sessions/:id/complete", async (req, res) => {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      const session = await storage.completeMeditationSession(id, notes);
      if (!session) {
        return res.status(404).json({ message: "Meditation session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to complete meditation session" });
    }
  });

  // Stress Logs
  app.get("/api/stress-logs", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const limit = parseInt(req.query.limit as string) || 50;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const logs = await storage.getStressLogs(userId, limit);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stress logs" });
    }
  });

  app.post("/api/stress-logs", async (req, res) => {
    try {
      const logData = insertStressLogSchema.parse(req.body);
      const userId = req.body.userId;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const log = await storage.createStressLog({ ...logData, userId });
      res.status(201).json(log);
    } catch (error) {
      res.status(400).json({ message: "Invalid stress log data" });
    }
  });

  app.get("/api/stress-logs/range", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const startDate = new Date(req.query.startDate as string);
      const endDate = new Date(req.query.endDate as string);
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const logs = await storage.getStressLogsByDateRange(userId, startDate, endDate);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stress logs by date range" });
    }
  });

  // Journal Entries
  app.get("/api/journal-entries", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const limit = parseInt(req.query.limit as string) || 20;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const entries = await storage.getJournalEntries(userId, limit);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });

  app.post("/api/journal-entries", async (req, res) => {
    try {
      const entryData = insertJournalEntrySchema.parse(req.body);
      const userId = req.body.userId;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const entry = await storage.createJournalEntry({ ...entryData, userId });
      res.status(201).json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid journal entry data" });
    }
  });

  app.patch("/api/journal-entries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { content, mood } = req.body;
      const entry = await storage.updateJournalEntry(id, content, mood);
      if (!entry) {
        return res.status(404).json({ message: "Journal entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(500).json({ message: "Failed to update journal entry" });
    }
  });

  app.delete("/api/journal-entries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteJournalEntry(id);
      if (!deleted) {
        return res.status(404).json({ message: "Journal entry not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete journal entry" });
    }
  });

  // Breathing Exercises
  app.get("/api/breathing-exercises", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const exercises = await storage.getBreathingExercises(userId);
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch breathing exercises" });
    }
  });

  app.post("/api/breathing-exercises", async (req, res) => {
    try {
      const exerciseData = insertBreathingExerciseSchema.parse(req.body);
      const userId = req.body.userId;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const exercise = await storage.createBreathingExercise({ ...exerciseData, userId });
      res.status(201).json(exercise);
    } catch (error) {
      res.status(400).json({ message: "Invalid breathing exercise data" });
    }
  });

  app.patch("/api/breathing-exercises/:id/complete", async (req, res) => {
    try {
      const { id } = req.params;
      const { effectivenessRating } = req.body;
      if (typeof effectivenessRating !== 'number' || effectivenessRating < 1 || effectivenessRating > 5) {
        return res.status(400).json({ message: "Effectiveness rating must be between 1 and 5" });
      }
      const exercise = await storage.completeBreathingExercise(id, effectivenessRating);
      if (!exercise) {
        return res.status(404).json({ message: "Breathing exercise not found" });
      }
      res.json(exercise);
    } catch (error) {
      res.status(500).json({ message: "Failed to complete breathing exercise" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
