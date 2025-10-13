'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// ... rest of your imports

import { Instagram, Facebook, Twitter, Linkedin, Youtube, Music, LogOut, Sun, Moon, AlertCircle, CheckCircle, Loader, TrendingUp, Users, Calendar, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    transition: 'background-color 0.3s ease',
  },
  light: {
    backgroundColor: '#f5f7fa',
    color: '#1a202c',
  },
  dark: {
    backgroundColor: '#1a202c',
    color: '#f5f7fa',
  },
  authContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
  },
  authCard: {
    width: '100%',
    maxWidth: '420px',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
  },
  authCardLight: {
    backgroundColor: '#ffffff',
  },
  authCardDark: {
    backgroundColor: '#2d3748',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    marginBottom: '16px',
    border: '2px solid',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  },
  inputLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    color: '#1a202c',
  },
  inputDark: {
    backgroundColor: '#374151',
    borderColor: '#4b5563',
    color: '#f5f7fa',
  },
  button: {
    width: '100%',
    padding: '14px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '8px',
  },
  buttonPrimary: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  navbarLight: {
    backgroundColor: '#ffffff',
  },
  navbarDark: {
    backgroundColor: '#2d3748',
  },
  dashboard: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  platformGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  platformCard: {
    padding: '30px 20px',
    borderRadius: '12px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '2px solid transparent',
  },
  platformCardLight: {
    backgroundColor: '#ffffff',
  },
  platformCardDark: {
    backgroundColor: '#2d3748',
  },
  scanSection: {
    padding: '30px',
    borderRadius: '12px',
    marginBottom: '30px',
  },
  scanSectionLight: {
    backgroundColor: '#ffffff',
  },
  scanSectionDark: {
    backgroundColor: '#2d3748',
  },
  resultCard: {
    padding: '30px',
    borderRadius: '12px',
    marginTop: '20px',
  },
  resultCardLight: {
    backgroundColor: '#ffffff',
  },
  resultCardDark: {
    backgroundColor: '#2d3748',
  },
  progressBar: {
    width: '100%',
    height: '12px',
    borderRadius: '6px',
    overflow: 'hidden',
    marginTop: '10px',
  },
  progressBarLight: {
    backgroundColor: '#e2e8f0',
  },
  progressBarDark: {
    backgroundColor: '#4b5563',
  },
  historyCard: {
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '12px',
    transition: 'all 0.3s ease',
  },
  historyCardLight: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
  },
  historyCardDark: {
    backgroundColor: '#2d3748',
    border: '1px solid #4b5563',
  },
};

