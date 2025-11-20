import React, { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Music, UtensilsCrossed, Sparkles, Globe, Users, Heart, Share2, Wand2, PlayCircle, Clock } from 'lucide-react';
import { AnalysisResult } from './FoodUploader';
import { ExtractedColors } from '../utils/colorExtractor';
import { foodDatabase } from '../utils/foodDatabase';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface AnalysisResultsProps {
  result: AnalysisResult;
  themeColors?: ExtractedColors;
  onTabChange?: (tab: string) => void;
}

export function AnalysisResults({ result, themeColors, onTabChange }: AnalysisResultsProps) {
  const [sunoDialogOpen, setSunoDialogOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSong, setGeneratedSong] = useState<{title: string; duration: string} | null>(null);

  const colors = themeColors || {
    primary: '#6366f1',
    secondary: '#a855f7',
    accent: '#ec4899',
    light: '#e0e7ff',
  };

  const normalizedDishKey = Object.keys(foodDatabase).find(
    (key) => key.toLowerCase() === result.dishName.toLowerCase()
  );
  const fallbackDish = normalizedDishKey ? foodDatabase[normalizedDishKey] : undefined;

  const songs = result.songs?.length ? result.songs : fallbackDish?.songs ?? [];
  const similarDishes = result.similarDishes ?? fallbackDish?.similarDishes ?? [];
  const funFact = result.funFact ?? fallbackDish?.funFact;
  const ingredientsList = result.ingredients
    ? String(result.ingredients)
        .split(/[,•\n]/)
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  const handleGenerateMusic = () => {
    setIsGenerating(true);
    // Simulate API call to Suno AI
    setTimeout(() => {
      setGeneratedSong({
        title: `${result.dishName} ${selectedMood || 'Culinary'} Journey`,
        duration: '2:45'
      });
      setIsGenerating(false);
    }, 3000);
  };
  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Dish Name Header with Uploaded Image */}
      <Card 
        className="p-8 text-white border-0 shadow-2xl transition-all duration-500"
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 40%, ${colors.accent} 70%, ${colors.primary} 100%)`,
        }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6 flex-1">
            {/* Display the uploaded image */}
            <div className="relative">
              <img
                src={result.imageUrl}
                alt={result.dishName}
                className="w-32 h-32 object-cover rounded-2xl shadow-2xl border-4 border-white/40"
              />
              <div className="absolute -bottom-2 -right-2 text-4xl" style={{ filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.3))' }}>
                {result.dishName === 'Pizza' ? '🍕' : result.dishName === 'Sushi' ? '🍣' : '🌮'}
              </div>
            </div>
            <div>
              <p className="text-white/80 text-sm">Your Culinary Journey</p>
              <h2 className="text-white">{result.dishName}</h2>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/40">
              <Heart className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/40">
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </Card>

      {ingredientsList.length > 0 && (
        <Card
          className="p-6 border-2 hover:shadow-lg transition-all"
          style={{
            background: `linear-gradient(135deg, ${colors.light}40 0%, ${colors.primary}08 50%, ${colors.secondary}08 100%)`,
            borderColor: `${colors.primary}40`,
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 style={{ color: colors.primary }}>Signature Ingredients</h3>
              <p className="text-sm" style={{ color: colors.secondary }}>
                Highlighting what brings this dish to life
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {ingredientsList.map((ingredient, index) => (
              <Badge
                key={`${ingredient}-${index}`}
                className="rounded-full px-3 py-1 text-sm"
                style={{
                  background: colors.light,
                  color: colors.primary,
                  borderColor: `${colors.primary}30`,
                  borderWidth: 1,
                }}
              >
                {ingredient}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Cultural Story */}
      <Card 
        className="p-6 border-2 hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: `linear-gradient(135deg, ${colors.light}40 0%, ${colors.primary}10 50%, ${colors.secondary}10 100%)`,
          borderColor: `${colors.primary}60`,
        }}
        onClick={() => onTabChange?.('facts')}
      >
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              }}
            >
              <Globe className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="mb-2 flex items-center gap-2" style={{ color: colors.primary }}>
              <Sparkles className="w-5 h-5" />
              Cultural Story
            </h3>
            <p className="leading-relaxed" style={{ color: colors.secondary }}>
              {result.foodHistory?.food_history ?? funFact ?? 'Upload your meal to uncover cultural stories behind the dish.'}
            </p>
            {result.foodHistory && (
              <p className="text-sm mt-2 italic" style={{ color: colors.accent }}>Click to explore more history and fun facts →</p>
            )}
            {!result.foodHistory && (
              <p className="text-sm mt-2 italic" style={{ color: colors.accent }}>Click to explore more fun facts →</p>
            )}
          </div>
        </div>
      </Card>

      {/* Song Suggestions */}
      <Card 
        className="p-6 hover:shadow-lg transition-all duration-500"
        style={{
          background: `linear-gradient(135deg, ${colors.light}40 0%, ${colors.secondary}10 50%, ${colors.accent}10 100%)`,
          borderWidth: '2px',
          borderColor: `${colors.secondary}60`,
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${colors.secondary}, ${colors.accent})`,
            }}
          >
            <Music className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 style={{ color: colors.secondary }}>Your Soundtrack</h3>
            <p className="text-sm" style={{ color: colors.accent }}>Music that matches this dish's vibe</p>
          </div>
        </div>
        <div className="space-y-3">
          {songs.length === 0 && (
            <div
              className="p-5 bg-white/70 rounded-2xl border-2 border-dashed text-center text-sm"
              style={{ borderColor: `${colors.secondary}40`, color: colors.secondary }}
            >
              Playlist suggestions appear here once we have enough info. Try uploading another angle for more detail!
            </div>
          )}
          {songs.map((song, index) => (
            <div
              key={index}
              className="p-5 bg-white rounded-2xl border-2 hover:shadow-xl transition-all transform hover:scale-[1.02] group"
              style={{ borderColor: `${colors.secondary}20` }}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                  style={{
                    background: `linear-gradient(135deg, ${colors.secondary}, ${colors.accent})`,
                  }}
                >
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="mb-1" style={{ color: colors.primary }}>{song.title}</p>
                  <p className="text-sm" style={{ color: colors.secondary }}>{song.artist}</p>
                </div>
                <Badge 
                  className="border-0"
                  style={{
                    background: `${colors.light}80`,
                    color: colors.accent,
                  }}
                >
                  {song.vibe ?? 'Playlist pick'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        
        {/* Suno AI Music Creation */}
        <Dialog open={sunoDialogOpen} onOpenChange={setSunoDialogOpen}>
          <DialogTrigger asChild>
            <div className="mt-4 p-5 rounded-2xl border-2 border-dashed hover:shadow-xl transition-all transform hover:scale-[1.02] cursor-pointer group"
              style={{
                background: `linear-gradient(135deg, ${colors.light}40, ${colors.primary}10, ${colors.secondary}10)`,
                borderColor: colors.accent,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{
                      background: `linear-gradient(135deg, ${colors.accent}, ${colors.secondary})`,
                    }}
                  >
                    <Wand2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="mb-1" style={{ color: colors.primary }}>Create Your Own Soundtrack</p>
                    <p className="text-sm" style={{ color: colors.secondary }}>Generate custom music with Suno AI</p>
                  </div>
                </div>
                <div className="transition-colors" style={{ color: colors.accent }}>
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]" style={{ borderColor: colors.primary }}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2" style={{ color: colors.primary }}>
                <Wand2 className="w-5 h-5" />
                Create Music with Suno AI
              </DialogTitle>
              <DialogDescription>
                Customize your soundtrack for {result.dishName}. Select a genre, mood, or add your own creative prompt.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Genre Selection */}
              <div className="space-y-2">
                <Label htmlFor="genre">Genre</Label>
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger id="genre">
                    <SelectValue placeholder="Select a genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jazz">Jazz</SelectItem>
                    <SelectItem value="classical">Classical</SelectItem>
                    <SelectItem value="electronic">Electronic</SelectItem>
                    <SelectItem value="world">World Music</SelectItem>
                    <SelectItem value="ambient">Ambient</SelectItem>
                    <SelectItem value="folk">Folk</SelectItem>
                    <SelectItem value="pop">Pop</SelectItem>
                    <SelectItem value="rock">Rock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mood Selection */}
              <div className="space-y-2">
                <Label htmlFor="mood">Mood</Label>
                <Select value={selectedMood} onValueChange={setSelectedMood}>
                  <SelectTrigger id="mood">
                    <SelectValue placeholder="Select a mood" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upbeat">Upbeat & Energetic</SelectItem>
                    <SelectItem value="relaxing">Relaxing & Calm</SelectItem>
                    <SelectItem value="romantic">Romantic & Intimate</SelectItem>
                    <SelectItem value="festive">Festive & Celebratory</SelectItem>
                    <SelectItem value="mysterious">Mysterious & Exotic</SelectItem>
                    <SelectItem value="nostalgic">Nostalgic & Warm</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Prompt */}
              <div className="space-y-2">
                <Label htmlFor="prompt">Custom Prompt (Optional)</Label>
                <Textarea
                  id="prompt"
                  placeholder={`Example: A lively tune that captures the essence of ${result.dishName}, with hints of cultural heritage...`}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>

              {/* Generated Song Display */}
              {generatedSong && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <PlayCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-green-900">{generatedSong.title}</p>
                      <p className="text-green-600 text-sm">Duration: {generatedSong.duration}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                      Ready
                    </Badge>
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleGenerateMusic}
                disabled={isGenerating || (!selectedGenre && !selectedMood && !customPrompt)}
                className="w-full text-white shadow-lg hover:shadow-xl transition-all"
                style={{
                  background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
                }}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate with Suno AI
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Note: This is a demo integration. In production, this would connect to Suno AI's API.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </Card>

      {/* Similar Dishes */}
      <Card 
        className="p-6 border-2 hover:shadow-lg transition-all"
        style={{
          background: `linear-gradient(135deg, ${colors.light}40 0%, ${colors.accent}10 50%, ${colors.primary}10 100%)`,
          borderColor: `${colors.accent}60`,
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${colors.accent}, ${colors.primary})`,
            }}
          >
            <UtensilsCrossed className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 style={{ color: colors.accent }}>Discover Similar Dishes</h3>
            <p className="text-sm" style={{ color: colors.primary }}>Expand your culinary horizons</p>
          </div>
        </div>
        {similarDishes.length === 0 ? (
          <div
            className="p-5 bg-white/70 rounded-2xl border-2 border-dashed text-center text-sm"
            style={{ borderColor: `${colors.accent}40`, color: colors.accent }}
          >
            We&apos;ll surface similar dishes once we gather more cultural context for this meal.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {similarDishes.map((dish, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-5 border-2 hover:shadow-lg transition-all transform hover:scale-[1.02] group cursor-pointer"
                style={{ 
                  borderColor: `${colors.accent}20`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                    style={{
                      background: `linear-gradient(135deg, ${colors.accent}, ${colors.secondary})`,
                    }}
                  >
                    <UtensilsCrossed className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="mb-0.5" style={{ color: colors.primary }}>{dish.name}</p>
                    <p className="text-sm" style={{ color: colors.secondary }}>{dish.cuisine}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Community Connection - Coming Soon */}
      <Card 
        className="p-8 border-2 hover:shadow-lg transition-all relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.light}40 0%, ${colors.primary}10 50%, ${colors.secondary}10 100%)`,
          borderColor: `${colors.primary}60`,
        }}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl" style={{ background: `radial-gradient(circle, ${colors.primary}40, transparent)` }} />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full blur-3xl" style={{ background: `radial-gradient(circle, ${colors.secondary}40, transparent)` }} />
        
        <div className="relative z-10">
          <div className="flex flex-col items-center text-center mb-6">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4 relative"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              }}
            >
              <Users className="w-10 h-10 text-white" />
              <div 
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${colors.accent}, ${colors.secondary})`,
                }}
              >
                <Clock className="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 className="mb-2" style={{ color: colors.primary }}>Connect with Others</h3>
            <p className="mb-6 max-w-md" style={{ color: colors.secondary }}>
              Find people who love this dish too and share your culinary experiences
            </p>
          </div>

          {/* Coming Soon Badge */}
          <div className="border-2 rounded-2xl p-6 text-center"
            style={{
              background: `linear-gradient(135deg, ${colors.light}60, ${colors.primary}10)`,
              borderColor: `${colors.accent}60`,
            }}
          >
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md mb-3">
              <Clock className="w-5 h-5" style={{ color: colors.secondary }} />
              <span style={{ color: colors.primary }}>Coming Soon</span>
            </div>
            <p className="text-sm" style={{ color: colors.accent }}>
              We're building an amazing community feature where you can connect with fellow food enthusiasts, share recipes, and discover new culinary adventures together!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
