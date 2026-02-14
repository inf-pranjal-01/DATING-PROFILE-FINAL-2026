import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WindowsXPDialogProps {
  isOpen: boolean;
  onAccept: () => void;
}

const termsContent = `DATING SERVICES END USER LICENSE AGREEMENT

IMPORTANT – READ CAREFULLY BEFORE PROCEEDING

This End User License Agreement ("Agreement") is a binding legal contract between you ("User", "You", "Second Party", "The Romantically Interested Entity") and The Provider ("Provider", "First Party", "The Grand Prize").

BY CLICKING "ACCEPT", YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY ALL TERMS HEREIN.

═══════════════════════════════════════════════════════════════

ARTICLE I: MANDATORY COMPLIANCE CLAUSES

Section 1.1 – Communication Protocol
User agrees to respond to text messages within a commercially reasonable timeframe, defined as "before I overthink and assume you hate me" (typically 2-4 hours, 6 hours maximum during designated sleep cycles).

Section 1.2 – Culinary Asset Sharing  
All food items purchased by either party shall be considered community property. User explicitly waives all rights to the phrase "I'm not hungry" when subsequently consuming Provider's french fries.

Section 1.3 – Meme Exchange Obligations
User commits to unlimited meme transmission rights. Provider reserves right to send memes at any hour, including but not limited to: 3:47 AM, during User's meetings, and family gatherings.

Section 1.4 – Textile Property Redistribution
User acknowledges that all hoodies, regardless of original purchase party, shall become "our hoodie" upon sixty (60) days of relationship establishment.

═══════════════════════════════════════════════════════════════

ARTICLE II: EMOTIONAL SUPPORT PROVISIONS

Section 2.1 – Existential Crisis Management  
Provider may initiate deep philosophical conversations at approximately 2:00 AM. User agrees to engage with questions such as "Do you think crabs think fish can fly?" with appropriate seriousness.

Section 2.2 – Comfort Protocol
User shall provide emotional support during Provider's irrational fears, including but not limited to:
- "Everyone secretly hates me"
- "I peaked in high school"
- "That text sounded rude, didn't it?"

═══════════════════════════════════════════════════════════════

ARTICLE III: DISCLOSURE OF MATERIAL DEFECTS

Section 3.1 – Known Issues  
Provider discloses the following non-conformities:
- Chronic overthinker (certified)
- Will quote memes in serious conversations  
- Singing voice: mediocre, enthusiasm: excessive
- Morning person status: FALSE
- Caffeine dependency: CRITICAL LEVEL

Section 3.2 – Quirk Acknowledgment
User accepts Provider "as-is" including weird laugh, tendency to narrate cooking like Food Network host, and irrational attachment to childhood stuffed animal.

═══════════════════════════════════════════════════════════════

ARTICLE IV: ENTERTAINMENT & RECREATION

Section 4.1 – Streaming Services Governance  
Netflix password sharing is mandatory. User agrees to endure Provider's questionable taste in reality TV. Skipping intro songs is STRICTLY PROHIBITED.

Section 4.2 – Date Night Arbitration
Provider maintains veto power over restaurant selection after the "Sketchy Taco Truck Incident of 2024."

═══════════════════════════════════════════════════════════════

ARTICLE V: PRIVACY & DATA USAGE

Section 5.1 – Photographic Rights  
User consents to being photographed at unflattering angles for Provider's private collection titled "You Look Cute When You Don't Know I'm Looking."

Section 5.2 – Conversational Recording
All embarrassing stories are subject to retelling at gatherings. User waives right to "That never happened."

═══════════════════════════════════════════════════════════════

ARTICLE VI: TERM & TERMINATION

Section 6.1 – Relationship Duration
Initial term: Indefinite, with auto-renewal clauses. Early termination requires 90-day notice and written thesis on "Why I'm Making a Huge Mistake."

Section 6.2 – Breakup Penalties  
Termination fees include: returning all hoodies, deleting shared Spotify playlists, and mandatory awkward "we can still be friends" coffee meeting.

═══════════════════════════════════════════════════════════════

ARTICLE VII: DISPUTE RESOLUTION

Section 7.1 – Conflict Management  
All arguments shall be resolved via:
1. Talking it out like adults
2. If that fails: Rock, Paper, Scissors (best 2 of 3)
3. Last resort: Asking your mom who's right

═══════════════════════════════════════════════════════════════

ARTICLE VIII: MISCELLANEOUS PROVISIONS

Section 8.1 – Pet Custody Anticipation  
In event of future pet acquisition, User acknowledges Provider will refer to self as "mom/dad" and you will tolerate baby-talk voices.

Section 8.2 – Holiday Obligations
User agrees to pretend Provider's handmade gifts are "exactly what I wanted" regardless of actual crafting skill demonstrated.

Section 8.3 – Spotify Wrapped Transparency
User permits judgment of music taste based on annual Spotify Wrapped results.

═══════════════════════════════════════════════════════════════

SCHEDULE A: ACCEPTABLE RESPONSE TIMES
- Good morning text: Within 30 min of waking  
- Funny meme: Immediate emoji reaction required
- "We need to talk": EMERGENCY PROTOCOL
- "What's for dinner?": No time limit (unanswerable)

SCHEDULE B: APPROVED PET NAMES  
Acceptable: Babe, Bubs, Dork, Nerd, Dummy (affectionate)
PROHIBITED: Bae, Zaddy, Kitten

SCHEDULE C: SHARED CALENDAR EVENTS
- Weekly movie night (non-negotiable)
- Monthly "why we're dating" date  
- Quarterly "meet weird friends" mixer
- Annual "what are we?" panic talk (optional)

═══════════════════════════════════════════════════════════════

EXHIBIT A: PROVIDER SPECIFICATIONS
- Humor: Dark but not concerning
- Cooking skill: 6.5/10 (pasta specialist)  
- Emotional availability: Surprisingly high
- Red flags: 0* (*detection system under review)

EXHIBIT B: COMPATIBILITY CHECKLIST  
☑ Laughs at own jokes when no one else does
☑ Willing to be big spoon AND little spoon
☑ Accepts pizza as food group
☑ Won't judge 3 AM Wikipedia deep-dives  

═══════════════════════════════════════════════════════════════

FINAL PROVISIONS

This Agreement constitutes entire understanding between parties. 

You didn't read this. But you clicked Accept anyway. 
That's commitment. I like that.

By proceeding, you acknowledge:
✓ You're taking a chance on someone weird  
✓ But the GOOD kind of weird
✓ You're potentially making best decision ever
✓ Either way, it'll be fun

The real agreement:
- I'll make you laugh
- I'll share my fries (after saying no)  
- I'll text you memes at 3 AM
- I'll be genuinely happy to see you
- I'll try my best, even when I'm a mess

That's it. ♥`;

