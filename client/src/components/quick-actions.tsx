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
      className="glass-morphism rounded-2xl p-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
          >
            <Button 
              className={`liquid-button w-full bg-gradient-to-r ${action.color} p-4 rounded-xl text-left h-auto hover:scale-105 transition-all duration-300`}
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
