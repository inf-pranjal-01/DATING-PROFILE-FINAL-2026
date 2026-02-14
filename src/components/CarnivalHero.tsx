import { motion } from 'framer-motion';
import { useEffect, useState, useRef, useCallback } from 'react';
import AlbumCover from './AlbumCover';
import FeatureCards from './FeatureCards';

type HeroState = 'centered' | 'animating' | 'expanded';

const CarnivalHero = () => {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; duration: number; color: string; size: number }>>([]);
  const [heroState, setHeroState] = useState<HeroState>('centered');
  const sectionRef = useRef<HTMLElement>(null);
  const hasExpandedRef = useRef(false);

  useEffect(() => {
    const colors = ['#FF69B4', '#00FFFF', '#FFE066', '#FF1493', '#00CED1'];
    const pieces = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 8,
    }));
    setConfetti(pieces);
  }, []);

  // Scroll-driven transformation — longer lock for cinematic feel
  const handleWheel = useCallback((e: WheelEvent) => {
    if (hasExpandedRef.current) return;
    if (heroState === 'centered' && e.deltaY > 0) {
      e.preventDefault();
      setHeroState('animating');
      setTimeout(() => {
        setHeroState('expanded');
        hasExpandedRef.current = true;
      }, 1800);
    }
    if (heroState === 'animating') {
      e.preventDefault();
    }
  }, [heroState]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasExpandedRef.current) {
          window.addEventListener('wheel', handleWheel, { passive: false });
        } else if (!entry.isIntersecting) {
          window.removeEventListener('wheel', handleWheel);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      window.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  const marqueeColors = ['#FF69B4', '#00FFFF', '#FFE066', '#FF1493'];

  return (
    <section ref={sectionRef} className="min-h-screen relative overflow-hidden carnival-gradient">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-carnival-deep/30 to-carnival-dark/50 pointer-events-none" />

      {/* Star particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: 'white',
            }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.3, 1] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      {/* Neon Marquee lights border */}
      <div className="absolute inset-6 pointer-events-none">
        {/* Top border */}
        <div className="absolute top-0 left-0 right-0 flex justify-around">
          {[...Array(24)].map((_, i) => (
            <motion.div
              key={`top-${i}`}
              className="w-3 h-3 rounded-full"
              style={{
                background: marqueeColors[i % marqueeColors.length],
                boxShadow: `0 0 10px ${marqueeColors[i % marqueeColors.length]}, 0 0 20px ${marqueeColors[i % marqueeColors.length]}`,
              }}
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.08 }}
            />
          ))}
        </div>
        {/* Bottom border */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-around">
          {[...Array(24)].map((_, i) => (
            <motion.div
              key={`bottom-${i}`}
              className="w-3 h-3 rounded-full"
              style={{
                background: marqueeColors[(i + 2) % marqueeColors.length],
                boxShadow: `0 0 10px ${marqueeColors[(i + 2) % marqueeColors.length]}, 0 0 20px ${marqueeColors[(i + 2) % marqueeColors.length]}`,
              }}
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.08 + 0.6 }}
            />
          ))}
        </div>
        {/* Left border */}
        <div className="absolute top-0 bottom-0 left-0 flex flex-col justify-around">
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={`left-${i}`}
              className="w-3 h-3 rounded-full"
              style={{
                background: marqueeColors[(i + 1) % marqueeColors.length],
                boxShadow: `0 0 10px ${marqueeColors[(i + 1) % marqueeColors.length]}, 0 0 20px ${marqueeColors[(i + 1) % marqueeColors.length]}`,
              }}
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>
        {/* Right border */}
        <div className="absolute top-0 bottom-0 right-0 flex flex-col justify-around">
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={`right-${i}`}
              className="w-3 h-3 rounded-full"
              style={{
                background: marqueeColors[(i + 3) % marqueeColors.length],
                boxShadow: `0 0 10px ${marqueeColors[(i + 3) % marqueeColors.length]}, 0 0 20px ${marqueeColors[(i + 3) % marqueeColors.length]}`,
              }}
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.1 + 0.5 }}
            />
          ))}
        </div>
      </div>

      {/* Confetti */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute confetti pointer-events-none"
          style={{
            left: `${piece.left}%`,
            top: '-20px',
            width: piece.size,
            height: piece.size,
            background: piece.color,
            boxShadow: `0 0 6px ${piece.color}`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}

      {/* Central spotlight effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <motion.div
          className="w-[1000px] h-[1000px] opacity-10"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, hsl(180 100% 50% / 0.5) 15deg, transparent 30deg, transparent 90deg, hsl(330 100% 65% / 0.5) 105deg, transparent 120deg, transparent 180deg, hsl(50 100% 60% / 0.5) 195deg, transparent 210deg, transparent 270deg, hsl(270 100% 65% / 0.5) 285deg, transparent 300deg, transparent 360deg)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        {/* Neon Header — always visible, stable */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="text-center mb-12"
        >
          <motion.div
            className="text-3xl md:text-4xl mb-6 tracking-[0.3em]"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨✨💖💕💖💝💕💖💝💝✨✨
          </motion.div>

          <motion.h1
            className="font-display text-4xl md:text-7xl lg:text-8xl tracking-[0.15em] mb-4 neon-text-pink neon-flicker"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            CONGRATULATIONS
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="font-display text-2xl md:text-4xl lg:text-5xl tracking-[0.2em] neon-text-cyan"
          >
            YOU'VE UNLOCKED THE
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="font-display text-3xl md:text-5xl lg:text-6xl tracking-[0.25em] neon-text-yellow mt-2"
          >
            GRAND PRIZE OF 2026
          </motion.p>
        </motion.div>

      {/* Album + Feature Cards row */}
        <motion.div
          className="flex items-center w-full max-w-7xl mx-auto px-4 md:px-12"
          animate={{
            justifyContent: heroState === 'centered' ? 'center' : 'flex-start',
          }}
          transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Album Cover with vinyl */}
          <motion.div
            layout
            transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="shrink-0"
          >
            <AlbumCover heroState={heroState} />
          </motion.div>

          {/* Feature Cards — revealed after album settles */}
          {heroState !== 'centered' && (
            <motion.div
              className="ml-auto pr-10 overflow-visible flex justify-end"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              transition={{ duration: 0.9, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <FeatureCards isVisible={heroState === 'expanded' || heroState === 'animating'} />
            </motion.div>
          )}
        </motion.div>

        {/* Limited edition text — stays visible */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="text-center mt-12 relative"
        >
          <motion.p
            className="font-display text-2xl md:text-3xl lg:text-4xl tracking-[0.3em] neon-text-cyan"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨ LIMITED EDITION ✨
          </motion.p>
          <p className="font-display text-xl md:text-2xl tracking-[0.2em] text-white/80 mt-3">
            ONE OF A KIND MODEL
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: heroState === 'centered' ? 1 : 0,
            y: [0, 10, 0],
          }}
          transition={{ delay: 2.5, duration: 2, repeat: Infinity }}
          className="mt-20 text-center"
        >
          <p className="font-body text-lg md:text-xl tracking-wider text-white/70">
            ↓ Scroll to Claim Your Prize ↓
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CarnivalHero;
