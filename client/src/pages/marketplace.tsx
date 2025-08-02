import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Star, 
  Heart,
  ShoppingCart,
  Package,
  Truck,
  CreditCard,
  Store,
  Tag,
  TrendingUp
} from "lucide-react";

interface Product {
  id: string;
  sellerId: string;
  categoryId: string;
  name: string;
  description: string;
  shortDescription: string | null;
  price: string;
  compareAtPrice: string | null;
  sku: string | null;
  images: string | null;
  tags: string | null;
  isDigital: boolean;
  downloadUrl: string | null;
  stockQuantity: number;
  isDropshipping: boolean;
  supplierInfo: string | null;
  shippingWeight: string | null;
  shippingDimensions: string | null;
  isActive: boolean;
  rating: string;
  reviewCount: number;
  salesCount: number;
  createdAt: Date;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  parentId: string | null;
  icon: string | null;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
}

interface Seller {
  id: string;
  userId: string;
  storeName: string;
  description: string | null;
  logo: string | null;
  banner: string | null;
  isVerified: boolean;
  rating: string;
  totalSales: number;
  commissionRate: string;
  paypalEmail: string | null;
  stripeAccountId: string | null;
  isActive: boolean;
  createdAt: Date;
}

function ProductCard({ product }: { product: Product }) {
  const images = product.images ? JSON.parse(product.images) : [];
  const tags = product.tags ? JSON.parse(product.tags) : [];
  const hasDiscount = product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass-morphism-enhanced border-white/20 overflow-hidden group cursor-pointer">
        <div className="relative h-48 overflow-hidden">
          {images.length > 0 ? (
            <img 
              src={images[0]} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-400/30 to-pink-500/30 flex items-center justify-center">
              <Package className="w-16 h-16 text-white/50" />
            </div>
          )}
          
          {hasDiscount && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-red-500 text-white">
                {Math.round((1 - parseFloat(product.price) / parseFloat(product.compareAtPrice!)) * 100)}% OFF
              </Badge>
            </div>
          )}
          
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
              <Heart className="w-4 h-4" />
            </Button>
          </div>
          
          {product.isDropshipping && (
            <div className="absolute bottom-2 left-2">
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                <Truck className="w-3 h-3 mr-1" />
                Fast Shipping
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-white line-clamp-2 mb-1">{product.name}</h3>
            <p className="text-sm text-white/70 line-clamp-2">{product.shortDescription || product.description}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-white">${product.price}</span>
              {hasDiscount && (
                <span className="text-sm text-white/50 line-through">${product.compareAtPrice}</span>
              )}
            </div>
            
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-white/70">{product.rating}</span>
              <span className="text-sm text-white/50">({product.reviewCount})</span>
            </div>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs bg-white/10 text-white border-white/20">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-white/50">{product.salesCount} sold</span>
            <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <ShoppingCart className="w-4 h-4 mr-1" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CategoryFilter({ categories, selectedCategory, onCategoryChange }: {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedCategory === "" ? "default" : "outline"}
        size="sm"
        onClick={() => onCategoryChange("")}
        className={selectedCategory === "" ? 
          "bg-gradient-to-r from-purple-500 to-pink-500" : 
          "border-white/20 text-white hover:bg-white/10"
        }
      >
        All Categories
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.id)}
          className={selectedCategory === category.id ? 
            "bg-gradient-to-r from-purple-500 to-pink-500" : 
            "border-white/20 text-white hover:bg-white/10"
          }
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products', selectedCategory, searchQuery],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('categoryId', selectedCategory);
      if (searchQuery) return fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}&limit=50`).then(res => res.json());
      return fetch(`/api/products?${params.toString()}&limit=50`).then(res => res.json());
    }
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    queryFn: () => fetch('/api/categories').then(res => res.json())
  });

  const { data: sellers = [] } = useQuery<Seller[]>({
    queryKey: ['/api/sellers'],
    queryFn: () => fetch('/api/sellers?limit=20').then(res => res.json())
  });

  const filteredProducts = products
    .filter(product => {
      const price = parseFloat(product.price);
      const minPrice = priceRange.min ? parseFloat(priceRange.min) : 0;
      const maxPrice = priceRange.max ? parseFloat(priceRange.max) : Infinity;
      return price >= minPrice && price <= maxPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-high":
          return parseFloat(b.price) - parseFloat(a.price);
        case "rating":
          return parseFloat(b.rating) - parseFloat(a.rating);
        case "sales":
          return b.salesCount - a.salesCount;
        default: // newest
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 mr-3 text-purple-400" />
            Healing Marketplace
          </h1>
          <p className="text-lg text-white/70">Discover products that support your wellness journey</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-8 space-y-6"
        >
          <Card className="glass-morphism-enhanced border-white/20">
            <CardContent className="p-6 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                <Input
                  placeholder="Search for healing products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 glass-morphism border-white/30 text-white placeholder:text-white/50"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-sm text-white/70 mb-2 block">Categories</label>
                <CategoryFilter 
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Sort by</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="glass-morphism border-white/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="sales">Best Selling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-white/70 mb-2 block">Min Price</label>
                  <Input
                    type="number"
                    placeholder="$0"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="glass-morphism border-white/30 text-white placeholder:text-white/50"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/70 mb-2 block">Max Price</label>
                  <Input
                    type="number"
                    placeholder="$1000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="glass-morphism border-white/30 text-white placeholder:text-white/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Featured Sellers */}
        {sellers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Featured Sellers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sellers.slice(0, 4).map((seller) => (
                <Card key={seller.id} className="glass-morphism-enhanced border-white/20 cursor-pointer hover:border-purple-400/50 transition-colors">
                  <CardContent className="p-4 text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                      <Store className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-white mb-1">{seller.storeName}</h3>
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-white/70">{seller.rating}</span>
                    </div>
                    <p className="text-xs text-white/50">{seller.totalSales} sales</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Products {searchQuery && `for "${searchQuery}"`}
            </h2>
            <p className="text-white/70">{filteredProducts.length} products found</p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card className="glass-morphism-enhanced border-white/20">
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                <p className="text-white/70 mb-4">Try adjusting your search or filters</p>
                <Button 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("");
                    setPriceRange({ min: "", max: "" });
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}