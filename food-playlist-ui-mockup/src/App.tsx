import React, { useRef, useState } from "react";

export default function FoodPlaylistHiFiMockup() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [activeTab, setActiveTab] = useState<'playlist' | 'similar'>('playlist');

  const onPickFile = () => fileInputRef.current?.click();

  const handleFiles = (files: FileList | null) => {
    if (!files || !files[0]) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
    setShowResults(false);
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const startAnalyze = () => {
    if (!imageSrc) return onPickFile();
    setIsLoading(true);
    setShowResults(false);
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
    }, 1400);
  };

  const base = highContrast ? "bg-zinc-900 text-white" : "";

  return (
    <div className={`min-h-screen ${base} relative`} style={{ fontSize: `${fontScale}rem` }}>
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-green-600 via-yellow-500 to-red-600" />
      <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none" style={{backgroundImage:
        "radial-gradient(white 1px, transparent 1px)", backgroundSize:"22px 22px"}}/>

      <header className="max-w-5xl mx-auto px-6 pt-10 pb-4 text-center text-white">
        <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur rounded-full px-4 py-2 shadow-lg">
          <span className="text-2xl">🍕🎶</span>
          <span className="font-semibold tracking-wide">Expand your meal experience</span>
        </div>
        <h1 className="mt-6 text-4xl md:text-5xl font-extrabold drop-shadow-sm">Pair your food with an AI-generated Experience</h1>
        <p className="mt-2 opacity-90">Upload a food photo and get ingredients with a custom Spotify playlist.</p>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-24">
        <section className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur rounded-3xl shadow-2xl p-6 md:p-8">
          {/* Tab Navigation at Top */}
          <div className="flex gap-2 border-b-2 border-zinc-200 mb-8">
            <button
              onClick={() => setActiveTab('playlist')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'playlist'
                  ? 'text-blue-600 border-b-2 border-blue-600 -mb-[2px]'
                  : 'text-zinc-600 hover:text-zinc-800'
              }`}
            >
              🎵 Playlist Experience
            </button>
            <button
              onClick={() => setActiveTab('similar')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'similar'
                  ? 'text-green-600 border-b-2 border-green-600 -mb-[2px]'
                  : 'text-zinc-600 hover:text-zinc-800'
              }`}
            >
              🍽️ Similar Foods & Themes
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'playlist' && (
            <div>
              <div
                onClick={onPickFile}
                onDragOver={(e)=>e.preventDefault()}
                onDrop={onDrop}
                className={`group cursor-pointer rounded-2xl border-2 border-dashed transition-all ${imageSrc ? "border-emerald-400 bg-emerald-50/60" : "border-indigo-300 bg-indigo-50/60 hover:bg-indigo-100"} p-6 flex flex-col items-center justify-center text-center`}
              >
                {imageSrc ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-full max-w-md aspect-video overflow-hidden rounded-xl ring-2 ring-emerald-300 shadow">
                      <img src={imageSrc} alt="preview" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-emerald-700 font-medium">Image loaded • Click to change or drag a new one</p>
                  </div>
                ) : (
                  <>
                    <div className="text-6xl">🖼️</div>
                    <h3 className="mt-2 text-lg font-semibold">Drag & drop a food photo here</h3>
                    <p className="text-sm opacity-70">or click to select a file from your device</p>
                  </>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e)=>handleFiles(e.target.files)} />
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button onClick={startAnalyze} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow">
                  <span>✨</span> Analyze My Food
                </button>
              </div>

              {isLoading && (
                <div className="mt-8 grid place-items-center">
                  <div className="bg-white rounded-2xl shadow p-6 w-full max-w-md text-center">
                    <div className="text-3xl animate-bounce">🍅 🧀 🌿</div>
                    <p className="mt-3 font-medium">Identifying flavors… 🍳</p>
                    <p className="opacity-70">Pairing with perfect beats… 🎶</p>
                    <div className="mt-4 h-2 w-40 bg-emerald-100 rounded overflow-hidden mx-auto">
                      <div className="h-full w-1/3 bg-emerald-500 animate-[loading_1.2s_ease-in-out_infinite]"/>
                    </div>
                  </div>
                  <style>{`@keyframes loading{0%{transform:translateX(-120%)}50%{transform:translateX(60%)}100%{transform:translateX(220%)}}`}</style>
                </div>
              )}

              {showResults && (
                <div className="mt-8 grid md:grid-cols-2 gap-6">
                  <div className="rounded-2xl shadow-lg overflow-hidden bg-white">
                    <div className="bg-gradient-to-r from-emerald-500 to-lime-500 text-white px-5 py-3 flex items-center gap-2 font-semibold"><span>🥗</span> Identified Ingredients</div>
                    <ul className="p-5 space-y-3">
                      {[
                        {icon:"🍅", name:"Tomato Sauce"},
                        {icon:"🧀", name:"Mozzarella Cheese"},
                        {icon:"🌿", name:"Basil Leaves"},
                      ].map((i)=> (
                        <li key={i.name} className="flex items-center gap-3 text-zinc-800">
                          <span className="text-2xl">{i.icon}</span>
                          <span className="font-medium">{i.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl shadow-lg overflow-hidden bg-white">
                    <div className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white px-5 py-3 flex items-center gap-2 font-semibold"><span>🎧</span> Recommended Playlist</div>
                    <div className="p-5 space-y-3">
                      <h3 className="text-2xl font-bold">Sunny Basil Beats</h3>
                      <p className="text-zinc-600">Italian café vibes, upbeat and warm. Custom‑named from your dish.</p>
                      <div className="rounded-xl overflow-hidden ring-1 ring-zinc-200 shadow">
                        <iframe
                          title="spotify"
                          className="w-full h-52"
                          src="https://open.spotify.com/embed/playlist/37i9dQZF1DX6R7QUWePReA?utm_source=generator"
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex gap-3 pt-1">
                        <button className="rounded-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow">▶️ Play on Spotify</button>
                        <button className="rounded-full px-4 py-2 bg-white border shadow-sm">❤️ Save Playlist</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-10">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-zinc-800">Recent Playlists</h4>
                  <div className="text-sm opacity-70">Auto‑saved locally (mock)</div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    {emoji:"🍕", name:"Sunny Basil Beats"},
                    {emoji:"🥗", name:"Fresh Greens Chill"},
                    {emoji:"🍔", name:"BBQ Beats"},
                  ].map((h,idx)=> (
                    <div key={idx} className="rounded-xl bg-white shadow p-4 flex items-center gap-3 hover:shadow-md transition cursor-pointer">
                      <div className="text-3xl">{h.emoji}</div>
                      <div className="flex-1">
                        <div className="font-medium">{h.name}</div>
                        <div className="text-sm opacity-70">▶️ Play</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'similar' && (
            <div>
              <div
                onClick={onPickFile}
                onDragOver={(e)=>e.preventDefault()}
                onDrop={onDrop}
                className={`group cursor-pointer rounded-2xl border-2 border-dashed transition-all ${imageSrc ? "border-emerald-400 bg-emerald-50/60" : "border-green-300 bg-green-50/60 hover:bg-green-100"} p-6 flex flex-col items-center justify-center text-center`}
              >
                {imageSrc ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-full max-w-md aspect-video overflow-hidden rounded-xl ring-2 ring-emerald-300 shadow">
                      <img src={imageSrc} alt="preview" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-emerald-700 font-medium">Image loaded • Click to change or drag a new one</p>
                  </div>
                ) : (
                  <>
                    <div className="text-6xl">🖼️</div>
                    <h3 className="mt-2 text-lg font-semibold">Drag & drop a food photo here</h3>
                    <p className="text-sm opacity-70">or click to select a file from your device</p>
                  </>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e)=>handleFiles(e.target.files)} />
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button onClick={startAnalyze} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold shadow">
                  <span>✨</span> Discover Similar Foods
                </button>
              </div>

              {isLoading && (
                <div className="mt-8 grid place-items-center">
                  <div className="bg-white rounded-2xl shadow p-6 w-full max-w-md text-center">
                    <div className="text-3xl animate-bounce">🍅 🧀 🌿</div>
                    <p className="mt-3 font-medium">Identifying flavors… 🍳</p>
                    <p className="opacity-70">Finding similar dishes… 🔍</p>
                    <div className="mt-4 h-2 w-40 bg-green-100 rounded overflow-hidden mx-auto">
                      <div className="h-full w-1/3 bg-green-500 animate-[loading_1.2s_ease-in-out_infinite]"/>
                    </div>
                  </div>
                  <style>{`@keyframes loading{0%{transform:translateX(-120%)}50%{transform:translateX(60%)}100%{transform:translateX(220%)}}`}</style>
                </div>
              )}

              {showResults && (
                <div className="mt-8 grid md:grid-cols-2 gap-6">
                  <div className="rounded-2xl shadow-lg overflow-hidden bg-white">
                    <div className="bg-gradient-to-r from-emerald-500 to-lime-500 text-white px-5 py-3 flex items-center gap-2 font-semibold"><span>🥗</span> Identified Ingredients</div>
                    <ul className="p-5 space-y-3">
                      {[
                        {icon:"🍅", name:"Tomato Sauce"},
                        {icon:"🧀", name:"Mozzarella Cheese"},
                        {icon:"🌿", name:"Basil Leaves"},
                      ].map((i)=> (
                        <li key={i.name} className="flex items-center gap-3 text-zinc-800">
                          <span className="text-2xl">{i.icon}</span>
                          <span className="font-medium">{i.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl shadow-lg overflow-hidden bg-white">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-3 flex items-center gap-2 font-semibold"><span>🍽️</span> Similar Foods & Themes</div>
                    <div className="p-5 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold mb-3">Similar Dishes</h3>
                        <div className="space-y-2">
                          {[
                            {icon:"🍕", name:"Margherita Pizza", origin:"Italian Classic"},
                            {icon:"🥖", name:"Caprese Sandwich", origin:"Fresh & Light"},
                            {icon:"🍝", name:"Pasta Pomodoro", origin:"Simple & Delicious"},
                          ].map((food)=> (
                            <div key={food.name} className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 hover:bg-orange-100 transition">
                              <span className="text-2xl">{food.icon}</span>
                              <div className="flex-1">
                                <div className="font-semibold text-zinc-800">{food.name}</div>
                                <div className="text-sm text-zinc-600">{food.origin}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold mb-3">Food Themes</h3>
                        <div className="flex flex-wrap gap-2">
                          {["Italian Cuisine", "Mediterranean", "Fresh & Healthy", "Comfort Food", "Vegetarian"].map((theme)=> (
                            <span key={theme} className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                              {theme}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button className="rounded-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow">🔍 Explore More</button>
                        <button className="rounded-full px-4 py-2 bg-white border shadow-sm">📋 Save Results</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-10">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-zinc-800">Recent Discoveries</h4>
                  <div className="text-sm opacity-70">Auto‑saved locally (mock)</div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    {emoji:"🍕", name:"Italian Classics"},
                    {emoji:"🥗", name:"Mediterranean Mix"},
                    {emoji:"🍔", name:"American Comfort"},
                  ].map((h,idx)=> (
                    <div key={idx} className="rounded-xl bg-white shadow p-4 flex items-center gap-3 hover:shadow-md transition cursor-pointer">
                      <div className="text-3xl">{h.emoji}</div>
                      <div className="flex-1">
                        <div className="font-medium">{h.name}</div>
                        <div className="text-sm opacity-70">🔍 View</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur shadow-xl rounded-full px-4 py-2 flex items-center gap-3">
        <button className="px-2" onClick={()=>setFontScale((v)=>Math.min(1.3, v+0.05))}>A+</button>
        <button className="px-2" onClick={()=>setFontScale((v)=>Math.max(0.85, v-0.05))}>A-</button>
        <div className="w-px h-5 bg-zinc-300"/>
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={highContrast} onChange={(e)=>setHighContrast(e.target.checked)} />
          <span>High Contrast 🌗</span>
        </label>
      </div>
    </div>
  );
}
