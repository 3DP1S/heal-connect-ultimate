import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  MessageCircle, 
  Send, 
  Users, 
  Bot,
  Sparkles,
  Brain,
  Zap,
  Heart,
  Star,
  Settings,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  RefreshCw,
  Download,
  Upload,
  Code,
  Palette,
  Wand2
} from "lucide-react";

interface ChatMessage {
  id: string;
  userId: string;
  agentId?: string;
  content: string;
  type: 'user' | 'agent' | 'system';
  timestamp: Date;
  metadata?: any;
}

interface AIAgent {
  id: string;
  name: string;
  role: string;
  specialization: string;
  avatar?: string;
  status: 'active' | 'idle' | 'working';
  capabilities: string[];
}

const aiAgents: AIAgent[] = [
  {
    id: 'elohim-o',
    name: 'ELOHIM-O',
    role: 'Sovereign AI',
    specialization: 'Healing App Architecture',
    status: 'active',
    capabilities: ['UI/UX Design', 'Backend Architecture', 'Healing Algorithms', 'System Integration']
  },
  {
    id: 'therapist-ai',
    name: 'Therapist AI',
    role: 'Wellness Expert',
    specialization: 'Mental Health & Therapy',
    status: 'active',
    capabilities: ['Therapy Sessions', 'Mood Analysis', 'Coping Strategies', 'Crisis Support']
  },
  {
    id: 'meditation-guide',
    name: 'Meditation Guide',
    role: 'Mindfulness Expert',
    specialization: 'Meditation & Breathwork',
    status: 'active',
    capabilities: ['Guided Meditation', 'Breathing Techniques', 'Mindfulness Training', 'Stress Relief']
  },
  {
    id: 'code-assistant',
    name: 'Code Assistant',
    role: 'Development AI',
    specialization: 'Full-Stack Development',
    status: 'idle',
    capabilities: ['React Development', 'API Design', 'Database Management', 'Testing']
  }
];

function AgentCard({ agent, isActive, onSelect }: {
  agent: AIAgent;
  isActive: boolean;
  onSelect: (agentId: string) => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(agent.id)}
      className={`cursor-pointer ${isActive ? 'ring-2 ring-purple-400' : ''}`}
    >
      <Card className={`glass-morphism-enhanced border-white/20 ${isActive ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${
                agent.status === 'active' ? 'from-green-400 to-emerald-500' :
                agent.status === 'working' ? 'from-blue-400 to-cyan-500' :
                'from-gray-400 to-gray-500'
              } flex items-center justify-center`}>
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                agent.status === 'active' ? 'bg-green-400' :
                agent.status === 'working' ? 'bg-blue-400' :
                'bg-gray-400'
              }`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate">{agent.name}</h3>
              <p className="text-xs text-white/70">{agent.role}</p>
              <p className="text-xs text-white/50">{agent.specialization}</p>
            </div>
            
            <Badge variant={agent.status === 'active' ? 'default' : 'secondary'} className="text-xs">
              {agent.status}
            </Badge>
          </div>
          
          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              {agent.capabilities.slice(0, 2).map((capability, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-white/10 text-white border-white/20">
                  {capability}
                </Badge>
              ))}
              {agent.capabilities.length > 2 && (
                <Badge variant="outline" className="text-xs bg-white/10 text-white border-white/20">
                  +{agent.capabilities.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ChatBubble({ message, isUser }: { message: ChatMessage; isUser: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[70%] p-4 rounded-2xl ${
          isUser
            ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
            : 'glass-morphism-enhanced border-white/20 text-white'
        }`}
      >
        {!isUser && (
          <div className="flex items-center space-x-2 mb-2">
            <Bot className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-purple-400 font-medium">
              {aiAgents.find(a => a.id === message.agentId)?.name || 'AI Assistant'}
            </span>
          </div>
        )}
        <p className="text-sm leading-relaxed">{message.content}</p>
        <p className="text-xs opacity-70 mt-2">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </motion.div>
  );
}

