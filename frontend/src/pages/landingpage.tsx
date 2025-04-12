import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, BookOpen, Users, Gamepad2, ChartBar, MessageCircle, Puzzle, Target, Award } from 'lucide-react';
import { ThreeScene } from '../components/ThreeScene';
import { Navigation } from '../components/Navigation';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleNavigation = (link: string) => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      navigate(link);
    } else {
      navigate('/login', { state: { returnUrl: link } });
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
      {/* Circular Disk Pointer */}
      <div
        className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-green-300 via-green-500 to-green-700 opacity-20 blur-[300px] transition-transform duration-75"
        style={{
          transform: `translate(${cursorPosition.x - 300}px, ${cursorPosition.y - 300}px)`,
        }}
      />

      <ThreeScene />
      <Navigation />

      <main className="relative pt-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-8xl font-extrabold mb-6 bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
              Revolutionizing Dyslexia Treatment
            </h1>
            <p className="text-lg md:text-2xl text-white mb-8 max-w-3xl mx-auto">
              Discover cutting-edge solutions that blend neuroscience and technology to transform lives.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <button
                onClick={() => handleNavigation('/dashboard')}
                className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-700 hover:from-green-400 hover:to-emerald-600 text-black px-10 py-4 rounded-xl font-semibold shadow-lg shadow-green-700/20"
              >
                <span className="absolute inset-0 w-0 bg-gradient-to-r from-emerald-300 to-teal-400 transition-all duration-300 ease-out group-hover:w-full"></span>
                <span className="absolute inset-0 w-full h-full bg-[length:4px_4px] bg-grid-white/10 transition-all duration-300"></span>
                <span className="relative flex items-center justify-center gap-2 z-10">
                  Get Started
                  <motion.div
                    initial={{ x: -5 }}
                    animate={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </span>
                <span className="absolute bottom-0 right-0 w-16 h-8 rounded-tl-3xl bg-white/10 blur-sm transform translate-x-1/2 translate-y-1/2"></span>
              </button>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent"
            >
              Our Core Features
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-300 max-w-2xl mx-auto"
            >
              Empowering individuals with dyslexia through innovative technology and personalized support
            </motion.p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'Neural Adaptation',
                description: 'Our technology adapts to your brain\'s unique patterns.',
              },
              {
                icon: BookOpen,
                title: 'Personalized Learning',
                description: 'Custom-tailored exercises for your specific needs.',
              },
              {
                icon: Users,
                title: 'Expert Support',
                description: '24/7 access to specialized dyslexia professionals.',
              },
            ].map(({ icon: Icon, title, description }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-gray-800 via-black to-gray-900 rounded-2xl p-6 hover:shadow-2xl hover:scale-105 transition-transform backdrop-blur-lg border border-green-500/20"
              >
                <Icon className="w-16 h-16 text-green-400 mb-4" />
                <h3 className="text-2xl font-semibold mb-2 text-white">{title}</h3>
                <p className="text-gray-300">{description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Solutions Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent"
            >
              Our Services
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-300 max-w-2xl mx-auto"
            >
              Comprehensive tools and assessments designed for dyslexia support
            </motion.p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Gamepad2,
                title: 'Interactive Games',
                description: 'Suite of engaging games including Word Match, Memory Game, Word Search, Word Scramble, and more to improve cognitive skills.',
                link: '/games',
                clickable: true
              },
              {
                icon: MessageCircle,
                title: 'AI Chatbot Assistant',
                description: 'Smart AI-powered chatbot providing instant support, guidance, and answers to your questions 24/7.',
                link: '/chatbot',
                clickable: false
              },
              {
                icon: ChartBar,
                title: 'Interactive Quiz',
                description: 'Comprehensive quiz system that generates detailed reports to track your understanding and progress.',
                link: '/quiz',
                clickable: true
              },
              {
                icon: Users,
                title: 'Parents Assessment',
                description: 'Detailed assessment tool for parents to evaluate and understand their child\'s learning patterns with comprehensive reports.',
                link: '/parents',
                clickable: true
              },
              {
                icon: Target,
                title: 'Progress Tracking',
                description: 'Advanced analytics dashboard showing detailed progress reports, improvements, and areas needing attention.',
                link: '/dashboard',
                clickable: true
              }
            ].map(({ icon: Icon, title, description, link, clickable }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={clickable ? { scale: 1.05 } : {}}
                transition={{ duration: 0.3 }}
                className={`group ${clickable ? 'cursor-pointer' : ''}`}
                onClick={() => {
                  if (clickable) {
                    handleNavigation(link);
                  }
                }}
              >
                <div className={`bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-2xl p-8 h-full backdrop-blur-lg border border-green-500/20 transition-all duration-300 ${clickable ? 'group-hover:border-green-500/50 group-hover:shadow-2xl' : ''}`}>
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-12 h-12 text-green-400" />
                    {clickable && (
                      <ArrowRight className="w-5 h-5 text-green-400 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                    )}
                  </div>
                  <h3 className={`text-xl font-semibold mb-3 text-white ${clickable ? 'group-hover:text-green-400' : ''} transition-colors`}>{title}</h3>
                  <p className={`text-gray-400 ${clickable ? 'group-hover:text-gray-300' : ''} transition-colors leading-relaxed`}>{description}</p>
                  {clickable && (
                    <div className="mt-4 flex items-center text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm font-medium">Explore</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-gradient-to-r from-green-500/20 to-green-700/20 rounded-3xl p-8 md:p-12 text-center backdrop-blur-lg shadow-xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Ready to Transform Your Reading Experience?
            </h2>
            <p className="text-lg text-white mb-8 max-w-2xl mx-auto">
              Join thousands of others who have already improved their reading abilities with our revolutionary treatment.
            </p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="bg-gradient-to-r from-green-500 to-green-700 text-black px-8 py-3 rounded-full font-semibold hover:from-green-400 hover:to-green-600 transition-transform shadow-lg"
              onClick={() => handleNavigation('/contact')}
            >
              Schedule a Free Consultation
            </motion.button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;