import { Sunrise, SunMedium, Sun, CloudSun, Sunset, Moon } from 'lucide-react';

export const BD_CITIES = {
  Dhaka:        { lat: 23.8103, lng: 90.4125 },
  Chittagong:   { lat: 22.3569, lng: 91.7832 },
  Sylhet:       { lat: 24.8949, lng: 91.8687 },
  Rajshahi:     { lat: 24.3745, lng: 88.6042 },
  Khulna:       { lat: 22.8456, lng: 89.5403 },
  Barisal:      { lat: 22.7010, lng: 90.3535 },
  Rangpur:      { lat: 25.7439, lng: 89.2752 },
  Mymensingh:   { lat: 24.7471, lng: 90.4203 },
  Comilla:      { lat: 23.4607, lng: 91.1809 },
  "Cox's Bazar":{ lat: 21.4272, lng: 92.0058 },
};

export const HADITH_COLLECTIONS = {
  bukhari:   { name: 'সহীহ বুখারী',  hadiths: 7540, chapters: 97, folder: 'Bukhari',    color: '#1e4d3a' },
  muslim:    { name: 'সহীহ মুসলিম',  hadiths: 7448, chapters: 56, folder: 'Muslim',     color: '#2a6b52' },
  abudaud:   { name: 'আবু দাউদ',      hadiths: 5273, chapters: 43, folder: 'AbuDaud',    color: '#b5451b' },
  tirmizi:   { name: 'তিরমিযী',       hadiths: 3940, chapters: 46, folder: 'At-tirmizi', color: '#c8860a' },
  nasai:     { name: 'নাসাঈ',         hadiths: 5757, chapters: 50, folder: 'Al-Nasai',   color: '#6b3a7a' },
  ibnemajah: { name: 'ই্বনে মাজাহ',  hadiths: 4340, chapters: 38, folder: 'Ibne-Mazah', color: '#8c5a1a' },
};

// Ramadan start dates by region (based on moon sighting)
export const RAMADAN_START_DATES = {
  BD: new Date('2026-02-19T00:00:00'), // Bangladesh
  SA: new Date('2026-02-18T00:00:00'), // Saudi Arabia
  default: new Date('2026-02-19T00:00:00'), // Default to Bangladesh
};

export const RAMADAN_START = RAMADAN_START_DATES.BD;

// Prayer calculation methods
export const CALCULATION_METHODS = {
  karachi: { 
    name: 'ইউনিভার্সিটি অফ ইসলামিক সায়েন্স, করাচি',
    nameEn: 'University of Islamic Sciences, Karachi',
    fajr: 18, 
    isha: 18,
    apiCode: '1'
  },
  mwl: { 
    name: 'মুসলিম বিশ্ব লীগ',
    nameEn: 'Muslim World League',
    fajr: 18, 
    isha: 17,
    apiCode: '3'
  },
  egypt: { 
    name: 'ইজিপ্সিয়ান জেনেরাল অথরিটি',
    nameEn: 'Egyptian General Authority of Survey',
    fajr: 19.5, 
    isha: 17.5,
    apiCode: '5'
  },
  isna: { 
    name: 'উত্তর আমেরিকার ইসলামী সোসাইটি',
    nameEn: 'Islamic Society of North America',
    fajr: 15, 
    isha: 15,
    apiCode: '2'
  },
  makkah: { 
    name: 'উম্ম আল-কুরা, মক্কা',
    nameEn: 'Umm Al-Qura, Makkah',
    fajr: 18.5, 
    isha: 90, // special: 90 min after Maghrib
    apiCode: '4'
  },
};

// Asr calculation methods
export const ASR_METHODS = {
  standard: { name: 'মানক (শাফেঈ)', nameEn: 'Standard (Shafi)', factor: 1, apiCode: 0, apiCode: 0 },
  hanafi: { name: 'হানাফী', nameEn: 'Hanafi', factor: 2, apiCode: 1 },
};

export const PRAYER_LIST = [
  { k: 'fajr',    bn: 'ফজর',    Ic: Sunrise },
  { k: 'sunrise', bn: 'সূর্যোদয়', Ic: SunMedium },
  { k: 'dhuhr',   bn: 'যোহর',    Ic: Sun },
  { k: 'asr',     bn: 'আসর',    Ic: CloudSun },
  { k: 'maghrib', bn: 'মাগরিব',  Ic: Sunset },
  { k: 'isha',    bn: 'এশা',    Ic: Moon },
];

export const PHRASES = [
  { bn: 'সুবহানাল্লাহ',      ar: 'سُبْحَانَ اللَّهِ' },
  { bn: 'আলহামদুলিল্লাহ',   ar: 'الْحَمْدُ لِلَّهِ' },
  { bn: 'আল্লাহু আকবার',     ar: 'اللَّهُ أَكْبَرُ' },
  { bn: 'লা ইলাহা ইল্লাল্লাহ', ar: 'لَا إِلَٰهَ إِلَّا اللَّهُ' },
];

export const DUAS = [
  { ar: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي', trans: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni", bn: 'হে আল্লাহ! তুমি ক্ষমাশীল, তুমি ক্ষমা পছন্দ করো, আমাকে ক্ষমা করে দাও।', occ: 'লাইলাতুল কদরের সেরা দোয়া' },
  { ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', trans: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan waqina 'adhaban-nar", bn: 'হে আমাদের রব! দুনিয়ায় ও আখেরাতে কল্যাণ দাও এবং জাহান্নামের শাস্তি থেকে রক্ষা করো।', occ: 'সূরা বাকারা ২:২০১' },
  { ar: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ', trans: "Rabbi ighfir li wa tub 'alayya innaka antat-tawwabur-rahim", bn: 'হে আমার রব! আমাকে ক্ষমা করুন এবং তওবা কবুল করুন।', occ: 'বুখারি — তওবার দোয়া' },
  { ar: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ', trans: "Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatik", bn: 'হে আল্লাহ! আমাকে তোমার জিকির, শোকর এবং সুন্দর ইবাদতে সাহায্য করো।', occ: 'আবু দাউদ' },
  { ar: 'رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ', trans: "Rabbana taqabbal minna innaka antas-sami'ul-'alim", bn: 'হে আমাদের রব! আমাদের থেকে কবুল করুন, নিশ্চয়ই আপনি সর্বশ্রোতা, সর্বজ্ঞ।', occ: 'সূরা বাকারা ২:১২৭' },
];

export const RAMADAN_VERSE_REFS = [2, 183, 2, 186, 2, 185, 2, 153, 97, 1, 65, 2];

export const HADITH_SEEDS = [
  { col: 'bukhari',  id: 1    },
  { col: 'bukhari',  id: 8    },
  { col: 'bukhari',  id: 1891 },
  { col: 'muslim',   id: 760  },
  { col: 'muslim',   id: 2699 },
  { col: 'abudaud',  id: 2342 },
  { col: 'tirmizi',  id: 682  },
  { col: 'nasai',    id: 2206 },
];
