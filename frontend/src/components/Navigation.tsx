import { Brain, Home, Info, Book, Phone, LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Navigation() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md shadow-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-green-400" />
            <span className="ml-2 text-xl font-bold text-white">DyslexAI</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { icon: Home, text: 'Home', path: '/' },
              { icon: Info, text: 'About', path: '/about' },
              { icon: Phone, text: 'Contact', path: '/contact' },
            ].map(({ icon: Icon, text, path }) => (
              <button
                key={text}
                onClick={() => navigate(path)}
                className="text-white hover:text-green-400 flex items-center space-x-1 transition-colors"
              >
                <Icon className="h-4 w-4" />
                <span>{text}</span>
              </button>
            ))}
          </div>

          {/* Sign In and Register */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => navigate('/login')}
              className="text-white hover:text-green-400 flex items-center space-x-1 transition-colors"
            >
              <LogIn className="h-5 w-5" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => navigate('/register')}
              className="text-white hover:text-green-400 flex items-center space-x-1 transition-colors"
            >
              <UserPlus className="h-5 w-5" />
              <span>Register</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}