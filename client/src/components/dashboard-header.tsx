import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function DashboardHeader() {
  return (
    <header className="bg-gray-800 border-b border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold">Healing Studio Dashboard</h2>
          <p className="text-gray-400 mt-1">Create, collaborate, and deploy healing applications</p>
        </motion.div>
        
        <div className="flex items-center space-x-4">
          <motion.div 
            className="flex items-center space-x-2 glass-morphism px-4 py-2 rounded-xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <motion.div 
              className="w-3 h-3 bg-green-500 rounded-full"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <span className="text-sm">AI Agents Active</span>
          </motion.div>
          
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Button 
              className="liquid-button bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-6 py-2 rounded-xl font-medium transition-all duration-300"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
