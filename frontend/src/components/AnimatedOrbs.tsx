import { motion } from 'motion/react';
import { Music, Globe, Users } from 'lucide-react';

interface AnimatedOrbsProps {
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export function AnimatedOrbs({ colors }: AnimatedOrbsProps) {
  const defaultColors = {
    primary: '#6366f1',
    secondary: '#a855f7',
    accent: '#ec4899',
  };
  
  const theme = colors || defaultColors;
  
  return (
    <div className="flex justify-center items-center gap-8 mb-6 relative">
      {/* Sound & Music Orb */}
      <motion.div
        className="relative"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
      >
        <motion.div
          className="w-24 h-24 rounded-full flex items-center justify-center backdrop-blur-xl border-2 border-white/30 shadow-2xl relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${theme.primary}90, ${theme.primary}60)`,
          }}
          animate={{
            boxShadow: [
              `0 0 20px ${theme.primary}40`,
              `0 0 40px ${theme.primary}60`,
              `0 0 20px ${theme.primary}40`,
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Animated waves */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white/20 rounded-full" />
          </motion.div>
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-2 border-white/20 rounded-full" />
          </motion.div>
          
          <Music className="w-10 h-10 text-white relative z-10" />
        </motion.div>
      </motion.div>

      {/* Center Food Orb - Largest */}
      <motion.div
        className="relative"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.5, delay: 0.2 }}
      >
        <motion.div
          className="w-32 h-32 rounded-full flex items-center justify-center backdrop-blur-xl border-2 border-white/30 shadow-2xl relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${theme.secondary}90, ${theme.accent}60)`,
          }}
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              `0 0 30px ${theme.secondary}40`,
              `0 0 50px ${theme.accent}60`,
              `0 0 30px ${theme.secondary}40`,
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Pulsing rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-white/30"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.8, 0, 0.8],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 1,
                ease: 'easeOut',
              }}
            />
          ))}
          
          <span className="text-6xl relative z-10 filter drop-shadow-lg">🍽️</span>
        </motion.div>
      </motion.div>

      {/* Culture & Community Orb */}
      <motion.div
        className="relative"
        initial={{ scale: 0, rotate: 180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.5, delay: 0.4 }}
      >
        <motion.div
          className="w-24 h-24 rounded-full flex items-center justify-center backdrop-blur-xl border-2 border-white/30 shadow-2xl relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${theme.accent}90, ${theme.accent}60)`,
          }}
          animate={{
            boxShadow: [
              `0 0 20px ${theme.accent}40`,
              `0 0 40px ${theme.accent}60`,
              `0 0 20px ${theme.accent}40`,
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          {/* Orbiting dots */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/60 rounded-full" />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/60 rounded-full" />
            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-white/60 rounded-full" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-white/60 rounded-full" />
          </motion.div>
          
          <Globe className="w-10 h-10 text-white relative z-10" />
        </motion.div>
      </motion.div>

      {/* Connecting lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'blur(1px)' }}>
        <motion.line
          x1="20%"
          y1="50%"
          x2="42%"
          y2="50%"
          stroke="white"
          strokeWidth="2"
          strokeOpacity="0.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
        />
        <motion.line
          x1="58%"
          y1="50%"
          x2="80%"
          y2="50%"
          stroke="white"
          strokeWidth="2"
          strokeOpacity="0.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
        />
      </svg>
    </div>
  );
}
