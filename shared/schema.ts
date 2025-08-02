import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, decimal } from "drizzle-orm/pg-core";
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

// MARKETPLACE INFRASTRUCTURE
export const sellers = pgTable("sellers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  storeName: text("store_name").notNull(),
  description: text("description"),
  logo: text("logo"), // URL to logo image
  banner: text("banner"), // URL to banner image
  isVerified: boolean("is_verified").default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  totalSales: integer("total_sales").default(0),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 4 }).default("0.1500"), // 15% default
  paypalEmail: text("paypal_email"),
  stripeAccountId: text("stripe_account_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  parentId: varchar("parent_id"),
  icon: text("icon"), // Lucide icon name
  image: text("image"), // Category image URL
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sellerId: varchar("seller_id").references(() => sellers.id).notNull(),
  categoryId: varchar("category_id").references(() => categories.id).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal("compare_at_price", { precision: 10, scale: 2 }),
  sku: text("sku").unique(),
  images: text("images"), // JSON array of image URLs
  tags: text("tags"), // JSON array of tags
  isDigital: boolean("is_digital").default(false),
  downloadUrl: text("download_url"), // For digital products
  stockQuantity: integer("stock_quantity").default(0),
  isDropshipping: boolean("is_dropshipping").default(true),
  supplierInfo: text("supplier_info"), // JSON with supplier details
  shippingWeight: decimal("shipping_weight", { precision: 8, scale: 2 }),
  shippingDimensions: text("shipping_dimensions"), // JSON: {length, width, height}
  isActive: boolean("is_active").default(true),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  reviewCount: integer("review_count").default(0),
  salesCount: integer("sales_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").notNull().default("pending"), // 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).default("0.00"),
  shippingAmount: decimal("shipping_amount", { precision: 10, scale: 2 }).default("0.00"),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).default("0.00"),
  paymentStatus: text("payment_status").notNull().default("pending"), // 'pending', 'paid', 'failed', 'refunded'
  paymentMethod: text("payment_method"), // 'stripe', 'paypal', 'crypto'
  shippingAddress: text("shipping_address"), // JSON object
  billingAddress: text("billing_address"), // JSON object
  orderItems: text("order_items"), // JSON array of items
  trackingNumber: text("tracking_number"),
  notes: text("notes"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id).notNull(),
  sellerId: varchar("seller_id").references(() => sellers.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }).notNull(),
  sellerPayout: decimal("seller_payout", { precision: 10, scale: 2 }).notNull(),
  paymentProcessor: text("payment_processor").notNull(), // 'stripe', 'paypal'
  processorTransactionId: text("processor_transaction_id"),
  status: text("status").notNull().default("pending"), // 'pending', 'completed', 'failed', 'refunded'
  processedAt: timestamp("processed_at"),
  payoutAt: timestamp("payout_at"),
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

