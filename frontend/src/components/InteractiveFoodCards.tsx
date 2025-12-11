import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Flame, Droplets } from 'lucide-react';
import { Card } from './ui/card';
import { ExtractedColors } from '../utils/colorExtractor';

interface InteractiveFoodCardsProps {
  onFoodSelect: (dishName: string) => void;
  themeColors: ExtractedColors;
}

const foodItems = [
  {
    name: 'Pizza',
    emoji: '🍕',
    quickFact: 'Click to explore Italian cuisine!',
    ingredients: ['🍅', '🧀', '🌿'],
    color: 'from-orange-500 to-amber-500',
    warm: true,
  },
  {
    name: 'Sushi',
    emoji: '🍣',
    quickFact: 'Click to discover Japanese traditions!',
    ingredients: ['🍚', '🐟', '🥢'],
    color: 'from-teal-500 to-cyan-500',
    warm: false,
  },
  {
    name: 'Tacos',
    emoji: '🌮',
    quickFact: 'Click to experience Mexican flavors!',
    ingredients: ['🌽', '🥩', '🌶️'],
    color: 'from-cyan-400 to-blue-500',
    warm: false,
  },
];

export function InteractiveFoodCards({ onFoodSelect, themeColors }: InteractiveFoodCardsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {foodItems.map((food, index) => (
        <motion.div
          key={food.name}
          whileHover={{ scale: 1.05, y: -10 }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => setHoveredIndex(index)}
          onHoverEnd={() => setHoveredIndex(null)}
          onClick={() => onFoodSelect(food.name)}
          className="cursor-pointer"
        >
          <Card 
            className="relative h-80 overflow-hidden border-2 transition-all duration-300"
            style={{
              borderColor: hoveredIndex === index ? (index === 0 ? '#ff7c5c' : index === 1 ? '#4ecdc4' : '#45b7d1') : (index === 0 ? '#ff7c5c40' : index === 1 ? '#4ecdc440' : '#45b7d140'),
              background: 'white',
            }}
          >
            {/* Animated background gradient */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${food.color} opacity-10`}
              animate={{
                opacity: hoveredIndex === index ? 0.2 : 0.1,
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Floating ingredients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {food.ingredients.map((ingredient, i) => (
                <motion.div
                  key={i}
                  className="absolute text-4xl opacity-30"
                  initial={{
                    x: Math.random() * 200 - 100,
                    y: 300,
                    rotate: 0,
                  }}
                  animate={hoveredIndex === index ? {
                    y: [-20, -40, -20],
                    x: [
                      Math.random() * 200 - 100,
                      Math.random() * 200 - 100 + 20,
                      Math.random() * 200 - 100,
                    ],
                    rotate: [0, 10, -10, 0],
                  } : {
                    y: 300,
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                  style={{
                    left: `${20 + i * 30}%`,
                  }}
                >
                  {ingredient}
                </motion.div>
              ))}
            </div>

            {/* Main emoji with pulse effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="relative"
                animate={hoveredIndex === index ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, -5, 5, 0],
                } : {
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  duration: 0.6,
                  repeat: hoveredIndex === index ? Infinity : 0,
                  repeatDelay: 0.5,
                }}
              >
                <div 
                  className="text-9xl"
                  style={{ filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.3))' }}
                >
                  {food.emoji}
                </div>
                
                {/* Sparkles effect */}
                {hoveredIndex === index && (
                  <>
                    <motion.div
                      className="absolute -top-4 -right-4"
                      animate={{
                        scale: [0, 1.5, 0],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                      }}
                    >
                      <Sparkles className="w-6 h-6" style={{ color: index === 0 ? '#ffb088' : index === 1 ? '#45b7d1' : '#74b9ff' }} />
                    </motion.div>
                    <motion.div
                      className="absolute -bottom-4 -left-4"
                      animate={{
                        scale: [0, 1.5, 0],
                        rotate: [360, 180, 0],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: 0.5,
                      }}
                    >
                      <Sparkles className="w-6 h-6" style={{ color: index === 0 ? '#ff7c5c' : index === 1 ? '#4ecdc4' : '#45b7d1' }} />
                    </motion.div>
                  </>
                )}
              </motion.div>
            </div>

            {/* Bottom info section */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-6 text-white"
              style={{
                background: index === 0 ? 'linear-gradient(to top, #ff7c5c, #ff7c5c00)' : index === 1 ? 'linear-gradient(to top, #4ecdc4, #4ecdc400)' : 'linear-gradient(to top, #45b7d1, #45b7d100)',
              }}
              animate={{
                opacity: hoveredIndex === index ? 1 : 0.7,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white">{food.name}</h3>
                {hoveredIndex === index && (
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    {index === 0 ? (
                      <Flame className="w-5 h-5 text-orange-300" />
                    ) : index === 1 ? (
                      <Droplets className="w-5 h-5 text-blue-300" />
                    ) : (
                      <Flame className="w-5 h-5 text-yellow-300" />
                    )}
                  </motion.div>
                )}
              </div>
              <motion.p
                className="text-sm text-white/90"
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: hoveredIndex === index ? 1 : 0,
                  y: hoveredIndex === index ? 0 : 10,
                }}
                transition={{ duration: 0.3 }}
              >
                {food.quickFact}
              </motion.p>
            </motion.div>

            {/* Ripple effect on hover */}
            {hoveredIndex === index && (
              <motion.div
                className="absolute inset-0 rounded-lg border-2"
                style={{ borderColor: themeColors.primary }}
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
