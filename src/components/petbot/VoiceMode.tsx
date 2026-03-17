import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, ArrowLeft, Volume2 } from 'lucide-react';
import VoiceWaveform from './VoiceWaveform.tsx';

interface VoiceModeProps {
  onBack: () => void;
}

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

const VoiceMode = ({ onBack }: VoiceModeProps) => {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [subtitle, setSubtitle] = useState('');
  const [userTranscript, setUserTranscript] = useState('');
  
  // Audio recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start recording audio
  const startListening = useCallback(async () => {
    if (voiceState !== 'idle') return; // ✅ Fix 6: Prevent overlap

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      audioChunksRef.current = []; // ✅ Fix 2: Always clear buffer before recording

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        mediaRecorderRef.current = null; // ✅ Fix 4: Reset recorder properly
        await sendAudioToBackend();
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;

      setVoiceState('listening');
      setSubtitle('');
      setUserTranscript('Listening...');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  }, [voiceState]);

  // Stop recording
  const stopListening = useCallback(() => {
    if (!mediaRecorderRef.current) return; // ✅ Fix 5: State-independent check

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setVoiceState('processing');
      setUserTranscript('Processing...');
    }
  }, []);

  // Send audio to backend
  const sendAudioToBackend = async () => {
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

      // ✅ Fix 3: Validate before sending
      if (audioBlob.size < 2000) {
        console.error('Audio too small, ignoring');
        setVoiceState('idle');
        return;
      }

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const API_URL = 'https://rag-agent-pet-bot.onrender.com';

      const response = await fetch(`${API_URL}/voice_chat`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Backend error');

      const data = await response.json();
      
      setSubtitle(data.text);
      setUserTranscript('');

      playAudioResponse(data.voice); 

    } catch (error) {
      console.error('Error calling backend:', error);
      setVoiceState('idle');
      setSubtitle('Sorry, something went wrong. Please try again.');
      setTimeout(() => setSubtitle(''), 3000);
    }
  };

  // Play base64 audio
  const playAudioResponse = (base64Audio: string) => {
    setVoiceState('speaking');

    const audioUrl = `data:audio/mp3;base64,${base64Audio}`;
    const audio = new Audio(audioUrl);
    audioPlayerRef.current = audio;

    audio.onended = () => setVoiceState('idle');
    audio.onerror = () => {
      console.error('Error playing audio');
      setVoiceState('idle');
    };

    audio.play();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
    };
  }, []);

  const stateLabel = {
    idle: 'Tap the mic to speak',
    listening: 'Listening...',
    processing: 'Thinking...',
    speaking: 'Speaking...',
  };

  const stateColor = {
    idle: 'hsl(var(--muted-foreground))',
    listening: 'hsl(var(--neon-cyan))',
    processing: 'hsl(var(--neon-yellow))',
    speaking: 'hsl(var(--neon-pink))',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col h-full"
    >
      {/* Voice Header */}
      <div className="instagram-gradient p-3 flex items-center gap-2">
        <button
          onClick={onBack}
          className="text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-2 h-2 bg-white rounded-full pulse-dot" />
          <span className="text-white font-bold text-sm">Voice Mode</span>
        </div>
        <Volume2 size={16} className="text-white/60" />
      </div>

      {/* Voice Visualization Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-muted/50 relative overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute inset-0 opacity-20 transition-colors duration-700"
          style={{
            background: `radial-gradient(circle at center, ${stateColor[voiceState]} 0%, transparent 70%)`,
          }}
        />

        {/* Bot avatar */}
        <motion.div
          animate={{
            scale: voiceState === 'speaking' ? [1, 1.08, 1] : 1,
          }}
          transition={{
            duration: 1.2,
            repeat: voiceState === 'speaking' ? Infinity : 0,
            ease: 'easeInOut',
          }}
          className="relative z-10 mb-4"
        >
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-3xl border-2 border-border shadow-lg">
            🤖
          </div>
          <motion.div
            className="absolute -inset-1 rounded-full border-2"
            style={{ borderColor: stateColor[voiceState] }}
            animate={{
              opacity: voiceState === 'idle' ? 0.3 : [0.4, 1, 0.4],
              scale: voiceState === 'speaking' ? [1, 1.15, 1] : 1,
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* State label */}
        <motion.p
          key={voiceState}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-medium mb-6 z-10"
          style={{ color: stateColor[voiceState] }}
        >
          {stateLabel[voiceState]}
        </motion.p>

        {/* Waveform */}
        <div className="z-10 w-full">
          <VoiceWaveform
            isActive={voiceState === 'listening' || voiceState === 'speaking'}
            isListening={voiceState === 'listening'}
          />
        </div>

        {/* User transcript */}
        <AnimatePresence>
          {userTranscript && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              className="text-xs text-muted-foreground mt-4 z-10 italic"
            >
              {userTranscript}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Subtitle area */}
      <div className="min-h-[72px] px-4 py-3 bg-card border-t border-border flex items-center justify-center">
        <AnimatePresence mode="wait">
          {subtitle ? (
            <motion.p
              key="subtitle"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-sm text-foreground text-center leading-relaxed"
            >
              {subtitle}
            </motion.p>
          ) : (
            <motion.p
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              className="text-xs text-muted-foreground text-center"
            >
              {voiceState === 'listening'
                ? '🎙️ Tap mic again when done speaking...'
                : 'Subtitles will appear here'}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Mic button */}
      <div className="p-4 bg-card border-t border-border flex justify-center">
        <motion.button
          onClick={() => { // ✅ Fix 1: Simple toggle — no timers, no race conditions
            if (voiceState === 'idle') {
              startListening();
            } else if (voiceState === 'listening') {
              stopListening();
            }
          }}
          disabled={voiceState === 'processing' || voiceState === 'speaking'}
          whileTap={{ scale: 0.92 }}
          className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background:
              voiceState === 'listening'
                ? 'hsl(var(--neon-cyan))'
                : voiceState === 'processing'
                  ? 'hsl(var(--neon-yellow))'
                  : 'hsl(var(--neon-pink))',
            boxShadow:
              voiceState === 'listening'
                ? '0 0 20px hsl(var(--neon-cyan) / 0.5), 0 0 40px hsl(var(--neon-cyan) / 0.2)'
                : voiceState === 'processing'
                  ? '0 0 20px hsl(var(--neon-yellow) / 0.5)'
                  : '0 0 20px hsl(var(--neon-pink) / 0.5), 0 0 40px hsl(var(--neon-pink) / 0.2)',
          }}
        >
          {voiceState === 'listening' && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-[hsl(var(--neon-cyan))]"
              animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
          {voiceState === 'listening' ? (
            <MicOff size={24} className="text-background" />
          ) : (
            <Mic size={24} className="text-background" />
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default VoiceMode;