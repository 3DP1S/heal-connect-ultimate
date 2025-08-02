import { useState } from "react";
import { Heart, Palette, Box, Brain, Users, Leaf, Rocket, User, Flower2, Focus, BookOpen, Wind, ShoppingBag, Store, Video, Camera } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";

const sidebarItems = [
  {
    id: 'visual-editor',
    icon: Palette,
    title: 'Visual Editor',
    description: 'Design healing interfaces',
    color: 'from-blue-500 to-purple-500',
    path: '/'
  },
  {
    id: 'meditation',
    icon: Flower2,
    title: 'Guided Meditation',
    description: 'Mindfulness & breathing exercises',
    color: 'from-green-500 to-emerald-500',
    path: '/meditation'
  },
  {
    id: 'stress-tracker',
    icon: Focus,
    title: 'Stress Relief',
    description: 'Anxiety tracking & mood logging',
    color: 'from-cyan-500 to-blue-500',
    path: '/stress-tracker'
  },
  {
    id: 'journal',
    icon: BookOpen,
    title: 'Mindful Journal',
    description: 'Daily reflections & prompts',
    color: 'from-purple-500 to-indigo-500',
    path: '/journal'
  },
  {
    id: 'breathing',
    icon: Wind,
    title: 'Breathing Exercises',
    description: 'Guided breathing patterns',
    color: 'from-teal-500 to-cyan-500',
    path: '/breathing'
  },
  {
    id: 'marketplace',
    icon: ShoppingBag,
    title: 'Healing Marketplace',
    description: 'Discover wellness products',
    color: 'from-purple-500 to-pink-500',
    path: '/marketplace'
  },
  {
    id: 'seller-dashboard',
    icon: Store,
    title: 'Seller Dashboard',
    description: 'Manage your storefront',
    color: 'from-emerald-500 to-teal-500',
    path: '/seller-dashboard'
  },
  {
    id: 'video-platform',
    icon: Video,
    title: 'Video Platform',
    description: 'Healing content & creators',
    color: 'from-red-500 to-pink-500',
    path: '/video-platform'
  },
  {
    id: 'creator-dashboard',
    icon: Camera,
    title: 'Creator Studio',
    description: 'Upload & manage videos',
    color: 'from-orange-500 to-red-500',
    path: '/creator-dashboard'
  },
  {
    id: '3d-generator',
    icon: Box,
    title: '3D Generator',
    description: 'Create immersive environments',
    color: 'from-indigo-500 to-purple-500',
    path: '/3d-generator'
  },
  {
    id: 'quantum-healing',
    icon: Brain,
    title: 'Quantum Healing Simulator',
    description: 'Advanced therapeutic tools',
    color: 'from-purple-500 to-pink-500',
    path: '/quantum-healing'
  },
  {
    id: 'ai-collaboration',
    icon: Users,
    title: 'AI Collaboration',
    description: 'Multi-agent development',
    color: 'from-pink-500 to-rose-500',
    path: '/collaboration'
  },
  {
    id: 'healing-suite',
    icon: Leaf,
    title: 'Healing Suite',
    description: 'Wellness app templates',
    color: 'from-teal-500 to-green-500',
    path: '/healing-suite'
  },
  {
    id: 'deploy-app',
    icon: Rocket,
    title: 'Deploy App',
    description: 'Launch your creation',
    color: 'from-orange-500 to-red-500',
    path: '/deploy'
  }
];

export default function Sidebar() {
  const [location] = useLocation();
  const activeItem = sidebarItems.find(item => item.path === location)?.id || 'visual-editor';

  return (
    <motion.div 
      className="w-80 bg-gradient-to-b from-gray-800 to-gray-900 border-r border-gray-700 flex flex-col"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <motion.div 
            className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-xl flex items-center justify-center animate-rainbow-border"
            animate={{
              borderRadius: ["60% 40% 30% 70%", "30% 60% 70% 40%", "40% 70% 30% 60%", "70% 30% 60% 40%", "60% 40% 30% 70%"],
              scale: [1, 1.1, 1.05, 1.15, 1],
              rotate: [0, 5, -3, 8, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            whileHover={{
              scale: 1.2,
              rotate: 360,
              transition: { duration: 0.8 }
            }}
          >
            <Heart className="text-white text-xl" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              ELOHIM-O LocalForge
            </h1>
            <p className="text-sm text-gray-400">AI Healing Studio</p>
          </div>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <div className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item, index) => (
          <Link key={item.id} href={item.path}>
            <motion.div
              className={`sidebar-item liquid-button p-4 rounded-xl cursor-pointer transition-all duration-500 ${
                activeItem === item.id 
                  ? `bg-gradient-to-r ${item.color} text-white glass-morphism-enhanced animate-pulse-glow` 
                  : 'hover:bg-gray-700 glass-morphism'
              }`}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                x: 16,
                scale: 1.08,
                rotateY: 10,
                transition: { duration: 0.3, type: "spring", stiffness: 300 }
              }}
              whileTap={{ 
                scale: 0.95,
                rotateX: 5,
                transition: { duration: 0.1 }
              }}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="text-lg" />
                <span className="font-medium">{item.title}</span>
              </div>
              <p className={`text-xs mt-1 ${
                activeItem === item.id ? 'text-white/80' : 'text-gray-400'
              }`}>
                {item.description}
              </p>
            </motion.div>
          </Link>
        ))}
      </div>
      
      {/* User Profile */}
      <div className="p-4 border-t border-gray-700">
        <motion.div 
          className="glass-morphism-enhanced p-4 rounded-xl animate-shimmer"
          whileHover={{ 
            scale: 1.05, 
            y: -5,
            transition: { duration: 0.3, type: "spring" }
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center space-x-3">
            <motion.div 
              className="w-10 h-10 bg-gradient-to-br from-green-500 via-emerald-500 to-cyan-500 rounded-full flex items-center justify-center animate-liquid-morph"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(34, 197, 94, 0.4), 0 0 40px rgba(6, 182, 212, 0.2)",
                  "0 0 40px rgba(34, 197, 94, 0.6), 0 0 60px rgba(6, 182, 212, 0.4)",
                  "0 0 60px rgba(34, 197, 94, 0.8), 0 0 80px rgba(6, 182, 212, 0.6)",
                  "0 0 40px rgba(34, 197, 94, 0.6), 0 0 60px rgba(6, 182, 212, 0.4)",
                  "0 0 20px rgba(34, 197, 94, 0.4), 0 0 40px rgba(6, 182, 212, 0.2)"
                ],
                scale: [1, 1.1, 1.2, 1.1, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{
                scale: 1.3,
                rotate: 180,
                transition: { duration: 0.5 }
              }}
            >
              <User className="text-white text-sm" />
            </motion.div>
            <div>
              <p className="font-medium">Creator</p>
              <p className="text-xs text-gray-400">Sovereign Mode</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
