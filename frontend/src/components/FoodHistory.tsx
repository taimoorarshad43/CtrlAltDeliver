import { Card } from './ui/card';
import { Clock, MapPin, Globe } from 'lucide-react';
import { AnalysisResult } from './FoodUploader';
import { ExtractedColors } from '../utils/colorExtractor';

interface FoodHistoryProps {
  analysisResult?: AnalysisResult | null;
  themeColors?: ExtractedColors;
}

const generalHistory = [
  {
    year: '3000 BCE',
    title: 'Bread Baking Begins',
    description: 'Ancient Egyptians discover leavened bread, revolutionizing food preservation and nutrition.',
    location: 'Ancient Egypt',
    emoji: '🍞',
    color: 'from-amber-400 to-orange-500',
  },
  {
    year: '1492',
    title: 'Columbian Exchange',
    description: 'Tomatoes, potatoes, and chocolate introduced to Europe, transforming global cuisine forever.',
    location: 'Americas to Europe',
    emoji: '🌍',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    year: '1809',
    title: 'Canning Invented',
    description: 'Nicolas Appert develops food preservation through canning, winning a prize from Napoleon.',
    location: 'France',
    emoji: '🥫',
    color: 'from-blue-400 to-indigo-500',
  },
  {
    year: '1885',
    title: 'First Hamburger',
    description: 'The hamburger is invented at a county fair in Wisconsin, becoming an American icon.',
    location: 'United States',
    emoji: '🍔',
    color: 'from-rose-400 to-pink-500',
  },
  {
    year: '1958',
    title: 'Instant Ramen Created',
    description: 'Momofuku Ando invents instant ramen, feeding millions and changing fast food culture.',
    location: 'Japan',
    emoji: '🍜',
    color: 'from-yellow-400 to-amber-500',
  },
  {
    year: '2010s',
    title: 'Food Tech Revolution',
    description: 'Plant-based meats and cellular agriculture emerge, reimagining sustainable food production.',
    location: 'Global',
    emoji: '🌱',
    color: 'from-purple-400 to-pink-500',
  },
];

