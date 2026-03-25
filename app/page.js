'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Facebook, Twitter, Linkedin, Youtube, Music, LogOut, Sun, Moon, AlertCircle, CheckCircle, Loader, TrendingUp, Users, Calendar, Activity, Shield, Image as ImageIcon, Hash, UserCheck } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './styles/Dashboard.module.css';

const platforms = [
  { name: 'Instagram', icon: Instagram, color: '#E4405F' },
  { name: 'Facebook', icon: Facebook, color: '#1877F2' },
  { name: 'Twitter', icon: Twitter, color: '#1DA1F2' },
];
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';


export default function App() {
  const [user, setUser] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      const savedTheme = localStorage.getItem('theme');
      
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error('Error parsing user data:', e);
          localStorage.removeItem('user');
        }
      }
      
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      }
    }
  }, []);

  const handleAuth = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.email || !formData.password || (authMode === 'signup' && !formData.name)) {
      setError('Please fill in all fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email');
      return;
    }

    const userData = { name: formData.name || formData.email.split('@')[0], email: formData.email };
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
    }
    setUser(userData);
    setSuccess(authMode === 'login' ? 'Login successful!' : 'Account created successfully!');
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    setUser(null);
    setFormData({ name: '', email: '', password: '' });
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    }
  };

  if (!mounted) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f5f7fa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Loader size={48} className="spin" style={{ color: '#3b82f6', margin: '0 auto' }} />
          <p style={{ marginTop: '16px', color: '#64748b' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`${styles.container} ${isDark ? styles.dark : styles.light}`}>
        <div className={styles.authContainer}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${styles.authCard} ${isDark ? styles.authCardDark : styles.authCardLight}`}
          >
            <div className={styles.flexBetween} style={{ marginBottom: '30px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>
                {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h1>
              <button
                onClick={toggleTheme}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isDark ? '#f5f7fa' : '#1a202c',
                }}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            <div>
              {authMode === 'signup' && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`${styles.input} ${isDark ? styles.inputDark : styles.inputLight}`}
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`${styles.input} ${isDark ? styles.inputDark : styles.inputLight}`}
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && handleAuth(e)}
                className={`${styles.input} ${isDark ? styles.inputDark : styles.inputLight}`}
              />

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ color: '#ef4444', marginBottom: '16px', fontSize: '14px' }}
                >
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ color: '#10b981', marginBottom: '16px', fontSize: '14px' }}
                >
                  {success}
                </motion.div>
              )}

              <button
                onClick={handleAuth}
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                {authMode === 'login' ? 'Sign In' : 'Sign Up'}
              </button>

              <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
                {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <span
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'signup' : 'login');
                    setError('');
                    setSuccess('');
                  }}
                  style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: '600' }}
                >
                  {authMode === 'login' ? 'Sign Up' : 'Sign In'}
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return <Dashboard user={user} isDark={isDark} toggleTheme={toggleTheme} handleLogout={handleLogout} />;
}

function Dashboard({ user, isDark, toggleTheme, handleLogout }) {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [chartData, setChartData] = useState([]);

  // Profile data form state
  const [profileData, setProfileData] = useState({
    username: '',
    followers: '',
    following: '',
    posts: '',
    profilePicture: 'yes',
    isVerified: 'no',
    accountAge: '',
    bio: '',
    bioLength: '',
    postsWithLinks: '',
    avgLikesPerPost: '',
    avgCommentsPerPost: '',
    followersToFollowingRatio: '',
    postFrequency: '',
    hashtagsPerPost: '',
    externalLinks: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem('scanHistory');
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory);
          setHistory(parsedHistory);
          setChartData(parsedHistory.slice(-10).map((item, idx) => ({
            name: `Scan ${idx + 1}`,
            accuracy: item.confidence,
          })));
        } catch (e) {
          console.error('Error parsing history:', e);
        }
      }
    }
  }, []);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateDerivedMetrics = () => {
    const followers = parseFloat(profileData.followers) || 0;
    const following = parseFloat(profileData.following) || 0;
    const posts = parseFloat(profileData.posts) || 0;

    // Calculate follower to following ratio
    const ratio = following > 0 ? (followers / following).toFixed(2) : 0;
    
    return {
      followersToFollowingRatio: ratio,
      bioLength: profileData.bio.length,
    };
  };

  const handleScan = async () => {
    // Validate required fields
    if (!profileData.username || !profileData.followers || !profileData.following || !profileData.posts) {
      alert('Please fill in at least Username, Followers, Following, and Posts');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const derived = calculateDerivedMetrics();
      
      // Prepare data for API
      const scanData = {
        username: profileData.username,
        followers: parseFloat(profileData.followers) || 0,
        following: parseFloat(profileData.following) || 0,
        posts: parseFloat(profileData.posts) || 0,
        profilePicture: profileData.profilePicture === 'yes' ? 1 : 0,
        isVerified: profileData.isVerified === 'yes' ? 1 : 0,
        accountAge: parseFloat(profileData.accountAge) || 0,
        bio: profileData.bio,
        bioLength: derived.bioLength,
        postsWithLinks: parseFloat(profileData.postsWithLinks) || 0,
        avgLikesPerPost: parseFloat(profileData.avgLikesPerPost) || 0,
        avgCommentsPerPost: parseFloat(profileData.avgCommentsPerPost) || 0,
        followersToFollowingRatio: parseFloat(derived.followersToFollowingRatio),
        postFrequency: parseFloat(profileData.postFrequency) || 0,
        hashtagsPerPost: parseFloat(profileData.hashtagsPerPost) || 0,
        externalLinks: parseFloat(profileData.externalLinks) || 0,
        platform: selectedPlatform
      };

      console.log('Sending scan request to:', `${API_BASE_URL}/api/scan`);
      console.log('Scan data:', scanData);

      const response = await fetch(`${API_BASE_URL}/api/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scanData),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to scan profile: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      const scanResult = {
        ...data,
        platform: selectedPlatform,
        url: profileData.username,
        timestamp: new Date().toISOString(),
        profileData: {
          username: profileData.username,
          followers: profileData.followers,
          following: profileData.following,
          posts_count: profileData.posts,
          is_verified: profileData.isVerified === 'yes',
          biography: profileData.bio,
        }
      };

      setResult(scanResult);

      // Update history
      const updatedHistory = [scanResult, ...history];
      setHistory(updatedHistory);
      if (typeof window !== 'undefined') {
        localStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
      }

      setChartData(updatedHistory.slice(-10).map((item, idx) => ({
        name: `Scan ${idx + 1}`,
        accuracy: item.confidence,
      })));

    } catch (err) {
      console.error('Error scanning profile:', err);
      alert(`Failed to scan profile: ${err.message}\n\nMake sure the backend server is running at ${API_BASE_URL}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProfileData({
      username: '',
      followers: '',
      following: '',
      posts: '',
      profilePicture: 'yes',
      isVerified: 'no',
      accountAge: '',
      bio: '',
      bioLength: '',
      postsWithLinks: '',
      avgLikesPerPost: '',
      avgCommentsPerPost: '',
      followersToFollowingRatio: '',
      postFrequency: '',
      hashtagsPerPost: '',
      externalLinks: '',
    });
    setResult(null);
  };

  return (
    <>
      <div className={`${styles.container} ${isDark ? styles.dark : styles.light}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}
        >
          {/* Header */}
          <div className={styles.flexBetween} style={{ marginBottom: '40px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: '700', margin: 0 }}>
                Fake Account Detector
              </h1>
              <p style={{ marginTop: '8px', opacity: 0.7 }}>Welcome, {user.name}!</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={toggleTheme}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isDark ? '#f5f7fa' : '#1a202c',
                }}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={handleLogout}
                className={`${styles.button} ${styles.buttonSecondary}`}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>

          {/* Platform Selection */}
          <AnimatePresence mode="wait">
            {!selectedPlatform && (
              <motion.div
                key="platform-selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Select a Platform</h2>
                <div className={styles.platformGrid}>
                  {platforms.map((platform, idx) => (
                    <motion.button
                      key={platform.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => setSelectedPlatform(platform.name)}
                      className={`${styles.platformCard} ${isDark ? styles.platformCardDark : styles.platformCardLight}`}
                      whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <platform.icon size={48} color={platform.color} />
                      <h3 style={{ marginTop: '16px', fontSize: '18px', fontWeight: '600' }}>
                        {platform.name}
                      </h3>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Manual Input Form */}
            {selectedPlatform && (
              <motion.div
                key="input-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button
                    onClick={() => {
                      setSelectedPlatform(null);
                      resetForm();
                    }}
                    className={`${styles.button} ${styles.buttonSecondary}`}
                  >
                    ← Back
                  </button>
                  <h2 style={{ fontSize: '24px', margin: 0 }}>Enter {selectedPlatform} Profile Details</h2>
                </div>

                <div className={`${styles.scanSection} ${isDark ? styles.scanSectionDark : styles.scanSectionLight}`}>
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: '600' }}>
                      Basic Information
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                      <InputField
                        label="Username *"
                        icon={UserCheck}
                        value={profileData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        placeholder="e.g., @johndoe"
                        isDark={isDark}
                      />
                      <InputField
                        label="Followers *"
                        icon={Users}
                        type="number"
                        value={profileData.followers}
                        onChange={(e) => handleInputChange('followers', e.target.value)}
                        placeholder="e.g., 1500"
                        isDark={isDark}
                      />
                      <InputField
                        label="Following *"
                        icon={Users}
                        type="number"
                        value={profileData.following}
                        onChange={(e) => handleInputChange('following', e.target.value)}
                        placeholder="e.g., 300"
                        isDark={isDark}
                      />
                      <InputField
                        label="Total Posts *"
                        icon={Hash}
                        type="number"
                        value={profileData.posts}
                        onChange={(e) => handleInputChange('posts', e.target.value)}
                        placeholder="e.g., 50"
                        isDark={isDark}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: '600' }}>
                      Account Details
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                      <SelectField
                        label="Has Profile Picture?"
                        icon={ImageIcon}
                        value={profileData.profilePicture}
                        onChange={(e) => handleInputChange('profilePicture', e.target.value)}
                        options={[
                          { value: 'yes', label: 'Yes' },
                          { value: 'no', label: 'No' }
                        ]}
                        isDark={isDark}
                      />
                      <SelectField
                        label="Is Verified?"
                        icon={CheckCircle}
                        value={profileData.isVerified}
                        onChange={(e) => handleInputChange('isVerified', e.target.value)}
                        options={[
                          { value: 'no', label: 'No' },
                          { value: 'yes', label: 'Yes' }
                        ]}
                        isDark={isDark}
                      />
                      <InputField
                        label="Account Age (years)"
                        icon={Calendar}
                        type="number"
                        step="0.1"
                        value={profileData.accountAge}
                        onChange={(e) => handleInputChange('accountAge', e.target.value)}
                        placeholder="e.g., 2.5"
                        isDark={isDark}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: '600' }}>
                      Engagement Metrics
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                      <InputField
                        label="Avg Likes Per Post"
                        icon={Activity}
                        type="number"
                        value={profileData.avgLikesPerPost}
                        onChange={(e) => handleInputChange('avgLikesPerPost', e.target.value)}
                        placeholder="e.g., 50"
                        isDark={isDark}
                      />
                      <InputField
                        label="Avg Comments Per Post"
                        icon={Activity}
                        type="number"
                        value={profileData.avgCommentsPerPost}
                        onChange={(e) => handleInputChange('avgCommentsPerPost', e.target.value)}
                        placeholder="e.g., 10"
                        isDark={isDark}
                      />
                      <InputField
                        label="Posts Per Week"
                        icon={TrendingUp}
                        type="number"
                        step="0.1"
                        value={profileData.postFrequency}
                        onChange={(e) => handleInputChange('postFrequency', e.target.value)}
                        placeholder="e.g., 3.5"
                        isDark={isDark}
                      />
                      <InputField
                        label="Avg Hashtags Per Post"
                        icon={Hash}
                        type="number"
                        step="0.1"
                        value={profileData.hashtagsPerPost}
                        onChange={(e) => handleInputChange('hashtagsPerPost', e.target.value)}
                        placeholder="e.g., 5"
                        isDark={isDark}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: '600' }}>
                      Content Analysis
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                      <InputField
                        label="Posts with External Links"
                        icon={Activity}
                        type="number"
                        value={profileData.postsWithLinks}
                        onChange={(e) => handleInputChange('postsWithLinks', e.target.value)}
                        placeholder="e.g., 5"
                        isDark={isDark}
                      />
                      <InputField
                        label="External Links in Bio"
                        icon={Activity}
                        type="number"
                        value={profileData.externalLinks}
                        onChange={(e) => handleInputChange('externalLinks', e.target.value)}
                        placeholder="e.g., 2"
                        isDark={isDark}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      Bio / Description
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Enter the account bio or description..."
                      className={`${styles.input} ${isDark ? styles.inputDark : styles.inputLight}`}
                      style={{ 
                        minHeight: '100px', 
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                    />
                    <p style={{ fontSize: '12px', opacity: 0.6, marginTop: '4px' }}>
                      Character count: {profileData.bio.length}
                    </p>
                  </div>

                  <div style={{ 
                    padding: '16px', 
                    backgroundColor: isDark ? '#374151' : '#f3f4f6',
                    borderRadius: '8px',
                    marginBottom: '24px'
                  }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '12px', fontWeight: '600' }}>
                      Calculated Metrics
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '14px' }}>
                      <div>
                        <span style={{ opacity: 0.7 }}>Follower:Following Ratio: </span>
                        <strong>{calculateDerivedMetrics().followersToFollowingRatio}</strong>
                      </div>
                      <div>
                        <span style={{ opacity: 0.7 }}>Bio Length: </span>
                        <strong>{calculateDerivedMetrics().bioLength} chars</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={resetForm}
                      className={`${styles.button} ${styles.buttonSecondary}`}
                      disabled={loading}
                    >
                      Reset Form
                    </button>
                    <button
                      onClick={handleScan}
                      className={`${styles.button} ${styles.buttonPrimary}`}
                      disabled={loading || !profileData.username || !profileData.followers || !profileData.following || !profileData.posts}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      {loading ? (
                        <>
                          <Loader size={18} className="spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Shield size={18} />
                          Analyze Profile
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Results Display */}
                <AnimatePresence>
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{ marginTop: '32px' }}
                    >
                      {/* Profile Preview */}
                      {result.profileData && (
                        <div 
                          className={`${styles.scanSection} ${isDark ? styles.scanSectionDark : styles.scanSectionLight}`}
                          style={{ marginBottom: '20px' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{
                              width: '80px',
                              height: '80px',
                              borderRadius: '50%',
                              backgroundColor: isDark ? '#4b5563' : '#e2e8f0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '32px',
                              fontWeight: '700',
                            }}>
                              {result.profileData.username?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div style={{ flex: 1 }}>
                              <h4 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {result.profileData.username || 'Unknown User'}
                                {result.profileData.is_verified && (
                                  <Shield size={18} color="#3b82f6" />
                                )}
                              </h4>
                              <p style={{ margin: '0 0 8px 0', opacity: 0.7, fontSize: '14px' }}>
                                {result.profileData.biography || 'No bio available'}
                              </p>
                              <div style={{ display: 'flex', gap: '16px', fontSize: '14px', flexWrap: 'wrap' }}>
                                <span><strong>{result.profileData.followers || 0}</strong> followers</span>
                                <span><strong>{result.profileData.following || 0}</strong> following</span>
                                <span><strong>{result.profileData.posts_count || 0}</strong> posts</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Detection Result */}
                      <div
                        className={`${styles.resultCard} ${isDark ? styles.resultCardDark : styles.resultCardLight}`}
                        style={{
                          borderLeft: `4px solid ${result.isFake ? '#ef4444' : '#10b981'}`,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                          {result.isFake ? (
                            <AlertCircle size={32} color="#ef4444" />
                          ) : (
                            <CheckCircle size={32} color="#10b981" />
                          )}
                          <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 4px 0' }}>
                              {result.isFake ? 'Suspicious Account Detected' : 'Appears to be Genuine'}
                            </h4>
                            <p style={{ margin: 0, opacity: 0.7 }}>
                              Confidence: {result.confidence}%
                            </p>
                            {result.accountStatus && (
                              <p style={{ 
                                fontSize: '14px', 
                                marginTop: '8px',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                backgroundColor: isDark ? '#374151' : '#f3f4f6',
                                display: 'inline-block'
                              }}>
                                Classification: <strong>{result.accountStatus}</strong>
                                {result.predictedClass && ` (${result.predictedClass})`}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className={`${styles.progressBar} ${isDark ? styles.progressBarDark : styles.progressBarLight}`}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.confidence}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={styles.progressFill}
                            style={{
                              backgroundColor: result.isFake ? '#ef4444' : '#10b981',
                            }}
                          />
                        </div>

                        {result.riskFactors && result.riskFactors.length > 0 && (
                          <div style={{ marginTop: '20px' }}>
                            <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                              {result.isFake ? 'Risk Factors Identified:' : 'Analysis Notes:'}
                            </h5>
                            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                              {result.riskFactors.map((factor, idx) => (
                                <li key={idx} style={{ marginBottom: '6px', opacity: 0.9 }}>
                                  {factor}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <h5 style={{ fontSize: '16px', fontWeight: '600', marginTop: '24px', marginBottom: '16px' }}>
                          Analysis Details
                        </h5>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                          {result.details && (
                            <>
                              <DetailItem icon={Calendar} label="Account Age" value={result.details.accountAge} isDark={isDark} />
                              <DetailItem icon={Users} label="Follower Ratio" value={result.details.followerRatio} isDark={isDark} />
                              <DetailItem icon={TrendingUp} label="Bio Status" value={result.details.bioSentiment} isDark={isDark} />
                              <DetailItem icon={Activity} label="Profile Picture" value={result.details.profilePicture} isDark={isDark} />
                              <DetailItem icon={Activity} label="Posting Activity" value={result.details.postingActivity} isDark={isDark} />
                              {result.details.engagementRate && (
                                <DetailItem icon={TrendingUp} label="Engagement Rate" value={result.details.engagementRate} isDark={isDark} />
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Charts and History */}
          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ marginTop: '40px' }}
            >
              <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Detection Accuracy Over Time</h2>
              <div className={`${styles.scanSection} ${isDark ? styles.scanSectionDark : styles.scanSectionLight}`}>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4b5563' : '#e2e8f0'} />
                    <XAxis dataKey="name" stroke={isDark ? '#9ca3af' : '#64748b'} />
                    <YAxis stroke={isDark ? '#9ca3af' : '#64748b'} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#2d3748' : '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        color: isDark ? '#f5f7fa' : '#1a202c',
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#3b82f6" 
                      strokeWidth={3} 
                      dot={{ fill: '#3b82f6', r: 5 }} 
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <h2 style={{ fontSize: '20px', marginBottom: '20px', marginTop: '40px' }}>Scan History</h2>
              {history.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`${styles.historyCard} ${isDark ? styles.historyCardDark : styles.historyCardLight}`}
                >
                  <div className={styles.flexBetween}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {item.isFake ? (
                        <AlertCircle size={20} color="#ef4444" />
                      ) : (
                        <CheckCircle size={20} color="#10b981" />
                      )}
                      <div>
                        <p style={{ fontWeight: '600', margin: '0 0 4px 0' }}>
                          {item.platform} - {item.accountStatus || (item.isFake ? 'Fake' : 'Real')}
                        </p>
                        <p style={{ fontSize: '12px', opacity: 0.6, margin: 0 }}>{item.url}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: '600', margin: '0 0 4px 0' }}>{item.confidence}%</p>
                      <p style={{ fontSize: '12px', opacity: 0.6, margin: 0 }}>
                        {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
}

function InputField({ label, icon: Icon, type = 'text', value, onChange, placeholder, isDark, step }) {
  return (
    <div>
      <label style={{ 
        display: 'block', 
        marginBottom: '8px', 
        fontWeight: '600',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        {Icon && <Icon size={16} />}
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        step={step}
        className={`${styles.input} ${isDark ? styles.inputDark : styles.inputLight}`}
      />
    </div>
  );
}

function SelectField({ label, icon: Icon, value, onChange, options, isDark }) {
  return (
    <div>
      <label style={{ 
        display: 'block', 
        marginBottom: '8px', 
        fontWeight: '600',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        {Icon && <Icon size={16} />}
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className={`${styles.input} ${isDark ? styles.inputDark : styles.inputLight}`}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value, isDark }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div
        style={{
          padding: '10px',
          borderRadius: '8px',
          backgroundColor: isDark ? '#374151' : '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={20} />
      </div>
      <div>
         <p style={{ fontSize: '12px', opacity: 0.6, margin: '0 0 4px 0' }}>{label}</p>
        <p style={{ fontWeight: '600', margin: 0 }}>{value}</p>
      </div>
    </div>
  );
}