// VIDEO PLATFORM INFRASTRUCTURE
export const creators = pgTable("creators", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  channelName: text("channel_name").notNull().unique(),
  description: text("description"),
  avatar: text("avatar"), // URL to avatar image
  banner: text("banner"), // URL to banner image
  isVerified: boolean("is_verified").default(false),
  subscriberCount: integer("subscriber_count").default(0),
  totalViews: integer("total_views").default(0),
  totalVideos: integer("total_videos").default(0),
  monetizationEnabled: boolean("monetization_enabled").default(false),
  revenueShareRate: decimal("revenue_share_rate", { precision: 5, scale: 4 }).default("0.7000"), // 70% to creator vs 30% platform
  paypalEmail: text("paypal_email"),
  stripeAccountId: text("stripe_account_id"),
  socialLinks: text("social_links"), // JSON object with social media links
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const videoCategories = pgTable("video_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  icon: text("icon"), // Lucide icon name
  color: text("color"), // Hex color for category
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const videos = pgTable("videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  creatorId: varchar("creator_id").references(() => creators.id).notNull(),
  categoryId: varchar("category_id").references(() => videoCategories.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  thumbnail: text("thumbnail").notNull(), // URL to thumbnail image
  videoUrl: text("video_url").notNull(), // URL to video file or stream
  duration: integer("duration").notNull(), // duration in seconds
  tags: text("tags"), // JSON array of tags
  isPublic: boolean("is_public").default(true),
  isPremium: boolean("is_premium").default(false),
  premiumPrice: decimal("premium_price", { precision: 8, scale: 2 }),
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  dislikeCount: integer("dislike_count").default(0),
  commentCount: integer("comment_count").default(0),
  shareCount: integer("share_count").default(0),
  monetizationEnabled: boolean("monetization_enabled").default(false),
  adRevenue: decimal("ad_revenue", { precision: 10, scale: 2 }).default("0.00"),
  premiumRevenue: decimal("premium_revenue", { precision: 10, scale: 2 }).default("0.00"),
  status: text("status").notNull().default("processing"), // 'processing', 'active', 'inactive', 'removed'
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const videoViews = pgTable("video_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  videoId: varchar("video_id").references(() => videos.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  viewDuration: integer("view_duration").notNull(), // seconds watched
  isCompleted: boolean("is_completed").default(false),
  deviceType: text("device_type"), // 'desktop', 'mobile', 'tablet'
  country: text("country"), // 2-letter country code
  referrerSource: text("referrer_source"), // 'search', 'suggested', 'direct', 'social'
  adRevenue: decimal("ad_revenue", { precision: 8, scale: 4 }).default("0.0000"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const monetizationRecords = pgTable("monetization_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  creatorId: varchar("creator_id").references(() => creators.id).notNull(),
  videoId: varchar("video_id").references(() => videos.id),
  type: text("type").notNull(), // 'ad_revenue', 'premium_sale', 'donation', 'subscription'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }).notNull(),
  creatorPayout: decimal("creator_payout", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'processed', 'paid'
  processedAt: timestamp("processed_at"),
  payoutAt: timestamp("payout_at"),
  metadata: text("metadata"), // JSON with additional context
  createdAt: timestamp("created_at").defaultNow(),
});

// MARKETPLACE INSERT SCHEMAS
export const insertSellerSchema = createInsertSchema(sellers).pick({
  storeName: true,
  description: true,
  logo: true,
  banner: true,
  paypalEmail: true,
  stripeAccountId: true,
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  description: true,
  parentId: true,
  icon: true,
  image: true,
  sortOrder: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  shortDescription: true,
  price: true,
  compareAtPrice: true,
  sku: true,
  images: true,
  tags: true,
  isDigital: true,
  downloadUrl: true,
  stockQuantity: true,
  isDropshipping: true,
  supplierInfo: true,
  shippingWeight: true,
  shippingDimensions: true,
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  orderNumber: true,
  totalAmount: true,
  taxAmount: true,
  shippingAmount: true,
  discountAmount: true,
  paymentMethod: true,
  shippingAddress: true,
  billingAddress: true,
  orderItems: true,
  notes: true,
});

// VIDEO PLATFORM INSERT SCHEMAS
export const insertCreatorSchema = createInsertSchema(creators).pick({
  channelName: true,
  description: true,
  avatar: true,
  banner: true,
  paypalEmail: true,
  stripeAccountId: true,
  socialLinks: true,
});

export const insertVideoCategorySchema = createInsertSchema(videoCategories).pick({
  name: true,
  description: true,
  icon: true,
  color: true,
  sortOrder: true,
});

export const insertVideoSchema = createInsertSchema(videos).pick({
  title: true,
  description: true,
  thumbnail: true,
  videoUrl: true,
  duration: true,
  tags: true,
  isPublic: true,
  isPremium: true,
  premiumPrice: true,
  monetizationEnabled: true,
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

// MARKETPLACE TYPES
export type InsertSeller = z.infer<typeof insertSellerSchema>;
export type Seller = typeof sellers.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type Payment = typeof payments.$inferSelect;

// VIDEO PLATFORM TYPES
export type InsertCreator = z.infer<typeof insertCreatorSchema>;
export type Creator = typeof creators.$inferSelect;

export type InsertVideoCategory = z.infer<typeof insertVideoCategorySchema>;
export type VideoCategory = typeof videoCategories.$inferSelect;

export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;

export type VideoView = typeof videoViews.$inferSelect;
export type MonetizationRecord = typeof monetizationRecords.$inferSelect;
