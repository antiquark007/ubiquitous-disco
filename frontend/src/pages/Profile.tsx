import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Edit2, 
  Save, 
  X,
  LogOut,
  User,
  Phone,
  Calendar,
  Globe,
  FileText,
  Cake
} from 'lucide-react';
import { ThreeScene } from '../components/ThreeScene';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

interface ProfileData {
  user_id: string;
  name: string;
  phone: string;
  dob: string;
  profile_photo: string;
  language: string;
  about: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [profileData, setProfileData] = useState<ProfileData>({
    user_id: localStorage.getItem('user_id') || '',
    name: '',
    phone: '',
    dob: '',
    profile_photo: '',
    language: '',
    about: ''
  });

  const [errors, setErrors] = useState<Partial<ProfileData>>({});

  const calculateAge = (dob: string) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age.toString();
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`https://dylexia.onrender.com/profile?user_id=${profileData.user_id}`);
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (profileData.user_id) {
      fetchProfile();
    }
  }, [profileData.user_id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ProfileData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, profile_photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      console.error('No user_id found in localStorage');
      return;
    }

    try {
      const { user_id, ...updateData } = profileData;
      
      const response = await fetch(`https://dylexia.onrender.com/update_profile?user_id=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update profile');
      }
      
      setIsEditing(false);
      const updatedData = await response.json();
      setProfileData(updatedData);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(error.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-black text-white relative overflow-hidden">
      {/* Circular Disk Pointer */}
      <div
        className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-green-300 via-green-500 to-green-700 opacity-15 blur-[200px] transition-transform duration-75"
        style={{
          transform: `translate(${cursorPosition.x - 300}px, ${cursorPosition.y - 300}px)`,
        }}
      />

      {/* Three.js Background */}
      <div className="absolute inset-0">
        <ThreeScene />
      </div>

      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
      
      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="flex justify-between items-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-bold bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent"
            >
              Profile Settings
            </motion.h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-400 hover:text-red-300 bg-red-500/10 px-4 py-2 rounded-lg"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </motion.button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-green-500/10">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <img
                      src={profileData.profile_photo || 'https://via.placeholder.com/150'}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-green-500/20"
                    />
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-green-500/20 rounded-full p-2 cursor-pointer hover:bg-green-500/30 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <Edit2 className="w-5 h-5 text-green-400" />
                      </label>
                    )}
                  </div>
                  <div className="text-center">
                    <h2 className="text-2xl font-semibold">{profileData.name || 'User'}</h2>
                    <p className="text-gray-400">ID: {profileData.user_id}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-8 border border-green-500/10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <User className="w-4 h-4 mr-2 text-green-400" />
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white disabled:opacity-50 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-green-400" />
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white disabled:opacity-50 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-green-400" />
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={profileData.dob}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white disabled:opacity-50 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <Cake className="w-4 h-4 mr-2 text-green-400" />
                        Age
                      </label>
                      <input
                        type="text"
                        value={calculateAge(profileData.dob)}
                        disabled
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-green-400" />
                        Language
                      </label>
                      <input
                        type="text"
                        name="language"
                        value={profileData.language}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white disabled:opacity-50 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-green-400" />
                      About
                    </label>
                    <textarea
                      name="about"
                      value={profileData.about}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white disabled:opacity-50 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4">
                    {isEditing ? (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center"
                        >
                          <X className="w-5 h-5 mr-2" />
                          Cancel
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-700 text-black rounded-lg hover:from-green-400 hover:to-green-600 flex items-center"
                        >
                          <Save className="w-5 h-5 mr-2" />
                          Save Changes
                        </motion.button>
                      </>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-700 text-black rounded-lg hover:from-green-400 hover:to-green-600 flex items-center"
                      >
                        <Edit2 className="w-5 h-5 mr-2" />
                        Edit Profile
                      </motion.button>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}