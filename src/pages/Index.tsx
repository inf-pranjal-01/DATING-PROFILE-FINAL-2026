import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PlugInteraction from '@/components/PlugInteraction';
import CarnivalHero from '@/components/CarnivalHero';
import ClaimPrizeSection from '@/components/ClaimPrizeSection';
import WindowsXPDialog from '@/components/WindowsXPDialog';
import NotificationToast from '@/components/NotificationToast';
import HomieComments from '@/components/HomieComments';
import PetBotChat from '@/components/PetBotChat';
import MiniMusicPlayer from '@/components/MiniMusicPlayer';

const Index = () => {
  const [showPlugInteraction, setShowPlugInteraction] = useState(true);
  const [showFlicker, setShowFlicker] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogTriggered, setDialogTriggered] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  const handlePlugConnect = () => {
    // Show flicker effect
    setShowFlicker(true);
    setTimeout(() => {
      setShowFlicker(false);
      setShowPlugInteraction(false);
    }, 500);
  };

  const handleAccept = () => {
    setShowDialog(false);
    setTermsAccepted(true);
    setShowNotification(true);
    document.body.style.overflow = 'unset';
    
    // Auto-dismiss notification after 8 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 8000);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (dialogTriggered || termsAccepted) return;
      
      const scrollTop = window.scrollY;
      if (scrollTop > 300 && !showDialog) {
        setShowDialog(true);
        setDialogTriggered(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dialogTriggered, showDialog, termsAccepted]);

  // Lock scroll when plug interaction is showing
  useEffect(() => {
    if (showPlugInteraction) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showPlugInteraction]);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Flicker overlay */}
      <AnimatePresence>
        {showFlicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 1, 0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-carnival-yellow z-[100] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Plug Interaction */}
      <AnimatePresence>
        {showPlugInteraction && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PlugInteraction onConnect={handlePlugConnect} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content (only visible after plug connects) */}
      {!showPlugInteraction && (
        <motion.div
          ref={mainContentRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Carnival Hero Section */}
          <CarnivalHero />

          {/* Homie Comments Section */}
          <HomieComments />

          {/* Claim Your Prize Section */}
          <ClaimPrizeSection />

          {/* Footer */}
          <footer className="py-8 text-center carnival-gradient border-t border-white/10">
            <p className="text-white/60 text-sm">
              Made with 💖 and questionable life choices
            </p>
            <p className="text-white/40 text-xs mt-2">
              © 2025 Grand Prize Dating™ - All Rights and Love Reserved (for you)
            </p>
          </footer>
        </motion.div>
      )}

      {/* Windows XP Dialog */}
      <WindowsXPDialog isOpen={showDialog} onAccept={handleAccept} />

      {/* Notification Toast */}
      <NotificationToast 
        isVisible={showNotification} 
        onClose={() => setShowNotification(false)} 
      />

      {/* Pet Bot Chat (only visible after accepting terms) */}
      {termsAccepted && <PetBotChat />}

      {/* Mini Music Player — appears after plug interaction */}
      <MiniMusicPlayer visible={!showPlugInteraction} />
    </div>
  );
};

export default Index;
