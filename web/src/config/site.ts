export const site = {
  name: "Placidchills",
  tagline: "Producer & Mastering Engineer",
  description:
    "Independent music producer and mastering engineer. Custom production, professional mastering, beat licensing. Credits include GAUSH, KALAM INK, Bantai Records.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://placidchills.com",
  owner: "Soumyajit",
  location: "Mumbai, India",
  experienceYears: 10,
  stats: {
    totalStreams: "10M+",
    topTrackStreams: "6.4M",
    topTrackName: "AAJ BHI AAP",
    editorialPlacements: 2,
    monthlyListeners: "70K+",
    releasedRecords: "100+",
  },
  social: {
    instagram: "https://www.instagram.com/placidchills_/",
    spotify: "https://open.spotify.com/artist/4DOiFiwOoLhBQOniziQ7V6",
    youtube: "https://www.youtube.com/@Placidchills",
    payhip: "https://payhip.com/placidchills",
  },
  genres: ["DHH", "Trap", "Drill", "Hip-Hop", "R&B"],
} as const;

export const pricing = {
  beats: {
    mp3: 2500,
    wav: 5000,
    stems: 10000,
    exclusiveFrom: 15000,
    exclusiveTo: 20000,
  },
  mastering: {
    single: 1000,
    epBundle: 4000,
    epTracks: "4–5",
    rushAddon: 500,
    turnaroundHours: 48,
    rushHours: 24,
  },
  customProduction: {
    depositPercent: 50,
    responseHours: 24,
  },
  masteringSamples: {
    originalUrl: "",
    masterUrl: "",
  },
} as const;

export const licenseTiers = [
  {
    id: "mp3",
    name: "MP3 Lease",
    price: pricing.beats.mp3,
    featured: false,
    allows: [
      "Untagged MP3 file (320kbps)",
      "Up to 100,000 streams across all platforms",
      "Up to 5,000 sales or paid downloads",
      "1 official music video",
      "Non-profit / mixtape use",
      "Live performances (unlimited)",
    ],
    prohibits: [
      "WAV or lossless file not included",
      "TV, film, advertisement, or sync use",
      "Selling or sublicensing to another artist",
      "Radio airplay (commercial)",
    ],
  },
  {
    id: "wav",
    name: "WAV Lease",
    price: pricing.beats.wav,
    featured: true,
    badge: "Most Popular",
    allows: [
      "WAV + MP3 files (full quality)",
      "Up to 500,000 streams across all platforms",
      "Up to 10,000 sales or paid downloads",
      "1 official music video",
      "Non-profit and commercial release",
      "Live performances (unlimited)",
      "Radio airplay (limited — see licensing page)",
    ],
    prohibits: [
      "Stems / individual track files not included",
      "TV, film, advertisement, or sync use",
      "Selling or sublicensing to another artist",
    ],
  },
  {
    id: "stems",
    name: "Trackout / Stems Lease",
    price: pricing.beats.stems,
    featured: false,
    allows: [
      "Full stems (individual track files: drums, bass, melody, etc.)",
      "WAV + MP3 files included",
      "Unlimited streams",
      "Unlimited sales and downloads",
      "Unlimited music videos",
      "Live performances (unlimited)",
      "Radio airplay (unlimited)",
    ],
    prohibits: [
      "TV, film, advertisement, or sync use without upgrade",
      "Selling or sublicensing to another artist",
      "Registering the beat as your own copyright",
    ],
  },
  {
    id: "exclusive",
    name: "Exclusive Rights",
    price: pricing.beats.exclusiveFrom,
    priceNote: `₹${pricing.beats.exclusiveFrom.toLocaleString("en-IN")}–${pricing.beats.exclusiveTo.toLocaleString("en-IN")} (negotiated per beat)`,
    featured: true,
    allows: [
      "Full ownership transfer — you own the beat",
      "All stems and files included",
      "Unlimited streams, sales, videos",
      "TV, film, advertisement, and sync use",
      "Radio airplay (unlimited)",
      "Beat permanently retired from the store",
      "No other artist can ever licence this beat",
    ],
    prohibits: [
      "Reselling or re-licensing the beat to another producer/artist after purchase",
    ],
  },
] as const;

export const formatInr = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`;
