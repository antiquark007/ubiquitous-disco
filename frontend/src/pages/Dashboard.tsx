import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Sparkles,
  Target,
  Clock,
  Trophy,
  Users,
  Brain
} from 'lucide-react';
import { ThreeScene } from '../components/ThreeScene';
import { Sidebar } from '../components/Sidebar';

function StatCard({ title, value, icon: Icon, trend, color }: { title: string; value: string; icon: any; trend?: string; color?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-green-500/10"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/60 text-sm">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
          {trend && <p className={`text-${color || 'green'}-400 text-sm mt-2`}>{trend}</p>}
        </div>
        <div className={`p-3 bg-${color || 'green'}-500/10 rounded-lg`}>
          <Icon className={`w-6 h-6 text-${color || 'green'}-400`} />
        </div>
      </div>
    </motion.div>
  );
}

function ActivityCard({ title, description, time, icon: Icon, color }: { title: string; description: string; time: string; icon: any; color?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-black/50 backdrop-blur-lg rounded-xl p-4 border border-green-500/10 flex items-start space-x-4"
    >
      <div className={`p-2 bg-${color || 'green'}-500/10 rounded-lg`}>
        <Icon className={`w-5 h-5 text-${color || 'green'}-400`} />
      </div>
      <div>
        <h4 className="text-white font-medium">{title}</h4>
        <p className="text-white/60 text-sm mt-1">{description}</p>
        <p className={`text-${color || 'green'}-400 text-xs mt-2`}>{time}</p>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // Track mouse position for the glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="flex h-screen bg-black text-white relative overflow-hidden">
      {/* Circular Disk Pointer */}
      <div
        className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-green-300 via-green-500 to-green-700 opacity-15 blur-[200px] transition-transform duration-75"
        style={{
          transform: `translate(${cursorPosition.x - 300}px, ${cursorPosition.y - 300}px)`,
        }}
      ></div>

      {/* Three.js Background */}
      <div className="absolute inset-0">
        <ThreeScene />
      </div>

      <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
      
      <main className="flex-1 p-8 overflow-y-auto relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, User!</h1>
              <p className="text-white/60 mt-2">Track your progress and continue learning</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-500 to-green-700 text-black px-6 py-2 rounded-full font-semibold flex items-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start New Session</span>
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Sessions"
              value="24"
              icon={BookOpen}
              trend="+12% from last week"
            />
            <StatCard
              title="Progress Score"
              value="85%"
              icon={Target}
              trend="+5% improvement"
              color="blue"
            />
            <StatCard
              title="Streak"
              value="7 days"
              icon={Trophy}
              trend="Keep it up!"
              color="yellow"
            />
            <StatCard
              title="Time Spent"
              value="12h 30m"
              icon={Clock}
              trend="+2h from last week"
              color="purple"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
              <div className="space-y-4">
                <ActivityCard
                  title="Completed Module 3"
                  description="Advanced reading comprehension exercises"
                  time="2 hours ago"
                  icon={BookOpen}
                />
                <ActivityCard
                  title="New Achievement"
                  description="Reached 7-day streak milestone"
                  time="5 hours ago"
                  icon={Trophy}
                  color="yellow"
                />
                <ActivityCard
                  title="Progress Update"
                  description="Reading speed increased by 15%"
                  time="Yesterday"
                  icon={Target}
                  color="blue"
                />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-black/50 backdrop-blur-lg rounded-xl p-4 border border-green-500/10 text-left flex items-center space-x-4"
                >
                  <BookOpen className="w-5 h-5 text-green-400" />
                  <span>Continue Learning</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-black/50 backdrop-blur-lg rounded-xl p-4 border border-green-500/10 text-left flex items-center space-x-4"
                >
                  <Brain className="w-5 h-5 text-green-400" />
                  <span>Take Assessment</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-black/50 backdrop-blur-lg rounded-xl p-4 border border-green-500/10 text-left flex items-center space-x-4"
                >
                  <Users className="w-5 h-5 text-green-400" />
                  <span>Join Community</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}