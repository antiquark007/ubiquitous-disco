import { motion } from 'framer-motion';
import { ThreeScene } from '../components/ThreeScene';
import { Brain, BookOpen, Users, Lightbulb } from 'lucide-react';
import { Navigation } from '../components/Navigation';

const About = () => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Three.js Background */}
      <div className="absolute inset-0">
        <ThreeScene />
      </div>
      
      {/* Navigation */}
      <Navigation />
      
      <main className="relative z-10 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
              About Dyslexia Innovation
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Empowering individuals with dyslexia through innovative technology and personalized learning solutions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-black/50 backdrop-blur-lg rounded-2xl p-8 border border-green-500/10"
            >
              <h2 className="text-2xl font-bold mb-6 text-green-400">Our Mission</h2>
              <p className="text-white/80 mb-4">
                At Dyslexia Innovation, we're dedicated to transforming the way people with dyslexia learn and interact with text. Our mission is to create accessible, effective, and engaging solutions that help individuals overcome reading challenges and unlock their full potential.
              </p>
              <p className="text-white/80">
                We believe that with the right tools and support, everyone can achieve their goals and excel in their personal and professional lives.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-black/50 backdrop-blur-lg rounded-2xl p-8 border border-green-500/10"
            >
              <h2 className="text-2xl font-bold mb-6 text-green-400">Our Vision</h2>
              <p className="text-white/80 mb-4">
                We envision a world where dyslexia is not a barrier to success, but rather a unique perspective that contributes to innovation and creativity. Our goal is to make reading and learning accessible to everyone, regardless of their learning differences.
              </p>
              <p className="text-white/80">
                Through continuous research and development, we strive to create cutting-edge solutions that make a real difference in people's lives.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-green-500/10 text-center"
            >
              <Brain className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Innovative Technology</h3>
              <p className="text-white/80">
                Leveraging cutting-edge AI and machine learning to create personalized learning experiences.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-green-500/10 text-center"
            >
              <BookOpen className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Research-Based</h3>
              <p className="text-white/80">
                Our solutions are built on solid scientific research and evidence-based practices.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-green-500/10 text-center"
            >
              <Users className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">User-Centered</h3>
              <p className="text-white/80">
                Designed with and for people with dyslexia, ensuring our solutions meet real needs.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-green-500/10 text-center"
            >
              <Lightbulb className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Continuous Innovation</h3>
              <p className="text-white/80">
                Constantly evolving and improving our solutions based on user feedback and new research.
              </p>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About; 