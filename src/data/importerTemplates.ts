export interface ImporterTemplate {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  year: number;
  duration: string;
  rating: string;
  views: number;
  likes: number;
  country: string;
  type: "Movie" | "Natok" | "Web Series";
  language?: string;
}

export const BANGLA_NATOK_TEMPLATES: Omit<ImporterTemplate, "id">[] = [
  {
    title: "Bachelor Point Season 4",
    description: "The daily hilarious struggles, relationship complications, and comedic antics of a group of bachelor friends living together in a Dhaka apartment. A massive cultural phenomenon of Bangladesh.",
    thumbnail: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=600",
    category: "Comedy",
    year: 2022,
    duration: "45m",
    rating: "TV-14",
    views: 450000,
    likes: 38000,
    country: "Bangladesh",
    type: "Natok"
  },
  {
    title: "Punorjonmo (The Rebirth)",
    description: "A dark mystery thriller masterpiece centered around Rafsan Haque, a renowned chef who hides a chilling double life, and his complicated obsession with culinary perfection and secrets.",
    thumbnail: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=600",
    category: "Thriller",
    year: 2021,
    duration: "1h 10m",
    rating: "TV-MA",
    views: 390000,
    likes: 32000,
    country: "Bangladesh",
    type: "Natok"
  },
  {
    title: "Male 3 (Female Sequel)",
    description: "A side-splitting neighborhood comedy series capturing the local rivalries, romantic aspirations, and chaotic community gatherings in an old Dhaka locality.",
    thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600",
    category: "Comedy",
    year: 2023,
    duration: "42m",
    rating: "TV-PG",
    views: 290000,
    likes: 18000,
    country: "Bangladesh",
    type: "Natok"
  },
  {
    title: "Hotel Albatross",
    description: "A classic, thought-provoking drama where absolute strangers get trapped in an isolated hotel during a mysterious storm, forcing them to reveal their darkest secrets and sins.",
    thumbnail: "https://images.unsplash.com/photo-1542204172-e70528091f52?q=80&w=600",
    category: "Drama",
    year: 2017,
    duration: "55m",
    rating: "TV-14",
    views: 180000,
    likes: 14000,
    country: "Bangladesh",
    type: "Natok"
  },
  {
    title: "Chander Pahar (Mountain of the Moon)",
    description: "An emotional journey of a young village boy seeking a better future in the city, but facing extreme emotional setbacks, familial pressure, and ultimate survival.",
    thumbnail: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600",
    category: "Drama",
    year: 2020,
    duration: "48m",
    rating: "TV-G",
    views: 220000,
    likes: 15000,
    country: "Bangladesh",
    type: "Natok"
  },
  {
    title: "Sheshta Sundor (The Beautiful End)",
    description: "A poignant romantic drama dealing with second chances, healing from broken hearts, and discovering that the end of one love story can be the beautiful beginning of another.",
    thumbnail: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?q=80&w=600",
    category: "Drama",
    year: 2024,
    duration: "52m",
    rating: "TV-PG",
    views: 310000,
    likes: 24000,
    country: "Bangladesh",
    type: "Natok"
  },
  {
    title: "Buker Moddhye (Deep in the Heart)",
    description: "An intense emotional rollercoaster about childhood sweethearts who get separated by pride and misunderstandings, only to cross paths years later under unforeseen circumstances.",
    thumbnail: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=600",
    category: "Drama",
    year: 2023,
    duration: "50m",
    rating: "TV-PG",
    views: 250000,
    likes: 19000,
    country: "Bangladesh",
    type: "Natok"
  },
  {
    title: "Shunyo (Empty Space)",
    description: "A gripping psychological drama about a writer suffering from severe writer's block who gets obsessed with a mysterious caller, leading to a dark spiral of self-reflection.",
    thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600",
    category: "Drama",
    year: 2021,
    duration: "1h 05m",
    rating: "TV-14",
    views: 140000,
    likes: 9800,
    country: "Bangladesh",
    type: "Natok"
  },
  {
    title: "Mojo Cola Special Natok",
    description: "A hilarious Eid special centering around a local street-smart boy who attempts to win a grand community prize with his quirky dance moves and energetic sidekicks.",
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600",
    category: "Comedy",
    year: 2025,
    duration: "40m",
    rating: "TV-G",
    views: 410000,
    likes: 35000,
    country: "Bangladesh",
    type: "Natok"
  },
  {
    title: "Task (The Secret Operation)",
    description: "An action-thriller natok about an undercover detective who must complete a high-stakes rescue operation in old Dhaka before a ticking bomb goes off.",
    thumbnail: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600",
    category: "Action",
    year: 2022,
    duration: "58m",
    rating: "TV-14",
    views: 210000,
    likes: 17000,
    country: "Bangladesh",
    type: "Natok"
  },
  {
    title: "Kabyo (The Poet of Love)",
    description: "A beautiful lyrical love story featuring a struggling poet who finds his muse in an absolute stranger, leading to an artistic renaissance in their lives.",
    thumbnail: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?q=80&w=600",
    category: "Drama",
    year: 2024,
    duration: "46m",
    rating: "TV-G",
    views: 165000,
    likes: 12000,
    country: "Bangladesh",
    type: "Natok"
  },
  {
    title: "Bachelor Trip to Cox's Bazar",
    description: "The Bachelors pack their bags and head to the longest sea beach in the world, resulting in utter chaos, comedic misunderstandings, and ultimate friendship goals.",
    thumbnail: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=600",
    category: "Comedy",
    year: 2023,
    duration: "1h 15m",
    rating: "TV-PG",
    views: 520000,
    likes: 49000,
    country: "Bangladesh",
    type: "Natok"
  },
  {
    title: "Unexpected Wedding",
    description: "A lighthearted family comedy about an accidental matchmaking incident that locks two highly incompatible individuals in an arranged marriage preparation.",
    thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600",
    category: "Comedy",
    year: 2024,
    duration: "45m",
    rating: "TV-G",
    views: 280000,
    likes: 21000,
    country: "Bangladesh",
    type: "Natok"
  },
  {
    title: "Eid Er Shaji",
    description: "An emotional family drama showcasing the warmth, sacrifices, and ultimate joy of celebrating Eid together in a joint family in rural Bangladesh.",
    thumbnail: "https://images.unsplash.com/photo-1542204172-e70528091f52?q=80&w=600",
    category: "Drama",
    year: 2025,
    duration: "50m",
    rating: "TV-PG",
    views: 330000,
    likes: 27000,
    country: "Bangladesh",
    type: "Natok"
  },
  {
    title: "Sweet Sixteen Memoirs",
    description: "A nostalgic coming-of-age drama looking back at high school life, teenage crushes, exam terrors, and lifelong promises made on rooftop gatherings.",
    thumbnail: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600",
    category: "Drama",
    year: 2021,
    duration: "48m",
    rating: "TV-G",
    views: 195000,
    likes: 14500,
    country: "Bangladesh",
    type: "Natok"
  }
];

