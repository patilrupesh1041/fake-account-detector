'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Facebook, Twitter, Linkedin, Youtube, Music, LogOut, Sun, Moon, AlertCircle, CheckCircle, Loader, TrendingUp, Users, Calendar, Activity, Shield } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './styles/Dashboard.module.css';

const platforms = [
  { name: 'Instagram', icon: Instagram, color: '#E4405F' },
  { name: 'Facebook', icon: Facebook, color: '#1877F2' },
  { name: 'Twitter', icon: Twitter, color: '#1DA1F2' },
  { name: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
  { name: 'TikTok', icon: Music, color: '#000000' },
  { name: 'YouTube', icon: Youtube, color: '#FF0000' },
];

const API_BASE_URL = 'http://localhost:8000';

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
    
    // Safely access localStorage only on client
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

  // Prevent hydration mismatch - show loading or nothing during SSR
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
            {/* Rest of auth UI remains the same */}
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

              <button onClick={handleAuth} className={`${styles.button} ${styles.buttonPrimary}`}>
                {authMode === 'login' ? 'Login' : 'Sign Up'}
              </button>
            </div>

            <p className={styles.textCenter} style={{ marginTop: '20px', fontSize: '14px' }}>
              {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <span
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'signup' : 'login');
                  setError('');
                  setSuccess('');
                }}
                style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: '600' }}
              >
                {authMode === 'login' ? 'Sign Up' : 'Login'}
              </span>
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${isDark ? styles.dark : styles.light}`}>
      <Dashboard user={user} isDark={isDark} onLogout={handleLogout} onToggleTheme={toggleTheme} />
    </div>
  );
}

function Dashboard({ user, isDark, onLogout, onToggleTheme }) {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [profileUrl, setProfileUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    const savedHistory = localStorage.getItem('scanHistory');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        const data = await response.json();
        setApiStatus(data.status === 'healthy' ? 'connected' : 'disconnected');
      } else {
        setApiStatus('disconnected');
      }
    } catch {
      setApiStatus('disconnected');
    }
  };

  const handleScan = async () => {
    if (!profileUrl.trim()) {
      setError('Please enter a profile URL or username');
      return;
    }

    setScanning(true);
    setResult(null);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: selectedPlatform.name,
          profileUrl: profileUrl.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const newResult = {
          platform: selectedPlatform.name,
          url: profileUrl.trim(),
          isFake: data.isFake,
          confidence: data.confidence,
          accountStatus: data.accountStatus,
          predictedClass: data.predictedClass,
          details: data.details,
          profileData: data.profileData,
          timestamp: new Date().toISOString(),
        };

        setResult(newResult);
        setApiStatus('connected');

        const updatedHistory = [newResult, ...history].slice(0, 10);
        setHistory(updatedHistory);
        localStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
      } else {
        setError(data.error || data.detail || 'Failed to scan profile. Please check the username/URL.');
      }
    } catch (err) {
      console.error('Error calling API:', err);
      setError(
        'Cannot connect to backend server. Please ensure:\n' +
        '1. Backend is running: python main.py\n' +
        '2. Server is at http://localhost:8000\n' +
        '3. Check browser console for details'
      );
      setApiStatus('disconnected');
    } finally {
      setScanning(false);
    }
  };

  const chartData = history.slice(0, 7).reverse().map((item, idx) => ({
    name: `Scan ${idx + 1}`,
    accuracy: item.confidence,
  }));

  return (
    <>
      <nav className={`${styles.navbar} ${isDark ? styles.navbarDark : styles.navbarLight}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>
            Fake Social Media Account Detection
          </h1>
          <div 
            className={`${styles.statusIndicator} ${
              apiStatus === 'connected' ? styles.statusConnected : 
              apiStatus === 'disconnected' ? styles.statusDisconnected : 
              styles.statusChecking
            }`}
            title={apiStatus === 'connected' ? 'Backend Connected' : 'Backend Disconnected'}
          />
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button
            onClick={onToggleTheme}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              color: isDark ? '#f5f7fa' : '#1a202c',
            }}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease',
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </nav>

      <div className={styles.dashboard}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {apiStatus === 'disconnected' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${styles.alert} ${isDark ? styles.alertErrorDark : styles.alertError}`}
            >
              <AlertCircle size={20} />
              <div>
                <strong>Backend Not Connected</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                  Run: <code>cd backend && python main.py</code> or <code>uvicorn main:app --reload --port 8000</code>
                </p>
              </div>
            </motion.div>
          )}

          <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Select Platform</h2>
          <div className={styles.platformGrid}>
            {platforms.map((platform) => (
              <motion.div
                key={platform.name}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedPlatform(platform);
                  setError('');
                  setResult(null);
                }}
                className={`${styles.platformCard} ${isDark ? styles.platformCardDark : styles.platformCardLight}`}
                style={{
                  borderColor: selectedPlatform?.name === platform.name ? platform.color : 'transparent',
                }}
              >
                <platform.icon size={40} color={platform.color} style={{ margin: '0 auto 12px' }} />
                <p style={{ fontWeight: '600', margin: 0 }}>{platform.name}</p>
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {selectedPlatform && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`${styles.scanSection} ${isDark ? styles.scanSectionDark : styles.scanSectionLight}`}
              >
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>
                  Scan {selectedPlatform.name} Profile
                </h3>
                <p style={{ fontSize: '14px', opacity: 0.7, marginBottom: '16px' }}>
                  Enter username (e.g., @username) or full profile URL
                </p>
                
                {/* Sample usernames hint */}
                <div style={{ 
                  padding: '12px', 
                  borderRadius: '8px', 
                  backgroundColor: isDark ? '#374151' : '#f3f4f6',
                  marginBottom: '16px',
                  fontSize: '13px'
                }}>
                  <strong>💡 Test with sample usernames:</strong>
                  <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedPlatform.name === 'Instagram' && (
                      <>
                        <code style={{ padding: '2px 6px', backgroundColor: isDark ? '#1f2937' : '#e5e7eb', borderRadius: '4px' }}>instagram</code>
                        <code style={{ padding: '2px 6px', backgroundColor: isDark ? '#1f2937' : '#e5e7eb', borderRadius: '4px' }}>fake_account_123</code>
                        <code style={{ padding: '2px 6px', backgroundColor: isDark ? '#1f2937' : '#e5e7eb', borderRadius: '4px' }}>real_person</code>
                      </>
                    )}
                    {selectedPlatform.name === 'Twitter' && (
                      <>
                        <code style={{ padding: '2px 6px', backgroundColor: isDark ? '#1f2937' : '#e5e7eb', borderRadius: '4px' }}>twitter</code>
                        <code style={{ padding: '2px 6px', backgroundColor: isDark ? '#1f2937' : '#e5e7eb', borderRadius: '4px' }}>elonmusk</code>
                        <code style={{ padding: '2px 6px', backgroundColor: isDark ? '#1f2937' : '#e5e7eb', borderRadius: '4px' }}>fake_bot_2023</code>
                      </>
                    )}
                    {selectedPlatform.name === 'Facebook' && (
                      <>
                        <code style={{ padding: '2px 6px', backgroundColor: isDark ? '#1f2937' : '#e5e7eb', borderRadius: '4px' }}>facebook</code>
                        <code style={{ padding: '2px 6px', backgroundColor: isDark ? '#1f2937' : '#e5e7eb', borderRadius: '4px' }}>fake_fb_account</code>
                      </>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder={`@username or https://${selectedPlatform.name.toLowerCase()}.com/username`}
                    value={profileUrl}
                    onChange={(e) => {
                      setProfileUrl(e.target.value);
                      setError('');
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && !scanning && profileUrl.trim() && handleScan()}
                    className={`${styles.input} ${isDark ? styles.inputDark : styles.inputLight}`}
                    style={{ flex: 1, marginBottom: 0 }}
                    disabled={scanning}
                  />
                  <button
                    onClick={handleScan}
                    disabled={!profileUrl.trim() || scanning}
                    className={`${styles.button} ${styles.buttonPrimary}`}
                    style={{
                      width: 'auto',
                      padding: '12px 32px',
                      marginTop: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {scanning ? (
                      <>
                        <Loader size={20} className="spin" />
                        Scanning...
                      </>
                    ) : (
                      'Scan Profile'
                    )}
                  </button>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      marginTop: '16px',
                      padding: '16px',
                      borderRadius: '8px',
                      backgroundColor: isDark ? '#7f1d1d' : '#fee2e2',
                      color: isDark ? '#fecaca' : '#991b1b',
                      whiteSpace: 'pre-line',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                  >
                    <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong>Error:</strong>
                      <div style={{ marginTop: '4px' }}>{error}</div>
                    </div>
                  </motion.div>
                )}

                <AnimatePresence>
                  {scanning && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={styles.textCenter}
                      style={{ padding: '40px' }}
                    >
                      <Loader size={48} className="spin" style={{ margin: '0 auto', color: selectedPlatform.color }} />
                      <p style={{ marginTop: '16px', fontSize: '16px', fontWeight: '500' }}>
                        Fetching profile data from {selectedPlatform.name}...
                      </p>
                      <p style={{ fontSize: '14px', opacity: 0.6 }}>This may take a few seconds</p>
                    </motion.div>
                  )}

                  {result && !scanning && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Profile Header */}
                      {result.profileData && (
                        <div className={`${styles.profileHeader} ${isDark ? styles.profileHeaderDark : styles.profileHeaderLight}`}
                          style={{ marginTop: '24px' }}
                        >
                          {(result.profileData.profile_pic_url || result.profileData.profile_image || result.profileData.profile_pic) && (
                            <img
                              src={result.profileData.profile_pic_url || result.profileData.profile_image || result.profileData.profile_pic}
                              alt="Profile"
                              className={styles.profileImage}
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          )}
                          <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {result.profileData.username || result.profileData.name || 'Unknown User'}
                              {result.profileData.is_verified && (
                                <Shield size={18} color="#3b82f6" />
                              )}
                            </h4>
                            <p style={{ margin: '0 0 8px 0', opacity: 0.7, fontSize: '14px' }}>
                              {result.profileData.full_name || result.profileData.biography || result.profileData.bio || result.profileData.about || 'No bio available'}
                            </p>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '14px', flexWrap: 'wrap' }}>
                              <span><strong>{result.profileData.followers || 0}</strong> followers</span>
                              <span><strong>{result.profileData.following || 0}</strong> following</span>
                              <span><strong>{result.profileData.posts_count || result.profileData.tweets_count || 0}</strong> posts</span>
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

                        <h5 style={{ fontSize: '16px', fontWeight: '600', marginTop: '24px', marginBottom: '16px' }}>
                          Analysis Details
                        </h5>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                          {result.details && (
                            <>
                              <DetailItem icon={Calendar} label="Account Age" value={result.details.accountAge} isDark={isDark} />
                              <DetailItem icon={Users} label="Follower Ratio" value={result.details.followerRatio} isDark={isDark} />
                              <DetailItem icon={TrendingUp} label="Bio Sentiment" value={result.details.bioSentiment} isDark={isDark} />
                              <DetailItem icon={Activity} label="Profile Picture" value={result.details.profilePicture} isDark={isDark} />
                              <DetailItem icon={Activity} label="Posting Activity" value={result.details.postingActivity} isDark={isDark} />
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
        <p style={{ fontWeight:'600', margin: 0 }}>{value}</p>
</div>
</div>
);
}