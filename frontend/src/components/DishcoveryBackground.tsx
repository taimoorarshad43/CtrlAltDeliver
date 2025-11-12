import { motion } from 'motion/react';

interface DishcoveryBackgroundProps {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export function DishcoveryBackground({ colors }: DishcoveryBackgroundProps) {
  // Floating food items
  const floatingFoods = [
    { emoji: '🍕', top: '10%', left: '25%', duration: 20, delay: 0 },
    { emoji: '🍣', top: '25%', left: '75%', duration: 25, delay: 2 },
    { emoji: '🌮', top: '60%', left: '20%', duration: 22, delay: 4 },
    { emoji: '🍜', top: '70%', left: '80%', duration: 24, delay: 1 },
    { emoji: '🍔', top: '35%', left: '85%', duration: 23, delay: 3 },
    { emoji: '🍛', top: '80%', left: '30%', duration: 21, delay: 5 },
    { emoji: '🥟', top: '15%', left: '60%', duration: 26, delay: 2.5 },
    { emoji: '🍰', top: '75%', left: '55%', duration: 22, delay: 4.5 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient backdrop */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 20% 30%, ${colors.primary}40, transparent 60%),
                       radial-gradient(circle at 80% 70%, ${colors.secondary}40, transparent 60%),
                       radial-gradient(circle at 50% 50%, ${colors.accent}20, transparent 70%)`,
        }}
      />

      {/* Dotted pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle, ${colors.primary} 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />

      {/* Floating food items */}
      {floatingFoods.map((food, index) => (
        <motion.div
          key={index}
          className="absolute text-5xl opacity-20"
          style={{
            top: food.top,
            left: food.left,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.sin(index) * 50, 0],
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: food.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: food.delay,
          }}
        >
          {food.emoji}
        </motion.div>
      ))}

      {/* Ambient light orbs */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          background: `radial-gradient(circle, ${colors.primary}, transparent)`,
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          background: `radial-gradient(circle, ${colors.secondary}, transparent)`,
        }}
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Recipe cards floating in background */}
      <motion.div
        className="absolute top-1/3 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: 0.15, 
          y: [0, -20, 0],
          rotate: [-2, 2, -2],
        }}
        transition={{
          opacity: { duration: 1, delay: 2 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <div 
          className="w-64 h-80 rounded-2xl border border-white/20"
          style={{
            background: `linear-gradient(135deg, ${colors.accent}20, ${colors.primary}20)`,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}
        />
      </motion.div>
    </div>
  );
}
