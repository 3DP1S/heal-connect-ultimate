import { Bot, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState } from "react";

export default function AiAssistant() {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: Implement AI chat functionality
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <motion.div 
      className="glass-morphism rounded-2xl p-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <div className="flex items-center space-x-3 mb-4">
        <motion.div 
          className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
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
          <Bot className="text-white text-sm" />
        </motion.div>
        <h3 className="text-lg font-semibold">AI Assistant</h3>
      </div>
      
      <motion.div 
        className="space-y-3 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <div className="bg-gray-700/50 p-3 rounded-lg">
          <p className="text-sm">I can help you create healing applications. What would you like to build today?</p>
        </div>
      </motion.div>
      
      <div className="flex space-x-2">
        <Input 
          type="text" 
          placeholder="Ask me anything..." 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-gray-700 border-gray-600 rounded-lg text-sm focus:border-blue-500 transition-colors"
        />
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            size="sm"
            onClick={handleSendMessage}
            className="liquid-button bg-blue-500 hover:bg-blue-600 p-2 rounded-lg"
          >
            <Send className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
