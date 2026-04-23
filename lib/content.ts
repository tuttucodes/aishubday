export const HER = {
  fullName: "Krishnaa Nair",
  firstName: "Krishnaa",
  nicknames: ["Aishu", "Chungi"],
  bday: "2026-04-24",
  bdayLabel: "April 24, 2026",
  turningAge: 21,
  together: "2025-06-15",
  togetherLabel: "June 15, 2025",
};

// Manual paywall switch. Keep true until site is ready to reveal
// to Krishnaa. When true, countdown stays locked even if the
// target date has already passed. Flip to false (or delete) when
// you want the site to open organically / at midnight.
export const MANUAL_LOCK = true;

export type Song = {
  title: string;
  artist: string;
  /** YouTube video id — if set, inline embed plays on tap. */
  youtubeId?: string;
  /** Fallback external YouTube URL. */
  youtube: string;
  spotify?: string;
  note?: string;
};

export const SONGS: Song[] = [
  {
    title: "Panchasara Umma",
    artist: "Ennum Eppozhum · malayalam",
    youtubeId: "gq_DsGIcDds",
    youtube: "https://www.youtube.com/watch?v=gq_DsGIcDds",
    spotify: "https://open.spotify.com/search/Panchasara%20Umma",
    note: "slow one. plays when u smile at nothing.",
  },
  {
    title: "Enthanennu Ennodu Onnum",
    artist: "malayalam",
    youtubeId: "xS4R5hb41Ys",
    youtube: "https://www.youtube.com/watch?v=xS4R5hb41Ys",
    spotify: "https://open.spotify.com/search/Enthanennu%20Ennodu%20Onnum",
    note: "our rainy-day song.",
  },
  {
    title: "From the Start",
    artist: "Laufey",
    youtubeId: "K4IIq2tlJh0",
    youtube: "https://www.youtube.com/watch?v=K4IIq2tlJh0",
    spotify: "https://open.spotify.com/track/5Eax0qFko2dh7Rl2lYs3bx",
    note: "u hummed this in the car. i've hummed it since.",
  },
  {
    title: "Les",
    artist: "Childish Gambino",
    youtubeId: "8X6eMd7XeNo",
    youtube: "https://www.youtube.com/watch?v=8X6eMd7XeNo",
    spotify: "https://open.spotify.com/search/Les%20Childish%20Gambino",
    note: "late-night us.",
  },
];

export const MEMORIES = [
  { date: "Jun 15, 2025", title: "day one", caption: "where it began." },
  { date: "the tape", title: "Dakshinchitra", caption: "still worried our tape leaks lol." },
  { date: "Chikmagalur", title: "those stairs", caption: "house stairs know things." },
];

export const REASONS = [
  "ur laugh",
  "ur smile",
  "ur eyes",
  "ur nose",
  "ur neck",
  "ur soft side",
  "u remember everything",
  "the way u stand up for me",
  "the way u believe in me",
  "u r home",
  "u choose me daily",
  "our long calls",
  "bava biriyani + eating out together",
  "spending time together",
  "movie dates",
  "unreasonably cute",
  "sexy all the time",
  "ur business mind",
  "ur passion",
  "ur drive",
  "the way u motivate me",
];

export const REASONS_CLOSER = "i love you, chungi.";

export const LETTER = `Krishnaa.

we met in the first week of college
and i didn't know yet — but the draft
of every good thing i have started there.

if u scroll far enough u'll find every
version of how i feel, scattered across
this page like small lights.

i built this because a card felt too small.
because a text felt too flat.
because today is ur day and i wanted
the whole internet quiet for u.

21 looks good on u.
so does every laugh, every long call,
every silly drive in cherthala,
every dance, every scooty sunday.

happy birthday, chungi.
urs, always.`;
