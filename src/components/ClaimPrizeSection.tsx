import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const ClaimPrizeSection = () => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <section className="py-20 px-4 carnival-gradient relative overflow-hidden">
        <div className="max-w-[700px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.button
              onClick={() => setShowDialog(true)}
              className="relative px-10 py-5 rounded-xl font-display text-3xl md:text-4xl tracking-[0.15em] border-2 transition-all"
              style={{
                color: 'hsl(330 100% 65%)',
                borderColor: 'hsl(330 100% 65%)',
                textShadow: '0 0 10px hsl(330 100% 65% / 0.6), 0 0 20px hsl(330 100% 65% / 0.3)',
                boxShadow: '0 0 15px hsl(330 100% 65% / 0.4), 0 0 30px hsl(330 100% 65% / 0.2), inset 0 0 15px hsl(330 100% 65% / 0.1)',
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 25px hsl(330 100% 65% / 0.6), 0 0 50px hsl(330 100% 65% / 0.3), inset 0 0 25px hsl(330 100% 65% / 0.2)',
              }}
              whileTap={{ scale: 0.98 }}
            >
              🎪 CLAIM YOUR PRIZE 🎪
            </motion.button>

            <p className="text-xl mt-6 text-white/70">
              Desperate for details? Ask the pet bot 🐾
            </p>
          </motion.div>
        </div>
      </section>

      {/* Dialog - rendered outside section to avoid overflow-hidden clipping */}
      <AnimatePresence>
        {showDialog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-[200]"
              onClick={() => setShowDialog(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="w-[90%] max-w-md rounded-2xl p-8 text-center relative pointer-events-auto"
                style={{
                  background: 'linear-gradient(135deg, hsl(250 30% 12%), hsl(250 25% 18%))',
                  border: '2px solid hsl(330 100% 65% / 0.5)',
                  boxShadow: '0 0 30px hsl(330 100% 65% / 0.3), 0 0 60px hsl(330 100% 65% / 0.1)',
                }}
              >
                <button
                  onClick={() => setShowDialog(false)}
                  className="absolute top-3 right-3 text-white/50 hover:text-white"
                >
                  <X size={20} />
                </button>

                <p className="text-white/90 text-lg md:text-xl font-body leading-relaxed mb-8">
                  "Curiosity looks good on you. We might look good together."
                </p>

                <a
                  href="mailto:pranjal.2025ug1073@iiitranchi.in"
                  className="inline-block px-8 py-3 rounded-full font-display text-xl tracking-wider transition-all"
                  style={{
                    background: 'linear-gradient(135deg, hsl(330 100% 65%), hsl(280 87% 44%))',
                    color: 'white',
                    boxShadow: '0 0 20px hsl(330 100% 65% / 0.5)',
                  }}
                >
                  Send a Hi! 💌
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ClaimPrizeSection;