const dishSpecificHistory: Record<string, typeof generalHistory> = {
  // Italian
  Pizza: [
    {
      year: '600 BCE',
      title: 'Ancient Flatbreads',
      description: 'Ancient Greeks bake flatbreads called "plakous" topped with herbs, onions, and garlic - the earliest pizza ancestor.',
      location: 'Ancient Greece',
      emoji: '🏛️',
      color: 'from-amber-400 to-orange-500',
    },
    {
      year: '997 CE',
      title: 'First "Pizza" Mention',
      description: 'The word "pizza" appears in a Latin text from Gaeta, Italy, marking the first recorded use of the term.',
      location: 'Gaeta, Italy',
      emoji: '📜',
      color: 'from-blue-400 to-indigo-500',
    },
    {
      year: '1522',
      title: 'Tomatoes Arrive',
      description: 'Tomatoes are brought from the Americas to Europe, eventually becoming the signature pizza topping.',
      location: 'Naples, Italy',
      emoji: '🍅',
      color: 'from-red-400 to-rose-500',
    },
    {
      year: '1889',
      title: 'Pizza Margherita Born',
      description: 'Chef Raffaele Esposito creates Pizza Margherita for Queen Margherita, using red, white, and green to honor the Italian flag.',
      location: 'Naples, Italy',
      emoji: '👑',
      color: 'from-green-400 to-emerald-500',
    },
    {
      year: '1905',
      title: 'First US Pizzeria',
      description: 'Gennaro Lombardi opens the first pizzeria in America, Lombardi\'s, which still operates in New York City today.',
      location: 'New York, USA',
      emoji: '🗽',
      color: 'from-yellow-400 to-amber-500',
    },
    {
      year: '1958',
      title: 'Frozen Pizza Revolution',
      description: 'The Celentano Brothers introduce frozen pizza to supermarkets, making pizza accessible to everyone.',
      location: 'United States',
      emoji: '❄️',
      color: 'from-cyan-400 to-blue-500',
    },
  ],
  Sushi: [
    {
      year: '8th Century',
      title: 'Origins in Southeast Asia',
      description: 'Fermented fish with rice originates as a preservation method in the Mekong River region.',
      location: 'Southeast Asia',
      emoji: '🌏',
      color: 'from-amber-400 to-orange-500',
    },
    {
      year: '718 CE',
      title: 'Arrives in Japan',
      description: 'Narezushi, fermented fish with rice, is introduced to Japan and becomes a form of tax payment.',
      location: 'Japan',
      emoji: '⛩️',
      color: 'from-red-400 to-rose-500',
    },
    {
      year: '1600s',
      title: 'Rice Vinegar Innovation',
      description: 'Japanese chefs begin using rice vinegar to speed up fermentation, creating the foundation for modern sushi.',
      location: 'Edo (Tokyo), Japan',
      emoji: '🍚',
      color: 'from-green-400 to-emerald-500',
    },
    {
      year: '1820s',
      title: 'Nigiri Sushi Invented',
      description: 'Hanaya Yohei creates nigiri sushi in Tokyo, using fresh fish on vinegared rice - the sushi we know today.',
      location: 'Tokyo, Japan',
      emoji: '🍣',
      color: 'from-blue-400 to-indigo-500',
    },
    {
      year: '1960s',
      title: 'Sushi Comes West',
      description: 'The first sushi bar opens in Los Angeles, introducing Americans to Japanese culinary traditions.',
      location: 'Los Angeles, USA',
      emoji: '🌴',
      color: 'from-purple-400 to-pink-500',
    },
    {
      year: '1980s-Present',
      title: 'Global Sushi Boom',
      description: 'Sushi becomes a global phenomenon with creative fusion rolls and conveyor belt restaurants worldwide.',
      location: 'Worldwide',
      emoji: '🌐',
      color: 'from-cyan-400 to-teal-500',
    },
  ],
  Tacos: [
    {
      year: '10,000 BCE',
      title: 'Corn Domestication',
      description: 'Indigenous peoples in Mexico domesticate corn, creating the foundation for tortillas and tacos.',
      location: 'Mesoamerica',
      emoji: '🌽',
      color: 'from-yellow-400 to-amber-500',
    },
    {
      year: '1500s',
      title: 'Tortillas in Aztec Culture',
      description: 'Aztecs use tortillas as edible plates and spoons, filled with fish and insects - early tacos.',
      location: 'Tenochtitlan (Mexico)',
      emoji: '🏛️',
      color: 'from-orange-400 to-red-500',
    },
    {
      year: '1700s',
      title: 'Silver Miners\' Tacos',
      description: 'Mexican silver miners use "tacos" (small explosive charges), giving the wrapped food its name.',
      location: 'Mexico',
      emoji: '⛏️',
      color: 'from-gray-400 to-slate-500',
    },
    {
      year: '1905',
      title: 'First Taco References',
      description: 'The word "taco" begins appearing in Mexican Spanish dictionaries and written records.',
      location: 'Mexico',
      emoji: '📖',
      color: 'from-brown-400 to-amber-600',
    },
    {
      year: '1940s',
      title: 'Taco Trucks Emerge',
      description: 'Mobile taco vendors start serving workers in Los Angeles, creating the iconic taco truck culture.',
      location: 'Los Angeles, USA',
      emoji: '🚚',
      color: 'from-blue-400 to-cyan-500',
    },
    {
      year: '1962-Present',
      title: 'Taco Bell & Globalization',
      description: 'Glen Bell opens Taco Bell, introducing Americanized tacos worldwide and sparking debate about authenticity.',
      location: 'California, USA',
      emoji: '🌮',
      color: 'from-purple-400 to-pink-500',
    },
  ],
  
  // Add more dishes
  Pasta: [
    {
      year: '1st Century CE',
      title: 'Early Noodle References',
      description: 'Ancient Roman texts mention "lagane," an early pasta-like dish made from sheets of dough.',
      location: 'Ancient Rome',
      emoji: '🏛️',
      color: 'from-amber-400 to-orange-500',
    },
    {
      year: '1295',
      title: 'Marco Polo Myth',
      description: 'Contrary to popular belief, Marco Polo did NOT bring pasta from China - Italians were already making it!',
      location: 'Italy',
      emoji: '📜',
      color: 'from-blue-400 to-indigo-500',
    },
    {
      year: '1800s',
      title: 'Pasta Goes Industrial',
      description: 'Mechanical pasta-making machines are invented, making pasta affordable for everyone.',
      location: 'Naples, Italy',
      emoji: '⚙️',
      color: 'from-yellow-400 to-amber-500',
    },
    {
      year: '1900s',
      title: 'Global Pasta Culture',
      description: 'Italian immigrants bring pasta to America, creating Italian-American dishes like spaghetti and meatballs.',
      location: 'United States',
      emoji: '🍝',
      color: 'from-red-400 to-rose-500',
    },
  ],
  
  Ramen: [
    {
      year: '1859',
      title: 'Port of Yokohama Opens',
      description: 'Chinese immigrants bring noodle soup to Japan, which evolves into ramen.',
      location: 'Yokohama, Japan',
      emoji: '🚢',
      color: 'from-blue-400 to-cyan-500',
    },
    {
      year: '1958',
      title: 'Instant Ramen Invented',
      description: 'Momofuku Ando invents instant ramen after World War II to feed a hungry nation.',
      location: 'Osaka, Japan',
      emoji: '💡',
      color: 'from-yellow-400 to-amber-500',
    },
    {
      year: '1970s-Present',
      title: 'Ramen Goes Global',
      description: 'Ramen shops open worldwide, and instant ramen becomes a college student staple.',
      location: 'Worldwide',
      emoji: '🌍',
      color: 'from-purple-400 to-pink-500',
    },
  ],
  
  Burger: [
    {
      year: '1885',
      title: 'Birth of the Burger',
      description: 'Charles Menches (or Louis Lassen) creates the first hamburger at a county fair.',
      location: 'United States',
      emoji: '🎡',
      color: 'from-red-400 to-orange-500',
    },
    {
      year: '1921',
      title: 'White Castle Opens',
      description: 'The first fast-food hamburger chain opens, selling burgers for 5 cents each.',
      location: 'Wichita, Kansas',
      emoji: '🏰',
      color: 'from-blue-400 to-indigo-500',
    },
    {
      year: '1940',
      title: 'McDonald\'s Revolution',
      description: 'The McDonald brothers open their restaurant, later transforming the fast-food industry.',
      location: 'California, USA',
      emoji: '🍔',
      color: 'from-yellow-400 to-red-500',
    },
  ],
  
  Curry: [
    {
      year: '2600 BCE',
      title: 'Spice Trade Begins',
      description: 'Ancient Indians cultivate turmeric, cumin, and other spices that become curry\'s foundation.',
      location: 'Indus Valley',
      emoji: '🌿',
      color: 'from-green-400 to-emerald-500',
    },
    {
      year: '1700s',
      title: 'British Encounter Curry',
      description: 'British colonizers in India encounter curry and bring it back to England.',
      location: 'India',
      emoji: '🇬🇧',
      color: 'from-orange-400 to-red-500',
    },
    {
      year: '1950s',
      title: 'Curry Goes Global',
      description: 'Indian restaurants open worldwide, and curry becomes Britain\'s favorite dish.',
      location: 'Worldwide',
      emoji: '🍛',
      color: 'from-yellow-400 to-orange-500',
    },
  ],
  
  Biryani: [
    {
      year: '1600s',
      title: 'Mughal Courts',
      description: 'Biryani is created in the Mughal emperor\'s kitchens, combining Persian and Indian cooking.',
      location: 'Delhi, India',
      emoji: '👑',
      color: 'from-purple-400 to-pink-500',
    },
    {
      year: '1700s',
      title: 'Regional Variations',
      description: 'Different cities develop their own biryani styles - Hyderabadi, Lucknowi, Kolkata.',
      location: 'India',
      emoji: '🍚',
      color: 'from-yellow-400 to-amber-500',
    },
    {
      year: '2000s',
      title: 'Global Popularity',
      description: 'Biryani becomes one of the most ordered dishes on food delivery apps worldwide.',
      location: 'Worldwide',
      emoji: '📱',
      color: 'from-blue-400 to-indigo-500',
    },
  ],
  
  Dumpling: [
    {
      year: '206 BCE',
      title: 'Han Dynasty Origins',
      description: 'Dumplings are invented in China, possibly by physician Zhang Zhongjing to treat frostbite.',
      location: 'Ancient China',
      emoji: '🏯',
      color: 'from-red-400 to-rose-500',
    },
    {
      year: '1300s',
      title: 'Silk Road Spread',
      description: 'Dumplings travel along the Silk Road, evolving into manti, pelmeni, and pierogi.',
      location: 'Central Asia',
      emoji: '🐫',
      color: 'from-amber-400 to-orange-500',
    },
    {
      year: '1900s',
      title: 'Global Dumpling Culture',
      description: 'Chinese restaurants worldwide popularize dumplings, from gyoza to dim sum.',
      location: 'Worldwide',
      emoji: '🥟',
      color: 'from-yellow-400 to-amber-500',
    },
  ],
  
  'Fried Rice': [
    {
      year: '600 CE',
      title: 'Sui Dynasty Innovation',
      description: 'Fried rice is invented in China as a way to use leftover rice and prevent food waste.',
      location: 'China',
      emoji: '🏮',
      color: 'from-yellow-400 to-amber-500',
    },
    {
      year: '1800s',
      title: 'Regional Variations',
      description: 'Different Asian countries develop their own versions - nasi goreng, kimchi fried rice.',
      location: 'Asia',
      emoji: '🌏',
      color: 'from-green-400 to-emerald-500',
    },
    {
      year: '1900s',
      title: 'Global Comfort Food',
      description: 'Fried rice becomes a staple in Chinese restaurants worldwide.',
      location: 'Worldwide',
      emoji: '🍚',
      color: 'from-orange-400 to-red-500',
    },
  ],
  
  'Hot Dog': [
    {
      year: '1400s',
      title: 'German Sausages',
      description: 'Frankfurt and Vienna create their iconic sausages, ancestors of the hot dog.',
      location: 'Germany',
      emoji: '🇩🇪',
      color: 'from-amber-400 to-brown-500',
    },
    {
      year: '1867',
      title: 'Comes to America',
      description: 'German immigrants bring frankfurter sausages to the United States.',
      location: 'New York, USA',
      emoji: '🗽',
      color: 'from-blue-400 to-indigo-500',
    },
    {
      year: '1893',
      title: 'Chicago World\'s Fair',
      description: 'Hot dogs gain massive popularity at the World\'s Fair, becoming an American icon.',
      location: 'Chicago, USA',
      emoji: '🌭',
      color: 'from-red-400 to-rose-500',
    },
  ],
  
  'Pad Thai': [
    {
      year: '1930s',
      title: 'National Dish Campaign',
      description: 'Thai Prime Minister promotes Pad Thai to unify the country and reduce rice consumption.',
      location: 'Thailand',
      emoji: '🇹🇭',
      color: 'from-red-400 to-rose-500',
    },
    {
      year: '1960s',
      title: 'Street Food Staple',
      description: 'Pad Thai becomes the most popular street food in Thailand.',
      location: 'Bangkok, Thailand',
      emoji: '🛺',
      color: 'from-yellow-400 to-amber-500',
    },
    {
      year: '1990s-Present',
      title: 'Global Thai Cuisine',
      description: 'Thai restaurants worldwide make Pad Thai one of the most recognized Asian dishes.',
      location: 'Worldwide',
      emoji: '🌍',
      color: 'from-purple-400 to-pink-500',
    },
  ],
  
  Croissant: [
    {
      year: '1683',
      title: 'Austrian Origins',
      description: 'Kipferl pastries are created in Vienna to celebrate victory over the Ottoman Empire.',
      location: 'Vienna, Austria',
      emoji: '🥐',
      color: 'from-amber-400 to-brown-500',
    },
    {
      year: '1770',
      title: 'Marie Antoinette',
      description: 'The Austrian princess brings the pastry tradition to France.',
      location: 'Paris, France',
      emoji: '👑',
      color: 'from-purple-400 to-pink-500',
    },
    {
      year: '1920s',
      title: 'French Perfection',
      description: 'French bakers perfect the laminated dough technique, creating the modern croissant.',
      location: 'France',
      emoji: '🇫🇷',
      color: 'from-blue-400 to-indigo-500',
    },
  ],
  
  Falafel: [
    {
      year: '1000 CE',
      title: 'Ancient Origins',
      description: 'Falafel is created in Egypt or Lebanon (both claim the invention!) as a vegetarian protein.',
      location: 'Middle East',
      emoji: '🏺',
      color: 'from-green-400 to-emerald-500',
    },
    {
      year: '1950s',
      title: 'Israeli Adoption',
      description: 'Yemeni Jews bring falafel to Israel, where it becomes the national street food.',
      location: 'Israel',
      emoji: '🇮🇱',
      color: 'from-blue-400 to-cyan-500',
    },
    {
      year: '2000s',
      title: 'Vegan Favorite',
      description: 'Falafel becomes popular worldwide as a healthy, plant-based protein option.',
      location: 'Worldwide',
      emoji: '🧆',
      color: 'from-yellow-400 to-amber-500',
    },
  ],
  
  Kimchi: [
    {
      year: '37 BCE',
      title: 'Early Fermentation',
      description: 'Ancient Koreans begin fermenting vegetables for winter storage.',
      location: 'Korea',
      emoji: '🏯',
      color: 'from-red-400 to-rose-500',
    },
    {
      year: '1600s',
      title: 'Chili Peppers Arrive',
      description: 'Portuguese traders bring chili peppers to Korea, transforming kimchi into its spicy modern form.',
      location: 'Korea',
      emoji: '🌶️',
      color: 'from-orange-400 to-red-500',
    },
    {
      year: '2010s',
      title: 'K-Culture Wave',
      description: 'Korean pop culture spreads kimchi worldwide as a probiotic superfood.',
      location: 'Worldwide',
      emoji: '🥬',
      color: 'from-green-400 to-emerald-500',
    },
  ],
  
  Burrito: [
    {
      year: '1900s',
      title: 'Mexican Border Towns',
      description: 'Burritos emerge in northern Mexico as a portable meal for workers.',
      location: 'Northern Mexico',
      emoji: '🌵',
      color: 'from-yellow-400 to-amber-500',
    },
    {
      year: '1960s',
      title: 'Mission Burrito',
      description: 'San Francisco\'s Mission District creates the super-sized burrito with everything inside.',
      location: 'San Francisco, USA',
      emoji: '🌉',
      color: 'from-orange-400 to-red-500',
    },
    {
      year: '1990s-Present',
      title: 'Fast-Casual Boom',
      description: 'Chipotle and others popularize customizable burritos nationwide.',
      location: 'United States',
      emoji: '🌯',
      color: 'from-brown-400 to-amber-600',
    },
  ],
};

