import { motion } from "framer-motion";

const systemItems = [
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
      className="glass-morphism rounded-2xl p-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
    >
      <h3 className="text-lg font-semibold mb-4">System Status</h3>
      <div className="space-y-3">
        {systemItems.map((item, index) => (
          <motion.div 
            key={index}
            className="flex items-center justify-between"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1 + index * 0.1, duration: 0.4 }}
          >
            <span className="text-sm">{item.name}</span>
            <div className="flex items-center space-x-2">
              <motion.div 
                className={`w-2 h-2 ${item.color} rounded-full`}
                animate={item.pulse ? {
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1]
                } : {}}
                transition={{
                  duration: 2,
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