export const BANGLA_MOVIE_TEMPLATES: Omit<ImporterTemplate, "id">[] = [
  {
    title: "Toofan (The Hurricane)",
    description: "A high-octane action blockbuster starring Shakib Khan as a powerful gangster who rises to dominate the criminal underworld through sheer grit, style, and absolute authority.",
    thumbnail: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600",
    category: "Action",
    year: 2024,
    duration: "2h 25m",
    rating: "R",
    views: 890000,
    likes: 72000,
    country: "Bangladesh",
    type: "Movie"
  },
  {
    title: "Priyotoma (The Beloved)",
    description: "An epic romantic tragedy following an intense, emotional journey of two lovers separated by cruel societal boundaries, featuring beautiful songs and outstanding performances.",
    thumbnail: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?q=80&w=600",
    category: "Drama",
    year: 2023,
    duration: "2h 15m",
    rating: "PG-13",
    views: 750000,
    likes: 61000,
    country: "Bangladesh",
    type: "Movie"
  },
  {
    title: "Hawa (The Wind)",
    description: "A critically acclaimed mystery drama set inside a traditional wooden fishing trawler in the deep Bay of Bengal, where a mysterious mute girl triggers paranoia among the crew.",
    thumbnail: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=600",
    category: "Thriller",
    year: 2022,
    duration: "2h 11m",
    rating: "R",
    views: 680000,
    likes: 58000,
    country: "Bangladesh",
    type: "Movie"
  },
  {
    title: "Surongo (The Tunnel)",
    description: "A gripping heist thriller based on true events about a simple locksmith who gets pushed to build an unbelievable underground tunnel to loot a bank for love and revenge.",
    thumbnail: "https://images.unsplash.com/photo-1542204172-e70528091f52?q=80&w=600",
    category: "Thriller",
    year: 2023,
    duration: "2h 18m",
    rating: "R",
    views: 590000,
    likes: 48000,
    country: "Bangladesh",
    type: "Movie"
  },
  {
    title: "Poran (My Heart)",
    description: "An intense, tragic love story based on a real-life incident in central Bangladesh, exploring the destructive dynamics of obsession, peer pressure, and local politics.",
    thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600",
    category: "Drama",
    year: 2022,
    duration: "2h 10m",
    rating: "PG-13",
    views: 490000,
    likes: 41000,
    country: "Bangladesh",
    type: "Movie"
  },
  {
    title: "Damal (The Brave Hearts)",
    description: "A historical sports drama showcasing the legendary Shadhin Bangla Football Team who toured India to raise funds and awareness for the Bangladesh Liberation War in 1971.",
    thumbnail: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=600",
    category: "Action",
    year: 2022,
    duration: "2h 05m",
    rating: "TV-14",
    views: 380000,
    likes: 31000,
    country: "Bangladesh",
    type: "Movie"
  },
  {
    title: "Aynabaji (Mirror Game)",
    description: "A legendary psychological crime thriller about Chanchal Chowdhury's character, Sharafat Karim Ayna, a human chameleon who serves prison time for wealthy criminals in exchange for money.",
    thumbnail: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=600",
    category: "Thriller",
    year: 2016,
    duration: "2h 14m",
    rating: "PG-13",
    views: 650000,
    likes: 54000,
    country: "Bangladesh",
    type: "Movie"
  },
  {
    title: "Rehana Maryam Noor",
    description: "An intense psychological drama centered around an assistant professor at a medical college who witnesses an incident and starts an uncompromising fight for justice.",
    thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600",
    category: "Drama",
    year: 2021,
    duration: "1h 47m",
    rating: "TV-MA",
    views: 240000,
    likes: 19000,
    country: "Bangladesh",
    type: "Movie"
  }
];

