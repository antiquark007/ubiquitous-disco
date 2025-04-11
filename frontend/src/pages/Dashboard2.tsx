import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '../components/Sidebar';
import Image from '../assets/EWUw5H.gif'
export default function Dashboard2() {
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
      />

      {/* GIF Background */}
      <div className="absolute inset-0">
        <img 
          src={Image}
          alt="Background" 
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, User!</h1>
              <p className="text-white/60 mt-2">Track your progress and continue learning</p>
            </div>
          </div>

          {/* Add your dashboard content here */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Add your dashboard cards and components here */}
          </div>
        </div>
      </main>
    </div>
  );
}