const platforms = [
  { name: 'Instagram', icon: Instagram, color: '#E4405F' },
  { name: 'Facebook', icon: Facebook, color: '#1877F2' },
  { name: 'Twitter', icon: Twitter, color: '#1DA1F2' },
  { name: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
  
];

export default function App() {
  const [user, setUser] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedTheme = localStorage.getItem('theme');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedTheme) setIsDark(savedTheme === 'dark');
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
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setSuccess(authMode === 'login' ? 'Login successful!' : 'Account created successfully!');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setFormData({ name: '', email: '', password: '' });
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  if (!user) {
    return (
      <div style={{ ...styles.container, ...(isDark ? styles.dark : styles.light) }}>
        <div style={styles.authContainer}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              ...styles.authCard,
              ...(isDark ? styles.authCardDark : styles.authCardLight),
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
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
                  style={{
                    ...styles.input,
                    ...(isDark ? styles.inputDark : styles.inputLight),
                  }}
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  ...styles.input,
                  ...(isDark ? styles.inputDark : styles.inputLight),
                }}
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && handleAuth(e)}
                style={{
                  ...styles.input,
                  ...(isDark ? styles.inputDark : styles.inputLight),
                }}
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

              <button onClick={handleAuth} style={{ ...styles.button, ...styles.buttonPrimary }}>
                {authMode === 'login' ? 'Login' : 'Sign Up'}
              </button>
            </div>

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
                {authMode === 'login' ? 'Sign Up' : 'Login'}
              </span>
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.container, ...(isDark ? styles.dark : styles.light) }}>
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

  useEffect(() => {
    const savedHistory = localStorage.getItem('scanHistory');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const handleScan = async () => {
    if (!profileUrl) return;

    setScanning(true);
    setResult(null);

    await new Promise((resolve) => setTimeout(resolve, 2500));

    const isFake = Math.random() > 0.5;
    const confidence = Math.floor(Math.random() * 20) + 80;
    
    const newResult = {
      platform: selectedPlatform.name,
      url: profileUrl,
      isFake,
      confidence,
      details: {
        accountAge: `${Math.floor(Math.random() * 5) + 1} years`,
        followerRatio: (Math.random() * 2).toFixed(2),
        bioSentiment: isFake ? 'Suspicious' : 'Genuine',
        profilePicture: isFake ? 'Stock Image Detected' : 'Original Image',
        postingActivity: isFake ? 'Irregular' : 'Consistent',
      },
      timestamp: new Date().toISOString(),
    };

    setResult(newResult);
    setScanning(false);

    const updatedHistory = [newResult, ...history].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
  };

  const chartData = history.slice(0, 7).reverse().map((item, idx) => ({
    name: `Scan ${idx + 1}`,
    accuracy: item.confidence,
  }));

  return (
    <>
      <nav style={{ ...styles.navbar, ...(isDark ? styles.navbarDark : styles.navbarLight) }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>
          Fake Social Media Account Detection
        </h1>
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

      <div style={styles.dashboard}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Select Platform</h2>
          <div style={styles.platformGrid}>
            {platforms.map((platform) => (
              <motion.div
                key={platform.name}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedPlatform(platform)}
                style={{
                  ...styles.platformCard,
                  ...(isDark ? styles.platformCardDark : styles.platformCardLight),
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
                style={{
                  ...styles.scanSection,
                  ...(isDark ? styles.scanSectionDark : styles.scanSectionLight),
                }}
              >
                <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>
                  Scan {selectedPlatform.name} Profile
                </h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder={`Enter ${selectedPlatform.name} profile URL or username`}
                    value={profileUrl}
                    onChange={(e) => setProfileUrl(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: '2px solid',
                      borderRadius: '8px',
                      fontSize: '16px',
                      ...(isDark ? styles.inputDark : styles.inputLight),
                    }}
                  />
                  <button
                    onClick={handleScan}
                    disabled={!profileUrl || scanning}
                    style={{
                      ...styles.button,
                      ...styles.buttonPrimary,
                      width: 'auto',
                      padding: '12px 32px',
                      marginTop: 0,
                      opacity: !profileUrl || scanning ? 0.6 : 1,
                    }}
                  >
                    {scanning ? <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} /> : 'Scan Profile'}
                  </button>
                </div>

                <AnimatePresence>
                  {scanning && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ textAlign: 'center', padding: '40px' }}
                    >
                      <Loader size={48} style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
                      <p style={{ marginTop: '16px', fontSize: '16px' }}>Analyzing profile...</p>
                    </motion.div>
                  )}

                  {result && !scanning && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{
                        ...styles.resultCard,
                        ...(isDark ? styles.resultCardDark : styles.resultCardLight),
                        borderLeft: `4px solid ${result.isFake ? '#ef4444' : '#10b981'}`,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        {result.isFake ? (
                          <AlertCircle size={32} color="#ef4444" />
                        ) : (
                          <CheckCircle size={32} color="#10b981" />
                        )}
                        <div>
                          <h4 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 4px 0' }}>
                            {result.isFake ? 'Fake Account Detected' : 'Real Account'}
                          </h4>
                          <p style={{ margin: 0, opacity: 0.7 }}>Confidence: {result.confidence}%</p>
                        </div>
                      </div>

                      <div
                        style={{
                          ...styles.progressBar,
                          ...(isDark ? styles.progressBarDark : styles.progressBarLight),
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.confidence}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          style={{
                            height: '100%',
                            backgroundColor: result.isFake ? '#ef4444' : '#10b981',
                            borderRadius: '6px',
                          }}
                        />
                      </div>

                      <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        <DetailItem icon={Calendar} label="Account Age" value={result.details.accountAge} isDark={isDark} />
                        <DetailItem icon={Users} label="Follower Ratio" value={result.details.followerRatio} isDark={isDark} />
                        <DetailItem icon={TrendingUp} label="Bio Sentiment" value={result.details.bioSentiment} isDark={isDark} />
                        <DetailItem icon={Activity} label="Profile Picture" value={result.details.profilePicture} isDark={isDark} />
                        <DetailItem icon={Activity} label="Posting Activity" value={result.details.postingActivity} isDark={isDark} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ marginTop: '40px' }}
            >
              <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Detection Accuracy Over Time</h2>
              <div
                style={{
                  ...styles.scanSection,
                  ...(isDark ? styles.scanSectionDark : styles.scanSectionLight),
                  padding: '20px',
                }}
              >
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4b5563' : '#e2e8f0'} />
                    <XAxis dataKey="name" stroke={isDark ? '#9ca3af' : '#64748b'} />
                    <YAxis stroke={isDark ? '#9ca3af' : '#64748b'} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#2d3748' : '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} />
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
                  style={{
                    ...styles.historyCard,
                    ...(isDark ? styles.historyCardDark : styles.historyCardLight),
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {item.isFake ? (
                        <AlertCircle size={20} color="#ef4444" />
                      ) : (
                        <CheckCircle size={20} color="#10b981" />
                      )}
                      <div>
                        <p style={{ fontWeight: '600', margin: '0 0 4px 0' }}>{item.platform}</p>
                        <p style={{ fontSize: '12px', opacity: 0.6, margin: 0 }}>{item.url}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: '600', margin: '0 0 4px 0' }}>{item.confidence}%</p>
                      <p style={{ fontSize: '12px', opacity: 0.6, margin: 0 }}>
                        {new Date(item.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        button:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }
        input:focus {
          outline: none;
          border-color: #3b82f6;
        }
      `}</style>
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