export const INDIAN_MOVIE_TEMPLATES: Omit<ImporterTemplate, "id">[] = [
  {
    title: "Jawan (The Soldier)",
    description: "A high-octane action thriller starring Shah Rukh Khan as a man driven by a personal vendetta to rectify the wrongs in Indian society, supported by an incredible cast.",
    thumbnail: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600",
    category: "Action",
    year: 2023,
    duration: "2h 49m",
    rating: "PG-13",
    views: 1200000,
    likes: 98000,
    country: "India",
    type: "Movie"
  },
  {
    title: "Pathaan (Spy Universe)",
    description: "An Indian undercover agent must race against time to stop an ex-agent turned terrorist leader from releasing a deadly bio-weapon on Indian cities.",
    thumbnail: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=600",
    category: "Action",
    year: 2023,
    duration: "2h 26m",
    rating: "PG-13",
    views: 1100000,
    likes: 85000,
    country: "India",
    type: "Movie"
  },
  {
    title: "Animal",
    description: "A dark, violent action thriller centering on a toxic and intense relationship between a wealthy industrialist father and his hyper-possessive son, who launches a bloodbath to protect him.",
    thumbnail: "https://images.unsplash.com/photo-1542204172-e70528091f52?q=80&w=600",
    category: "Thriller",
    year: 2023,
    duration: "3h 21m",
    rating: "R",
    views: 950000,
    likes: 79000,
    country: "India",
    type: "Movie"
  },
  {
    title: "RRR (Rise Roar Revolt)",
    description: "An Oscar-winning epic action adventure set in colonial India, centering on two legendary revolutionaries who unite to wage war against British tyrannical rule.",
    thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600",
    category: "Action",
    year: 2022,
    duration: "3h 07m",
    rating: "PG-13",
    views: 1450000,
    likes: 124000,
    country: "India",
    type: "Movie"
  },
  {
    title: "KGF Chapter 2",
    description: "In the blood-soaked Kolar Gold Fields, Rocky's name strikes fear into his foes. While his allies look up to him, the government views him as a massive threat to law and order.",
    thumbnail: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=600",
    category: "Action",
    year: 2022,
    duration: "2h 48m",
    rating: "R",
    views: 1350000,
    likes: 110000,
    country: "India",
    type: "Movie"
  },
  {
    title: "Pushpa: The Rise",
    description: "A cool, gritty action film about Pushpa Raj, a red sandalwood smuggler who ascends to control the illegal trade, matching wits with a ruthless police inspector.",
    thumbnail: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=600",
    category: "Action",
    year: 2021,
    duration: "2h 59m",
    rating: "R",
    views: 1150000,
    likes: 92000,
    country: "India",
    type: "Movie"
  },
  {
    title: "Kantara",
    description: "A majestic mythological thriller about a local rebel who clashes with a forest officer, triggering a legendary spiritual battle involving forest gods and human greed.",
    thumbnail: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?q=80&w=600",
    category: "Thriller",
    year: 2022,
    duration: "2h 30m",
    rating: "PG-13",
    views: 820000,
    likes: 73000,
    country: "India",
    type: "Movie"
  }
];

