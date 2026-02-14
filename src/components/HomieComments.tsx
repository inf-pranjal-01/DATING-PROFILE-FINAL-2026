import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, MoreHorizontal, CheckCircle } from 'lucide-react';

interface Comment {
  id: number;
  username: string;
  avatar: string;
  text: string;
  likes: number;
  comments: number;
  time: string;
  verified?: boolean;
  reply?: {
    username: string;
    text: string;
  };
}

const commentsData: Comment[] = [
  {
    id: 1,
    username: '@bestfriend1',
    avatar: '🧑',
    text: "Bro finally made a website instead of texting 'wyd' at 2 AM to me instead of his crush.",
    likes: 47,
    comments: 12,
    time: '2d',
  },
  {
    id: 2,
    username: '@childhood_homie',
    avatar: '👨',
    text: "Known him since 3rd grade. Can confirm: He's 85% decent human, 15% walking meme. Still recommend. Would trust with my Netflix password.",
    likes: 92,
    comments: 8,
    time: '1w',
  },
  {
    id: 3,
    username: '@roommate',
    avatar: '🧔',
    text: "Lives with this guy. Pros: Clean, funny, wakes me up in morning. Cons: Sometimes he himself wakes up late. Send help. 🎤😭",
    likes: 156,
    comments: 24,
    time: '3d',
  },
  {
    id: 4,
    username: '@pet_doggo',
    avatar: '🐕',
    text: "Don't let him pet you or else you will get addicted. I tried to leave once. Couldn't. Now I'm stuck getting belly rubs forever. Worth it though. 11/10 would recommend. *woof* 🐾",
    likes: 312,
    comments: 45,
    time: '4h',
  },
  {
    id: 5,
    username: '@ex_girlfriend',
    avatar: '👱‍♀️',
    text: "He's actually great. I'm just commitment-phobic. If you're reading this: say yes. I regret everything. This is not a drill. THIS IS ONCE IN A LIFETIME CHANCE. 🚩🚨",
    likes: 203,
    comments: 67,
    time: '12h',
  },
];

const HomieComments = () => {
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());
  const [animatedLikes, setAnimatedLikes] = useState<Map<number, number>>(new Map());

  const handleLike = (commentId: number, originalLikes: number) => {
    if (likedComments.has(commentId)) return;
    
    setLikedComments(prev => new Set([...prev, commentId]));
    
    // Animate the like count
    let current = originalLikes;
    const target = originalLikes + 1;
    const interval = setInterval(() => {
      current++;
      setAnimatedLikes(prev => new Map(prev).set(commentId, current));
      if (current >= target) {
        clearInterval(interval);
      }
    }, 50);
  };

  return (
    <section className="py-16 px-4 carnival-gradient min-h-screen">
      <div className="max-w-[700px] mx-auto">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-carnival text-3xl md:text-4xl text-center mb-10"
          style={{
            color: 'hsl(180 100% 50%)',
            textShadow: '0 0 5px hsl(180 100% 50% / 0.4), 0 0 10px hsl(180 100% 50% / 0.2)',
          }}
        >
          What The Homies Say 💬
        </motion.h2>

        {/* Comments */}
        <div className="space-y-5">
          {commentsData.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, boxShadow: '0 8px 30px hsl(330 100% 65% / 0.2)' }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-5 shadow-md transition-shadow border border-white/10"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{comment.avatar}</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm text-white/90">{comment.username}</span>
                    {comment.verified && (
                      <CheckCircle className="w-4 h-4 text-instagram-blue fill-instagram-blue" />
                    )}
                  </div>
                </div>
                <button className="text-white/40 hover:text-white/70">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              {/* Text */}
              <p className="text-white/80 text-sm leading-relaxed mb-4">
                {comment.text}
              </p>

              {/* Reply if exists */}
              {comment.reply && (
                <div className="ml-8 mb-4 pl-3 border-l-2 border-white/20">
                  <span className="font-bold text-xs text-white/50">{comment.reply.username}</span>
                  <p className="text-sm text-white/50">{comment.reply.text}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-6 text-white/40 text-sm">
                <button
                  onClick={() => handleLike(comment.id, comment.likes)}
                  className="flex items-center gap-1 hover:text-carnival-red transition-colors"
                >
                  <Heart
                    size={18}
                    className={likedComments.has(comment.id) ? 'fill-carnival-red text-carnival-red' : ''}
                  />
                  <span>
                    {animatedLikes.get(comment.id) ?? comment.likes}
                  </span>
                </button>
                <button className="flex items-center gap-1 hover:text-white/70 transition-colors">
                  <MessageCircle size={18} />
                  <span>{comment.comments}</span>
                </button>
                <span className="ml-auto">⏰ {comment.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomieComments;
