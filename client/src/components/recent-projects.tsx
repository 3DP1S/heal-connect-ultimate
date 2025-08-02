import { Leaf, Brain, Sparkles, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const projects = [
  {
    id: 1,
    name: 'Meditation Garden App',
    description: 'Tranquil meditation environment with nature sounds',
    icon: Leaf,
    status: 'Active',
    statusColor: 'bg-green-500/20 text-green-500',
    lastModified: '2 hours ago',
    color: 'from-green-500 to-cyan-500'
  },
  {
    id: 2,
    name: 'Anxiety Relief Simulator',
    description: 'Interactive breathing exercises with biofeedback',
    icon: Brain,
    status: 'Testing',
    statusColor: 'bg-purple-500/20 text-purple-500',
    lastModified: '1 day ago',
    color: 'from-purple-500 to-blue-500'
  },
  {
    id: 3,
    name: 'Chakra Balancing Tool',
    description: '7-chakra visualization and healing frequencies',
    icon: Sparkles,
    status: 'Deployed',
    statusColor: 'bg-cyan-500/20 text-cyan-500',
    lastModified: '3 days ago',
    color: 'from-cyan-500 to-green-500'
  }
];

export default function RecentProjects() {
  return (
    <motion.div 
      className="glass-morphism rounded-2xl p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Recent Projects</h3>
        <Button variant="ghost" className="text-blue-500 hover:text-blue-400">
          View All
        </Button>
      </div>
      
      <div className="space-y-4">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="widget-card p-4 rounded-xl border border-gray-600 hover:border-blue-500 transition-all duration-300"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
            whileHover={{ 
              scale: 1.02,
              borderColor: "rgb(59, 130, 246)",
              transition: { duration: 0.2 }
            }}
          >
            <div className="flex items-center space-x-4">
              <motion.div 
                className={`w-16 h-16 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center`}
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <project.icon className="text-white text-xl" />
              </motion.div>
              
              <div className="flex-1">
                <h4 className="font-semibold">{project.name}</h4>
                <p className="text-sm text-gray-400">{project.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge className={`text-xs ${project.statusColor} border-0`}>
                    {project.status}
                  </Badge>
                  <span className="text-xs text-gray-400">{project.lastModified}</span>
                </div>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="sm"
                  variant="ghost"
                  className="liquid-button bg-blue-500/20 hover:bg-blue-500/30 p-2 rounded-lg"
                >
                  <Edit className="text-blue-500 h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
