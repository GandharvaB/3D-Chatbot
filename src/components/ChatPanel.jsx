import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAvatarStore, { AVATAR_STATES } from '../store/avatarStore';
import { detectLanguageFromCode } from '../services/sarvamai';

// Typewriter effect component
function TypewriterText({ text, speed = 30, onComplete }) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed('');
    indexRef.current = 0;

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayed}<span className="typewriter-cursor">|</span></span>;
}

// Language badge
function LanguageBadge({ languageCode }) {
  const lang = detectLanguageFromCode(languageCode);
  return (
    <span className="language-badge">
      {lang.flag} {lang.name}
    </span>
  );
}

// Single message bubble
function MessageBubble({ message, isLatest }) {
  const isUser = message.role === 'user';
  const isAI = message.role === 'assistant';

  return (
    <motion.div
      className={`message-bubble ${isUser ? 'user-message' : 'ai-message'}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="message-content">
        {isAI && isLatest ? (
          <TypewriterText text={message.content} speed={25} />
        ) : (
          message.content
        )}
      </div>
      <div className="message-meta">
        <LanguageBadge languageCode={message.language} />
        <span className="message-time">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </motion.div>
  );
}

export default function ChatPanel() {
  const messages = useAvatarStore((s) => s.messages);
  const avatarState = useAvatarStore((s) => s.avatarState);
  const error = useAvatarStore((s) => s.error);
  const clearError = useAvatarStore((s) => s.clearError);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, avatarState]);

  return (
    <div className="chat-panel">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="avatar-status-dot" data-state={avatarState} />
          <div>
            <h2 className="chat-title">AI Avatar</h2>
            <span className="chat-subtitle">
              {avatarState === AVATAR_STATES.LISTENING && 'Listening...'}
              {avatarState === AVATAR_STATES.THINKING && 'Thinking...'}
              {avatarState === AVATAR_STATES.SPEAKING && 'Speaking...'}
              {avatarState === AVATAR_STATES.IDLE && 'Ready to chat'}
              {avatarState === AVATAR_STATES.EMOTING && 'Expressing...'}
            </span>
          </div>
        </div>
        <button
          className="settings-button"
          onClick={useAvatarStore.getState().toggleSettings}
          title="Settings"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="chat-empty">
            <div className="chat-empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            </div>
            <p className="chat-empty-text">
              Press the mic button and start speaking
            </p>
            <p className="chat-empty-subtext">
              Supports Hindi, English, Tamil, Telugu & more
            </p>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg, idx) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isLatest={idx === messages.length - 1 && msg.role === 'assistant'}
            />
          ))}
        </AnimatePresence>

        {/* Status indicators */}
        {avatarState === AVATAR_STATES.LISTENING && (
          <motion.div
            className="status-indicator listening"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="listening-dots">
              <span /><span /><span />
            </div>
            Listening...
          </motion.div>
        )}

        {avatarState === AVATAR_STATES.THINKING && (
          <motion.div
            className="status-indicator thinking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="thinking-dots">
              <span /><span /><span />
            </div>
            Thinking...
          </motion.div>
        )}

        {/* Error display */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              <span>{error}</span>
              <button onClick={clearError} className="error-dismiss">✕</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
