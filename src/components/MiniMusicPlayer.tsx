import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward } from 'lucide-react';

const PLAYLIST = [
  {
    title: 'I didn\'t ask',
    artist: 'Alana Jordan',
    src: '/music/Track1.mp3',
    cover: '🌙',
  },
  {
    title: 'No cure for you',
    artist: 'Alana Jordan',
    src: '/music/Track3.mp3',
    cover: '💜',
  },
  {
    title: 'Cherry Stained Fingers',
    artist: 'Kazoom',
    src: '/music/Track2.mp3',
    cover: '✨',
  },
];
interface MiniMusicPlayerProps {
  visible?: boolean;
}

const MiniMusicPlayer = ({ visible = true }: MiniMusicPlayerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const handleNextRef = useRef<() => void>(() => {});

  // Initialize audio
  useEffect(() => {
    const audio = new Audio(PLAYLIST[0].src);
    audio.volume = 0.3;
    audio.preload = 'auto';
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Auto-play when component becomes visible (after plug connect)
  useEffect(() => {
    if (!visible || hasInteracted || !audioRef.current) return;

    // Try immediate play — the plug click may still count as a user gesture
    const tryPlay = () => {
      if (!audioRef.current || hasInteracted) return;
      audioRef.current.play().then(() => {
        setHasInteracted(true);
        setIsPlaying(true);
      }).catch(() => {
        // Browser blocked auto-play; fall back to next user interaction
        const handleFirstInteraction = () => {
          if (audioRef.current) {
            audioRef.current.play().then(() => {
              setHasInteracted(true);
              setIsPlaying(true);
            }).catch(() => {});
          }
        };
        window.addEventListener('click', handleFirstInteraction, { once: true });
        window.addEventListener('scroll', handleFirstInteraction, { once: true });
        window.addEventListener('keydown', handleFirstInteraction, { once: true });
      });
    };

    // Small delay to let the audio element initialize
    const timer = setTimeout(tryPlay, 100);
    return () => clearTimeout(timer);
  }, [visible, hasInteracted]);

  // Progress tracking & ended listener (set up once)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      handleNextRef.current();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isPlaying]);

  const handleNext = useCallback(() => {
    const next = (currentTrack + 1) % PLAYLIST.length;
    setCurrentTrack(next);
    setProgress(0);

    const audio = audioRef.current;
    if (audio) {
      audio.src = PLAYLIST[next].src;
      audio.volume = 0.3;
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [currentTrack]);

  // Keep handleNextRef current
  useEffect(() => {
    handleNextRef.current = handleNext;
  }, [handleNext]);

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  const track = PLAYLIST[currentTrack];

  if (!visible) return null;

  return (
    <motion.div
      className="fixed bottom-6 left-6 z-50 flex items-center"
      initial={{ opacity: 0, y: 30, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Vinyl disk button — always on top */}
      <motion.button
        className="relative z-10 w-14 h-14 rounded-full cursor-pointer focus:outline-none shrink-0"
        onClick={toggleExpand}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: 'radial-gradient(circle at 50% 50%, hsl(0 0% 8%) 0%, hsl(0 0% 14%) 20%, hsl(0 0% 8%) 22%, hsl(0 0% 12%) 40%, hsl(0 0% 8%) 42%, hsl(0 0% 12%) 60%, hsl(0 0% 8%) 62%, hsl(0 0% 10%) 100%)',
          boxShadow: isPlaying
            ? '0 0 20px hsl(330 100% 65% / 0.5), 0 0 40px hsl(330 100% 65% / 0.2), 0 4px 12px rgba(0,0,0,0.5)'
            : '0 0 10px hsl(330 100% 65% / 0.2), 0 4px 12px rgba(0,0,0,0.5)',
          border: '2px solid hsl(330 100% 65% / 0.4)',
        }}
      >
        <motion.div
          className="w-full h-full rounded-full"
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={
            isPlaying
              ? { duration: 3, repeat: Infinity, ease: 'linear' }
              : { duration: 0 }
          }
        >
          {[30, 45, 60, 75, 88].map((size) => (
            <div
              key={size}
              className="absolute rounded-full"
              style={{
                width: `${size}%`,
                height: `${size}%`,
                top: `${(100 - size) / 2}%`,
                left: `${(100 - size) / 2}%`,
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            />
          ))}
          <div
            className="absolute rounded-full flex items-center justify-center"
            style={{
              width: '36%',
              height: '36%',
              top: '32%',
              left: '32%',
              background: 'radial-gradient(circle, hsl(330 100% 65% / 0.9), hsl(270 80% 40% / 0.9))',
              boxShadow: '0 0 10px hsl(330 100% 65% / 0.4)',
            }}
          >
            <span className="text-[6px] text-white/90 select-none">♫</span>
          </div>
          <div
            className="absolute rounded-full"
            style={{
              width: '6%',
              height: '6%',
              top: '47%',
              left: '47%',
              background: 'hsl(0 0% 3%)',
            }}
          />
        </motion.div>

        {isPlaying && (
          <motion.div
            className="absolute -inset-1 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, hsl(330 100% 65% / 0.15), transparent 70%)',
            }}
            animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Expanded panel — extends to the right from behind the vinyl */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="absolute left-5 h-14 flex items-center"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ overflow: 'hidden', zIndex: 5 }}
          >
            <div
              className="h-full w-full flex items-center gap-3 pr-4"
              style={{
                paddingLeft: 48,
                background: 'linear-gradient(90deg, hsl(250 30% 12% / 0.95), hsl(250 25% 15% / 0.95))',
                borderRadius: '0 28px 28px 0',
                border: '1px solid hsl(330 100% 65% / 0.3)',
                borderLeft: 'none',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 0 20px hsl(330 100% 65% / 0.15), 0 4px 16px rgba(0,0,0,0.4)',
              }}
            >
              {/* Cover */}
              <div
                className="w-9 h-9 rounded-md flex items-center justify-center text-lg shrink-0"
                style={{
                  background: 'linear-gradient(135deg, hsl(250 30% 20%), hsl(270 40% 25%))',
                  border: '1px solid hsl(330 100% 65% / 0.2)',
                }}
              >
                {track.cover}
              </div>

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium truncate" style={{ color: 'hsl(0 0% 90%)' }}>
                  {track.title}
                </p>
                <p className="text-[8px] truncate" style={{ color: 'hsl(0 0% 55%)' }}>
                  {track.artist}
                </p>
                <div className="mt-1 h-[2px] w-full rounded-full" style={{ background: 'hsl(250 20% 25%)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, hsl(330 100% 65%), hsl(270 100% 65%))',
                    }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                  style={{
                    background: 'hsl(330 100% 65% / 0.15)',
                    border: '1px solid hsl(330 100% 65% / 0.3)',
                  }}
                >
                  {isPlaying ? (
                    <Pause className="w-3 h-3" style={{ color: 'hsl(330 100% 65%)' }} />
                  ) : (
                    <Play className="w-3 h-3 ml-0.5" style={{ color: 'hsl(330 100% 65%)' }} />
                  )}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className="w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                  style={{
                    background: 'hsl(270 100% 65% / 0.1)',
                    border: '1px solid hsl(270 100% 65% / 0.2)',
                  }}
                >
                  <SkipForward className="w-2.5 h-2.5" style={{ color: 'hsl(270 100% 65%)' }} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MiniMusicPlayer;
