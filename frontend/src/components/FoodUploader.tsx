import { useMemo, useState, useRef } from 'react';
import { Upload, Sparkles, Camera } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { extractColorsFromImage, ExtractedColors } from '../utils/colorExtractor';
import { foodDatabase, getRandomDish } from '../utils/foodDatabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

interface FoodUploaderProps {
  onImageAnalyzed: (result: AnalysisResult) => void;
  onColorsExtracted?: (colors: ExtractedColors) => void;
  themeColors?: ExtractedColors;
  onReset?: () => void;
}

export interface PlaylistTrack {
  title: string;
  artist: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  vibe?: string;
}

export interface AnalysisResult {
  dishName: string;
  ingredients: string;
  songs: PlaylistTrack[];
  similarDishes?: { name: string; cuisine: string; image: string }[];
  funFact?: string;
  imageUrl: string;
  playlistText?: string;
  source?: string;
}

export function FoodUploader({ onImageAnalyzed, onColorsExtracted, themeColors, onReset }: FoodUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const colors = themeColors || {
    primary: '#6366f1',
    secondary: '#a855f7',
    accent: '#ec4899',
    light: '#e0e7ff',
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageUrl = e.target?.result as string;
      setPreview(imageUrl);
      setAnalyzing(true);

      if (onColorsExtracted) {
        try {
          const extracted = await extractColorsFromImage(imageUrl);
          onColorsExtracted(extracted);
        } catch (err) {
          console.error('Error extracting colors:', err);
        }
      }

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/api/analyze-image`, {
          method: 'POST',
          body: formData,
        });

        const payload = await response.json();

        if (!response.ok || payload.success !== true) {
          const message = payload.error || 'Unable to analyze the image. Please try again.';
          throw new Error(message);
        }

        const playlistItems: PlaylistTrack[] = Array.isArray(payload.parsed_playlist)
          ? payload.parsed_playlist.map((item: any) => ({
              title: item.song ?? item.title ?? 'Unknown Title',
              artist: item.artist ?? 'Unknown Artist',
              spotifyUrl: item.spotify_url,
              youtubeUrl: item.youtube_url,
            }))
          : [];

        const rawDishName: string = payload.food_name ?? 'Unknown';
        const sanitizedDishName = rawDishName.replace(/_/g, ' ').trim();
        const normalizedDishKey = Object.keys(foodDatabase).find(
          (key) => key.toLowerCase() === sanitizedDishName.toLowerCase()
        );
        const fallbackDish = normalizedDishKey ? foodDatabase[normalizedDishKey] : undefined;

        onImageAnalyzed({
          dishName: fallbackDish?.name ?? (sanitizedDishName || 'Unknown'),
          ingredients: payload.ingredients ?? '',
          songs: playlistItems.length ? playlistItems : fallbackDish?.songs ?? [],
          similarDishes: fallbackDish?.similarDishes,
          funFact: fallbackDish?.funFact,
          imageUrl: imageUrl,
          playlistText: payload.playlist,
          source: payload.source ?? 'uploaded_image',
        });
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRefresh = () => {
    setPreview(null);
    setError(null);
    if (onReset) {
      onReset();
    }
  };

  const helperDish = useMemo(() => getRandomDish(), []);

  return (
    <Card
      className="p-8 border-2 border-dashed hover:shadow-2xl transform hover:scale-[1.01] transition-all duration-500"
      style={{
        borderColor: `${colors.primary}60`,
        background: `linear-gradient(135deg, ${colors.light}40 0%, ${colors.primary}08 30%, ${colors.secondary}08 70%, ${colors.accent}08 100%)`,
      }}
    >
      <div className="flex flex-col items-center gap-6">
        {preview ? (
          <div className="relative w-full max-w-md">
            <img
              src={preview}
              alt="Uploaded food"
              className="w-full h-64 object-cover rounded-2xl shadow-2xl border-4 border-white"
            />
            {analyzing && (
              <div
                className="absolute inset-0 rounded-2xl flex items-center justify-center backdrop-blur-sm transition-all duration-500"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}cc, ${colors.secondary}cc)`,
                }}
              >
                <div className="flex flex-col items-center gap-3 text-white">
                  <div className="relative">
                    <Sparkles className="w-12 h-12 animate-spin" />
                    <div className="absolute inset-0 animate-ping">
                      <Sparkles className="w-12 h-12 opacity-30" />
                    </div>
                  </div>
                  <p>Discovering your dish&apos;s story...</p>
                  <p className="text-sm text-white/70">Analyzing culture, sound &amp; history</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 py-12">
            <div className="relative">
              <div className="text-8xl animate-bounce" style={{ filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.2))' }}>
                📸
              </div>
              <div className="absolute -bottom-2 -right-2 text-4xl animate-pulse" style={{ filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.2))' }}>
                🍕
              </div>
            </div>

            <div className="text-center max-w-md">
              <h3 className="mb-2" style={{ color: colors.primary }}>Upload Your Meal</h3>
              <p style={{ color: colors.secondary }}>Start your journey of sound, culture, and story</p>
              <p className="mt-3 text-sm" style={{ color: colors.accent }}>
                Unsure what to try? Upload a snapshot of {helperDish.name.toLowerCase()} to see a full walkthrough.
              </p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex gap-3">
          <Button
            onClick={handleClick}
            className="text-white px-8 py-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
            disabled={analyzing}
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
            }}
          >
            <Camera className="w-5 h-5 mr-2" />
            {analyzing ? 'Analyzing...' : preview ? 'Discover Another Dish' : 'Begin Your Journey'}
          </Button>
          {preview && (
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="px-8 py-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all border-2"
              style={{
                borderColor: colors.primary,
                color: colors.primary,
              }}
            >
              <Upload className="w-5 h-5 mr-2" />
              Start Fresh
            </Button>
          )}
        </div>

        {error && (
          <div
            className="mt-4 w-full max-w-md text-center text-sm font-medium px-4 py-3 rounded-xl"
            style={{
              background: `${colors.accent}10`,
              color: colors.accent,
              border: `1px solid ${colors.accent}40`,
            }}
          >
            {error}
          </div>
        )}
      </div>
    </Card>
  );
}
