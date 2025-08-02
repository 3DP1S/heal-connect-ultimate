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