export function FoodHistory({ analysisResult, themeColors }: FoodHistoryProps) {
  const colors = themeColors || {
    primary: '#6366f1',
    secondary: '#a855f7',
    accent: '#ec4899',
    light: '#e0e7ff',
  };

  // Get dish-specific history or use general history
  const historyItems = analysisResult?.dishName && dishSpecificHistory[analysisResult.dishName]
    ? dishSpecificHistory[analysisResult.dishName]
    : generalHistory;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        {analysisResult?.imageUrl && (
          <div className="flex justify-center mb-4">
            <img
              src={analysisResult.imageUrl}
              alt={analysisResult.dishName}
              className="w-40 h-40 object-cover rounded-2xl shadow-lg border-4 border-white"
            />
          </div>
        )}
        <div className="flex items-center justify-center gap-2">
          <Globe className="w-8 h-8" style={{ color: colors.primary }} />
          <h2 style={{ color: colors.primary }}>
            {analysisResult?.dishName ? `${analysisResult.dishName} Time Travel` : 'Culinary Time Travel'}
          </h2>
        </div>
        <p className="max-w-2xl mx-auto" style={{ color: `${colors.primary}dd` }}>
          {analysisResult?.dishName 
            ? `Explore the fascinating journey of ${analysisResult.dishName} through history`
            : 'Explore how food has shaped cultures and connected people across centuries'
          }
        </p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div 
          className="absolute left-8 top-0 bottom-0 w-1 hidden md:block"
          style={{
            background: `linear-gradient(to bottom, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
          }}
        />

        <div className="space-y-8">
          {historyItems.map((item, index) => (
            <Card
              key={index}
              className="relative md:ml-20 p-6 hover:shadow-2xl transition-all border-2 transform hover:scale-[1.02]"
              style={{
                background: 'white',
                borderColor: `${colors.primary}40`,
              }}
            >
              {/* Timeline dot */}
              <div 
                className="hidden md:block absolute -left-[4.5rem] top-8 w-6 h-6 rounded-full bg-white border-4 shadow-lg"
                style={{ borderColor: colors.primary }}
              />

              <div className="flex flex-col md:flex-row gap-6">
                <div 
                  className={`flex-shrink-0 w-28 h-28 rounded-2xl bg-gradient-to-br ${item.color} flex flex-col items-center justify-center shadow-xl transform hover:rotate-3 transition-transform`}
                >
                  <div className="text-4xl mb-1" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
                    {item.emoji}
                  </div>
                  <Clock className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span 
                      className="px-4 py-1.5 rounded-full text-white"
                      style={{
                        background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                      }}
                    >
                      {item.year}
                    </span>
                    <div 
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                      style={{
                        background: `${colors.primary}15`,
                        color: colors.primary,
                      }}
                    >
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{item.location}</span>
                    </div>
                  </div>
                  <h3 className="mb-2" style={{ color: colors.primary }}>{item.title}</h3>
                  <p className="leading-relaxed" style={{ color: `${colors.primary}dd` }}>
                    {item.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
