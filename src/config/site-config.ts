export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
}

export interface ConstellationNode {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
  x: number; // percentage width (0-100)
  y: number; // percentage height (0-100)
}

export interface SiteConfig {
  girlName: string;
  favoriteHeartColor: string;
  favoriteHeartEmoji: string;
  favoriteFlower: string;
  favoriteFlowerEmoji: string;
  music: {
    pianoUrl: string;
    windUrl: string;
    sparkleUrl: string;
  };
  themeColors: {
    deepNavy: string;
    midnightBlue: string;
    skyBlue: string;
    babyBlue: string;
    whiteGlow: string;
    lavender: string;
    silver: string;
    softPurple: string;
  };
  quotes: string[];
  wishes: string[];
  gallery: MemoryItem[];
  constellations: ConstellationNode[];
}

export const siteConfig: SiteConfig = {
  girlName: "Ammuuuu",
  favoriteHeartColor: "Sky Blue",
  favoriteHeartEmoji: "💙",
  favoriteFlower: "Tulips",
  favoriteFlowerEmoji: "🌷",
  music: {
    pianoUrl: "/music/piano.mp3",
    windUrl: "/music/wind.mp3",
    sparkleUrl: "/music/sparkle.mp3",
  },
  themeColors: {
    deepNavy: "#020617",
    midnightBlue: "#0b132b",
    skyBlue: "#87CEEB",
    babyBlue: "#BFEFFF",
    whiteGlow: "#ffffff",
    lavender: "#E6E6FA",
    silver: "#C0C0C0",
    softPurple: "#8A2BE2",
  },
  quotes: [
    "The sky feels brighter when you smile.",
    "You deserve every beautiful thing in this world.",
    "May today surprise you with happiness.",
    "Keep shining.",
    "The stars are cheering for your dreams.",
    "You carry a little bit of magic in your smile.",
    "May your heart always be light and full of peace.",
    "In a world of temporary things, you are a beautiful forever.",
    "Never forget how much of a blessing you are.",
    "May your path always be guided by light and kindness.",
    "The world is a softer place because of you.",
    "May you find joy in the smallest of moments."
  ],
  wishes: [
    "May happiness always find you.",
    "May your dreams become your reality.",
    "May every sunrise bring hope.",
    "May every wish made at 11:11 come true.",
    "May life always be gentle with you.",
    "May your smile never fade.",
    "May your days be filled with laughter and your nights with peace.",
    "May you always have the strength to rise above any storm.",
    "May the right people always surround and support you.",
    "May your confidence bloom like a garden in spring.",
    "May you find magic in the ordinary.",
    "May your heart be a sanctuary of comfort and hope.",
    "May you always believe in the beauty of your dreams.",
    "May you receive double the kindness you give to the world.",
    "May every step you take lead you closer to peace.",
    "May you never lose your wonder.",
    "May success follow you in everything you do.",
    "May your health always be robust and your mind calm.",
    "May your soul remain as beautiful as a field of tulips.",
    "May you find reasons to smile every single day.",
    "May your journey be filled with beautiful unexpected blessings.",
    "May you feel loved, appreciated, and safe every day.",
    "May you conquer every silent battle you are fighting.",
    "May your spirit be free and your heart full.",
    "May today be the start of your happiest chapter yet.",
    "May your life be as radiant as the moon in a clear sky.",
    "May you always find beauty in the little things.",
    "May you stand tall and confident, knowing your worth.",
    "May you always have a reason to hope for tomorrow.",
    "May every memory you make be sweet and lasting.",
    "May your mind be free of worries and full of dreams.",
    "May you find comfort in times of exhaustion.",
    "May you always walk in light and love.",
    "May you be blessed with infinite peace of mind.",
    "May you always be proud of the person you are becoming.",
    "May the universe align to grant your deepest silent prayers.",
    "May you always feel inspired and creative.",
    "May your laughter ring loud and clear.",
    "May your eyes always see the good in people.",
    "May you be protected from any negativity or doubt.",
    "May every season of your life bring growth and joy.",
    "May you have the courage to chase your wildest dreams.",
    "May your kindness return to you a hundredfold.",
    "May you sleep peacefully and wake up with excitement.",
    "May you find your true north and walk it with pride.",
    "May your heart always beat to the rhythm of joy.",
    "May your life be colored with the prettiest shades of blue.",
    "May you feel secure in your own skin.",
    "May every door of opportunity swing open for you.",
    "May your struggles turn into your greatest strengths.",
    "May you always have a friend who listens with their heart.",
    "May your presence bring warmth to everyone you meet.",
    "May your hard work yield sweet fruits.",
    "May you never forget the power of your own light.",
    "May you always find a silver lining in every cloud.",
    "May you be filled with energy and enthusiasm.",
    "May you always speak your truth with gentleness.",
    "May you be a beacon of hope for others.",
    "May your heart remain pure and resilient.",
    "May every 11:11 remind you of how special you are.",
    "May your day be filled with serendipitous moments.",
    "May you always have a warm cup of peace when life gets busy.",
    "May you find beauty in the quiet moments.",
    "May your creativity flow like a gentle river.",
    "May you feel valued and treasured by those who matter.",
    "May you never doubt the impact of your kindness.",
    "May your step be light and your heart full.",
    "May you always have a shoulder to lean on.",
    "May your dreams paint your nights with wonder.",
    "May you always find your way back to happiness.",
    "May you be blessed with absolute clarity in your choices.",
    "May your soul always sing with freedom.",
    "May you find joy in learning and growing.",
    "May you always feel at home in your own heart.",
    "May you get the rest you deserve.",
    "May you feel a gentle breeze of comfort when you're stressed.",
    "May your life be a beautiful canvas of smiles.",
    "May your patience be rewarded beautifully.",
    "May you feel secure and supported by the universe.",
    "May your passion burn bright and steady.",
    "May you never stop believing in magic.",
    "May you find strength in your vulnerability.",
    "May your memories always be a source of warmth.",
    "May you be blessed with wisdom and discernment.",
    "May you always find a reason to dance in the rain.",
    "May your life be free of regrets and full of learning.",
    "May you look in the mirror and see someone truly extraordinary.",
    "May your voice always be heard with respect and love.",
    "May you walk with confidence, grace, and poise.",
    "May your dreams grow wings and fly.",
    "May your days be lighthearted and carefree.",
    "May you always know that you are enough.",
    "May your kindness touch lives in ways you'll never fully know.",
    "May you find peace in let-offs and new beginnings.",
    "May your life be full of laughter that makes your stomach hurt.",
    "May you be blessed with deep, meaningful relationships.",
    "May every sunset remind you of a beautiful day lived.",
    "May your heart be filled with gratitude and content.",
    "May the stars always guide you home.",
    "May your light shine bright, even in the darkest rooms.",
    "May every wish you make today bring you closer to your destiny.",
    "May you always find magic at 11:11.",
    "May you always know how loved you are, Ammuuuu."
  ],
  gallery: [
    {
      id: "mem-1",
      title: "Chasing Stars",
      date: "August 12, 2025",
      description: "Under the starlit sky, mapping dreams onto the clouds.",
      image: "/images/gallery-1.jpg"
    },
    {
      id: "mem-2",
      title: "Tulip Whispers",
      date: "September 24, 2025",
      description: "A soft breeze walking through fields of blooming tulips.",
      image: "/images/gallery-2.jpg"
    },
    {
      id: "mem-3",
      title: "Ocean of Dreams",
      date: "October 18, 2025",
      description: "Watching the twilight fade into a deep blue ocean glow.",
      image: "/images/gallery-3.jpg"
    },
    {
      id: "mem-4",
      title: "Cozy Afternoons",
      date: "November 05, 2025",
      description: "Warm tea, soft blankets, and peaceful thoughts.",
      image: "/images/gallery-4.jpg"
    },
    {
      id: "mem-5",
      title: "A Winter's Wish",
      date: "December 21, 2025",
      description: "Making a wish as the first snowflake touches the ground.",
      image: "/images/gallery-5.jpg"
    },
    {
      id: "mem-6",
      title: "Spring Symphony",
      date: "April 02, 2026",
      description: "When the flowers open up to welcome the sky blue sun.",
      image: "/images/gallery-6.jpg"
    }
  ],
  constellations: [
    {
      id: "const-1",
      title: "First Spark of Hope",
      date: "January 11, 2025",
      description: "A silent wish made during a quiet night that lit up the sky.",
      image: "/images/gallery-1.jpg",
      x: 15,
      y: 20
    },
    {
      id: "const-2",
      title: "The Blue Butterfly Effect",
      date: "March 15, 2025",
      description: "A small act of kindness that fluttered and changed everything.",
      image: "/images/gallery-2.jpg",
      x: 35,
      y: 45
    },
    {
      id: "const-3",
      title: "The Quiet Moonrise",
      date: "June 20, 2025",
      description: "Finding peace under the gentle silver glow of a midnight moon.",
      image: "/images/gallery-3.jpg",
      x: 55,
      y: 15
    },
    {
      id: "const-4",
      title: "Golden Hour Reflection",
      date: "September 09, 2025",
      description: "Looking back at the path traveled and realizing how beautiful the journey is.",
      image: "/images/gallery-4.jpg",
      x: 70,
      y: 55
    },
    {
      id: "const-5",
      title: "The 11:11 Constellation",
      date: "November 11, 2025",
      description: "Connecting the stars of memory to create a lasting pattern of joy.",
      image: "/images/gallery-5.jpg",
      x: 88,
      y: 30
    }
  ]
};
