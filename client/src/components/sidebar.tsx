import { useState } from "react";
import { Heart, Palette, Box, Brain, Users, Leaf, Rocket, User } from "lucide-react";
import { motion } from "framer-motion";

const sidebarItems = [
  {
    id: 'visual-editor',
    icon: Palette,
    title: 'Visual Editor',
    description: 'Design healing interfaces',
    color: 'from-blue-500 to-purple-500',
    isActive: true
  },
  {
    id: '3d-generator',
    icon: Box,
    title: '3D Generator',
    description: 'Create immersive environments',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'quantum-healing',
    icon: Brain,
    title: 'Quantum Healing Simulator',
    description: 'Advanced therapeutic tools',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'ai-collaboration',
    icon: Users,
    title: 'AI Collaboration',
    description: 'Multi-agent development',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'healing-suite',
    icon: Leaf,
    title: 'Healing Suite',
    description: 'Wellness app templates',
    color: 'from-green-500 to-teal-500'
  },
  {
    id: 'deploy-app',
    icon: Rocket,
    title: 'Deploy App',
    description: 'Launch your creation',
    color: 'from-orange-500 to-red-500'
  }
];

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('visual-editor');

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
            className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center"
            animate={{
              borderRadius: ["60% 40% 30% 70%", "30% 60% 70% 40%", "60% 40% 30% 70%"]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
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
          <motion.div
            key={item.id}
            className={`sidebar-item liquid-button p-4 rounded-xl cursor-pointer transition-all duration-300 ${
              activeItem === item.id 
                ? `bg-gradient-to-r ${item.color} text-white` 
                : 'hover:bg-gray-700'
            }`}
            onClick={() => setActiveItem(item.id)}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ 
              x: 8,
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
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
        ))}
      </div>
      
      {/* User Profile */}
      <div className="p-4 border-t border-gray-700">
        <motion.div 
          className="glass-morphism p-4 rounded-xl"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center space-x-3">
            <motion.div 
              className="w-10 h-10 bg-gradient-to-br from-green-500 to-cyan-500 rounded-full flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(99, 102, 241, 0.3)",
                  "0 0 30px rgba(99, 102, 241, 0.6)",
                  "0 0 20px rgba(99, 102, 241, 0.3)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
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
