import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertMeditationSessionSchema,
  insertStressLogSchema,
  insertJournalEntrySchema,
  insertBreathingExerciseSchema,
  insertSellerSchema,
  insertCategorySchema,
  insertProductSchema,
  insertOrderSchema,
  insertCreatorSchema,
  insertVideoCategorySchema,
  insertVideoSchema
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

  // MARKETPLACE API ROUTES
  
  // Sellers
  app.get("/api/sellers", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const sellers = await storage.getAllSellers(limit);
      res.json(sellers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sellers" });
    }
  });

  app.get("/api/sellers/me", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const seller = await storage.getSeller(userId);
      res.json(seller);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch seller profile" });
    }
  });

  app.post("/api/sellers", async (req, res) => {
    try {
      const sellerData = insertSellerSchema.parse(req.body);
      const userId = req.body.userId;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const seller = await storage.createSeller({ ...sellerData, userId });
      res.status(201).json(seller);
    } catch (error) {
      res.status(400).json({ message: "Invalid seller data" });
    }
  });

  app.patch("/api/sellers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const seller = await storage.updateSeller(id, updates);
      if (!seller) {
        return res.status(404).json({ message: "Seller not found" });
      }
      res.json(seller);
    } catch (error) {
      res.status(500).json({ message: "Failed to update seller" });
    }
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid category data" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const sellerId = req.query.sellerId as string;
      const categoryId = req.query.categoryId as string;
      const limit = parseInt(req.query.limit as string) || 50;
      const products = await storage.getProducts(sellerId, categoryId, limit);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      const limit = parseInt(req.query.limit as string) || 20;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const products = await storage.searchProducts(query, limit);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to search products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const { sellerId, categoryId } = req.body;
      if (!sellerId || !categoryId) {
        return res.status(400).json({ message: "Seller ID and Category ID are required" });
      }
      const product = await storage.createProduct({ ...productData, sellerId, categoryId });
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.patch("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const product = await storage.updateProduct(id, updates);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Orders
  app.get("/api/orders", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const limit = parseInt(req.query.limit as string) || 50;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const orders = await storage.getOrders(userId, limit);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/sellers/:sellerId/orders", async (req, res) => {
    try {
      const { sellerId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const orders = await storage.getSellerOrders(sellerId, limit);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch seller orders" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const userId = req.body.userId;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const order = await storage.createOrder({ ...orderData, userId });
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      const order = await storage.updateOrderStatus(id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // VIDEO PLATFORM API ROUTES
  
  // Creators
  app.get("/api/creators", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const creators = await storage.getAllCreators(limit);
      res.json(creators);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch creators" });
    }
  });

  app.get("/api/creators/me", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const creator = await storage.getCreator(userId);
      res.json(creator);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch creator profile" });
    }
  });

  app.post("/api/creators", async (req, res) => {
    try {
      const creatorData = insertCreatorSchema.parse(req.body);
      const userId = req.body.userId;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const creator = await storage.createCreator({ ...creatorData, userId });
      res.status(201).json(creator);
    } catch (error) {
      res.status(400).json({ message: "Invalid creator data" });
    }
  });

  app.patch("/api/creators/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const creator = await storage.updateCreator(id, updates);
      if (!creator) {
        return res.status(404).json({ message: "Creator not found" });
      }
      res.json(creator);
    } catch (error) {
      res.status(500).json({ message: "Failed to update creator" });
    }
  });

  // Video Categories
  app.get("/api/video-categories", async (req, res) => {
    try {
      const categories = await storage.getVideoCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch video categories" });
    }
  });

  app.post("/api/video-categories", async (req, res) => {
    try {
      const categoryData = insertVideoCategorySchema.parse(req.body);
      const category = await storage.createVideoCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid video category data" });
    }
  });

  // Videos
  app.get("/api/videos", async (req, res) => {
    try {
      const creatorId = req.query.creatorId as string;
      const categoryId = req.query.categoryId as string;
      const limit = parseInt(req.query.limit as string) || 50;
      const videos = await storage.getVideos(creatorId, categoryId, limit);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  app.get("/api/videos/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      const limit = parseInt(req.query.limit as string) || 20;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const videos = await storage.searchVideos(query, limit);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to search videos" });
    }
  });

  app.get("/api/videos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const video = await storage.getVideo(id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch video" });
    }
  });

  app.post("/api/videos", async (req, res) => {
    try {
      const videoData = insertVideoSchema.parse(req.body);
      const { creatorId, categoryId } = req.body;
      if (!creatorId || !categoryId) {
        return res.status(400).json({ message: "Creator ID and Category ID are required" });
      }
      const video = await storage.createVideo({ ...videoData, creatorId, categoryId });
      res.status(201).json(video);
    } catch (error) {
      res.status(400).json({ message: "Invalid video data" });
    }
  });

  app.patch("/api/videos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const video = await storage.updateVideo(id, updates);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: "Failed to update video" });
    }
  });

  app.delete("/api/videos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteVideo(id);
      if (!deleted) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete video" });
    }
  });

  app.post("/api/videos/:id/view", async (req, res) => {
    try {
      const { id } = req.params;
      const { userId, viewDuration, deviceType, country } = req.body;
      
      // Increment video view count
      const video = await storage.incrementVideoViews(id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      // Create view record for analytics
      const viewRecord = await storage.createVideoView({
        videoId: id,
        userId: userId || null,
        viewDuration: viewDuration || 0,
        isCompleted: viewDuration >= (video.duration * 0.8), // 80% completion
        deviceType: deviceType || null,
        country: country || null,
        referrerSource: req.headers.referer ? "external" : "direct",
        adRevenue: "0.0000"
      });
      
      res.json({ success: true, viewCount: video.viewCount });
    } catch (error) {
      res.status(500).json({ message: "Failed to record video view" });
    }
  });

  // Analytics
  app.get("/api/videos/:id/analytics", async (req, res) => {
    try {
      const { id } = req.params;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      
      const analytics = await storage.getVideoAnalytics(id, startDate, endDate);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch video analytics" });
    }
  });

  // Monetization
  app.get("/api/creators/:creatorId/monetization", async (req, res) => {
    try {
      const { creatorId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const records = await storage.getMonetizationRecords(creatorId, limit);
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch monetization records" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