const WindowsXPDialog = ({ isOpen, onAccept }: WindowsXPDialogProps) => {
  const [declineHoverCount, setDeclineHoverCount] = useState(0);
  const [declinePosition, setDeclinePosition] = useState({ x: 0, y: 0 });
  const [declineVisible, setDeclineVisible] = useState(true);
  const [shakeClose, setShakeClose] = useState(false);
  const declineButtonRef = useRef<HTMLButtonElement>(null);

  const handleDeclineHover = () => {
    if (declineHoverCount >= 5) {
      setDeclineVisible(false);
      return;
    }

    const randomX = (Math.random() - 0.5) * 200;
    const randomY = (Math.random() - 0.5) * 100;
    
    setDeclinePosition({ x: randomX, y: randomY });
    setDeclineHoverCount(prev => prev + 1);
  };

  const handleCloseClick = () => {
    setShakeClose(true);
    setTimeout(() => setShakeClose(false), 500);
  };

  const getDeclineText = () => {
    if (declineHoverCount >= 3) return "Why Are You Running?";
    return "I Decline";
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="w-full max-w-[600px] bg-xp-beige rounded-lg overflow-hidden"
            style={{
              border: '3px ridge #0054E3',
              boxShadow: '5px 5px 10px rgba(0,0,0,0.3)',
            }}
          >
            {/* Title bar */}
            <div className="xp-titlebar h-[30px] flex items-center justify-between px-2">
              <span className="text-white font-bold text-[11px] font-system truncate">
                Cookie Usage Agreement v14.02.2026
              </span>
              <div className="flex gap-1">
                <button className="w-5 h-5 bg-xp-button rounded-sm flex items-center justify-center opacity-50 cursor-not-allowed text-[10px]">
                  —
                </button>
                <button className="w-5 h-5 bg-xp-button rounded-sm flex items-center justify-center opacity-50 cursor-not-allowed text-[10px]">
                  □
                </button>
                <motion.button 
                  onClick={handleCloseClick}
                  animate={shakeClose ? { x: [-5, 5, -5, 5, 0] } : {}}
                  transition={{ duration: 0.3 }}
                  className="w-5 h-5 bg-carnival-red rounded-sm flex items-center justify-center text-white text-[10px] font-bold"
                >
                  ×
                </motion.button>
              </div>
            </div>

            {/* Content area */}
            <div className="bg-white p-4 h-[400px] overflow-y-scroll hide-scrollbar">
              <pre className="font-mono text-xs text-foreground whitespace-pre-wrap leading-relaxed">
                {termsContent}
              </pre>
            </div>

            {/* Buttons area */}
            <div className="bg-xp-beige p-3 flex justify-end gap-3 relative h-16">
              {declineVisible && (
                <motion.button
                  ref={declineButtonRef}
                  onMouseEnter={handleDeclineHover}
                  animate={{ x: declinePosition.x, y: declinePosition.y }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="xp-button"
                >
                  {getDeclineText()}
                </motion.button>
              )}
              <button
                onClick={onAccept}
                className="xp-button xp-button-primary font-bold"
              >
                I Accept These Terms
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WindowsXPDialog;
