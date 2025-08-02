import { Wand2, Upload, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const actions = [
  {
    icon: Wand2,
    title: 'AI-Generated Template',
    description: 'Create with AI assistance',
    color: 'from-blue-500 to-purple-500'
  },
  {
    icon: Upload,
    title: 'Import Project',
    description: 'From local files',
    color: 'from-green-500 to-cyan-500'
  },
  {
    icon: Users,
    title: 'Join Collaboration',
    description: 'Work with others',
    color: 'from-purple-500 to-pink-500'
  }
];

export default function QuickActions() {
  return (
    <motion.div 
      className="glass-morphism-enhanced rounded-2xl p-6 animate-float"
      initial={{ opacity: 0, x: 80, rotateX: 30 }}
      animate={{ opacity: 1, x: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay: 0.6, type: "spring", stiffness: 120 }}
      whileHover={{
        scale: 1.02,
        rotateY: 2,
        transition: { duration: 0.3 }
      }}
    >
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.7 + index * 0.15, duration: 0.6, type: "spring" }}
          >
            <Button 
              className={`liquid-button w-full bg-gradient-to-r ${action.color} p-4 rounded-xl text-left h-auto hover:scale-110 hover:rotate-1 transition-all duration-500 animate-shimmer`}
            >
              <div className="flex items-center space-x-3">
                <action.icon className="text-lg" />
                <div>
                  <p className="font-medium">{action.title}</p>
                  <p className="text-xs opacity-80">{action.description}</p>
                </div>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