export default function CollaborationPage() {
  const [selectedAgent, setSelectedAgent] = useState(aiAgents[0].id);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: 'user-1',
      agentId: 'elohim-o',
      content: 'Welcome to the AI Collaboration Studio! I am ELOHIM-O, your sovereign AI assistant for healing app development. How can I assist you in creating transformative wellness experiences today?',
      type: 'agent',
      timestamp: new Date(Date.now() - 60000)
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'user-1',
      content: inputMessage,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const selectedAgentData = aiAgents.find(a => a.id === selectedAgent);
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        userId: 'user-1',
        agentId: selectedAgent,
        content: getAIResponse(inputMessage, selectedAgentData?.specialization || ''),
        type: 'agent',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000 + Math.random() * 2000);
  };

  const getAIResponse = (userInput: string, specialization: string) => {
    const responses = {
      'Healing App Architecture': [
        'I can help you design the architectural foundation for your healing application. Let\'s focus on creating scalable, user-centric wellness experiences.',
        'Based on your request, I suggest implementing a microservices architecture with dedicated modules for meditation, therapy, and community features.',
        'For optimal healing app performance, we should prioritize real-time data synchronization and offline-first capabilities for users in remote areas.',
      ],
      'Mental Health & Therapy': [
        'From a therapeutic perspective, it\'s important to create safe spaces for emotional expression. How can I help you implement evidence-based wellness interventions?',
        'I recommend incorporating cognitive behavioral therapy (CBT) techniques into your app\'s core functionality. This will provide users with practical coping strategies.',
        'Mental health applications should prioritize user privacy and data security. Let\'s discuss implementing end-to-end encryption for sensitive therapeutic data.',
      ],
      'Meditation & Breathwork': [
        'Guided meditation requires careful attention to pacing and ambient design. I can help you create immersive, calming experiences for your users.',
        'Breathing exercises are most effective when combined with visual cues and gentle audio guidance. Would you like me to design a breathwork session?',
        'For maximum mindfulness impact, consider implementing progressive meditation programs that adapt to each user\'s experience level and preferences.',
      ],
      'Full-Stack Development': [
        'I can assist with implementing the technical requirements for your healing platform. Which specific development challenges are you facing?',
        'For optimal performance, I recommend using React with TypeScript for the frontend and Express.js with PostgreSQL for the backend infrastructure.',
        'Let\'s implement proper error handling and user feedback systems to ensure a smooth healing app experience for all users.',
      ]
    };

    const categoryResponses = responses[specialization as keyof typeof responses] || responses['Healing App Architecture'];
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast({ title: "Voice recording started", description: "Speak your message..." });
    } else {
      toast({ title: "Voice recording stopped", description: "Processing your message..." });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex h-screen">
        {/* AI Agents Panel */}
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-80 border-r border-white/10 p-4 overflow-y-auto"
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center">
              <Users className="w-6 h-6 mr-2 text-purple-400" />
              AI Collaboration Studio
            </h2>
            <p className="text-sm text-white/70">Multi-agent healing app development</p>
          </div>

          <div className="space-y-3">
            {aiAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isActive={selectedAgent === agent.id}
                onSelect={setSelectedAgent}
              />
            ))}
          </div>

          <div className="mt-6 p-4 glass-morphism-enhanced rounded-xl">
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center">
              <Sparkles className="w-4 h-4 mr-1 text-yellow-400" />
              Active Session
            </h3>
            <div className="space-y-2 text-xs text-white/70">
              <div className="flex justify-between">
                <span>Messages:</span>
                <span>{messages.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Agents:</span>
                <span>{aiAgents.filter(a => a.status === 'active').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Session Time:</span>
                <span>12:34</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-4 border-b border-white/10 glass-morphism-enhanced"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {aiAgents.find(a => a.id === selectedAgent)?.name}
                  </h3>
                  <p className="text-xs text-white/70">
                    {aiAgents.find(a => a.id === selectedAgent)?.specialization}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:bg-white/10"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:bg-white/10"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Messages Area */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            <AnimatePresence>
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  message={message}
                  isUser={message.type === 'user'}
                />
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </motion.div>

          {/* Input Area */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="p-4 border-t border-white/10 glass-morphism-enhanced"
          >
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask your AI agents anything about healing app development..."
                  className="glass-morphism border-white/30 text-white pr-12"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleVoiceToggle}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
                    isRecording ? 'text-red-400 animate-pulse' : 'text-white/70'
                  } hover:bg-white/10`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </div>
              
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between mt-3 text-xs text-white/50">
              <div className="flex items-center space-x-4">
                <span>🤖 {aiAgents.filter(a => a.status === 'active').length} agents online</span>
                <span>⚡ Real-time collaboration</span>
                <span>🔒 Encrypted communication</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="ghost" className="text-white/50 hover:text-white">
                  <Code className="w-3 h-3 mr-1" />
                  Code
                </Button>
                <Button size="sm" variant="ghost" className="text-white/50 hover:text-white">
                  <Palette className="w-3 h-3 mr-1" />
                  Design
                </Button>
                <Button size="sm" variant="ghost" className="text-white/50 hover:text-white">
                  <Wand2 className="w-3 h-3 mr-1" />
                  Magic
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}