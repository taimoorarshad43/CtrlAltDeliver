export interface DishData {
  name: string;
  cuisine: string;
  emoji: string;
  songs: { title: string; artist: string; vibe: string }[];
  similarDishes: { name: string; cuisine: string; image: string }[];
  funFact: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    light: string;
  };
}

export const foodDatabase: Record<string, DishData> = {
  // Italian
  Pizza: {
    name: 'Pizza',
    cuisine: 'Italian',
    emoji: '🍕',
    songs: [
      { title: 'That\'s Amore', artist: 'Dean Martin', vibe: 'Classic Italian Romance' },
      { title: 'Mambo Italiano', artist: 'Rosemary Clooney', vibe: 'Upbeat & Fun' },
      { title: 'Funiculì, Funiculà', artist: 'Luciano Pavarotti', vibe: 'Joyful Traditional' },
    ],
    similarDishes: [
      { name: 'Calzone', cuisine: 'Italian', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400' },
      { name: 'Focaccia', cuisine: 'Italian', image: 'https://images.unsplash.com/photo-1600289031464-74d374b64991?w=400' },
      { name: 'Stromboli', cuisine: 'Italian-American', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' },
    ],
    funFact: '🍕 The world\'s most expensive pizza costs $12,000 and takes 72 hours to make! It\'s topped with three types of caviar, buffalo mozzarella, lobster from Norway, and pink Australian sea salt.',
    colors: { primary: '#dc2626', secondary: '#ea580c', accent: '#f59e0b', light: '#fee2e2' },
  },
  Pasta: {
    name: 'Pasta',
    cuisine: 'Italian',
    emoji: '🍝',
    songs: [
      { title: 'O Sole Mio', artist: 'Luciano Pavarotti', vibe: 'Classic Italian Opera' },
      { title: 'Volare', artist: 'Dean Martin', vibe: 'Joyful Romance' },
      { title: 'Con te partirò', artist: 'Andrea Bocelli', vibe: 'Emotional Journey' },
    ],
    similarDishes: [
      { name: 'Risotto', cuisine: 'Italian', image: 'https://images.unsplash.com/photo-1476124369491-c4442ea37b2c?w=400' },
      { name: 'Gnocchi', cuisine: 'Italian', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400' },
      { name: 'Lasagna', cuisine: 'Italian', image: 'https://images.unsplash.com/photo-1619895092538-128341789043?w=400' },
    ],
    funFact: '🍝 There are over 600 different types of pasta shapes! Each shape is designed to hold sauce differently, from spaghetti to farfalle.',
    colors: { primary: '#f59e0b', secondary: '#dc2626', accent: '#16a34a', light: '#fef3c7' },
  },

  // Japanese
  Sushi: {
    name: 'Sushi',
    cuisine: 'Japanese',
    emoji: '🍣',
    songs: [
      { title: 'Sukiyaki', artist: 'Kyu Sakamoto', vibe: 'Classic Japanese Pop' },
      { title: 'Plastic Love', artist: 'Mariya Takeuchi', vibe: 'City Pop Vibes' },
      { title: 'Ponyo on the Cliff by the Sea', artist: 'Joe Hisaishi', vibe: 'Whimsical Ocean Theme' },
    ],
    similarDishes: [
      { name: 'Sashimi', cuisine: 'Japanese', image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400' },
      { name: 'Poke Bowl', cuisine: 'Hawaiian', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' },
      { name: 'Kimbap', cuisine: 'Korean', image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400' },
    ],
    funFact: '🍣 Sushi chefs in Japan train for up to 10 years before they\'re allowed to serve customers. The first 2 years are often spent just learning to prepare the rice perfectly!',
    colors: { primary: '#0284c7', secondary: '#0891b2', accent: '#06b6d4', light: '#e0f2fe' },
  },
  Ramen: {
    name: 'Ramen',
    cuisine: 'Japanese',
    emoji: '🍜',
    songs: [
      { title: 'Tokyo Drifting', artist: 'Glass Animals', vibe: 'Modern Tokyo Vibes' },
      { title: 'Spirited Away Theme', artist: 'Joe Hisaishi', vibe: 'Nostalgic Japanese' },
      { title: 'Lost in Japan', artist: 'Shawn Mendes', vibe: 'Contemporary Wanderlust' },
    ],
    similarDishes: [
      { name: 'Udon', cuisine: 'Japanese', image: 'https://images.unsplash.com/photo-1618841557871-b4664fbf0cb3?w=400' },
      { name: 'Pho', cuisine: 'Vietnamese', image: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400' },
      { name: 'Laksa', cuisine: 'Malaysian', image: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400' },
    ],
    funFact: '🍜 Instant ramen was invented by Momofuku Ando in 1958 and became so popular that it\'s considered one of Japan\'s greatest inventions of the 20th century!',
    colors: { primary: '#f59e0b', secondary: '#dc2626', accent: '#16a34a', light: '#fef3c7' },
  },

  // Mexican
  Tacos: {
    name: 'Tacos',
    cuisine: 'Mexican',
    emoji: '🌮',
    songs: [
      { title: 'La Bamba', artist: 'Ritchie Valens', vibe: 'Fiesta Energy' },
      { title: 'Cielito Lindo', artist: 'Pedro Infante', vibe: 'Traditional Mariachi' },
      { title: 'Tequila', artist: 'The Champs', vibe: 'Party Classic' },
    ],
    similarDishes: [
      { name: 'Burritos', cuisine: 'Mexican', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400' },
      { name: 'Quesadillas', cuisine: 'Mexican', image: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400' },
      { name: 'Enchiladas', cuisine: 'Mexican', image: 'https://images.unsplash.com/photo-1599920532066-e4a1fdd5b3b1?w=400' },
    ],
    funFact: '🌮 Tacos were invented by Mexican silver miners in the 18th century! The word "taco" referred to the little charges they used to excavate ore.',
    colors: { primary: '#ca8a04', secondary: '#dc2626', accent: '#ea580c', light: '#fef3c7' },
  },
  Burrito: {
    name: 'Burrito',
    cuisine: 'Mexican',
    emoji: '🌯',
    songs: [
      { title: 'Gasolina', artist: 'Daddy Yankee', vibe: 'High Energy Latin' },
      { title: 'Bésame Mucho', artist: 'Consuelo Velázquez', vibe: 'Romantic Classic' },
      { title: 'Oye Como Va', artist: 'Santana', vibe: 'Latin Rock Fusion' },
    ],
    similarDishes: [
      { name: 'Chimichanga', cuisine: 'Tex-Mex', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400' },
      { name: 'Fajitas', cuisine: 'Mexican', image: 'https://images.unsplash.com/photo-1599974164574-33d59a62efeb?w=400' },
      { name: 'Tostadas', cuisine: 'Mexican', image: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=400' },
    ],
    funFact: '🌯 The Mission burrito was invented in San Francisco in the 1960s and popularized the "everything wrapped in one" concept that\'s now worldwide!',
    colors: { primary: '#b45309', secondary: '#16a34a', accent: '#dc2626', light: '#fed7aa' },
  },

  // Indian
  Curry: {
    name: 'Curry',
    cuisine: 'Indian',
    emoji: '🍛',
    songs: [
      { title: 'Jai Ho', artist: 'A.R. Rahman', vibe: 'Bollywood Celebration' },
      { title: 'Tunak Tunak Tun', artist: 'Daler Mehndi', vibe: 'Energetic Punjabi' },
      { title: 'Chaiyya Chaiyya', artist: 'Sukhwinder Singh', vibe: 'Mystical Journey' },
    ],
    similarDishes: [
      { name: 'Biryani', cuisine: 'Indian', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400' },
      { name: 'Tikka Masala', cuisine: 'Indian', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400' },
      { name: 'Korma', cuisine: 'Indian', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400' },
    ],
    funFact: '🍛 The word "curry" comes from the Tamil word "kari" meaning sauce. There are over 100 different types of curry across India, each region having its own unique blend of spices!',
    colors: { primary: '#d97706', secondary: '#dc2626', accent: '#ca8a04', light: '#fef3c7' },
  },
  Biryani: {
    name: 'Biryani',
    cuisine: 'Indian',
    emoji: '🍚',
    songs: [
      { title: 'Desi Girl', artist: 'Vishal-Shekhar', vibe: 'Bollywood Pop' },
      { title: 'Mundian To Bach Ke', artist: 'Panjabi MC', vibe: 'Bhangra Fusion' },
      { title: 'Lean On', artist: 'Major Lazer & DJ Snake', vibe: 'Global Dance' },
    ],
    similarDishes: [
      { name: 'Pulao', cuisine: 'Indian', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400' },
      { name: 'Fried Rice', cuisine: 'Asian', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400' },
      { name: 'Paella', cuisine: 'Spanish', image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400' },
    ],
    funFact: '🍚 Biryani has over 26 varieties across India! Hyderabadi biryani alone uses 47 different ingredients and takes hours to prepare in the traditional dum cooking method.',
    colors: { primary: '#f59e0b', secondary: '#dc2626', accent: '#16a34a', light: '#fef3c7' },
  },

  // Chinese
  Dumpling: {
    name: 'Dumplings',
    cuisine: 'Chinese',
    emoji: '🥟',
    songs: [
      { title: 'The Moon Represents My Heart', artist: 'Teresa Teng', vibe: 'Classic Mandopop' },
      { title: 'Kung Fu Fighting', artist: 'Carl Douglas', vibe: 'Retro Fun' },
      { title: 'Moonlight', artist: 'Jay Chou', vibe: 'Contemporary Chinese' },
    ],
    similarDishes: [
      { name: 'Gyoza', cuisine: 'Japanese', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400' },
      { name: 'Momo', cuisine: 'Tibetan', image: 'https://images.unsplash.com/photo-1625395005224-0fce593c8249?w=400' },
      { name: 'Pierogi', cuisine: 'Polish', image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400' },
    ],
    funFact: '🥟 Chinese families make over 400 dumplings for Chinese New Year! Each fold in the dumpling represents wealth, and eating them brings prosperity for the coming year.',
    colors: { primary: '#dc2626', secondary: '#f59e0b', accent: '#16a34a', light: '#fee2e2' },
  },
  'Fried Rice': {
    name: 'Fried Rice',
    cuisine: 'Chinese',
    emoji: '🍚',
    songs: [
      { title: 'Shanghai Nights', artist: 'Marilyn Manson', vibe: 'Dark Urban' },
      { title: 'Big In Japan', artist: 'Alphaville', vibe: '80s Synth Pop' },
      { title: 'Made in China', artist: 'Higher Brothers', vibe: 'Modern Chinese Hip Hop' },
    ],
    similarDishes: [
      { name: 'Nasi Goreng', cuisine: 'Indonesian', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400' },
      { name: 'Kimchi Fried Rice', cuisine: 'Korean', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400' },
      { name: 'Arroz Chaufa', cuisine: 'Peruvian', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400' },
    ],
    funFact: '🍚 Fried rice was invented as a way to use leftover rice! Day-old rice is actually better for fried rice because it\'s drier and absorbs flavors better.',
    colors: { primary: '#ca8a04', secondary: '#16a34a', accent: '#dc2626', light: '#fef3c7' },
  },

  // American
  Burger: {
    name: 'Burger',
    cuisine: 'American',
    emoji: '🍔',
    songs: [
      { title: 'Born in the U.S.A.', artist: 'Bruce Springsteen', vibe: 'American Rock Anthem' },
      { title: 'Cheeseburger in Paradise', artist: 'Jimmy Buffett', vibe: 'Laid-back Beach' },
      { title: 'Old Town Road', artist: 'Lil Nas X', vibe: 'Modern Country Rap' },
    ],
    similarDishes: [
      { name: 'Hot Dog', cuisine: 'American', image: 'https://images.unsplash.com/photo-1612392166886-ee7c769a7558?w=400' },
      { name: 'Sandwich', cuisine: 'American', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400' },
      { name: 'Slider', cuisine: 'American', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400' },
    ],
    funFact: '🍔 Americans eat approximately 50 billion burgers per year - that\'s three burgers per person per week! The first hamburger was served at Louis\' Lunch in Connecticut in 1900.',
    colors: { primary: '#b45309', secondary: '#dc2626', accent: '#facc15', light: '#fed7aa' },
  },
  'Hot Dog': {
    name: 'Hot Dog',
    cuisine: 'American',
    emoji: '🌭',
    songs: [
      { title: 'Take Me Out to the Ball Game', artist: 'Traditional', vibe: 'Baseball Classic' },
      { title: 'American Pie', artist: 'Don McLean', vibe: 'Folk Rock Nostalgia' },
      { title: 'Surfin\' U.S.A.', artist: 'The Beach Boys', vibe: 'Summer Vibes' },
    ],
    similarDishes: [
      { name: 'Bratwurst', cuisine: 'German', image: 'https://images.unsplash.com/photo-1599684943271-f5eb64c3f6e8?w=400' },
      { name: 'Corn Dog', cuisine: 'American', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400' },
      { name: 'Chorizo', cuisine: 'Spanish', image: 'https://images.unsplash.com/photo-1613564834361-9436948817d1?w=400' },
    ],
    funFact: '🌭 Americans consume 20 billion hot dogs a year! That\'s enough to stretch from Los Angeles to Washington D.C. more than five times.',
    colors: { primary: '#dc2626', secondary: '#facc15', accent: '#b45309', light: '#fee2e2' },
  },

  // Thai
  'Pad Thai': {
    name: 'Pad Thai',
    cuisine: 'Thai',
    emoji: '🍜',
    songs: [
      { title: 'One Night in Bangkok', artist: 'Murray Head', vibe: 'Synth Pop Adventure' },
      { title: 'Jai Yen Yen', artist: 'T-Bone', vibe: 'Modern Thai Pop' },
      { title: 'Wonderful Tonight', artist: 'Eric Clapton', vibe: 'Romantic Classic' },
    ],
    similarDishes: [
      { name: 'Drunken Noodles', cuisine: 'Thai', image: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400' },
      { name: 'Chow Mein', cuisine: 'Chinese', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400' },
      { name: 'Singapore Noodles', cuisine: 'Singaporean', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400' },
    ],
    funFact: '🍜 Pad Thai was invented in the 1930s as part of a national campaign to promote Thai nationalism and reduce rice consumption during a shortage!',
    colors: { primary: '#dc2626', secondary: '#f59e0b', accent: '#16a34a', light: '#fee2e2' },
  },

  // French
  Croissant: {
    name: 'Croissant',
    cuisine: 'French',
    emoji: '🥐',
    songs: [
      { title: 'La Vie en Rose', artist: 'Édith Piaf', vibe: 'Classic French Romance' },
      { title: 'Non, Je Ne Regrette Rien', artist: 'Édith Piaf', vibe: 'Powerful & Emotional' },
      { title: 'Aux Champs-Élysées', artist: 'Joe Dassin', vibe: 'Upbeat Parisian' },
    ],
    similarDishes: [
      { name: 'Pain au Chocolat', cuisine: 'French', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400' },
      { name: 'Baguette', cuisine: 'French', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400' },
      { name: 'Danish Pastry', cuisine: 'Danish', image: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400' },
    ],
    funFact: '🥐 Despite being iconic to France, croissants were actually invented in Austria! They were brought to France by Marie Antoinette and became a French staple.',
    colors: { primary: '#f59e0b', secondary: '#b45309', accent: '#dc2626', light: '#fef3c7' },
  },

  // Middle Eastern
  Falafel: {
    name: 'Falafel',
    cuisine: 'Middle Eastern',
    emoji: '🧆',
    songs: [
      { title: 'Habibi', artist: 'Various Artists', vibe: 'Traditional Middle Eastern' },
      { title: 'Desert Rose', artist: 'Sting feat. Cheb Mami', vibe: 'World Fusion' },
      { title: 'Ya Rayah', artist: 'Rachid Taha', vibe: 'North African Rock' },
    ],
    similarDishes: [
      { name: 'Hummus', cuisine: 'Middle Eastern', image: 'https://images.unsplash.com/photo-1571390687149-7dd2e8a1f06c?w=400' },
      { name: 'Shawarma', cuisine: 'Middle Eastern', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400' },
      { name: 'Kebab', cuisine: 'Middle Eastern', image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400' },
    ],
    funFact: '🧆 Falafel is over 1,000 years old! Both Egypt and Lebanon claim to have invented it, and the debate continues today. It\'s become a symbol of Middle Eastern cuisine worldwide.',
    colors: { primary: '#16a34a', secondary: '#ca8a04', accent: '#dc2626', light: '#dcfce7' },
  },

  // Korean
  Kimchi: {
    name: 'Kimchi',
    cuisine: 'Korean',
    emoji: '🥬',
    songs: [
      { title: 'Gangnam Style', artist: 'PSY', vibe: 'K-Pop Party' },
      { title: 'Dynamite', artist: 'BTS', vibe: 'Upbeat K-Pop' },
      { title: 'Arirang', artist: 'Traditional', vibe: 'Korean Folk' },
    ],
    similarDishes: [
      { name: 'Sauerkraut', cuisine: 'German', image: 'https://images.unsplash.com/photo-1622732748870-ddff2e45f71e?w=400' },
      { name: 'Pickles', cuisine: 'Various', image: 'https://images.unsplash.com/photo-1589621316382-008455b857cd?w=400' },
      { name: 'Tsukemono', cuisine: 'Japanese', image: 'https://images.unsplash.com/photo-1626265310958-184b6926b881?w=400' },
    ],
    funFact: '🥬 Koreans eat an average of 40 pounds of kimchi per person per year! There are over 200 varieties of kimchi, and it was even sent to space with Korea\'s first astronaut.',
    colors: { primary: '#dc2626', secondary: '#16a34a', accent: '#f59e0b', light: '#fee2e2' },
  },
};

// Helper function to get a random dish for mock analysis
export function getRandomDish(): DishData {
  const dishes = Object.values(foodDatabase);
  return dishes[Math.floor(Math.random() * dishes.length)];
}

// Helper function to identify dish from image filename or content
export function identifyDish(imageUrl: string): DishData {
  // Simple keyword matching from filename/url
  const lowerUrl = imageUrl.toLowerCase();
  
  for (const [key, dish] of Object.entries(foodDatabase)) {
    if (lowerUrl.includes(key.toLowerCase())) {
      return dish;
    }
  }
  
  // If no match found, return a random dish
  return getRandomDish();
}
