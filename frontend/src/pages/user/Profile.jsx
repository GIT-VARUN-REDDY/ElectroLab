import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Lock, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '',
    college: user?.college || '', course: user?.course || '',
  });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', form);
      if (data.success) { updateUser(data.user); toast.success('Profile updated'); }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally { setSaving(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirm) return toast.error('Passwords do not match');
    if (passwords.newPassword.length < 6) return toast.error('Password too short');
    setChangingPass(true);
    try {
      const { data } = await api.put('/users/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      if (data.success) { toast.success('Password changed'); setPasswords({ currentPassword: '', newPassword: '', confirm: '' }); }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setChangingPass(false); }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('avatar', file);
    setUploadingAvatar(true);
    try {
      const { data } = await api.put('/users/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (data.success) { updateUser({ avatar: data.avatar }); toast.success('Avatar updated'); }
    } catch { toast.error('Failed to upload avatar'); }
    finally { setUploadingAvatar(false); }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-black text-white mb-8">
          My <span className="gradient-text">Profile</span>
        </motion.h1>

        <div className="glass rounded-2xl p-6 mb-6 flex items-center gap-6">
          <div className="relative">
            {user?.avatar
              ? <img src={user.avatar} alt="Your profile avatar" className="w-20 h-20 rounded-2xl object-cover" />
              : <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl font-black" aria-hidden="true">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
            }
            <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-primary-500 transition-colors" aria-label="Change profile photo">
              {uploadingAvatar
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                : <Camera className="w-4 h-4 text-white" aria-hidden="true" />
              }
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" aria-label="Upload profile photo" />
            </label>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-gray-400">{user?.email}</p>
            <p className="text-xs text-primary-400 mt-1 capitalize">{user?.role}</p>
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="glass rounded-2xl p-6 mb-6 space-y-5" aria-label="Profile information form">
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-primary-400" aria-hidden="true" /> Personal Information
          </h3>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="profile-name" className="text-xs text-gray-400 mb-1.5 block">Full Name</label>
              <input id="profile-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-glass" autoComplete="name" />
            </div>
            <div>
              <label htmlFor="profile-email" className="text-xs text-gray-400 mb-1.5 block">Email (read-only)</label>
              <input id="profile-email" value={user?.email} className="input-glass opacity-50 cursor-not-allowed" readOnly aria-readonly="true" />
            </div>
            <div>
              <label htmlFor="profile-phone" className="text-xs text-gray-400 mb-1.5 block">Phone</label>
              <input id="profile-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-glass" placeholder="+91 XXXXX XXXXX" autoComplete="tel" />
            </div>
            <div>
              <label htmlFor="profile-college" className="text-xs text-gray-400 mb-1.5 block">College</label>
              <input id="profile-college" value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} className="input-glass" placeholder="Your institution" autoComplete="organization" />
            </div>
            <div>
              <label htmlFor="profile-course" className="text-xs text-gray-400 mb-1.5 block">Course</label>
              <input id="profile-course" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} className="input-glass" placeholder="e.g. B.Tech ECE" />
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" aria-hidden="true" />{saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        <form onSubmit={handlePasswordChange} className="glass rounded-2xl p-6 space-y-5" aria-label="Change password form">
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary-400" aria-hidden="true" /> Change Password
          </h3>
          <div>
            <label htmlFor="current-password" className="text-xs text-gray-400 mb-1.5 block">Current Password</label>
            <input id="current-password" type="password" value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              className="input-glass" placeholder="Your current password" required aria-required="true" autoComplete="current-password" />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="new-pass" className="text-xs text-gray-400 mb-1.5 block">New Password</label>
              <input id="new-pass" type="password" value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                className="input-glass" placeholder="Min. 6 characters" required aria-required="true" autoComplete="new-password" />
            </div>
            <div>
              <label htmlFor="confirm-pass" className="text-xs text-gray-400 mb-1.5 block">Confirm New Password</label>
              <input id="confirm-pass" type="password" value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="input-glass" placeholder="Re-enter new password" required aria-required="true" autoComplete="new-password" />
            </div>
          </div>
          <button type="submit" disabled={changingPass} className="btn-primary flex items-center gap-2">
            <Lock className="w-4 h-4" aria-hidden="true" />{changingPass ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;