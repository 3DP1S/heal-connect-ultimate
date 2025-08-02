import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'meditation', 'therapy', 'wellness', etc.
  status: text("status").notNull().default("active"), // 'active', 'testing', 'deployed', 'archived'
  userId: varchar("user_id").references(() => users.id).notNull(),
  data: text("data"), // JSON string for project configuration
  lastModified: timestamp("last_modified").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const collaborations = pgTable("collaborations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  role: text("role").notNull().default("contributor"), // 'owner', 'collaborator', 'viewer'
  createdAt: timestamp("created_at").defaultNow(),
});

export const simulations = pgTable("simulations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'quantum_healing', '3d_environment', 'biofeedback'
  config: text("config"), // JSON string for simulation settings
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const deployments = pgTable("deployments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  version: text("version").notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'deployed', 'failed'
  url: text("url"),
  deployedAt: timestamp("deployed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const meditationSessions = pgTable("meditation_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  duration: integer("duration").notNull(), // duration in minutes
  type: text("type").notNull(), // 'guided', 'silent', 'breathing', 'body_scan'
  backgroundSound: text("background_sound"), // 'ocean', 'forest', 'rain', 'silence'
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const stressLogs = pgTable("stress_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  stressLevel: integer("stress_level").notNull(), // 1-10 scale
  mood: text("mood").notNull(), // 'anxious', 'calm', 'overwhelmed', 'peaceful', etc.
  triggers: text("triggers"), // JSON array of trigger categories
  notes: text("notes"),
  exerciseCompleted: text("exercise_completed"), // type of calming exercise done
  createdAt: timestamp("created_at").defaultNow(),
});

export const journalEntries = pgTable("journal_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title"),
  content: text("content").notNull(), // encrypted content
  prompt: text("prompt"), // daily healing prompt used
  mood: text("mood"), // mood when writing
  isPrivate: boolean("is_private").default(true),
  tags: text("tags"), // JSON array of tags
  createdAt: timestamp("created_at").defaultNow(),
});

export const breathingExercises = pgTable("breathing_exercises", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  pattern: text("pattern").notNull(), // '4-7-8', '4-4-4-4', 'custom'
  inhaleCount: integer("inhale_count").notNull(),
  holdCount: integer("hold_count"),
  exhaleCount: integer("exhale_count").notNull(),
  pauseCount: integer("pause_count"),
  duration: integer("duration").notNull(), // total duration in minutes
  completedAt: timestamp("completed_at"),
  effectivenessRating: integer("effectiveness_rating"), // 1-5 scale
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  description: true,
  type: true,
  status: true,
  data: true,
});

export const insertCollaborationSchema = createInsertSchema(collaborations).pick({
  projectId: true,
  userId: true,
  role: true,
});

export const insertSimulationSchema = createInsertSchema(simulations).pick({
  projectId: true,
  name: true,
  type: true,
  config: true,
  isActive: true,
});

export const insertDeploymentSchema = createInsertSchema(deployments).pick({
  projectId: true,
  version: true,
  status: true,
  url: true,
});

export const insertMeditationSessionSchema = createInsertSchema(meditationSessions).pick({
  name: true,
  duration: true,
  type: true,
  backgroundSound: true,
  notes: true,
});

export const insertStressLogSchema = createInsertSchema(stressLogs).pick({
  stressLevel: true,
  mood: true,
  triggers: true,
  notes: true,
  exerciseCompleted: true,
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).pick({
  title: true,
  content: true,
  prompt: true,
  mood: true,
  isPrivate: true,
  tags: true,
});

export const insertBreathingExerciseSchema = createInsertSchema(breathingExercises).pick({
  name: true,
  pattern: true,
  inhaleCount: true,
  holdCount: true,
  exhaleCount: true,
  pauseCount: true,
  duration: true,
  effectivenessRating: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertCollaboration = z.infer<typeof insertCollaborationSchema>;
export type Collaboration = typeof collaborations.$inferSelect;

export type InsertSimulation = z.infer<typeof insertSimulationSchema>;
export type Simulation = typeof simulations.$inferSelect;

export type InsertDeployment = z.infer<typeof insertDeploymentSchema>;
export type Deployment = typeof deployments.$inferSelect;

export type InsertMeditationSession = z.infer<typeof insertMeditationSessionSchema>;
export type MeditationSession = typeof meditationSessions.$inferSelect;

export type InsertStressLog = z.infer<typeof insertStressLogSchema>;
export type StressLog = typeof stressLogs.$inferSelect;

export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;

export type InsertBreathingExercise = z.infer<typeof insertBreathingExerciseSchema>;
export type BreathingExercise = typeof breathingExercises.$inferSelect;
