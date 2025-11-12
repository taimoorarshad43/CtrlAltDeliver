import { motion } from 'motion/react';
import { Music, Camera, Share2, BookOpen, Headphones, Users } from 'lucide-react';

interface DishcoveryLogoProps {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export function DishcoveryLogo({ colors }: DishcoveryLogoProps) {
  const activities = [
    { icon: Headphones, delay: 0, rotation: -45, distance: 140, label: 'Enjoy' },
    { icon: Camera, delay: 0.3, rotation: 0, distance: 140, label: 'Capture' },
    { icon: Share2, delay: 0.6, rotation: 45, distance: 140, label: 'Share' },
    { icon: BookOpen, delay: 0.9, rotation: 90, distance: 140, label: 'Learn' },
    { icon: Music, delay: 1.2, rotation: 135, distance: 140, label: 'Vibe' },
    { icon: Users, delay: 1.5, rotation: 180, distance: 140, label: 'Connect' },
  ];

  return (
    <div className="flex flex-col items-center justify-center mb-12">
      {/* Main Title - Center of Attention */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-8 relative z-10"
      >
        <motion.h1 
          className="text-white mb-3"
          style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontFamily: '"Playfair Display", "Georgia", serif',
            fontWeight: 700,
            letterSpacing: '0.02em',
            textShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 60px rgba(255,255,255,0.3)',
            background: `linear-gradient(135deg, white, ${colors.accent}30, white)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5))',
          }}
          animate={{
            textShadow: [
              '0 8px 32px rgba(0,0,0,0.4), 0 0 60px rgba(255,255,255,0.3)',
              '0 8px 32px rgba(0,0,0,0.4), 0 0 80px rgba(255,255,255,0.5)',
              '0 8px 32px rgba(0,0,0,0.4), 0 0 60px rgba(255,255,255,0.3)',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Dishcovery
        </motion.h1>
        
        <motion.p
          className="text-white/90 tracking-wider uppercase"
          style={{
            fontSize: 'clamp(0.75rem, 1.5vw, 1.125rem)',
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 300,
            letterSpacing: '0.3em',
            textShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Where Food Meets Culture
        </motion.p>
      </motion.div>

      {/* Chef Avatar with Activities */}
      <div className="relative">
        {/* Activity Icons Orbiting */}
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <motion.div
              key={index}
              className="absolute"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: [0.9, 1.1, 0.9],
                y: [0, -8, 0],
              }}
              transition={{
                opacity: { duration: 0.6, delay: activity.delay },
                scale: { duration: 2.5, repeat: Infinity, delay: activity.delay, ease: "easeInOut" },
                y: { duration: 2, repeat: Infinity, delay: activity.delay, ease: "easeInOut" },
              }}
              style={{
                left: `calc(50% + ${Math.cos((activity.rotation * Math.PI) / 180) * activity.distance}px)`,
                top: `calc(50% + ${Math.sin((activity.rotation * Math.PI) / 180) * activity.distance}px)`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <div 
                  className="p-3 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 shadow-lg"
                  style={{
                    boxShadow: `0 4px 16px ${colors.accent}40`,
                  }}
                >
                  <Icon className="text-white" size={24} strokeWidth={2} />
                </div>
                <span 
                  className="text-white/80 text-xs uppercase tracking-wider"
                  style={{
                    fontFamily: '"Montserrat", sans-serif',
                    fontWeight: 600,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  {activity.label}
                </span>
              </div>
            </motion.div>
          );
        })}

        {/* Chef Avatar */}
        <motion.div
          className="relative"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.5, type: "spring", stiffness: 100 }}
        >
          {/* Avatar Circle */}
          <div 
            className="w-32 h-32 rounded-full relative overflow-hidden shadow-2xl border-4 border-white/50"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            }}
          >
            {/* Chef Illustration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-6xl"
              >
                👨‍🍳
              </motion.div>
            </div>
            
            {/* Sparkle Effects */}
            <motion.div
              className="absolute top-2 right-2 text-xl"
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ✨
            </motion.div>
            
            <motion.div
              className="absolute bottom-2 left-2 text-xl"
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1,
                ease: "easeInOut",
              }}
            >
              ✨
            </motion.div>
          </div>

          {/* Pulsing Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-full blur-2xl -z-10"
            style={{
              background: `radial-gradient(circle, ${colors.accent}60, ${colors.primary}40, transparent)`,
            }}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.6, 0.9, 0.6],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Connecting Lines */}
        <svg className="absolute inset-0 pointer-events-none" style={{ width: '400px', height: '400px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
          {activities.map((activity, index) => {
            const x = 200 + Math.cos((activity.rotation * Math.PI) / 180) * activity.distance;
            const y = 200 + Math.sin((activity.rotation * Math.PI) / 180) * activity.distance;
            return (
              <motion.line
                key={index}
                x1="200"
                y1="200"
                x2={x}
                y2={y}
                stroke="white"
                strokeWidth="2"
                strokeOpacity="0.2"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: activity.delay + 0.5 }}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
