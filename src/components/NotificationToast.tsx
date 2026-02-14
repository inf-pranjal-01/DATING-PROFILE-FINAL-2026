import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface NotificationToastProps {
  isVisible: boolean;
  onClose: () => void;
}

const NotificationToast = ({ isVisible, onClose }: NotificationToastProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0, y: -20 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="fixed top-5 right-5 z-[10000] w-[350px] max-w-[90vw] bg-card rounded-lg shadow-xl overflow-hidden"
          style={{
            borderLeft: '4px solid hsl(var(--xp-blue))',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔔</span>
              <span className="font-bold text-sm text-foreground">Relationship Status Update</span>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              YOU JUST ACCEPTED TO BE HIS VALENTINE WITHOUT READING TERMS AND CONDITIONS... MAYBE.
            </p>
            <p className="text-sm text-muted-foreground mt-3">
              BUT DON'T WORRY, HE'S A KEEPER. ❤️
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationToast;
