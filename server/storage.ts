import { 
  type User, type InsertUser,
  type MeditationSession, type InsertMeditationSession,
  type StressLog, type InsertStressLog,
  type JournalEntry, type InsertJournalEntry,
  type BreathingExercise, type InsertBreathingExercise,
  type Seller, type InsertSeller,
  type Category, type InsertCategory,
  type Product, type InsertProduct,
  type Order, type InsertOrder,
  type Payment,
  type Creator, type InsertCreator,
  type VideoCategory, type InsertVideoCategory,
  type Video, type InsertVideo,
  type VideoView, type MonetizationRecord
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
  
  // MARKETPLACE OPERATIONS
  // Sellers
  getSeller(userId: string): Promise<Seller | undefined>;
  createSeller(seller: InsertSeller & { userId: string }): Promise<Seller>;
  updateSeller(id: string, updates: Partial<InsertSeller>): Promise<Seller | undefined>;
  getAllSellers(limit?: number): Promise<Seller[]>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, updates: Partial<InsertCategory>): Promise<Category | undefined>;
  
  // Products
  getProducts(sellerId?: string, categoryId?: string, limit?: number): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct & { sellerId: string; categoryId: string }): Promise<Product>;
  updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  searchProducts(query: string, limit?: number): Promise<Product[]>;
  
  // Orders
  getOrders(userId: string, limit?: number): Promise<Order[]>;
  getSellerOrders(sellerId: string, limit?: number): Promise<Order[]>;
  createOrder(order: InsertOrder & { userId: string }): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  
  // Payments
  getPayments(sellerId: string, limit?: number): Promise<Payment[]>;
  createPayment(payment: Omit<Payment, 'id' | 'createdAt'>): Promise<Payment>;
  
  // VIDEO PLATFORM OPERATIONS
  // Creators
  getCreator(userId: string): Promise<Creator | undefined>;
  createCreator(creator: InsertCreator & { userId: string }): Promise<Creator>;
  updateCreator(id: string, updates: Partial<InsertCreator>): Promise<Creator | undefined>;
  getAllCreators(limit?: number): Promise<Creator[]>;
  
  // Video Categories
  getVideoCategories(): Promise<VideoCategory[]>;
  createVideoCategory(category: InsertVideoCategory): Promise<VideoCategory>;
  
  // Videos
  getVideos(creatorId?: string, categoryId?: string, limit?: number): Promise<Video[]>;
  getVideo(id: string): Promise<Video | undefined>;
  createVideo(video: InsertVideo & { creatorId: string; categoryId: string }): Promise<Video>;
  updateVideo(id: string, updates: Partial<InsertVideo>): Promise<Video | undefined>;
  deleteVideo(id: string): Promise<boolean>;
  searchVideos(query: string, limit?: number): Promise<Video[]>;
  incrementVideoViews(id: string): Promise<Video | undefined>;
  
  // Video Views
  createVideoView(view: Omit<VideoView, 'id' | 'createdAt'>): Promise<VideoView>;
  getVideoAnalytics(videoId: string, startDate?: Date, endDate?: Date): Promise<VideoView[]>;
  
  // Monetization
  getMonetizationRecords(creatorId: string, limit?: number): Promise<MonetizationRecord[]>;
  createMonetizationRecord(record: Omit<MonetizationRecord, 'id' | 'createdAt'>): Promise<MonetizationRecord>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private meditationSessions: Map<string, MeditationSession>;
  private stressLogs: Map<string, StressLog>;
  private journalEntries: Map<string, JournalEntry>;
  private breathingExercises: Map<string, BreathingExercise>;
  
  // Marketplace storage
  private sellers: Map<string, Seller>;
  private categories: Map<string, Category>;
  private products: Map<string, Product>;
  private orders: Map<string, Order>;
  private payments: Map<string, Payment>;
  
  // Video platform storage
  private creators: Map<string, Creator>;
  private videoCategories: Map<string, VideoCategory>;
  private videos: Map<string, Video>;
  private videoViews: Map<string, VideoView>;
  private monetizationRecords: Map<string, MonetizationRecord>;

  constructor() {
    this.users = new Map();
    this.meditationSessions = new Map();
    this.stressLogs = new Map();
    this.journalEntries = new Map();
    this.breathingExercises = new Map();
    
    // Initialize marketplace storage
    this.sellers = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.payments = new Map();
    
    // Initialize video platform storage
    this.creators = new Map();
    this.videoCategories = new Map();
    this.videos = new Map();
    this.videoViews = new Map();
    this.monetizationRecords = new Map();
    
    // Seed some default categories
    this.seedDefaultData();
  }
  
  private seedDefaultData() {
    // Default marketplace categories
    const healingCategory: Category = {
      id: randomUUID(),
      name: "Healing & Wellness",
      description: "Products for physical and mental wellness",
      parentId: null,
      icon: "Heart",
      image: null,
      isActive: true,
      sortOrder: 1,
      createdAt: new Date()
    };
    this.categories.set(healingCategory.id, healingCategory);
    
    // Default video categories
    const meditationVideoCategory: VideoCategory = {
      id: randomUUID(),
      name: "Guided Meditation",
      description: "Meditation and mindfulness videos",
      icon: "Brain",
      color: "#8B5CF6",
      isActive: true,
      sortOrder: 1,
      createdAt: new Date()
    };
    this.videoCategories.set(meditationVideoCategory.id, meditationVideoCategory);
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

  // MARKETPLACE OPERATIONS
  // Sellers
  async getSeller(userId: string): Promise<Seller | undefined> {
    return Array.from(this.sellers.values()).find(seller => seller.userId === userId);
  }

  async createSeller(sellerData: InsertSeller & { userId: string }): Promise<Seller> {
    const id = randomUUID();
    const seller: Seller = {
      ...sellerData,
      id,
      logo: sellerData.logo || null,
      banner: sellerData.banner || null,
      isVerified: false,
      rating: "0.00",
      totalSales: 0,
      commissionRate: "0.1500",
      paypalEmail: sellerData.paypalEmail || null,
      stripeAccountId: sellerData.stripeAccountId || null,
      isActive: true,
      createdAt: new Date()
    };
    this.sellers.set(id, seller);
    return seller;
  }

  async updateSeller(id: string, updates: Partial<InsertSeller>): Promise<Seller | undefined> {
    const seller = this.sellers.get(id);
    if (seller) {
      Object.assign(seller, updates);
      this.sellers.set(id, seller);
    }
    return seller;
  }

  async getAllSellers(limit = 50): Promise<Seller[]> {
    return Array.from(this.sellers.values())
      .filter(seller => seller.isActive)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values())
      .filter(category => category.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = {
      ...categoryData,
      id,
      description: categoryData.description || null,
      parentId: categoryData.parentId || null,
      icon: categoryData.icon || null,
      image: categoryData.image || null,
      isActive: true,
      sortOrder: categoryData.sortOrder || 0,
      createdAt: new Date()
    };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: string, updates: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (category) {
      Object.assign(category, updates);
      this.categories.set(id, category);
    }
    return category;
  }

  // Products
  async getProducts(sellerId?: string, categoryId?: string, limit = 50): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(product => {
        if (!product.isActive) return false;
        if (sellerId && product.sellerId !== sellerId) return false;
        if (categoryId && product.categoryId !== categoryId) return false;
        return true;
      })
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(productData: InsertProduct & { sellerId: string; categoryId: string }): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      ...productData,
      id,
      shortDescription: productData.shortDescription || null,
      compareAtPrice: productData.compareAtPrice || null,
      sku: productData.sku || null,
      images: productData.images || null,
      tags: productData.tags || null,
      isDigital: productData.isDigital || false,
      downloadUrl: productData.downloadUrl || null,
      stockQuantity: productData.stockQuantity || 0,
      isDropshipping: productData.isDropshipping || true,
      supplierInfo: productData.supplierInfo || null,
      shippingWeight: productData.shippingWeight || null,
      shippingDimensions: productData.shippingDimensions || null,
      isActive: true,
      rating: "0.00",
      reviewCount: 0,
      salesCount: 0,
      createdAt: new Date()
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (product) {
      Object.assign(product, updates);
      this.products.set(id, product);
    }
    return product;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async searchProducts(query: string, limit = 20): Promise<Product[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.products.values())
      .filter(product => 
        product.isActive && (
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          (product.tags && product.tags.toLowerCase().includes(searchTerm))
        )
      )
      .slice(0, limit);
  }

  // Orders
  async getOrders(userId: string, limit = 50): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async getSellerOrders(sellerId: string, limit = 50): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => {
        // Check if any order item belongs to this seller
        try {
          const items = JSON.parse(order.orderItems || '[]');
          return items.some((item: any) => item.sellerId === sellerId);
        } catch {
          return false;
        }
      })
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async createOrder(orderData: InsertOrder & { userId: string }): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...orderData,
      id,
      status: "pending",
      taxAmount: orderData.taxAmount || "0.00",
      shippingAmount: orderData.shippingAmount || "0.00",
      discountAmount: orderData.discountAmount || "0.00",
      paymentStatus: "pending",
      paymentMethod: orderData.paymentMethod || null,
      shippingAddress: orderData.shippingAddress || null,
      billingAddress: orderData.billingAddress || null,
      trackingNumber: null,
      notes: orderData.notes || null,
      completedAt: null,
      createdAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      order.status = status;
      if (status === "delivered") {
        order.completedAt = new Date();
      }
      this.orders.set(id, order);
    }
    return order;
  }

  // Payments
  async getPayments(sellerId: string, limit = 50): Promise<Payment[]> {
    return Array.from(this.payments.values())
      .filter(payment => payment.sellerId === sellerId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async createPayment(paymentData: Omit<Payment, 'id' | 'createdAt'>): Promise<Payment> {
    const id = randomUUID();
    const payment: Payment = {
      ...paymentData,
      id,
      createdAt: new Date()
    };
    this.payments.set(id, payment);
    return payment;
  }

  // VIDEO PLATFORM OPERATIONS
  // Creators
  async getCreator(userId: string): Promise<Creator | undefined> {
    return Array.from(this.creators.values()).find(creator => creator.userId === userId);
  }

  async createCreator(creatorData: InsertCreator & { userId: string }): Promise<Creator> {
    const id = randomUUID();
    const creator: Creator = {
      ...creatorData,
      id,
      description: creatorData.description || null,
      avatar: creatorData.avatar || null,
      banner: creatorData.banner || null,
      isVerified: false,
      subscriberCount: 0,
      totalViews: 0,
      totalVideos: 0,
      monetizationEnabled: false,
      revenueShareRate: "0.7000",
      paypalEmail: creatorData.paypalEmail || null,
      stripeAccountId: creatorData.stripeAccountId || null,
      socialLinks: creatorData.socialLinks || null,
      isActive: true,
      createdAt: new Date()
    };
    this.creators.set(id, creator);
    return creator;
  }

  async updateCreator(id: string, updates: Partial<InsertCreator>): Promise<Creator | undefined> {
    const creator = this.creators.get(id);
    if (creator) {
      Object.assign(creator, updates);
      this.creators.set(id, creator);
    }
    return creator;
  }

  async getAllCreators(limit = 50): Promise<Creator[]> {
    return Array.from(this.creators.values())
      .filter(creator => creator.isActive)
      .sort((a, b) => b.subscriberCount - a.subscriberCount)
      .slice(0, limit);
  }

  // Video Categories
  async getVideoCategories(): Promise<VideoCategory[]> {
    return Array.from(this.videoCategories.values())
      .filter(category => category.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async createVideoCategory(categoryData: InsertVideoCategory): Promise<VideoCategory> {
    const id = randomUUID();
    const category: VideoCategory = {
      ...categoryData,
      id,
      description: categoryData.description || null,
      icon: categoryData.icon || null,
      color: categoryData.color || null,
      isActive: true,
      sortOrder: categoryData.sortOrder || 0,
      createdAt: new Date()
    };
    this.videoCategories.set(id, category);
    return category;
  }

  // Videos
  async getVideos(creatorId?: string, categoryId?: string, limit = 50): Promise<Video[]> {
    return Array.from(this.videos.values())
      .filter(video => {
        if (video.status !== "active") return false;
        if (creatorId && video.creatorId !== creatorId) return false;
        if (categoryId && video.categoryId !== categoryId) return false;
        return true;
      })
      .sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0))
      .slice(0, limit);
  }

  async getVideo(id: string): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async createVideo(videoData: InsertVideo & { creatorId: string; categoryId: string }): Promise<Video> {
    const id = randomUUID();
    const video: Video = {
      ...videoData,
      id,
      description: videoData.description || null,
      tags: videoData.tags || null,
      isPublic: videoData.isPublic ?? true,
      isPremium: videoData.isPremium || false,
      premiumPrice: videoData.premiumPrice || null,
      viewCount: 0,
      likeCount: 0,
      dislikeCount: 0,
      commentCount: 0,
      shareCount: 0,
      monetizationEnabled: videoData.monetizationEnabled || false,
      adRevenue: "0.00",
      premiumRevenue: "0.00",
      status: "processing",
      publishedAt: new Date(),
      createdAt: new Date()
    };
    this.videos.set(id, video);
    return video;
  }

  async updateVideo(id: string, updates: Partial<InsertVideo>): Promise<Video | undefined> {
    const video = this.videos.get(id);
    if (video) {
      Object.assign(video, updates);
      this.videos.set(id, video);
    }
    return video;
  }

  async deleteVideo(id: string): Promise<boolean> {
    return this.videos.delete(id);
  }

  async searchVideos(query: string, limit = 20): Promise<Video[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.videos.values())
      .filter(video => 
        video.status === "active" && video.isPublic && (
          video.title.toLowerCase().includes(searchTerm) ||
          (video.description && video.description.toLowerCase().includes(searchTerm)) ||
          (video.tags && video.tags.toLowerCase().includes(searchTerm))
        )
      )
      .slice(0, limit);
  }

  async incrementVideoViews(id: string): Promise<Video | undefined> {
    const video = this.videos.get(id);
    if (video) {
      video.viewCount++;
      this.videos.set(id, video);
    }
    return video;
  }

  // Video Views
  async createVideoView(viewData: Omit<VideoView, 'id' | 'createdAt'>): Promise<VideoView> {
    const id = randomUUID();
    const view: VideoView = {
      ...viewData,
      id,
      userId: viewData.userId || null,
      deviceType: viewData.deviceType || null,
      country: viewData.country || null,
      referrerSource: viewData.referrerSource || null,
      adRevenue: viewData.adRevenue || "0.0000",
      createdAt: new Date()
    };
    this.videoViews.set(id, view);
    return view;
  }

  async getVideoAnalytics(videoId: string, startDate?: Date, endDate?: Date): Promise<VideoView[]> {
    return Array.from(this.videoViews.values())
      .filter(view => {
        if (view.videoId !== videoId) return false;
        if (startDate && view.createdAt && view.createdAt < startDate) return false;
        if (endDate && view.createdAt && view.createdAt > endDate) return false;
        return true;
      })
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  // Monetization
  async getMonetizationRecords(creatorId: string, limit = 50): Promise<MonetizationRecord[]> {
    return Array.from(this.monetizationRecords.values())
      .filter(record => record.creatorId === creatorId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async createMonetizationRecord(recordData: Omit<MonetizationRecord, 'id' | 'createdAt'>): Promise<MonetizationRecord> {
    const id = randomUUID();
    const record: MonetizationRecord = {
      ...recordData,
      id,
      videoId: recordData.videoId || null,
      processedAt: null,
      payoutAt: null,
      metadata: recordData.metadata || null,
      createdAt: new Date()
    };
    this.monetizationRecords.set(id, record);
    return record;
  }
}

export const storage = new MemStorage();
