import { motion } from "framer-motion";

const systemItems = [
  {
    name: 'HEAL CONNECT',
    status: 'Active',
    color: 'bg-green-500',
    pulse: true
  },
  {
    name: 'AI Agents',
    status: 'Online',
    color: 'bg-green-500',
    pulse: true
  },
  {
    name: 'Local Storage',
    status: '84% Free',
    color: 'bg-green-500',
    pulse: false
  },
  {
    name: 'Quantum Simulator',
    status: 'Ready',
    color: 'bg-cyan-500',
    pulse: true
  }
];

export default function SystemStatus() {
  return (
    <motion.div 
      className="glass-morphism-enhanced rounded-2xl p-6 animate-float-slow"
      initial={{ opacity: 0, x: 70, rotateY: 20 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      transition={{ duration: 0.9, delay: 1.0, type: "spring", stiffness: 100 }}
      whileHover={{
        scale: 1.02,
        rotateX: 2,
        transition: { duration: 0.3 }
      }}
    >
      <h3 className="text-lg font-semibold mb-4">System Status</h3>
      <div className="space-y-3">
        {systemItems.map((item, index) => (
          <motion.div 
            key={index}
            className="flex items-center justify-between p-2 rounded-lg glass-morphism transition-all duration-300 hover:scale-105"
            initial={{ opacity: 0, x: 30, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 1.1 + index * 0.15, duration: 0.5, type: "spring" }}
            whileHover={{
              x: 5,
              transition: { duration: 0.2 }
            }}
          >
            <span className="text-sm">{item.name}</span>
            <div className="flex items-center space-x-2">
              <motion.div 
                className={`w-3 h-3 ${item.color} rounded-full animate-liquid`}
                animate={item.pulse ? {
                  scale: [1, 1.5, 1.2, 1.8, 1],
                  opacity: [1, 0.6, 0.9, 0.4, 1],
                  boxShadow: [
                    `0 0 10px ${item.color.includes('green') ? 'rgba(34, 197, 94, 0.5)' : 'rgba(6, 182, 212, 0.5)'}`,
                    `0 0 20px ${item.color.includes('green') ? 'rgba(34, 197, 94, 0.8)' : 'rgba(6, 182, 212, 0.8)'}`,
                    `0 0 30px ${item.color.includes('green') ? 'rgba(34, 197, 94, 1)' : 'rgba(6, 182, 212, 1)'}`,
                    `0 0 20px ${item.color.includes('green') ? 'rgba(34, 197, 94, 0.8)' : 'rgba(6, 182, 212, 0.8)'}`,
                    `0 0 10px ${item.color.includes('green') ? 'rgba(34, 197, 94, 0.5)' : 'rgba(6, 182, 212, 0.5)'}`
                  ]
                } : {}}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <span className={`text-xs ${
                item.color.includes('green') ? 'text-green-500' : 'text-cyan-500'
              }`}>
                {item.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