export const WEB_SERIES_TEMPLATES: Omit<ImporterTemplate, "id">[] = [
  {
    title: "Taqdeer (The Destiny)",
    description: "A breakout Bangladeshi mystery thriller series following a freezer van driver who finds a dead body inside his vehicle, launching him into a terrifying web of blackmail and political secrets.",
    thumbnail: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=600",
    category: "Thriller",
    year: 2020,
    duration: "8 Episodes",
    rating: "TV-MA",
    views: 540000,
    likes: 42000,
    country: "Bangladesh",
    type: "Web Series"
  },
  {
    title: "Karagar (The Dungeon)",
    description: "In a cell of a high-security prison that has been locked for fifty years, a mysterious inmate suddenly appears, claiming to have been imprisoned there since the 1700s.",
    thumbnail: "https://images.unsplash.com/photo-1542204172-e70528091f52?q=80&w=600",
    category: "Thriller",
    year: 2022,
    duration: "7 Episodes",
    rating: "TV-MA",
    views: 610000,
    likes: 53000,
    country: "Bangladesh",
    type: "Web Series"
  },
  {
    title: "Mohanagar (The Metropolis)",
    description: "Set inside a Dhaka police station over the course of a single chaotic night, where a powerful politician's son is detained, triggering a intense tactical war between honest and corrupt officers.",
    thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600",
    category: "Drama",
    year: 2021,
    duration: "8 Episodes",
    rating: "TV-14",
    views: 480000,
    likes: 39000,
    country: "Bangladesh",
    type: "Web Series"
  },
  {
    title: "Mirzapur",
    description: "An epic, gritty Indian crime saga where a shocking incident at a wedding spark an unstoppable chain of events involving a mafia don, his wild son, and two honest brothers.",
    thumbnail: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600",
    category: "Action",
    year: 2018,
    duration: "10 Episodes",
    rating: "R",
    views: 1800000,
    likes: 145000,
    country: "India",
    type: "Web Series"
  },
  {
    title: "Panchayat",
    description: "A brilliant, heartwarming comedy series centered on an engineering graduate who, due to lack of job options, joins as a low-salary secretary of a remote panchayat village office in rural India.",
    thumbnail: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?q=80&w=600",
    category: "Comedy",
    year: 2020,
    duration: "8 Episodes",
    rating: "TV-PG",
    views: 1200000,
    likes: 98000,
    country: "India",
    type: "Web Series"
  },
  {
    title: "Stranger Things",
    description: "When a young boy vanishes, a small Indiana town uncovers a mystery involving secret government experiments, terrifying supernatural forces, and one strange little girl.",
    thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600",
    category: "Sci-Fi",
    year: 2016,
    duration: "9 Episodes",
    rating: "TV-14",
    views: 2300000,
    likes: 195000,
    country: "International",
    type: "Web Series"
  },
  {
    title: "Wednesday",
    description: "Smart, sarcastic and a little dead inside, Wednesday Addams investigates a murder spree while making new friends — and foes — at Nevermore Academy.",
    thumbnail: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=600",
    category: "Fantasy",
    year: 2022,
    duration: "8 Episodes",
    rating: "TV-14",
    views: 1980000,
    likes: 165000,
    country: "International",
    type: "Web Series"
  },
  {
    title: "Breaking Bad",
    description: "A high school chemistry teacher diagnosed with terminal lung cancer turns to manufacturing methamphetamine with his former student to secure his family's financial future.",
    thumbnail: "https://images.unsplash.com/photo-1542204172-e70528091f52?q=80&w=600",
    category: "Thriller",
    year: 2008,
    duration: "7 Episodes",
    rating: "R",
    views: 2900000,
    likes: 245000,
    country: "International",
    type: "Web Series"
  }
];

