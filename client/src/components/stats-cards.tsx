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
          className="widget-card glass-morphism-enhanced p-6 rounded-2xl animate-shimmer"
          initial={{ y: 80, opacity: 0, rotateX: -15 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          transition={{ delay: stat.delay, duration: 0.8, type: "spring", stiffness: 100 }}
          whileHover={{ 
            y: -12, 
            scale: 1.08,
            rotateY: 5,
            rotateX: 5,
            transition: { duration: 0.3, type: "spring" }
          }}
          whileTap={{
            scale: 0.98,
            transition: { duration: 0.1 }
          }}
        >
          <div className="flex items-center space-x-4">
            <motion.div 
              className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center animate-liquid`}
              animate={{
                y: [0, -15, 0],
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 5px 20px rgba(99, 102, 241, 0.3)",
                  "0 10px 40px rgba(99, 102, 241, 0.6)",
                  "0 5px 20px rgba(99, 102, 241, 0.3)"
                ]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: stat.delay * 2
              }}
              whileHover={{
                rotate: 360,
                scale: 1.2,
                transition: { duration: 0.6 }
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
