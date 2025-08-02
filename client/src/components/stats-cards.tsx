import { Heart, Users, Brain, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    icon: Heart,
    value: 12,
    label: 'Healing Apps',
    color: 'from-green-500 to-cyan-500',
    delay: 0
  },
  {
    icon: Users,
    value: 8,
    label: 'Collaborations',
    color: 'from-blue-500 to-purple-500',
    delay: 0.1
  },
  {
    icon: Brain,
    value: 24,
    label: 'Simulations',
    color: 'from-purple-500 to-pink-500',
    delay: 0.2
  },
  {
    icon: Rocket,
    value: 5,
    label: 'Deployed',
    color: 'from-green-500 to-emerald-500',
    delay: 0.3
  }
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className="widget-card glass-morphism p-6 rounded-2xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: stat.delay, duration: 0.5 }}
          whileHover={{ 
            y: -5, 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
        >
          <div className="flex items-center space-x-4">
            <motion.div 
              className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}
              animate={{
                y: [0, -10, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: stat.delay * 2
              }}
            >
              <stat.icon className="text-white text-xl" />
            </motion.div>
            <div>
              <motion.p 
                className="text-2xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: stat.delay + 0.3 }}
              >
                {stat.value}
              </motion.p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