export const HOLLYWOOD_TEMPLATES: Omit<ImporterTemplate, "id">[] = [
  {
    title: "Inception",
    description: "A professional thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600",
    category: "Sci-Fi",
    year: 2010,
    duration: "2h 28m",
    rating: "PG-13",
    views: 1500000,
    likes: 120000,
    country: "International",
    type: "Movie"
  },
  {
    title: "Interstellar",
    description: "When Earth becomes uninhabitable, a team of courageous explorers travels through a wormhole in space in an attempt to ensure humanity's survival on foreign worlds.",
    thumbnail: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600",
    category: "Sci-Fi",
    year: 2014,
    duration: "2h 49m",
    rating: "PG-13",
    views: 1800000,
    likes: 154000,
    country: "International",
    type: "Movie"
  },
  {
    title: "Oppenheimer",
    description: "The story of American scientist J. Robert Oppenheimer and his historical role in the development of the atomic bomb that changed the world forever.",
    thumbnail: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600",
    category: "Drama",
    year: 2023,
    duration: "3h 00m",
    rating: "R",
    views: 1100000,
    likes: 93000,
    country: "International",
    type: "Movie"
  },
  {
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability.",
    thumbnail: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=600",
    category: "Action",
    year: 2008,
    duration: "2h 32m",
    rating: "PG-13",
    views: 2200000,
    likes: 185000,
    country: "International",
    type: "Movie"
  }
];

export const PAKISTANI_TEMPLATES: Omit<ImporterTemplate, "id">[] = [
  {
    title: "Parizaad (Drama Series)",
    description: "The journey of a dark-skinned, sensitive, and intelligent young man named Parizaad who faces constant societal rejection but possesses a heart of gold and a deep talent for poetry.",
    thumbnail: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=600",
    category: "Drama",
    year: 2021,
    duration: "29 Episodes",
    rating: "TV-PG",
    views: 1200000,
    likes: 98000,
    country: "Pakistan",
    type: "Web Series",
    language: "Urdu"
  },
  {
    title: "The Legend of Maula Jatt",
    description: "A fierce and legendary prize-fighter named Maula Jatt takes on his arch-nemesis Noori Natt in a brutal, cinematic clash of clans. The highest-grossing Pakistani movie of all time.",
    thumbnail: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=600",
    category: "Action",
    year: 2022,
    duration: "2h 33m",
    rating: "R",
    views: 890000,
    likes: 74000,
    country: "Pakistan",
    type: "Movie",
    language: "Urdu"
  },
  {
    title: "Mere Humsafar (Romantic Drama)",
    description: "An innocent, soft-spoken girl raised in an abusive household finds comfort, love, and respect when her charming cousin Hamza returns from abroad and marries her to protect her.",
    thumbnail: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=600",
    category: "Drama",
    year: 2022,
    duration: "40 Episodes",
    rating: "TV-PG",
    views: 2400000,
    likes: 195000,
    country: "Pakistan",
    type: "Web Series",
    language: "Urdu"
  },
  {
    title: "Zindagi Gulzar Hai",
    description: "The story of two contrasting individuals, Kashaf and Zaroon, who come from different socioeconomic backgrounds and hold different perspectives on life, love, and family values.",
    thumbnail: "https://images.unsplash.com/photo-1460881680858-30d872d5b530?q=80&w=600",
    category: "Comedy",
    year: 2012,
    duration: "26 Episodes",
    rating: "TV-PG",
    views: 1500000,
    likes: 110000,
    country: "Pakistan",
    type: "Web Series",
    language: "Urdu"
  }
];

