import { motion } from 'framer-motion';

const features = [
  { emoji: '🍜', title: 'Survival Skills', desc: 'Can cook Maggi better than code.' },
  { emoji: '🎵', title: 'Our Playlist', desc: 'Every song tells a story' },
  { emoji: '🎪', title: 'My Hometown', desc: 'Varanasi....could change to ours' },
  { emoji: '🌙', title: 'Late Night Talks', desc: 'Tere liye subah shaam sab ek krdu' },
  { emoji: '💕', title: 'Commitment', desc: 'The best is yet to come' },
  { emoji: '🔮', title: 'Future Plans', desc: 'Interested aren\'t we?' },
];

interface FeatureCardsProps {
  isVisible: boolean;
}

const FeatureCards = ({ isVisible }: FeatureCardsProps) => {
  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-2 md:gap-3 overflow-visible">
      {features.map((feature, i) => (
        <motion.div
          key={feature.title}
          className="w-20 h-28 md:w-28 md:h-36 lg:w-32 lg:h-40 rounded-2xl flex flex-col items-center justify-center p-2 md:p-3 text-center cursor-pointer"
          style={{
            background:
              'linear-gradient(135deg, hsl(250 25% 14% / 0.9), hsl(250 30% 10% / 0.95))',
            border: '2px solid hsl(330 100% 65% / 0.3)',
            boxShadow:
              '0 0 15px hsl(330 100% 65% / 0.15), 0 8px 24px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)',
          }}
          initial={{ x: 120, opacity: 0 }}
          animate={
            isVisible
              ? {
                  x: 0,
                  opacity: 1,
                  transition: {
                    delay: 0.2 + i * 0.1,
                    duration: 0.7,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  },
                }
              : { x: 120, opacity: 0 }
          }
          whileHover={{
            scale: 1.06,
            borderColor: 'hsl(180 100% 50% / 0.6)',
            boxShadow:
              '0 0 25px hsl(180 100% 50% / 0.3), 0 12px 32px rgba(0,0,0,0.4)',
          }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-2xl md:text-3xl lg:text-4xl mb-2">
            {feature.emoji}
          </span>
          <h3 className="font-display text-xs md:text-sm lg:text-base tracking-wider neon-text-cyan mb-1">
            {feature.title}
          </h3>
          <p className="font-body text-[9px] md:text-[10px] lg:text-xs text-white/60 leading-tight">
            {feature.desc}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default FeatureCards;
