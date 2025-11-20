import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Sparkles, RefreshCw } from 'lucide-react';
import { AnalysisResult } from './FoodUploader';
import { ExtractedColors } from '../utils/colorExtractor';

interface FunFactsProps {
  analysisResult?: AnalysisResult | null;
  themeColors?: ExtractedColors;
}

const generalFacts = [
  {
    emoji: '🍯',
    fact: 'Honey never spoils! Archaeologists found 3,000-year-old honey in Egyptian tombs that was still perfectly edible.',
    category: 'Ancient Foods',
  },
  {
    emoji: '🍫',
    fact: 'Chocolate was once used as currency by the Aztecs. You could buy a turkey for 100 cacao beans!',
    category: 'Historical Treasures',
  },
  {
    emoji: '🥜',
    fact: 'Peanuts aren\'t actually nuts - they\'re legumes! They grow underground and are related to beans and lentils.',
    category: 'Food Science',
  },
  {
    emoji: '🍓',
    fact: 'Strawberries are the only fruit with seeds on the outside. A single strawberry can have up to 200 seeds!',
    category: 'Nature\'s Wonders',
  },
  {
    emoji: '🧀',
    fact: 'The most stolen food in the world is cheese! It\'s so valuable that there\'s a black market for rare cheeses.',
    category: 'Surprising Facts',
  },
  {
    emoji: '🍌',
    fact: 'Bananas are berries, but strawberries aren\'t! Botanically speaking, a berry has seeds on the inside.',
    category: 'Food Science',
  },
  {
    emoji: '🌶️',
    fact: 'Chili peppers make you feel hot because capsaicin tricks your brain into thinking your mouth is on fire!',
    category: 'Spicy Science',
  },
  {
    emoji: '🍅',
    fact: 'There are over 10,000 varieties of tomatoes! They come in colors ranging from white to purple to black.',
    category: 'Variety is Life',
  },
  {
    emoji: '🥑',
    fact: 'Avocados are toxic to birds and most domestic animals, but they\'re a superfood for humans!',
    category: 'Nature\'s Quirks',
  },
];

