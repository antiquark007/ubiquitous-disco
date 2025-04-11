import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../api/authApi';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { ThreeScene } from '../components/ThreeScene';

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

function Login() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate();

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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const {user_id}= await loginApi(formData.email, formData.password);
      localStorage.setItem('user_id',user_id)
      if (rememberMe) {
        localStorage.setItem('userEmail', formData.email);
      }
      
      
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleGoogleLoginSuccess = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const decoded: any = jwtDecode(credentialResponse.credential);
      const email = decoded.email;

      if (email) {
        setIsLoading(true);
        console.log('Google Login Email:', email);
        localStorage.setItem('userEmail', email);
        
        // Show success state briefly before redirecting
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        console.error('Email not found in Google response');
      }
    } else {
      console.error('Credential is undefined');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div
        className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-green-300 via-green-500 to-green-700 opacity-20 blur-[300px] transition-transform duration-75"
        style={{
          transform: `translate(${cursorPosition.x - 300}px, ${cursorPosition.y - 300}px)`,
        }}
      ></div>
      
      <motion.div 
        className="fixed w-[400px] h-[400px] rounded-full bg-green-700/10 blur-[150px]"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 15,
          ease: "easeInOut"
        }}
        style={{ 
          left: '25%', 
          top: '30%' 
        }}
      />
      
      <motion.div 
        className="fixed w-[350px] h-[350px] rounded-full bg-green-500/10 blur-[120px]"
        animate={{
          x: [0, -20, 0],
          y: [0, 20, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: "easeInOut"
        }}
        style={{ 
          right: '20%', 
          bottom: '20%' 
        }}
      />

      {/* Three.js Background */}
      <div className="absolute inset-0">
        <ThreeScene />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-center gap-10 lg:gap-20">
        {/* Left Side - Branding */}
        <motion.div 
          className="w-full md:w-1/2 max-w-md mb-10 md:mb-0 text-center md:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Welcome Back
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-300 mb-8"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Sign in to continue your journey with personalized learning experiences designed for dyslexia.
            </motion.p>
            
            <motion.div 
              className="hidden md:block space-y-6 mt-12"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full"
                  />
                </div>
                <div>
                  <h3 className="text-white font-medium">Personalized Learning</h3>
                  <p className="text-gray-400 text-sm">Tailored to your unique needs</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-6 h-6 bg-green-500/30 rounded-full"
                  />
                </div>
                <div>
                  <h3 className="text-white font-medium">Track Your Progress</h3>
                  <p className="text-gray-400 text-sm">See your improvement over time</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div 
          className="w-full md:w-1/2 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="backdrop-blur-lg bg-gradient-to-br from-gray-800/90 via-gray-900/90 to-black/90 p-8 rounded-2xl shadow-2xl border border-gray-700/50">
            {isSuccess ? (
              <motion.div 
                className="py-10 flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.6, times: [0, 0.6, 1] }}
                >
                  <motion.svg 
                    className="w-12 h-12 text-green-500" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <motion.path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    />
                  </motion.svg>
                </motion.div>
                <motion.h2 
                  className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Login Successful!
                </motion.h2>
                <motion.p 
                  className="text-gray-400 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  Redirecting to your dashboard...
                </motion.p>
              </motion.div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <motion.h2 
                    className="text-3xl font-bold bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    Sign In
                  </motion.h2>
                  <motion.p 
                    className="text-gray-400 mt-2"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    Access your personalized learning dashboard
                  </motion.p>
                </div>

                <motion.form 
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <motion.div 
                    className="space-y-5"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {/* Email Input */}
                    <div>
                      <div className="relative">
                        <label className="absolute -top-2.5 left-3 px-1 text-xs font-medium text-green-400 bg-gray-900 rounded">
                          Email Address
                        </label>
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border-2 ${
                            errors.email ? 'border-red-500' : 'border-gray-700 focus:border-green-500'
                          } rounded-xl bg-gray-800/80 text-white placeholder-gray-500 focus:outline-none transition-colors`}
                          placeholder="your.email@example.com"
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                      <AnimatePresence>
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-1 text-sm text-red-400 flex items-center"
                          >
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.email}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Password Input */}
                    <div>
                      <div className="relative">
                        <label className="absolute -top-2.5 left-3 px-1 text-xs font-medium text-green-400 bg-gray-900 rounded">
                          Password
                        </label>
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-12 py-3 border-2 ${
                            errors.password ? 'border-red-500' : 'border-gray-700 focus:border-green-500'
                          } rounded-xl bg-gray-800/80 text-white placeholder-gray-500 focus:outline-none transition-colors`}
                          placeholder="Enter your password"
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <AnimatePresence>
                        {errors.password && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-1 text-sm text-red-400 flex items-center"
                          >
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.password}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                  
                  {/* Remember Me & Forgot Password */}
                  <motion.div 
                    className="flex items-center justify-between text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        className="w-4 h-4 text-green-500 rounded border-gray-600 focus:ring-green-400 focus:ring-offset-gray-900"
                      />
                      <label htmlFor="rememberMe" className="text-gray-300">
                        Remember Me
                      </label>
                    </div>
                    <a href="#" className="text-green-400 hover:text-green-300 hover:underline transition-colors">
                      Forgot Password?
                    </a>
                  </motion.div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                    >
                      <p className="text-red-400 text-sm text-center">{error}</p>
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 ${
                      isLoading 
                        ? 'bg-green-700/60 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-green-500 to-green-700 hover:from-green-400 hover:to-green-600'
                    } text-white shadow-lg shadow-green-500/20 transition-all`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <span>Sign In</span>
                        <ArrowRight size={18} />
                      </div>
                    )}
                  </motion.button>
                  
                  <motion.div 
                    className="relative flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="border-t border-gray-700 w-full absolute"></div>
                    <span className="bg-gray-900 px-4 text-gray-400 text-sm relative">
                      Or continue with
                    </span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <GoogleLogin
                      onSuccess={handleGoogleLoginSuccess}
                      onError={() => console.log('Google Login Failed')}
                      theme="filled_black"
                      size="large"
                      shape="circle"
                      text="signin_with"
                      locale="en"
                    />
                  </motion.div>
                </motion.form>

                <motion.div 
                  className="mt-8 text-center text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <span className="text-gray-400">Don't have an account? </span>
                  <motion.a
                    href="/register"
                    className="font-medium text-green-400 hover:text-green-300 hover:underline"
                    whileHover={{ scale: 1.05 }}
                  >
                    Sign up
                  </motion.a>
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;