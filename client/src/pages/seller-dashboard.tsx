import { useQuery, useState } from 'react'; import { Card, CardHeader, CardTitle, CardDescription, CardContent, Tabs, TabsList, TabsTrigger, TabsContent, Badge } from '@/components/ui';
import { useQuery, useState } from 'react'; import { Card, CardHeader, CardTitle, CardDescription, CardContent, Tabs, TabsList, TabsTrigger, TabsContent, Badge } from '@/components/ui';
import { useQuery, useState } from 'react'; import { Card, CardHeader, CardTitle, CardDescription, CardContent, Tabs, TabsList, TabsTrigger, TabsContent, Badge } from '@/components/ui';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Store, 
  Plus, 
  Edit, 
  Trash2,
  Package,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Star,
  BarChart3,
  Settings,
  Eye,
  Upload
} from "lucide-react";

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

function StatsCard({ icon: Icon, label, value, change, color }: {
  icon: any;
  label: string;
  value: string | number;
  change?: string;
  color: string;
}) {
  return (
    <Card className="glass-morphism-enhanced border-white/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/70 mb-1">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {change && (
              <p className={`text-sm flex items-center mt-1 ${color}`}>
                <TrendingUp className="w-4 h-4 mr-1" />
                {change}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg bg-gradient-to-br ${color.includes('red') ? 'from-red-400/20 to-red-600/20' : 'from-green-400/20 to-green-600/20'}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductCard({ product, onEdit, onDelete }: {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}) {
  const images = product.images ? JSON.parse(product.images) : [];
  
  return (
    <Card className="glass-morphism-enhanced border-white/20">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            {images.length > 0 ? (
              <img src={images[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-400/30 to-pink-500/30 flex items-center justify-center">
                <Package className="w-8 h-8 text-white/50" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-white truncate">{product.name}</h3>
                <p className="text-sm text-white/70 line-clamp-2">{product.shortDescription}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-lg font-bold text-white">${product.price}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-white/70">{product.rating}</span>
                  </div>
                  <span className="text-sm text-white/50">{product.salesCount} sold</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant={product.isActive ? "default" : "secondary"}>
                  {product.isActive ? "Active" : "Inactive"}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(product)}
                  className="text-white hover:bg-white/10"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(product.id)}
                  className="text-red-400 hover:bg-red-400/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductForm({ product, categories, onSubmit, onCancel }: {
  product?: Product;
  categories: Category[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    shortDescription: product?.shortDescription || "",
    price: product?.price || "",
    compareAtPrice: product?.compareAtPrice || "",
    categoryId: product?.categoryId || "",
    tags: product?.tags ? JSON.parse(product.tags).join(", ") : "",
    isDigital: product?.isDigital || false,
    stockQuantity: product?.stockQuantity || 0,
    isDropshipping: product?.isDropshipping || true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags ? JSON.stringify(formData.tags.split(",").map((tag: string) => tag.trim())) : null,
      price: parseFloat(formData.price),
      compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null
    });
  };

  return (
    <Card className="glass-morphism-enhanced border-white/20">
      <CardHeader>
        <CardTitle className="text-white">
          {product ? "Edit Product" : "Add New Product"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/70 mb-2 block">Product Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="glass-morphism border-white/30 text-white"
                required
              />
            </div>
            
            <div>
              <label className="text-sm text-white/70 mb-2 block">Category</label>
              <Select value={formData.categoryId} onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}>
                <SelectTrigger className="glass-morphism border-white/30 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm text-white/70 mb-2 block">Short Description</label>
            <Input
              value={formData.shortDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
              className="glass-morphism border-white/30 text-white"
              placeholder="Brief product summary..."
            />
          </div>

          <div>
            <label className="text-sm text-white/70 mb-2 block">Full Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="glass-morphism border-white/30 text-white"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-white/70 mb-2 block">Price ($)</label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="glass-morphism border-white/30 text-white"
                required
              />
            </div>
            
            <div>
              <label className="text-sm text-white/70 mb-2 block">Compare At Price ($)</label>
              <Input
                type="number"
                step="0.01"
                value={formData.compareAtPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, compareAtPrice: e.target.value }))}
                className="glass-morphism border-white/30 text-white"
                placeholder="Original price"
              />
            </div>
            
            <div>
              <label className="text-sm text-white/70 mb-2 block">Stock Quantity</label>
              <Input
                type="number"
                value={formData.stockQuantity}
                onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: parseInt(e.target.value) || 0 }))}
                className="glass-morphism border-white/30 text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-white/70 mb-2 block">Tags (comma separated)</label>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              className="glass-morphism border-white/30 text-white"
              placeholder="healing, wellness, natural..."
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-white/70">
                <input
                  type="checkbox"
                  checked={formData.isDigital}
                  onChange={(e) => setFormData(prev => ({ ...prev, isDigital: e.target.checked }))}
                  className="rounded"
                />
                <span>Digital Product</span>
              </label>
              
              <label className="flex items-center space-x-2 text-white/70">
                <input
                  type="checkbox"
                  checked={formData.isDropshipping}
                  onChange={(e) => setFormData(prev => ({ ...prev, isDropshipping: e.target.checked }))}
                  className="rounded"
                />
                <span>Dropshipping</span>
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                {product ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function SellerDashboardPage() {
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: seller } = useQuery<Seller>({
    queryKey: ['/api/sellers/me', 'user-1'],
    queryFn: () => fetch('/api/sellers/me?userId=user-1').then(res => res.json())
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products', seller?.id],
    queryFn: () => seller ? fetch(`/api/products?sellerId=${seller.id}&limit=100`).then(res => res.json()) : [],
    enabled: !!seller
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    queryFn: () => fetch('/api/categories').then(res => res.json())
  });

  const createSellerMutation = useMutation({
    mutationFn: async (sellerData: any) => {
      const response = await fetch('/api/sellers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sellerData)
      });
      if (!response.ok) throw new Error('Failed to create seller');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sellers/me'] });
      toast({ title: "Store created!", description: "Welcome to the marketplace!" });
    }
  });

  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...productData, sellerId: seller?.id })
      });
      if (!response.ok) throw new Error('Failed to create product');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({ title: "Product created!", description: "Your product is now live." });
      setShowProductForm(false);
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update product');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({ title: "Product updated!", description: "Changes saved successfully." });
      setEditingProduct(null);
      setShowProductForm(false);
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete product');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({ title: "Product deleted", description: "Product removed from marketplace." });
    }
  });

  const handleCreateSeller = () => {
    createSellerMutation.mutate({
      userId: 'user-1',
      storeName: "My Healing Store",
      description: "Sharing wellness products that inspire healing and growth."
    });
  };

  const handleProductSubmit = (data: any) => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, ...data });
    } else {
      createProductMutation.mutate({ ...data, categoryId: data.categoryId });
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(productId);
    }
  };

  if (!seller) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
        <Card className="glass-morphism-enhanced border-white/20 w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Store className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Start Selling</h2>
            <p className="text-white/70 mb-6">Create your healing marketplace store and start sharing products that make a difference.</p>
            <Button 
              onClick={handleCreateSeller}
              disabled={createSellerMutation.isPending}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {createSellerMutation.isPending ? "Creating..." : "Create My Store"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalRevenue = products.reduce((sum, product) => sum + (parseFloat(product.price) * product.salesCount), 0);
  const avgRating = products.length > 0 ? products.reduce((sum, product) => sum + parseFloat(product.rating), 0) / products.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Seller Dashboard</h1>
          <p className="text-lg text-white/70">Manage your {seller.storeName} store</p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8">
          {["overview", "products", "analytics"].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "ghost"}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? 
                "bg-gradient-to-r from-purple-500 to-pink-500" : 
                "text-white hover:bg-white/10"
              }
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>

        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                icon={DollarSign}
                label="Total Revenue"
                value={`$${totalRevenue.toFixed(2)}`}
                change="+12.5%"
                color="text-green-400"
              />
              <StatsCard
                icon={Package}
                label="Products"
                value={products.length}
                change="+3 this month"
                color="text-blue-400"
              />
              <StatsCard
                icon={ShoppingCart}
                label="Total Sales"
                value={products.reduce((sum, product) => sum + product.salesCount, 0)}
                change="+8.2%"
                color="text-purple-400"
              />
              <StatsCard
                icon={Star}
                label="Avg Rating"
                value={avgRating.toFixed(1)}
                change="⭐⭐⭐⭐⭐"
                color="text-yellow-400"
              />
            </div>

            {/* Quick Actions */}
            <Card className="glass-morphism-enhanced border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => setShowProductForm(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Settings className="w-4 h-4 mr-2" />
                    Store Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === "products" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">My Products</h2>
              <Button
                onClick={() => {
                  setEditingProduct(null);
                  setShowProductForm(true);
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            {showProductForm && (
              <ProductForm
                product={editingProduct || undefined}
                categories={categories}
                onSubmit={handleProductSubmit}
                onCancel={() => {
                  setShowProductForm(false);
                  setEditingProduct(null);
                }}
              />
            )}

            <div className="space-y-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "analytics" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="glass-morphism-enhanced border-white/20">
              <CardContent className="p-12 text-center">
                <BarChart3 className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Analytics Coming Soon</h3>
                <p className="text-white/70">Detailed sales analytics and insights will be available here.</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}