const dishSpecificFacts: Record<string, typeof generalFacts> = {
  // Italian
  Pizza: [
    {
      emoji: '🍕',
      fact: 'The world\'s largest pizza ever made was 122 feet in diameter and weighed over 26,000 pounds! It was made in Rome in 2012.',
      category: 'Record Breakers',
    },
    {
      emoji: '🍕',
      fact: 'Americans eat approximately 350 slices of pizza per second, adding up to 100 acres of pizza every day!',
      category: 'Mind-Blowing Stats',
    },
    {
      emoji: '🍕',
      fact: 'Pizza Margherita was created in 1889 to honor Queen Margherita of Italy, with toppings representing the Italian flag: red (tomato), white (mozzarella), and green (basil).',
      category: 'Royal History',
    },
    {
      emoji: '🍕',
      fact: 'Ancient Greeks and Romans ate flatbreads topped with oils and herbs, which is considered the ancestor of modern pizza.',
      category: 'Ancient Origins',
    },
    {
      emoji: '🍕',
      fact: 'The first pizzeria in the United States, Lombardi\'s, opened in New York City in 1905 and is still operating today!',
      category: 'American History',
    },
    {
      emoji: '🍕',
      fact: 'October is officially recognized as National Pizza Month in the United States.',
      category: 'Celebrations',
    },
  ],
  Sushi: [
    {
      emoji: '🍣',
      fact: 'Sushi chefs in Japan train for up to 10 years before they\'re allowed to serve customers. The first 2 years are often spent just learning to prepare the rice perfectly!',
      category: 'Mastery',
    },
    {
      emoji: '🍣',
      fact: 'Sushi was originally invented as a way to preserve fish! The rice fermented and preserved the fish for months.',
      category: 'Food Preservation',
    },
    {
      emoji: '🍣',
      fact: 'The original sushi, called narezushi, was fermented for 6 months to a year, and only the fish was eaten - the rice was discarded!',
      category: 'Ancient Technique',
    },
    {
      emoji: '🍣',
      fact: 'Real wasabi is extremely rare and expensive. Most "wasabi" served in restaurants is actually a mixture of horseradish, mustard, and green food coloring.',
      category: 'Surprising Truth',
    },
    {
      emoji: '🍣',
      fact: 'The most expensive sushi in the world can cost over $1,000 per piece, made with rare bluefin tuna belly called "otoro."',
      category: 'Luxury Dining',
    },
    {
      emoji: '🍣',
      fact: 'California Roll was invented in Los Angeles in the 1960s to make sushi more appealing to Americans who weren\'t used to eating raw fish.',
      category: 'Innovation',
    },
  ],
  Tacos: [
    {
      emoji: '🌮',
      fact: 'Tacos were invented by Mexican silver miners in the 18th century! The word "taco" referred to the little charges they used to excavate ore.',
      category: 'Mining History',
    },
    {
      emoji: '🌮',
      fact: 'The world record for eating tacos is 114 tacos in 8 minutes! That\'s more than 14 tacos per minute.',
      category: 'Record Breakers',
    },
    {
      emoji: '🌮',
      fact: 'In Mexico, tacos are traditionally eaten with hands, not forks! Using utensils is considered improper taco etiquette.',
      category: 'Cultural Traditions',
    },
    {
      emoji: '🌮',
      fact: 'Fish tacos originated in Baja California and became popular in San Diego in the 1980s, creating the iconic West Coast taco style.',
      category: 'Coastal Cuisine',
    },
    {
      emoji: '🌮',
      fact: 'Taco Bell serves over 2 billion tacos every year, but authentic Mexican tacos use soft corn tortillas, not the hard shells.',
      category: 'Fast Food Facts',
    },
    {
      emoji: '🌮',
      fact: 'October 4th is National Taco Day in the United States, celebrating one of America\'s favorite foods!',
      category: 'Celebrations',
    },
  ],
  Pasta: [
    {
      emoji: '🍝',
      fact: 'There are over 600 different types of pasta shapes! Each shape is designed to hold sauce differently.',
      category: 'Variety',
    },
    {
      emoji: '🍝',
      fact: 'The average Italian eats over 60 pounds of pasta per year, while Americans eat about 20 pounds.',
      category: 'Consumption',
    },
    {
      emoji: '🍝',
      fact: 'The word "pasta" comes from the Italian word for "paste" - referring to the dough.',
      category: 'Etymology',
    },
  ],
  
  // Japanese
  Ramen: [
    {
      emoji: '🍜',
      fact: 'Instant ramen was invented in 1958 and is considered one of Japan\'s greatest inventions of the 20th century!',
      category: 'Innovation',
    },
    {
      emoji: '🍜',
      fact: 'There are over 20,000 ramen restaurants in Japan, each with their own secret broth recipe.',
      category: 'Culinary Culture',
    },
    {
      emoji: '🍜',
      fact: 'The longest ramen noodle ever made was 10,119 feet long - that\'s almost 2 miles!',
      category: 'Record Breakers',
    },
  ],
  
  // American
  Burger: [
    {
      emoji: '🍔',
      fact: 'Americans eat 50 billion burgers per year - that\'s three burgers per person per week!',
      category: 'Consumption',
    },
    {
      emoji: '🍔',
      fact: 'The first hamburger was served at Louis\' Lunch in Connecticut in 1900 and cost just 5 cents.',
      category: 'History',
    },
    {
      emoji: '🍔',
      fact: 'The world\'s most expensive burger costs $5,000 and includes Wagyu beef, white truffles, and edible gold!',
      category: 'Luxury',
    },
  ],
  'Hot Dog': [
    {
      emoji: '🌭',
      fact: 'Americans consume 20 billion hot dogs a year! That\'s enough to stretch from LA to DC more than five times.',
      category: 'Consumption',
    },
    {
      emoji: '🌭',
      fact: 'The hot dog eating world record is 76 hot dogs in 10 minutes, set by Joey Chestnut!',
      category: 'Record Breakers',
    },
  ],
  
  // Indian
  Curry: [
    {
      emoji: '🍛',
      fact: 'There are over 100 different types of curry across India, each region having its own unique blend of spices!',
      category: 'Diversity',
    },
    {
      emoji: '🍛',
      fact: 'Turmeric, the spice that gives curry its yellow color, has been used in Indian medicine for over 4,000 years.',
      category: 'Ancient Medicine',
    },
    {
      emoji: '🍛',
      fact: 'The word "curry" comes from the Tamil word "kari" meaning sauce.',
      category: 'Etymology',
    },
  ],
  Biryani: [
    {
      emoji: '🍚',
      fact: 'Biryani has over 26 varieties across India! Hyderabadi biryani alone uses 47 different ingredients.',
      category: 'Variety',
    },
    {
      emoji: '🍚',
      fact: 'Traditional biryani is cooked using the "dum" method - slow cooking in a sealed pot for hours.',
      category: 'Technique',
    },
  ],
  
  // Chinese
  Dumpling: [
    {
      emoji: '🥟',
      fact: 'Chinese families make over 400 dumplings for Chinese New Year! Each fold represents wealth.',
      category: 'Tradition',
    },
    {
      emoji: '🥟',
      fact: 'Dumplings have been eaten in China for over 1,800 years, dating back to the Eastern Han Dynasty.',
      category: 'Ancient Food',
    },
  ],
  'Fried Rice': [
    {
      emoji: '🍚',
      fact: 'Fried rice was invented as a way to use leftover rice! Day-old rice is actually better because it\'s drier.',
      category: 'Innovation',
    },
    {
      emoji: '🍚',
      fact: 'There are hundreds of varieties of fried rice across Asia, each with unique ingredients and flavors.',
      category: 'Variety',
    },
  ],
  
  // Thai
  'Pad Thai': [
    {
      emoji: '🍜',
      fact: 'Pad Thai was invented in the 1930s as part of a campaign to promote Thai nationalism during a rice shortage!',
      category: 'History',
    },
    {
      emoji: '🍜',
      fact: 'Authentic Pad Thai should have a perfect balance of sweet, sour, salty, and spicy flavors.',
      category: 'Culinary Balance',
    },
  ],
  
  // French
  Croissant: [
    {
      emoji: '🥐',
      fact: 'Despite being iconic to France, croissants were actually invented in Austria!',
      category: 'Surprising Origins',
    },
    {
      emoji: '🥐',
      fact: 'A proper croissant should have exactly 27 layers of butter and dough.',
      category: 'Technique',
    },
    {
      emoji: '🥐',
      fact: 'French people eat over 10 billion croissants per year!',
      category: 'Consumption',
    },
  ],
  
  // Middle Eastern
  Falafel: [
    {
      emoji: '🧆',
      fact: 'Falafel is over 1,000 years old! Both Egypt and Lebanon claim to have invented it.',
      category: 'Ancient Origins',
    },
    {
      emoji: '🧆',
      fact: 'Falafel is naturally vegan and packed with protein from chickpeas or fava beans.',
      category: 'Nutrition',
    },
  ],
  
  // Korean
  Kimchi: [
    {
      emoji: '🥬',
      fact: 'Koreans eat an average of 40 pounds of kimchi per person per year!',
      category: 'Consumption',
    },
    {
      emoji: '🥬',
      fact: 'There are over 200 varieties of kimchi, and it was even sent to space with Korea\'s first astronaut.',
      category: 'Variety',
    },
  ],
  
  // Mexican
  Burrito: [
    {
      emoji: '🌯',
      fact: 'The Mission burrito was invented in San Francisco in the 1960s and popularized the "everything wrapped in one" concept!',
      category: 'Innovation',
    },
    {
      emoji: '🌯',
      fact: 'The largest burrito ever made weighed 12,785 pounds and was over 2 miles long!',
      category: 'Record Breakers',
    },
  ],
};

