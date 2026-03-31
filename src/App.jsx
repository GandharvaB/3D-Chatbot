import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AvatarScene from './components/AvatarScene';
import ChatPanel from './components/ChatPanel';
import MicButton from './components/MicButton';
import AudioVisualizer from './components/AudioVisualizer';
import useAvatarStore from './store/avatarStore';

// Settings panel component
function SettingsPanel() {
  const showSettings = useAvatarStore((s) => s.showSettings);
  const settings = useAvatarStore((s) => s.settings);
  const updateSettings = useAvatarStore((s) => s.updateSettings);
  const toggleSettings = useAvatarStore((s) => s.toggleSettings);

  if (!showSettings) return null;

  return (
    <motion.div
      className="settings-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) toggleSettings(); }}
    >
      <motion.div
        className="settings-panel"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <div className="settings-title">
          <span>Settings</span>
          <button className="settings-close" onClick={toggleSettings}>✕</button>
        </div>

        <div className="settings-group">
          <label className="settings-label">Language</label>
          <select
            className="settings-select"
            value={settings.language}
            onChange={(e) => updateSettings({ language: e.target.value })}
          >
            <option value="en-IN">🌐 English (Indian)</option>
            <option value="hi-IN">🇮🇳 Hindi</option>
            <option value="ta-IN">🇮🇳 Tamil</option>
            <option value="te-IN">🇮🇳 Telugu</option>
            <option value="kn-IN">🇮🇳 Kannada</option>
            <option value="ml-IN">🇮🇳 Malayalam</option>
            <option value="bn-IN">🇮🇳 Bengali</option>
            <option value="mr-IN">🇮🇳 Marathi</option>
            <option value="gu-IN">🇮🇳 Gujarati</option>
            <option value="pa-IN">🇮🇳 Punjabi</option>
            <option value="od-IN">🇮🇳 Odia</option>
          </select>
        </div>

        <div className="settings-group">
          <label className="settings-label">Voice</label>
          <select
            className="settings-select"
            value={settings.speaker}
            onChange={(e) => updateSettings({ speaker: e.target.value })}
          >
            <option value="ritu">Ritu (Female)</option>
            <option value="vidya">Vidya (Female)</option>
            <option value="shubh">Shubh (Male)</option>
            <option value="arya">Arya (Female)</option>
          </select>
        </div>

        <div className="settings-group">
          <label className="settings-label">Voice Speed</label>
          <input
            type="range"
            className="settings-range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={settings.voiceSpeed}
            onChange={(e) => updateSettings({ voiceSpeed: parseFloat(e.target.value) })}
          />
          <div className="range-value">{settings.voiceSpeed.toFixed(1)}x</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

import { useProgress } from '@react-three/drei';

// Loading screen
function LoadingScreen() {
  const isLoading = useAvatarStore((s) => s.isLoading);
  const { progress, active } = useProgress();

  useEffect(() => {
    // If progress reaches 100 and it's no longer actively loading, hide the screen
    if (progress >= 100) {
      setTimeout(() => {
        useAvatarStore.getState().setLoading(false);
      }, 800);
    }
  }, [progress, active]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="loading-screen"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="loading-logo"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <circle cx="9" cy="9" r="1" fill="currentColor" />
              <circle cx="15" cy="9" r="1" fill="currentColor" />
            </svg>
          </motion.div>

          <motion.p
            className="loading-text"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Initializing AI Avatar...
          </motion.p>

          <div className="loading-bar-container">
            <motion.div
              className="loading-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <>
      <LoadingScreen />

      <div className="app-container">
        {/* 3D Avatar Canvas — Left 60% */}
        <div className="canvas-container">
          <AvatarScene />
        </div>

        {/* Chat Panel — Right 40% */}
        <div className="chat-container">
          <ChatPanel />
        </div>

        {/* Floating Mic Button */}
        <MicButton />

        {/* Audio Visualizer */}
        <div style={{
          position: 'fixed',
          bottom: '32px',
          left: '30%',
          transform: 'translateX(-50%)',
          zIndex: 99,
          pointerEvents: 'none',
        }}>
          <AudioVisualizer />
        </div>
      </div>

      {/* Settings panel overlay */}
      <AnimatePresence>
        <SettingsPanel />
      </AnimatePresence>
    </>
  );
}