export const ALL_TEMPLATES: Omit<ImporterTemplate, "id">[] = [
  ...BANGLA_NATOK_TEMPLATES,
  ...BANGLA_MOVIE_TEMPLATES,
  ...INDIAN_MOVIE_TEMPLATES,
  ...WEB_SERIES_TEMPLATES,
  ...HOLLYWOOD_TEMPLATES,
  ...PAKISTANI_TEMPLATES
];

// Generates bulk movies to hit targets up to 200 items smoothly!
export function generateBulkMovies(
  query: string,
  limit: number,
  platform: "movie-box" | "dejavu"
): ImporterTemplate[] {
  const normQuery = query.toLowerCase().trim();
  
  // Filter matching templates
  let matches = ALL_TEMPLATES.filter(item => {
    if (!normQuery) return true;
    return (
      item.title.toLowerCase().includes(normQuery) ||
      item.description.toLowerCase().includes(normQuery) ||
      item.country.toLowerCase().includes(normQuery) ||
      item.category.toLowerCase().includes(normQuery) ||
      item.type.toLowerCase().includes(normQuery) ||
      (item.language && item.language.toLowerCase().includes(normQuery))
    );
  });

  // If matches are fewer than 10, expand to all
  if (matches.length < 10) {
    matches = [...matches, ...ALL_TEMPLATES.filter(x => !matches.includes(x))];
  }

  const results: ImporterTemplate[] = [];
  const suffix = platform === "movie-box" ? "mb" : "dj";

  // Generate unique objects until we reach the target limit (up to 200)
  for (let i = 0; i < limit; i++) {
    const template = matches[i % matches.length];
    const multiplier = Math.floor(i / matches.length);
    
    let itemTitle = template.title;
    let itemViews = template.views;
    let itemLikes = template.likes;
    let itemYear = template.year;

    if (multiplier > 0) {
      itemTitle = `${template.title} (Part ${multiplier + 1})`;
      itemViews = Math.floor(template.views * (0.8 / multiplier));
      itemLikes = Math.floor(template.likes * (0.85 / multiplier));
      itemYear = Math.max(2010, template.year - (multiplier % 5));
    }

    // Infer language and country if not specified
    let itemCountry = template.country;
    let itemLanguage = template.language;

    if (!itemLanguage) {
      if (itemCountry === "Bangladesh") {
        itemLanguage = "Bangla";
      } else if (itemCountry === "Pakistan") {
        itemLanguage = "Urdu";
      } else if (itemCountry === "India") {
        itemLanguage = "Hindi";
      } else {
        itemLanguage = "English";
      }
    }

    results.push({
      id: `${suffix}-${template.type.toLowerCase()}-${i + 1}-${Math.floor(Math.random() * 9000 + 1000)}`,
      title: itemTitle,
      description: template.description,
      thumbnail: template.thumbnail,
      category: template.category,
      year: itemYear,
      duration: template.duration,
      rating: template.rating,
      views: itemViews,
      likes: itemLikes,
      country: itemCountry,
      type: template.type,
      language: itemLanguage
    });
  }

  return results;
}
