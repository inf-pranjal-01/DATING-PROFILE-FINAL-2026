import { motion, useAnimation } from 'framer-motion';
import { useState } from 'react';
import albumCoverImg from '@/assets/album-cover.png';

const SPOTIFY_URL = 'https://open.spotify.com/playlist/2I5hfLAlMW47sDz0SJeyIC?si=fF4qCr34QZqdBfKgZwVUPw';

interface AlbumCoverProps {
  heroState: 'centered' | 'animating' | 'expanded';
}

const AlbumCover = ({ heroState }: AlbumCoverProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const vinylControls = useAnimation();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -10, y: x * 10 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    vinylControls.start({
      x: '75%',
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    vinylControls.start({
      x: '0%',
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    });
  };

  const handleVinylClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(SPOTIFY_URL, '_blank', 'noopener,noreferrer');
  };

  const albumSize =
    heroState === 'centered'
      ? 'w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96'
      : 'w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80';

  const vinylSize =
    heroState === 'centered'
      ? 'w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96'
      : 'w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80';

  return (
    <div
      className="relative"
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Vinyl disk — positioned behind album center */}
      <motion.div
        className="absolute top-0 left-0 z-0"
        initial={{ x: '0%' }}
        animate={vinylControls}
      >
        <motion.div
          className={`${vinylSize} rounded-full relative cursor-pointer`}
          style={{
            background:
              'radial-gradient(circle at 50% 50%, hsl(0 0% 5%) 0%, hsl(0 0% 10%) 18%, hsl(0 0% 5%) 20%, hsl(0 0% 12%) 22%, hsl(0 0% 5%) 36%, hsl(0 0% 12%) 38%, hsl(0 0% 5%) 52%, hsl(0 0% 12%) 54%, hsl(0 0% 5%) 68%, hsl(0 0% 12%) 70%, hsl(0 0% 5%) 84%, hsl(0 0% 8%) 100%)',
            boxShadow: isHovered
              ? '0 0 50px hsl(270 100% 65% / 0.35), 0 10px 40px rgba(0,0,0,0.7)'
              : '0 6px 24px rgba(0,0,0,0.6)',
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: isHovered ? 3 : 8,
            repeat: Infinity,
            ease: 'linear',
          }}
          onClick={handleVinylClick}
        >
          {/* Groove rings — concentric subtle lines */}
          {[24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 88].map((size) => (
            <div
              key={size}
              className="absolute rounded-full"
              style={{
                width: `${size}%`,
                height: `${size}%`,
                top: `${(100 - size) / 2}%`,
                left: `${(100 - size) / 2}%`,
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            />
          ))}

          {/* Reflective sheen on vinyl */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.03) 100%)',
            }}
          />

        {/* Center label — gradient circle with text */}
          <div
            className="absolute rounded-full flex items-center justify-center"
            style={{
              width: '30%',
              height: '30%',
              top: '35%',
              left: '35%',
              background:
                'radial-gradient(circle, hsl(330 100% 65% / 0.95), hsl(270 80% 40% / 0.95))',
              boxShadow:
                '0 0 24px hsl(330 100% 65% / 0.5), inset 0 0 10px rgba(0,0,0,0.3)',
            }}
          >
            <span className="text-[13px] md:text-[15px] font-display tracking-wider text-white text-center leading-tight select-none">
             🎧 Curated 🎧
              <br />
              for you
              <br />
              [CLICK ME]
            </span>
          </div>

          {/* Spindle hole */}
          <div
            className="absolute rounded-full"
            style={{
              width: '3.5%',
              height: '3.5%',
              top: '48.25%',
              left: '48.25%',
              background: 'hsl(0 0% 3%)',
              boxShadow: 'inset 0 0 4px rgba(0,0,0,0.8)',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Album cover — on top */}
      <motion.div
        className={`relative z-10 ${albumSize} rounded-3xl overflow-hidden transition-all duration-700`}
        style={{
          border: '4px solid hsl(330 100% 65%)',
          boxShadow: isHovered
            ? '0 30px 70px hsl(330 100% 65% / 0.4), 0 0 50px hsl(330 100% 65% / 0.3), inset 0 0 20px hsl(330 100% 65% / 0.2)'
            : '0 0 20px hsl(330 100% 65% / 0.5), 0 0 40px hsl(330 100% 65% / 0.3), inset 0 0 20px hsl(330 100% 65% / 0.2)',
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease-out, box-shadow 0.4s ease',
        }}
        animate={{
          boxShadow: isHovered
            ? '0 30px 70px hsl(330 100% 65% / 0.4), 0 0 50px hsl(330 100% 65% / 0.3), inset 0 0 20px hsl(330 100% 65% / 0.2)'
            : [
                '0 0 20px hsl(330 100% 65% / 0.5), 0 0 40px hsl(330 100% 65% / 0.3), inset 0 0 20px hsl(330 100% 65% / 0.2)',
                '0 0 30px hsl(180 100% 50% / 0.5), 0 0 60px hsl(180 100% 50% / 0.3), inset 0 0 30px hsl(180 100% 50% / 0.2)',
                '0 0 20px hsl(330 100% 65% / 0.5), 0 0 40px hsl(330 100% 65% / 0.3), inset 0 0 20px hsl(330 100% 65% / 0.2)',
              ],
          borderColor: isHovered
            ? 'hsl(330 100% 65%)'
            : [
                'hsl(330 100% 65%)',
                'hsl(180 100% 50%)',
                'hsl(330 100% 65%)',
              ],
        }}
        transition={{ duration: 4, repeat: isHovered ? 0 : Infinity }}
      >
        <img
          src={albumCoverImg}
          alt="For You album cover"
          className="w-full h-full object-cover"
        />

        {/* Shine overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 40%)',
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Outer glow */}
      <motion.div
        className="absolute -inset-6 rounded-3xl opacity-60 pointer-events-none -z-10"
        style={{
          background:
            'linear-gradient(135deg, hsl(330 100% 65% / 0.4), hsl(180 100% 50% / 0.4))',
          filter: 'blur(30px)',
        }}
        animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </div>
  );
};

export default AlbumCover;
