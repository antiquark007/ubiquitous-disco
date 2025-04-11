import { useState, useEffect } from 'react';
import { Mail, Lock, User, Phone as PhoneIcon, Calendar, Eye, EyeOff, AlertCircle, FileText, Upload, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { registerApi } from '../api/authApi';
import { RegisterFormData } from '../types';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  dob?: string;
  profile_photo?: string;
  language?: string;
  about?: string;
}

function Register() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    profile_photo: '',
    language: '',
    about: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();

  // Track mouse position for the glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }

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
    } else if (step === 2) {
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      }

      if (!formData.dob) {
        newErrors.dob = 'Date of birth is required';
      }

     
    } else if (step === 3) {
      if (!formData.language) {
        newErrors.language = 'Preferred language is required';
      }

      if (!formData.about) {
        newErrors.about = 'About section is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

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
      const submissionData: RegisterFormData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || 'string',
        dob: formData.dob || 'string',
        profile_photo: formData.profile_photo || '',
        language: formData.language || '',
        about: formData.about || ''
      };

      await registerApi(submissionData);
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profile_photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -100, transition: { duration: 0.3 } }
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 }
  };

  const inputVariants = {
    focus: { scale: 1.01, borderColor: '#22c55e', transition: { duration: 0.2 } },
  };

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Mandarin', 'Hindi',
    'Arabic', 'Russian', 'Portuguese', 'Japanese', 'Other'
  ];

  const progressPercentage = ((currentStep - 1) / 2) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="fixed w-[800px] h-[800px] rounded-full bg-green-500/10 blur-[100px]"
        animate={{
          x: mousePosition.x - 400,
          y: mousePosition.y - 400,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 80 }}
      />

      <motion.div
        className="fixed w-[400px] h-[400px] rounded-full bg-green-700/10 blur-[80px]"
        animate={{
          x: mousePosition.x / 2,
          y: mousePosition.y / 2,
        }}
        transition={{ type: 'spring', damping: 40, stiffness: 90 }}
      />

      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row min-h-screen">
        {/* Left Side - Branding */}
        <motion.div
          className="md:w-1/3 lg:w-1/4 py-8 pr-4 hidden md:flex flex-col justify-center"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="sticky top-10 space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl font-bold bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Join Our Community
            </motion.h1>

            <motion.p
              className="text-gray-400 text-lg"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Create your account and unlock a world of possibilities. Your journey starts here.
            </motion.p>

            <motion.div
              className="space-y-6 mt-12"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <div className="flex items-center space-x-3">
                <div className="bg-green-500/20 p-2 rounded-full">
                  <User className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-gray-300">Personalized experience</p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-green-500/20 p-2 rounded-full">
                  <Lock className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-gray-300">Secure and private</p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-green-500/20 p-2 rounded-full">
                  <Globe className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-gray-300">Join global community</p>
              </div>
            </motion.div>

            <motion.div
              className="w-full h-1 bg-gray-800 rounded-full mt-12 overflow-hidden"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "100%" }}
              transition={{ delay: 1, duration: 1 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-green-600"
                style={{ width: `${progressPercentage}%` }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>

            <motion.div
              className="flex justify-between text-sm mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <div className={`${currentStep >= 1 ? 'text-green-500' : 'text-gray-500'}`}>Account</div>
              <div className={`${currentStep >= 2 ? 'text-green-500' : 'text-gray-500'}`}>Personal</div>
              <div className={`${currentStep >= 3 ? 'text-green-500' : 'text-gray-500'}`}>Details</div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Side - Form */}
        <div className="md:w-2/3 lg:w-3/4 flex items-center justify-center py-6">
          <motion.div
            className="w-full max-w-2xl bg-gradient-to-br from-gray-800/90 via-gray-900/90 to-black/90 p-8 rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Mobile progress indicator */}
            <div className="md:hidden mb-8">
              <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-400 to-green-600"
                  style={{ width: `${progressPercentage}%` }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex justify-between text-sm mt-2">
                <div className={`${currentStep >= 1 ? 'text-green-500' : 'text-gray-500'}`}>Account</div>
                <div className={`${currentStep >= 2 ? 'text-green-500' : 'text-gray-500'}`}>Personal</div>
                <div className={`${currentStep >= 3 ? 'text-green-500' : 'text-gray-500'}`}>Details</div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
                    Create Your Account
                  </h2>
                  <p className="text-gray-400 text-center mb-8">
                    Let's start with your basic information
                  </p>

                  <div className="space-y-6">
                    {/* Name */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <motion.input
                          whileFocus="focus"
                          variants={inputVariants}
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-600'
                            } rounded-lg bg-gray-800/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all`}
                          placeholder="John Doe"
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                      <AnimatePresence>
                        {errors.name && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-1 text-sm text-red-400 flex items-center"
                          >
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.name}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <motion.input
                          whileFocus="focus"
                          variants={inputVariants}
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-600'
                            } rounded-lg bg-gray-800/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all`}
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

                    {/* Password */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <motion.input
                          whileFocus="focus"
                          variants={inputVariants}
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-12 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-600'
                            } rounded-lg bg-gray-800/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all`}
                          placeholder="Create a secure password"
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none transition-colors"
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
                      <p className="mt-2 text-xs text-gray-500">Password must be at least 6 characters</p>
                    </div>
                  </div>

                  <motion.div
                    className="mt-10 flex justify-end"
                  >
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      type="button"
                      onClick={handleNextStep}
                      className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all"
                    >
                      Continue
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
                    Personal Information
                  </h2>
                  <p className="text-gray-400 text-center mb-8">
                    Tell us a bit more about yourself
                  </p>

                  <div className="space-y-6">
                    {/* Phone */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <motion.input
                          whileFocus="focus"
                          variants={inputVariants}
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-600'
                            } rounded-lg bg-gray-800/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all`}
                          placeholder="+1 (555) 123-4567"
                        />
                        <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                      <AnimatePresence>
                        {errors.phone && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-1 text-sm text-red-400 flex items-center"
                          >
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.phone}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Date of Birth */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Date of Birth
                      </label>
                      <div className="relative">
                        <motion.input
                          whileFocus="focus"
                          variants={inputVariants}
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border ${errors.dob ? 'border-red-500' : 'border-gray-600'
                            } rounded-lg bg-gray-800/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all`}
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                      <AnimatePresence>
                        {errors.dob && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-1 text-sm text-red-400 flex items-center"
                          >
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.dob}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Profile Photo */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Profile Photo
                      </label>
                      <div className="flex flex-col items-center space-y-4">
                        {previewUrl ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-green-500/30"
                          >
                            <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
                            <button
                              onClick={() => {
                                setPreviewUrl(null);
                                setFormData(prev => ({ ...prev, profile_photo: '' }));
                              }}
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/3 -translate-y-1/3"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </motion.div>
                        ) : (
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="w-full border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-green-500 transition-colors cursor-pointer"
                            onClick={() => document.getElementById('profile_photo')?.click()}
                          >
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-400">
                              Click to upload a profile photo
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG or GIF up to 5MB
                            </p>
                          </motion.div>
                        )}
                        <input
                          id="profile_photo"
                          type="file"
                          name="profile_photo"
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                      <AnimatePresence>
                        {errors.profile_photo && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 text-sm text-red-400 flex items-center justify-center"
                          >
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.profile_photo}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <motion.div className="mt-10 flex justify-between">
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      type="button"
                      onClick={handlePrevStep}
                      className="px-8 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-all"
                    >
                      Back
                    </motion.button>

                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      type="button"
                      onClick={handleNextStep}
                      className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all"
                    >
                      Continue
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.form
                  key="step3"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
                    Final Details
                  </h2>
                  <p className="text-gray-400 text-center mb-8">
                    Almost there! Just a few more details
                  </p>

                  <div className="space-y-6">
                    {/* Preferred Language */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Preferred Language
                      </label>
                      <div className="relative">
                        <motion.select
                          whileFocus="focus"
                          variants={inputVariants}
                          name="language"
                          value={formData.language}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border ${errors.language ? 'border-red-500' : 'border-gray-600'
                            } rounded-lg bg-gray-800/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all`}
                        >
                          <option value="" disabled>Select your preferred language</option>
                          {languages.map(lang => (
                            <option key={lang} value={lang}>{lang}</option>
                          ))}
                        </motion.select>
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                    </div>

                    {/* About */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Tell Us About Yourself
                      </label>
                      <div className="relative">
                        <motion.textarea
                          whileFocus="focus"
                          variants={inputVariants}
                          name="about"
                          value={formData.about}
                          onChange={handleChange}
                          rows={4}
                          className={`w-full pl-10 pr-4 py-3 border ${errors.about ? 'border-red-500' : 'border-gray-600'
                            } rounded-lg bg-gray-800/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all`}
                          placeholder="Share a bit about yourself, your interests, and why you're signing up..."
                        />
                        <FileText className="absolute left-3 top-5 text-gray-400" size={18} />
                      </div>
                    </div>
                  </div>

                  {/* Display error message if API error occurred */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 mt-6 bg-red-500/10 border border-red-500/20 rounded-lg"
                    >
                      <p className="text-red-400 text-sm text-center">{error}</p>
                    </motion.div>
                  )}

                  <motion.div className="mt-10 flex justify-between">
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      type="button"
                      onClick={handlePrevStep}
                      className="px-8 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-all"
                    >
                      Back
                    </motion.button>

                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      type="submit"
                      disabled={isLoading}
                      className={`px-8 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Registering...</span>
                        </div>
                      ) : (
                        'Complete Registration'
                      )}
                    </motion.button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>

            {currentStep === 1 && (
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-400">
                  Already have an account?{' '}
                  <a
                    href="/login"
                    className="font-medium text-green-400 hover:text-green-300"
                  >
                    Sign in
                  </a>
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Register;