export function FunFacts({ analysisResult, themeColors }: FunFactsProps) {
  const [currentFact, setCurrentFact] = useState(0);
  
  const colors = themeColors || {
    primary: '#6366f1',
    secondary: '#a855f7',
    accent: '#ec4899',
    light: '#e0e7ff',
  };

  // Check if we have API fun facts data
  const hasApiFunFacts = analysisResult?.foodHistory?.fun_facts;
  
  // Get dish-specific facts or use general facts (fallback)
  const facts = analysisResult?.dishName && dishSpecificFacts[analysisResult.dishName] 
    ? dishSpecificFacts[analysisResult.dishName] 
    : generalFacts;

  const nextFact = () => {
    setCurrentFact((prev) => (prev + 1) % facts.length);
  };

  useEffect(() => {
    // Only auto-cycle if we're using hardcoded facts, not API data
    if (!hasApiFunFacts) {
      const interval = setInterval(nextFact, 8000);
      return () => clearInterval(interval);
    }
  }, [facts.length, hasApiFunFacts]);

  // Reset to first fact when dish changes
  useEffect(() => {
    setCurrentFact(0);
  }, [analysisResult?.dishName]);

  const fact = facts[currentFact];

  return (
    <Card 
      className="p-8 border-2 shadow-xl transition-all duration-500"
      style={{
        background: `linear-gradient(to bottom right, ${colors.light}, ${colors.primary}15, ${colors.secondary}15)`,
        borderColor: `${colors.primary}40`,
      }}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.secondary})`,
            }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 style={{ color: colors.primary }}>
              {analysisResult?.dishName ? `${analysisResult.dishName} Stories` : 'Did You Know?'}
            </h3>
            <p className="text-sm" style={{ color: `${colors.primary}cc` }}>
              {analysisResult?.dishName ? 'Fascinating facts about your dish' : 'Fascinating food stories'}
            </p>
          </div>
        </div>
        <Button
          onClick={nextFact}
          variant="ghost"
          size="sm"
          className="rounded-full hover:bg-white/60"
          style={{ color: colors.primary }}
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {analysisResult?.imageUrl && (
        <div className="mb-6 flex justify-center">
          <img
            src={analysisResult.imageUrl}
            alt={analysisResult.dishName}
            className="w-32 h-32 object-cover rounded-2xl shadow-lg border-4 border-white"
          />
        </div>
      )}

      {/* Display API fun facts if available */}
      {hasApiFunFacts ? (
        <div className="space-y-6">
          <div className="text-8xl text-center transform hover:scale-110 transition-transform" style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' }}>
            ✨
          </div>
          <div className="flex justify-center mb-4">
            <div 
              className="px-4 py-2 rounded-full text-white"
              style={{
                background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
              }}
            >
              Fun Facts
            </div>
          </div>
          <div 
            className="leading-relaxed text-center text-lg whitespace-pre-line p-6 rounded-2xl"
            style={{ 
              color: colors.primary,
              background: `${colors.light}40`,
              border: `2px solid ${colors.primary}30`,
            }}
          >
            {analysisResult.foodHistory?.fun_facts}
          </div>
        </div>
      ) : (
        <>
          {/* Display cycling hardcoded facts as fallback */}
          <div className="space-y-6">
            <div className="text-8xl text-center transform hover:scale-110 transition-transform" style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' }}>
              {fact.emoji}
            </div>
            <div className="flex justify-center">
              <div 
                className="px-4 py-2 rounded-full text-white"
                style={{
                  background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                }}
              >
                {fact.category}
              </div>
            </div>
            <p className="leading-relaxed text-center text-lg" style={{ color: colors.primary }}>
              {fact.fact}
            </p>
          </div>

          <div className="flex gap-2 mt-8 justify-center">
            {facts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentFact(index)}
                className={`h-2 rounded-full transition-all hover:opacity-80`}
                style={{
                  background: index === currentFact 
                    ? `linear-gradient(to right, ${colors.primary}, ${colors.secondary})` 
                    : `${colors.primary}40`,
                  width: index === currentFact ? '32px' : '8px',
                }}
                aria-label={`Go to fact ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
