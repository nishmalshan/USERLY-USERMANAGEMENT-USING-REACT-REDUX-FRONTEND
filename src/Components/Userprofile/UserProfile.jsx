import { useState, useRef, useEffect } from 'react';
import { User, PencilLine, Camera, Save, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slices/authSlice';
import axios from 'axios';

const UserProfile = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  
  // Local state for profile data
  const [profileData, setProfileData] = useState({
    username: user?.name || '',
    email: user?.email || '',
    profileImage: user?.profileImage || null
  });
  
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editedUsername, setEditedUsername] = useState(user?.name || '');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Sync profileData with Redux user state when it changes
  useEffect(() => {
    setProfileData({
      username: user?.name || '',
      email: user?.email || '',
      profileImage: user?.profileImage || null
    });
    setEditedUsername(user?.name || '');
  }, [user]);

  // Handle username edit toggle
  const handleEditUsername = () => {
    setIsEditingUsername(true);
    setEditedUsername(profileData.username);
  };

  // Cancel username editing
  const handleCancelEdit = () => {
    setIsEditingUsername(false);
    setError('');
  };

  // Save username changes
  const handleSaveUsername = async () => {
    if (!editedUsername.trim() || editedUsername.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    try {
      const response = await axios.patch('http://localhost:5000/updateUsername', {
        username: editedUsername
      }, {
        withCredentials: true // Include cookies for authentication
      });
      

      if (response.data.success) {
        setProfileData(prev => ({
          ...prev,
          username: response.data.user
        }));

        dispatch(updateUser({
          user: {
            ...user, // Preserve existing user data (email, etc.)
            name: response.data.user // Update only the name
          }
        }));

        setIsEditingUsername(false);
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  // Trigger file input click
  const handleProfileImageClick = () => {
    fileInputRef.current.click();
  };

  // Handle profile image upload
  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPG or PNG image');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Image size must be less than 2MB');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('profileImage', file);
      const response = await axios.post('http://localhost:5000/api/users/upload-profile-image', formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      if (response.data.success) {
        const newImageUrl = response.data.imageUrl;

        // Update local state
        setProfileData((prev) => ({
          ...prev,
          profileImage: newImageUrl,
        }));

        // Update Redux state
        dispatch(
          updateUser({
            user: { ...user, profileImage: newImageUrl },
          })
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-rose-50">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-5/10 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#f5593d] to-[#e24023] mb-6">User Profile</h2>
          
          {/* Profile Image */}
          <div className="relative mx-auto w-28 h-28 mb-4">
            <div 
              className="w-full h-full rounded-full bg-gradient-to-r from-[#f5593d] to-[#e24023] p-1 shadow-lg"
              onClick={handleProfileImageClick}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 relative group">
                {profileData.profileImage ? (
                  <img 
                    src={profileData.profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {isUploading ? (
                    <div className="animate-pulse text-white">Uploading...</div>
                  ) : (
                    <Camera className="w-8 h-8 text-white" />
                  )}
                </div>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleProfileImageChange}
              className="hidden"
              accept="image/png, image/jpeg, image/jpg"
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* Username Field */}
          <div className="group">
            <div className="relative">
              {isEditingUsername ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={editedUsername}
                    onChange={(e) => setEditedUsername(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#f5593d]"
                    placeholder="Enter username"
                  />
                  <div className="absolute right-2 flex space-x-2">
                    <button onClick={handleSaveUsername} className="text-green-500 hover:text-green-600">
                      <Save className="h-5 w-5" />
                    </button>
                    <button onClick={handleCancelEdit} className="text-red-500 hover:text-red-600">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center">
                  <h3 className="text-gray-800 font-medium text-2xl">{profileData.username}</h3>
                  <button onClick={handleEditUsername} className="text-gray-500 hover:text-[#f5593d] ml-2">
                    <PencilLine className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
            {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
          </div>

          {/* Email Field */}
          <div className="group">
            <label className="block text-gray-700 text-sm font-medium mb-2 ml-1">Email Address</label>
            <div className="p-3">
              <p className="text-gray-800">{profileData.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;