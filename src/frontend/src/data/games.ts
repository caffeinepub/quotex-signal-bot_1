export interface Game {
  id: string;
  name: string;
  provider: string;
  category: string;
  gradient: string;
  emoji: string;
  muted?: boolean;
}

export const GAME_CATEGORIES = [
  { id: "popular", label: "Popular", icon: "🔥" },
  { id: "pg-slot", label: "PG-Slot", icon: "🎰" },
  { id: "pragmatic", label: "Pragmatic", icon: "♟️" },
  { id: "pescaria", label: "Pescaria", icon: "🐟" },
  { id: "blockchain", label: "Blockchain", icon: "⛓️" },
];

export const GAMES: Game[] = [
  // Popular
  {
    id: "jili-slots",
    name: "JILI Slots",
    provider: "JILI",
    category: "popular",
    gradient: "from-purple-900 to-purple-700",
    emoji: "🎰",
    muted: true,
  },
  {
    id: "jdb-fishing",
    name: "JDB Fishing",
    provider: "JDB",
    category: "popular",
    gradient: "from-blue-900 to-cyan-700",
    emoji: "🐟",
  },
  {
    id: "olympian-temple",
    name: "Olympian Temple",
    provider: "JILI",
    category: "popular",
    gradient: "from-amber-900 to-amber-600",
    emoji: "🏛️",
    muted: true,
  },
  {
    id: "golden-empire",
    name: "Golden Empire",
    provider: "JDB",
    category: "popular",
    gradient: "from-yellow-900 to-yellow-600",
    emoji: "👑",
  },
  {
    id: "boxing-king",
    name: "Boxing King",
    provider: "JILI",
    category: "popular",
    gradient: "from-red-900 to-red-700",
    emoji: "🥊",
    muted: true,
  },
  {
    id: "lucky-fortune",
    name: "Lucky Fortune",
    provider: "JDB",
    category: "popular",
    gradient: "from-green-900 to-emerald-600",
    emoji: "🍀",
  },
  {
    id: "dragon-tiger",
    name: "Dragon Tiger",
    provider: "JILI",
    category: "popular",
    gradient: "from-orange-900 to-red-700",
    emoji: "🐉",
    muted: true,
  },
  {
    id: "mega-win",
    name: "Mega Win",
    provider: "JDB",
    category: "popular",
    gradient: "from-indigo-900 to-purple-700",
    emoji: "💰",
  },

  // PG-Slot
  {
    id: "mahjong-ways",
    name: "Mahjong Ways",
    provider: "PG",
    category: "pg-slot",
    gradient: "from-red-900 to-pink-700",
    emoji: "🀄",
  },
  {
    id: "fortune-tiger",
    name: "Fortune Tiger",
    provider: "PG",
    category: "pg-slot",
    gradient: "from-orange-900 to-amber-600",
    emoji: "🐯",
  },
  {
    id: "lucky-piggy",
    name: "Lucky Piggy",
    provider: "PG",
    category: "pg-slot",
    gradient: "from-pink-900 to-rose-600",
    emoji: "🐷",
  },
  {
    id: "wild-bandito",
    name: "Wild Bandito",
    provider: "PG",
    category: "pg-slot",
    gradient: "from-stone-900 to-amber-800",
    emoji: "🤠",
  },
  {
    id: "treasures-aztec",
    name: "Treasures of Aztec",
    provider: "PG",
    category: "pg-slot",
    gradient: "from-teal-900 to-green-700",
    emoji: "💎",
  },
  {
    id: "candy-burst",
    name: "Candy Burst",
    provider: "PG",
    category: "pg-slot",
    gradient: "from-fuchsia-900 to-pink-600",
    emoji: "🍬",
  },

  // Pragmatic
  {
    id: "gates-olympus",
    name: "Gates of Olympus",
    provider: "Pragmatic",
    category: "pragmatic",
    gradient: "from-sky-900 to-blue-700",
    emoji: "⚡",
  },
  {
    id: "sweet-bonanza",
    name: "Sweet Bonanza",
    provider: "Pragmatic",
    category: "pragmatic",
    gradient: "from-pink-900 to-purple-700",
    emoji: "🍭",
  },
  {
    id: "big-bass-splash",
    name: "Big Bass Splash",
    provider: "Pragmatic",
    category: "pragmatic",
    gradient: "from-cyan-900 to-teal-700",
    emoji: "🎣",
  },
  {
    id: "fire-strike",
    name: "Fire Strike",
    provider: "Pragmatic",
    category: "pragmatic",
    gradient: "from-red-950 to-orange-700",
    emoji: "🔥",
  },
  {
    id: "jokers-jewels",
    name: "Joker's Jewels",
    provider: "Pragmatic",
    category: "pragmatic",
    gradient: "from-violet-900 to-indigo-700",
    emoji: "🃏",
  },

  // Pescaria
  {
    id: "fishing-war",
    name: "Fishing War",
    provider: "JILI",
    category: "pescaria",
    gradient: "from-blue-950 to-cyan-800",
    emoji: "⚔️",
    muted: true,
  },
  {
    id: "happy-fishing",
    name: "Happy Fishing",
    provider: "JDB",
    category: "pescaria",
    gradient: "from-teal-950 to-blue-700",
    emoji: "🎏",
  },
  {
    id: "jackpot-fishing",
    name: "Jackpot Fishing",
    provider: "JILI",
    category: "pescaria",
    gradient: "from-green-950 to-teal-700",
    emoji: "🏆",
    muted: true,
  },
  {
    id: "dragon-fortune",
    name: "Dragon Fortune Fish",
    provider: "JDB",
    category: "pescaria",
    gradient: "from-amber-950 to-red-800",
    emoji: "🐉",
  },

  // Blockchain
  {
    id: "crypto-slots",
    name: "Crypto Slots",
    provider: "Chain",
    category: "blockchain",
    gradient: "from-gray-900 to-slate-700",
    emoji: "🔒",
  },
  {
    id: "bitcoin-fortune",
    name: "Bitcoin Fortune",
    provider: "Chain",
    category: "blockchain",
    gradient: "from-orange-950 to-yellow-700",
    emoji: "₿",
  },
  {
    id: "eth-jackpot",
    name: "ETH Jackpot",
    provider: "Chain",
    category: "blockchain",
    gradient: "from-indigo-950 to-blue-800",
    emoji: "Ξ",
  },
];
