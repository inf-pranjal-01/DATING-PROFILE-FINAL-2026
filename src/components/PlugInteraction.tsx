import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlugInteractionProps {
  onConnect: () => void;
}

const PlugInteraction = ({ onConnect }: PlugInteractionProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [showSparks, setShowSparks] = useState(false);
  const [wireGlowing, setWireGlowing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<HTMLDivElement>(null);
  const plugRef = useRef<HTMLDivElement>(null);
  const wireRef = useRef<SVGPathElement>(null);
  const isDraggingRef = useRef(false);
  const posRef = useRef({ x: 50, y: typeof window !== 'undefined' ? window.innerHeight - 150 : 500 });

  const socketPosition = {
    x: typeof window !== 'undefined' ? window.innerWidth - 60 : 800,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
  };

  const updateDOM = useCallback(() => {
    const { x, y } = posRef.current;
    if (plugRef.current) {
      plugRef.current.style.left = `${x}px`;
      plugRef.current.style.top = `${y}px`;
    }
    if (wireRef.current) {
      const startX = 0;
      const startY = y + 35;
      const endX = x + 20;
      const endY = y + 35;
      const controlX1 = startX + (endX - startX) * 0.3;
      const controlY1 = startY + 50 * Math.sin((endX - startX) * 0.01);
      const controlX2 = startX + (endX - startX) * 0.7;
      const controlY2 = endY - 30 * Math.sin((endX - startX) * 0.01);
      wireRef.current.setAttribute('d', `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`);
    }
  }, []);

  // Initial render
  useEffect(() => {
    updateDOM();
  }, [updateDOM]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isConnected) return;
    isDraggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [isConnected]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current || isConnected) return;

    const newX = Math.max(20, Math.min(e.clientX - 40, window.innerWidth - 100));
    const newY = Math.max(20, Math.min(e.clientY - 40, window.innerHeight - 100));

    posRef.current = { x: newX, y: newY };
    updateDOM();

    // Check proximity to socket
    const distance = Math.sqrt(
      Math.pow(newX - socketPosition.x + 40, 2) +
      Math.pow(newY - socketPosition.y, 2)
    );

    if (distance < 80) {
      handleConnection();
    }
  }, [isConnected, socketPosition, updateDOM]);

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const handleConnection = () => {
    if (isConnected) return;

    setIsConnected(true);
    isDraggingRef.current = false;

    // Snap to socket
    posRef.current = {
      x: socketPosition.x - 60,
      y: socketPosition.y - 35,
    };
    updateDOM();

    // Show sparks
    setShowSparks(true);
    setTimeout(() => setShowSparks(false), 500);

    // Wire glow
    setTimeout(() => setWireGlowing(true), 200);

    // Transition to next section
    setTimeout(() => {
      onConnect();
    }, 1500);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-background z-50 overflow-hidden cursor-default"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Instruction text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
      >
        <p className="text-muted-foreground text-lg font-system">
          Drag the plug to connect ⚡
        </p>
      </motion.div>

      {/* Wire SVG */}
      <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
        <path
          ref={wireRef}
          fill="none"
          stroke={wireGlowing ? "#FFD700" : "#000"}
          strokeWidth="10"
          strokeLinecap="round"
          className={wireGlowing ? "wire-glow" : ""}
          style={{
            filter: wireGlowing ? 'drop-shadow(0 0 10px #FFD700)' : 'none',
            transition: wireGlowing ? 'all 0.5s ease-out' : 'none',
          }}
        />
      </svg>

      {/* Electrical Plug - Hand-drawn style */}
      <div
        ref={plugRef}
        style={{
          position: 'absolute',
          cursor: 'grab',
          touchAction: 'none',
        }}
        onPointerDown={handlePointerDown}
      >
        <svg width="90" height="90" viewBox="0 0 90 90" className="select-none">
          {/* Plug body */}
          <rect x="15" y="40" width="55" height="30" rx="4" fill="#d4d4d4" stroke="#555" strokeWidth="2" />
          <rect x="17" y="42" width="51" height="26" rx="3" fill="linear" />
          {/* Body gradient shading */}
          <defs>
            <linearGradient id="plugBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e8e8e8" />
              <stop offset="50%" stopColor="#c0c0c0" />
              <stop offset="100%" stopColor="#a0a0a0" />
            </linearGradient>
            <linearGradient id="prongGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c0c0c0" />
              <stop offset="100%" stopColor="#888" />
            </linearGradient>
          </defs>
          <rect x="15" y="40" width="55" height="30" rx="4" fill="url(#plugBody)" stroke="#666" strokeWidth="2" />
          {/* Left prong */}
          <rect x="28" y="8" width="7" height="34" rx="1.5" fill="url(#prongGrad)" stroke="#555" strokeWidth="1.5" />
          {/* Right prong */}
          <rect x="50" y="8" width="7" height="34" rx="1.5" fill="url(#prongGrad)" stroke="#555" strokeWidth="1.5" />
          {/* Wire exit */}
          <circle cx="12" cy="55" r="6" fill="#333" />
          <circle cx="12" cy="55" r="3" fill="#1a1a1a" />
          {/* Plug label / texture lines */}
          <line x1="25" y1="50" x2="60" y2="50" stroke="#999" strokeWidth="0.5" />
          <line x1="25" y1="54" x2="60" y2="54" stroke="#999" strokeWidth="0.5" />
          <line x1="25" y1="58" x2="60" y2="58" stroke="#999" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Electrical Socket */}
      <div
        ref={socketRef}
        className="absolute pulse-glow"
        style={{
          right: 20,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        <svg width="80" height="110" viewBox="0 0 80 110">
          <defs>
            <linearGradient id="plateFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f5f0e8" />
              <stop offset="100%" stopColor="#ddd5c8" />
            </linearGradient>
            <radialGradient id="socketInner" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#2a2a2a" />
              <stop offset="100%" stopColor="#111" />
            </radialGradient>
          </defs>
          {/* Wall plate */}
          <rect x="5" y="5" width="70" height="100" rx="6" fill="url(#plateFill)" stroke="#bbb" strokeWidth="2" />
          {/* Inner shadow */}
          <rect x="8" y="8" width="64" height="94" rx="4" fill="none" stroke="#ccc" strokeWidth="1" />
          {/* Screw top */}
          <circle cx="40" cy="15" r="4" fill="#ccc" stroke="#aaa" strokeWidth="1" />
          <line x1="37" y1="15" x2="43" y2="15" stroke="#999" strokeWidth="1" />
          {/* Socket face - recessed area */}
          <rect x="18" y="28" width="44" height="50" rx="22" fill="url(#socketInner)" stroke="#333" strokeWidth="1.5" />
          {/* Left slot */}
          <rect x="27" y="38" width="7" height="16" rx="2" fill="#000" stroke="#222" strokeWidth="0.5" />
          {/* Right slot */}
          <rect x="46" y="38" width="7" height="16" rx="2" fill="#000" stroke="#222" strokeWidth="0.5" />
          {/* Ground hole */}
          <circle cx="40" cy="67" r="4.5" fill="#000" stroke="#222" strokeWidth="0.5" />
          {/* Screw bottom */}
          <circle cx="40" cy="95" r="4" fill="#ccc" stroke="#aaa" strokeWidth="1" />
          <line x1="40" y1="92" x2="40" y2="98" stroke="#999" strokeWidth="1" />
        </svg>
      </div>

      {/* Sparks effect */}
      <AnimatePresence>
        {showSparks && (
          <div className="absolute" style={{ left: socketPosition.x - 30, top: socketPosition.y - 40 }}>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 0 }}
                animate={{
                  opacity: 0,
                  scale: 1.5,
                  x: (Math.random() - 0.5) * 100,
                  y: (Math.random() - 0.5) * 100,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="absolute w-4 h-4"
                style={{
                  background: i % 2 === 0 ? '#FFD700' : '#FFF',
                  borderRadius: '50%',
                  filter: 'blur(2px)',
                  boxShadow: '0 0 10px #FFD700',
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlugInteraction;
