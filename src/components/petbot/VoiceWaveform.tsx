import { motion } from 'framer-motion';

interface VoiceWaveformProps {
  isActive: boolean;
  isListening: boolean;
}

const VoiceWaveform = ({ isActive, isListening }: VoiceWaveformProps) => {
  const bars = 24;

  return (
    <div className="flex items-center justify-center gap-[3px] h-24">
      {Array.from({ length: bars }).map((_, i) => {
        const delay = i * 0.05;
        const baseHeight = Math.sin((i / bars) * Math.PI) * 0.7 + 0.3;

        return (
          <motion.div
            key={i}
            className="w-[3px] rounded-full"
            style={{
              background: isListening
                ? `hsl(var(--neon-cyan))`
                : `hsl(var(--neon-pink))`,
              boxShadow: isListening
                ? `0 0 6px hsl(var(--neon-cyan) / 0.6)`
                : `0 0 6px hsl(var(--neon-pink) / 0.6)`,
            }}
            animate={
              isActive
                ? {
                    height: [
                      `${baseHeight * 20}px`,
                      `${baseHeight * 80}px`,
                      `${baseHeight * 35}px`,
                      `${baseHeight * 65}px`,
                      `${baseHeight * 20}px`,
                    ],
                  }
                : { height: '4px' }
            }
            transition={
              isActive
                ? {
                    duration: 0.8 + Math.random() * 0.4,
                    repeat: Infinity,
                    delay,
                    ease: 'easeInOut',
                  }
                : { duration: 0.3 }
            }
          />
        );
      })}
    </div>
  );
};

export default VoiceWaveform;
