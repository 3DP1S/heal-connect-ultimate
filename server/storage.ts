import { 
  type User, type InsertUser,
  type MeditationSession, type InsertMeditationSession,
  type StressLog, type InsertStressLog,
  type JournalEntry, type InsertJournalEntry,
  type BreathingExercise, type InsertBreathingExercise
} from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Meditation Sessions
  getMeditationSessions(userId: string): Promise<MeditationSession[]>;
  createMeditationSession(session: InsertMeditationSession & { userId: string }): Promise<MeditationSession>;
  completeMeditationSession(id: string, notes?: string): Promise<MeditationSession | undefined>;
  
  // Stress Logs
  getStressLogs(userId: string, limit?: number): Promise<StressLog[]>;
  createStressLog(log: InsertStressLog & { userId: string }): Promise<StressLog>;
  getStressLogsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<StressLog[]>;
  
  // Journal Entries
  getJournalEntries(userId: string, limit?: number): Promise<JournalEntry[]>;
  createJournalEntry(entry: InsertJournalEntry & { userId: string }): Promise<JournalEntry>;
  updateJournalEntry(id: string, content: string, mood?: string): Promise<JournalEntry | undefined>;
  deleteJournalEntry(id: string): Promise<boolean>;
  
  // Breathing Exercises
  getBreathingExercises(userId: string): Promise<BreathingExercise[]>;
  createBreathingExercise(exercise: InsertBreathingExercise & { userId: string }): Promise<BreathingExercise>;
  completeBreathingExercise(id: string, effectivenessRating: number): Promise<BreathingExercise | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private meditationSessions: Map<string, MeditationSession>;
  private stressLogs: Map<string, StressLog>;
  private journalEntries: Map<string, JournalEntry>;
  private breathingExercises: Map<string, BreathingExercise>;

  constructor() {
    this.users = new Map();
    this.meditationSessions = new Map();
    this.stressLogs = new Map();
    this.journalEntries = new Map();
    this.breathingExercises = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      displayName: insertUser.displayName || null,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Meditation Sessions
  async getMeditationSessions(userId: string): Promise<MeditationSession[]> {
    return Array.from(this.meditationSessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createMeditationSession(sessionData: InsertMeditationSession & { userId: string }): Promise<MeditationSession> {
    const id = randomUUID();
    const session: MeditationSession = {
      ...sessionData,
      id,
      backgroundSound: sessionData.backgroundSound || null,
      notes: sessionData.notes || null,
      completedAt: null,
      createdAt: new Date()
    };
    this.meditationSessions.set(id, session);
    return session;
  }

  async completeMeditationSession(id: string, notes?: string): Promise<MeditationSession | undefined> {
    const session = this.meditationSessions.get(id);
    if (session) {
      session.completedAt = new Date();
      if (notes) session.notes = notes;
      this.meditationSessions.set(id, session);
    }
    return session;
  }

  // Stress Logs
  async getStressLogs(userId: string, limit = 50): Promise<StressLog[]> {
    return Array.from(this.stressLogs.values())
      .filter(log => log.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async createStressLog(logData: InsertStressLog & { userId: string }): Promise<StressLog> {
    const id = randomUUID();
    const log: StressLog = {
      ...logData,
      id,
      triggers: logData.triggers || null,
      notes: logData.notes || null,
      exerciseCompleted: logData.exerciseCompleted || null,
      createdAt: new Date()
    };
    this.stressLogs.set(id, log);
    return log;
  }

  async getStressLogsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<StressLog[]> {
    return Array.from(this.stressLogs.values())
      .filter(log => 
        log.userId === userId &&
        log.createdAt && log.createdAt >= startDate &&
        log.createdAt && log.createdAt <= endDate
      )
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  // Journal Entries
  async getJournalEntries(userId: string, limit = 20): Promise<JournalEntry[]> {
    return Array.from(this.journalEntries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async createJournalEntry(entryData: InsertJournalEntry & { userId: string }): Promise<JournalEntry> {
    const id = randomUUID();
    const entry: JournalEntry = {
      ...entryData,
      id,
      title: entryData.title || null,
      prompt: entryData.prompt || null,
      mood: entryData.mood || null,
      isPrivate: entryData.isPrivate ?? true,
      tags: entryData.tags || null,
      createdAt: new Date()
    };
    this.journalEntries.set(id, entry);
    return entry;
  }

  async updateJournalEntry(id: string, content: string, mood?: string): Promise<JournalEntry | undefined> {
    const entry = this.journalEntries.get(id);
    if (entry) {
      entry.content = content;
      if (mood) entry.mood = mood;
      this.journalEntries.set(id, entry);
    }
    return entry;
  }

  async deleteJournalEntry(id: string): Promise<boolean> {
    return this.journalEntries.delete(id);
  }

  // Breathing Exercises
  async getBreathingExercises(userId: string): Promise<BreathingExercise[]> {
    return Array.from(this.breathingExercises.values())
      .filter(exercise => exercise.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createBreathingExercise(exerciseData: InsertBreathingExercise & { userId: string }): Promise<BreathingExercise> {
    const id = randomUUID();
    const exercise: BreathingExercise = {
      ...exerciseData,
      id,
      holdCount: exerciseData.holdCount || null,
      pauseCount: exerciseData.pauseCount || null,
      completedAt: null,
      effectivenessRating: exerciseData.effectivenessRating || null,
      createdAt: new Date()
    };
    this.breathingExercises.set(id, exercise);
    return exercise;
  }

  async completeBreathingExercise(id: string, effectivenessRating: number): Promise<BreathingExercise | undefined> {
    const exercise = this.breathingExercises.get(id);
    if (exercise) {
      exercise.completedAt = new Date();
      exercise.effectivenessRating = effectivenessRating;
      this.breathingExercises.set(id, exercise);
    }
    return exercise;
  }
}

export const storage = new MemStorage();
