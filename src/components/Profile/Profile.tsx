import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Target, LogOut, Edit2, Save, X, Camera, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from '../../lib/auth';
import { uploadAvatar, deleteAvatar, updateProfile } from '../../lib/profileService';

interface ProfileProps {
  onLogout: () => void;
}

export default function Profile({ onLogout }: ProfileProps) {
  const { user, profile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        age: profile.age?.toString() || '',
        gender: profile.gender || '',
        height: profile.height?.toString() || '',
        weight: profile.weight?.toString() || '',
      });
    }
  }, [profile]);

  const handleLogout = async () => {
    try {
      await signOut();
      onLogout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    setError('');
    try {
      await updateProfile(user.id, {
        name: formData.name,
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender || null,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
      });

      await refreshProfile();
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }

    setUploadingAvatar(true);
    setError('');
    try {
      await uploadAvatar(user.id, file);
      await refreshProfile();
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user || !profile?.avatar_url) return;

    if (!confirm('Are you sure you want to remove your profile picture?')) return;

    setUploadingAvatar(true);
    setError('');
    try {
      await deleteAvatar(user.id);
      await refreshProfile();
    } catch (error: any) {
      console.error('Error deleting avatar:', error);
      setError('Failed to delete image. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-green-900 to-teal-800 pb-24">
      <div className="px-6 pt-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-white hover:bg-white/30 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
            {error && (
              <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-100 text-sm">
                {error}
              </div>
            )}

            <div className="flex items-center justify-center mb-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-green-500 flex items-center justify-center overflow-hidden">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center hover:bg-teal-600 transition-all shadow-lg disabled:opacity-50"
                      title={profile?.avatar_url ? 'Change picture' : 'Upload picture'}
                    >
                      <Camera className="w-5 h-5 text-white" />
                    </button>
                    {profile?.avatar_url && (
                      <button
                        onClick={handleDeleteAvatar}
                        disabled={uploadingAvatar}
                        className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-all shadow-lg disabled:opacity-50"
                        title="Remove picture"
                      >
                        <Trash2 className="w-5 h-5 text-white" />
                      </button>
                    )}
                  </div>
                </div>

                {uploadingAvatar && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-1">{profile?.name || 'User'}</h2>
              <p className="text-white/70 flex items-center justify-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{user?.email}</span>
              </p>
            </div>

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-lg text-white hover:bg-white/30 transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-green-500 px-3 py-2 rounded-lg text-white hover:bg-green-600 transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-lg text-white hover:bg-white/30 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/50 disabled:opacity-70 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    disabled={!isEditing}
                    placeholder="25"
                    className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/50 disabled:opacity-70 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    disabled={!isEditing}
                    className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/50 disabled:opacity-70 transition-all"
                  >
                    <option value="" className="bg-teal-900">Select</option>
                    <option value="male" className="bg-teal-900">Male</option>
                    <option value="female" className="bg-teal-900">Female</option>
                    <option value="other" className="bg-teal-900">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Height (cm)</label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    disabled={!isEditing}
                    placeholder="170"
                    className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/50 disabled:opacity-70 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    disabled={!isEditing}
                    placeholder="70"
                    className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/50 disabled:opacity-70 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Fitness Stats</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-teal-400/30 flex items-center justify-center">
                    <Target className="w-5 h-5 text-teal-200" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{profile?.level || 1}</p>
                    <p className="text-white/70 text-sm">Level</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-green-400/30 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-200" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{profile?.current_streak || 0}</p>
                    <p className="text-white/70 text-sm">Day Streak</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4 col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Total XP</p>
                    <p className="text-2xl font-bold text-white">{profile?.total_xp || 0}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-sm mb-1">Longest Streak</p>
                    <p className="text-2xl font-bold text-white">{profile?.longest_streak || 0} days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
