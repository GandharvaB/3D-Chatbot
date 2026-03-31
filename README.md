# 3D AI Avatar Chatbot

An interactive 3D AI avatar chatbot with real-time voice conversations powered by **Sarvam AI**. Features a full-body animated avatar with lip sync, gestures, and multilingual support for Indian languages.

## ✨ Features

- **Full-body 3D avatar** with procedural skeleton, clothing, and realistic proportions
- **Real-time lip sync** driven by audio frequency analysis
- **5-state animation system**: IDLE → LISTENING → THINKING → SPEAKING → EMOTING
- **Voice pipeline**: Speech-to-Text → AI Chat → Text-to-Speech via Sarvam AI
- **8 semantic gestures** triggered by AI response content (wave, shrug, nod, etc.)
- **Facial expressions**: blink, gaze tracking, emotion morphs, eyebrow animations
- **Multilingual**: Hindi, English, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Odia
- **Premium UI**: glassmorphic chat panel, animated mic button, waveform visualizer
- **Keyboard shortcuts**: Space = push-to-talk, Escape = stop playback

## 🚀 Quick Start

### 1. Get a Sarvam AI API Key

Register at [dashboard.sarvam.ai](https://dashboard.sarvam.ai/) to get your API key.

### 2. Setup

```bash
# Clone or navigate to the project
cd avatar-chatbot

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env and add your Sarvam AI API key
```

### 3. Configure

Edit `.env`:
```
VITE_SARVAM_KEY=your_actual_api_key_here
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in Chrome (recommended for best Web Audio support).

## 📦 Tech Stack

| Technology | Purpose |
|---|---|
| **Vite + React** | Build system & UI framework |
| **Three.js + R3F** | 3D rendering engine |
| **@react-three/drei** | 3D helpers (orbit controls) |
| **@react-three/postprocessing** | Visual effects (DOF, bloom, vignette) |
| **Zustand** | State management (5-state machine) |
| **Framer Motion** | UI animations |
| **Sarvam AI** | STT (Saaras v3), TTS (Bulbul v3), Chat (sarvam-m4) |
| **Web Audio API** | Mic capture, audio playback, frequency analysis |

## 🏗️ Architecture

```
src/
├── components/
│   ├── AvatarScene.jsx      # R3F canvas + lighting + post-processing
│   ├── AvatarModel.jsx      # Procedural 3D avatar + skeleton + animations
│   ├── FaceAnimation.jsx    # Lip sync + gaze + blink system
│   ├── GestureController.jsx # Gesture clip manager
│   ├── ChatPanel.jsx        # Conversation UI with typewriter effect
│   ├── MicButton.jsx        # Push-to-talk + keyboard shortcuts
│   └── AudioVisualizer.jsx  # Circular waveform ring
├── services/
│   ├── sarvamai.js          # All Sarvam AI API calls
│   └── audioCapture.js      # Web Audio API mic/playback
├── store/
│   └── avatarStore.js       # Zustand state machine
├── hooks/
│   ├── useSpeech.js         # STT → Chat → TTS pipeline
│   └── useGesture.js        # Semantic gesture triggers
├── App.jsx                  # Main layout
└── main.jsx                 # Entry point
```

## 🎯 Avatar States

| State | Description | Visual |
|---|---|---|
| **IDLE** | Default relaxed pose, breathing, subtle sway | White mic ring |
| **LISTENING** | Mic active, head tilts, eyebrow raises, weight shift | Green pulsing ring |
| **THINKING** | Processing, hand-to-chin pose | Blue spinner |
| **SPEAKING** | Lip sync active, head nods, hand gestures | Amber animated bars |
| **EMOTING** | Emotional expression (smile/frown) | Purple dot |

## 🤝 Sarvam AI Endpoints

- **STT**: `POST /speech-to-text` — Saaras v3, auto language detection
- **Chat**: `POST /v1/chat/completions` — sarvam-m4 model
- **TTS**: `POST /text-to-speech` — Bulbul v3, 30+ voices

## License

MIT
