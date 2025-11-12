import React, { useState } from 'react';
import { Camera, BookOpen, Clock, Sparkles, Music, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { FoodUploader, AnalysisResult } from './components/FoodUploader';
import { FunFacts } from './components/FunFacts';
import { FoodHistory } from './components/FoodHistory';
import { AnalysisResults } from './components/AnalysisResults';
import { InteractiveFoodCards } from './components/InteractiveFoodCards';
import { DishcoveryBackground } from './components/DishcoveryBackground';
import { ExtractedColors } from './utils/colorExtractor';
import { foodDatabase } from './utils/foodDatabase';

export default function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [themeColors, setThemeColors] = useState<ExtractedColors>({
    primary: '#6366f1',
    secondary: '#a855f7',
    accent: '#ec4899',
    light: '#e0e7ff',
  });

  const handleReset = () => {
    setAnalysisResult(null);
    setThemeColors({
      primary: '#6366f1',
      secondary: '#a855f7',
      accent: '#ec4899',
      light: '#e0e7ff',
    });
  };

  const handleFoodSelect = (dishName: string) => {
    const dish = foodDatabase[dishName];
    if (dish) {
      setThemeColors(dish.colors);
      
      // Get appropriate image URL and supporting info based on dish
      const imageUrls: Record<string, string> = {
        Pizza: 'https://images.unsplash.com/photo-1642789736356-d7122adfe91b?w=800',
        Sushi: 'https://images.unsplash.com/photo-1625937751876-4515cd8e78bd?w=800',
        Tacos: 'https://images.unsplash.com/photo-1757774551171-91143e145b0a?w=800',
        Pasta: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800',
        Ramen: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=800',
        Burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
        Curry: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
        Biryani: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
        Dumpling: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800',
        'Fried Rice': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800',
        'Hot Dog': 'https://images.unsplash.com/photo-1612392166886-ee7c769a7558?w=800',
        'Pad Thai': 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800',
        Croissant: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800',
        Falafel: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
        Kimchi: 'https://images.unsplash.com/photo-1625871449839-7a03e8880891?w=800',
        Burrito: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800',
      };

      const sampleIngredients: Record<string, string> = {
        Pizza: 'pizza dough, tomato sauce, mozzarella, basil, olive oil',
        Sushi: 'sushi rice, nori, raw fish, soy sauce, wasabi',
        Tacos: 'corn tortillas, seasoned meat, pico de gallo, cilantro, lime',
        Pasta: 'pasta, garlic, olive oil, parmesan, herbs',
        Ramen: 'noodles, miso broth, pork, scallions, soft egg',
        Burger: 'bun, beef patty, cheddar, lettuce, tomato',
        Curry: 'onion, tomato, garlic, ginger, garam masala',
        Biryani: 'basmati rice, chicken, yogurt, saffron, fried onions',
        Dumpling: 'dumpling wrappers, minced pork, cabbage, ginger, soy sauce',
        'Fried Rice': 'day-old rice, egg, peas, carrots, soy sauce',
        'Hot Dog': 'hot dog bun, sausage, mustard, ketchup, relish',
        'Pad Thai': 'rice noodles, tamarind sauce, shrimp, peanuts, bean sprouts',
        Croissant: 'laminated dough, butter, yeast, milk, sugar',
        Falafel: 'chickpeas, parsley, garlic, cumin, coriander',
        Kimchi: 'napa cabbage, gochugaru, garlic, ginger, scallions',
        Burrito: 'flour tortilla, rice, beans, carne asada, salsa',
      };
      
      setAnalysisResult({
        dishName: dish.name,
        ingredients: sampleIngredients[dishName] ?? 'Upload a food photo to generate an ingredient list.',
        songs: dish.songs,
        similarDishes: dish.similarDishes,
        funFact: dish.funFact,
        imageUrl: imageUrls[dishName] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
        playlistText: dish.songs.map((song) => `${song.title} – ${song.artist}`).join('\n'),
        source: 'curated_example',
      });
    }
  };

  return (
    <div 
      className="min-h-screen transition-colors duration-1000 relative"
      style={{
        background: analysisResult 
          ? `linear-gradient(180deg, ${themeColors.light}20 0%, ${themeColors.primary}10 50%, ${themeColors.secondary}10 100%)`
          : `linear-gradient(180deg, #fff5f0 0%, #ffe8e0 15%, #fff9f0 30%, #e8fffe 50%, #e0f7ff 70%, #f0fdf4 85%, #f0f9ff 100%)`,
      }}
    >
      {/* 3D Background with Chef Scenes */}
      <DishcoveryBackground colors={{ primary: themeColors.primary, secondary: themeColors.secondary, accent: themeColors.accent }} />

      {/* Hero Section */}
      <header 
        className="relative overflow-hidden text-white py-20 px-4 transition-colors duration-1000"
        style={{
          background: analysisResult
            ? `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.secondary} 40%, ${themeColors.accent} 70%, ${themeColors.primary} 100%)`
            : `linear-gradient(135deg, #ff7c5c 0%, #ffb088 20%, #ffa86a 35%, #4ecdc4 55%, #45b7d1 70%, #96ceb4 85%, #74b9ff 100%)`,
        }}
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30" />
          {/* Animated gradient orbs for depth */}
          <motion.div
            className="absolute top-0 left-0 w-96 h-96 rounded-full"
            style={{
              background: analysisResult
                ? `radial-gradient(circle, ${themeColors.primary}60 0%, transparent 70%)`
                : 'radial-gradient(circle, rgba(255,124,92,0.4) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-96 h-96 rounded-full"
            style={{
              background: analysisResult
                ? `radial-gradient(circle, ${themeColors.secondary}60 0%, transparent 70%)`
                : 'radial-gradient(circle, rgba(78,205,196,0.4) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full"
            style={{
              background: analysisResult
                ? `radial-gradient(circle, ${themeColors.accent}50 0%, transparent 70%)`
                : 'radial-gradient(circle, rgba(150,206,180,0.3) 0%, transparent 70%)',
              filter: 'blur(50px)',
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Dishcovery Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-12"
          >
            <motion.h1 
              className="text-white mb-4"
              style={{
                fontSize: 'clamp(3rem, 8vw, 6rem)',
                fontFamily: '"Playfair Display", "Georgia", serif',
                fontWeight: 700,
                letterSpacing: '0.02em',
                textShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 60px rgba(255,255,255,0.3)',
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
              className="text-white/90 tracking-wider uppercase mb-6"
              style={{
                fontSize: 'clamp(0.75rem, 1.5vw, 1.125rem)',
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 300,
                letterSpacing: '0.3em',
                textShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Where Food Meets Culture
            </motion.p>
          </motion.div>
          
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000" style={{ animationDelay: '200ms' }}>
            An AI-powered app that turns every meal into a journey of sound, culture, and story. 
            Experience your food not just through taste, but through its culture and sounds.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList 
            className="grid w-full max-w-2xl mx-auto grid-cols-3 bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-2 transition-all duration-1000"
            style={{ borderWidth: '2px', borderColor: `${themeColors.primary}40` }}
          >
            <TabsTrigger 
              value="upload" 
              className="rounded-xl transition-all duration-300 relative overflow-hidden"
              style={{
                color: activeTab === 'upload' ? 'white' : '#374151',
                background: activeTab === 'upload' 
                  ? `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
                  : 'transparent',
                fontWeight: '500',
                boxShadow: activeTab === 'upload' ? `0 4px 12px ${themeColors.primary}60` : 'none',
              }}
            >
              <Camera className="w-4 h-4 mr-2" />
              Discover
            </TabsTrigger>
            <TabsTrigger 
              value="facts" 
              className="rounded-xl transition-all duration-300 relative overflow-hidden"
              style={{
                color: activeTab === 'facts' ? 'white' : '#374151',
                background: activeTab === 'facts' 
                  ? `linear-gradient(135deg, ${themeColors.secondary}, ${themeColors.accent})`
                  : 'transparent',
                fontWeight: '500',
                boxShadow: activeTab === 'facts' ? `0 4px 12px ${themeColors.secondary}60` : 'none',
              }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Fun Facts
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="rounded-xl transition-all duration-300 relative overflow-hidden"
              style={{
                color: activeTab === 'history' ? 'white' : '#374151',
                background: activeTab === 'history' 
                  ? `linear-gradient(135deg, ${themeColors.accent}, ${themeColors.primary})`
                  : 'transparent',
                fontWeight: '500',
                boxShadow: activeTab === 'history' ? `0 4px 12px ${themeColors.accent}60` : 'none',
              }}
            >
              <Clock className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-8">
            <FoodUploader 
              onImageAnalyzed={setAnalysisResult} 
              onColorsExtracted={setThemeColors}
              themeColors={themeColors}
              onReset={handleReset}
            />
            
            {analysisResult && <AnalysisResults result={analysisResult} themeColors={themeColors} onTabChange={setActiveTab} />}

            {!analysisResult && (
              <div className="space-y-4">
                <div className="text-center">
                  <p style={{ color: '#ff7c5c' }}>
                    Or try one of these popular dishes to see how it works:
                  </p>
                </div>
                <InteractiveFoodCards onFoodSelect={handleFoodSelect} themeColors={themeColors} />
              </div>
            )}
          </TabsContent>

          {/* Fun Facts Tab */}
          <TabsContent value="facts">
            <FunFacts analysisResult={analysisResult} themeColors={themeColors} />
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <FoodHistory analysisResult={analysisResult} themeColors={themeColors} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer 
        className="relative text-white py-12 px-4 mt-16 transition-colors duration-1000"
        style={{
          background: analysisResult
            ? `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.secondary} 33%, ${themeColors.accent} 66%, ${themeColors.primary} 100%)`
            : `linear-gradient(135deg, #ff7c5c 0%, #ffb088 25%, #4ecdc4 50%, #45b7d1 75%, #74b9ff 100%)`,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Music className="w-6 h-6" />
              <Globe className="w-6 h-6" />
              <BookOpen className="w-6 h-6" />
            </div>
            <p className="text-white/90 max-w-2xl mx-auto leading-relaxed">
              Turning every meal into a journey of sound, culture, and story
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm text-white/70">
            <span>Discover Your Food's Story</span>
            <span>•</span>
            <span>Connect Through Culture</span>
            <span>•</span>
            <span>Experience Through Sound</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
