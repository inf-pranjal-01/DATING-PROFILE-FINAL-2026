import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface VoiceWaveformProps {
  isActive: boolean;
  isListening: boolean;
}

const BARS = 24;

// Generated ONCE at module load — never on re-render
const BAR_CONFIGS = Array.from({ length: BARS }).map((_, i) => ({
  delay: i * 0.05,
  baseHeight: Math.sin((i / BARS) * Math.PI) * 0.7 + 0.3,
  duration: 0.8 + Math.random() * 0.4,
}));

const VoiceWaveform = ({ isActive, isListening }: VoiceWaveformProps) => {
  const color = isListening ? 'hsl(var(--neon-cyan))' : 'hsl(var(--neon-pink))';
  const glow = isListening
    ? '0 0 6px hsl(var(--neon-cyan) / 0.6)'
    : '0 0 6px hsl(var(--neon-pink) / 0.6)';

  return (
    <div className="flex items-center justify-center gap-[3px] h-24">
      {BAR_CONFIGS.map((bar, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full"
          style={{
            background: color,
            boxShadow: glow,
          }}
          animate={
            isActive
              ? {
                  height: [
                    `${bar.baseHeight * 20}px`,
                    `${bar.baseHeight * 80}px`,
                    `${bar.baseHeight * 35}px`,
                    `${bar.baseHeight * 65}px`,
                    `${bar.baseHeight * 20}px`,
                  ],
                }
              : { height: '4px' }
          }
          transition={
            isActive
              ? {
                  duration: bar.duration,
                  repeat: Infinity,
                  delay: bar.delay,
                  ease: 'easeInOut',
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
};

export default VoiceWaveform;
