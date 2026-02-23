import { useState, useEffect, useCallback } from 'react';
import { Heart, ShieldCheck, Sparkles, BarChart3, BookOpen, RefreshCw, Bookmark, HeartHandshake, Star, CalendarDays, Hourglass, Globe, ExternalLink, Moon, Sunset } from 'lucide-react';
import { toBn, fmt12 } from '../utils/helpers';
import { getPrayerTimes } from '../utils/prayerTimes';
import { RAMADAN_START, RAMADAN_VERSE_REFS, DUAS, BD_CITIES, CALCULATION_METHODS, ASR_METHODS } from '../utils/constants';

/* ── Countdown hook ─────────────────────────────────────── */
function useCountdown(target) {
  const [diff, setDiff] = useState(target ? target - Date.now() : 0);
  useEffect(() => {
    if (!target) return;
    const id = setInterval(() => setDiff(target - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  return Math.max(0, diff);
}

/* ── Day/Night Tracker ──────────────────────────────────── */
function DayNightTracker({ prayerTimes }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!prayerTimes) return null;

  const now = currentTime.getHours() * 60 + currentTime.getMinutes();
  const sunrise = prayerTimes.sunrise[0] * 60 + prayerTimes.sunrise[1];
  const sunset = prayerTimes.maghrib[0] * 60 + prayerTimes.maghrib[1];
  
  const isDaytime = now >= sunrise && now <= sunset;
  const timeStr = fmt12(currentTime.getHours(), currentTime.getMinutes());
  
  // Determine current prayer period
  let currentPrayer = '';
  let nextPrayerName = '';
  let nextPrayerTime = '';
  
  if (now < sunrise) {
    currentPrayer = 'ইশা';
    nextPrayerName = 'ফজর';
    nextPrayerTime = fmt12(prayerTimes.fajr[0], prayerTimes.fajr[1]);
  } else if (now < prayerTimes.fajr[0] * 60 + prayerTimes.fajr[1]) {
    currentPrayer = 'ফজর';
    nextPrayerName = 'যোহর';
    nextPrayerTime = fmt12(prayerTimes.dhuhr[0], prayerTimes.dhuhr[1]);
  } else if (now < prayerTimes.dhuhr[0] * 60 + prayerTimes.dhuhr[1]) {
    currentPrayer = 'ফজর';
    nextPrayerName = 'যোহর';
    nextPrayerTime = fmt12(prayerTimes.dhuhr[0], prayerTimes.dhuhr[1]);
  } else if (now < prayerTimes.asr[0] * 60 + prayerTimes.asr[1]) {
    currentPrayer = 'যোহর';
    nextPrayerName = 'আসর';
    nextPrayerTime = fmt12(prayerTimes.asr[0], prayerTimes.asr[1]);
  } else if (now < sunset) {
    currentPrayer = 'আসর';
    nextPrayerName = 'মাগরিব';
    nextPrayerTime = fmt12(prayerTimes.maghrib[0], prayerTimes.maghrib[1]);
  } else if (now < prayerTimes.isha[0] * 60 + prayerTimes.isha[1]) {
    currentPrayer = 'মাগরিব';
    nextPrayerName = 'এশা';
    nextPrayerTime = fmt12(prayerTimes.isha[0], prayerTimes.isha[1]);
  } else {
    currentPrayer = 'এশা';
    nextPrayerName = 'ফজর';
    nextPrayerTime = fmt12(prayerTimes.fajr[0], prayerTimes.fajr[1]);
  }

  return (
    <div className="hero" style={{ 
      position: 'relative',
      background: isDaytime 
        ? 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 100%)'
        : 'linear-gradient(to bottom, #0a1628 0%, #1e3a5f 100%)',
      overflow: 'hidden',
      animation: 'fadeIn 0.6s ease-in',
      padding: '2rem 1rem 3rem'
    }}>
      {/* Mosque silhouette */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '100px',
        background: isDaytime ? 'rgba(30, 77, 58, 0.15)' : 'rgba(0, 0, 0, 0.4)',
        clipPath: 'polygon(0% 100%, 0% 60%, 5% 55%, 8% 45%, 10% 55%, 12% 50%, 15% 40%, 18% 50%, 20% 45%, 25% 30%, 28% 25%, 30% 30%, 32% 25%, 35% 30%, 38% 35%, 40% 30%, 42% 40%, 45% 30%, 50% 20%, 55% 30%, 58% 40%, 60% 30%, 62% 35%, 65% 30%, 68% 25%, 70% 30%, 72% 25%, 75% 30%, 78% 50%, 80% 45%, 82% 50%, 85% 40%, 88% 50%, 90% 55%, 92% 45%, 95% 55%, 100% 60%, 100% 100%)'
      }} />
      
      {/* Stars (night only) */}
      {!isDaytime && (
        <>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: `${10 + Math.random() * 40}%`,
                left: `${10 + Math.random() * 80}%`,
                width: '3px',
                height: '3px',
                background: '#FFD700',
                borderRadius: '50%',
                animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 2}s`,
                boxShadow: '0 0 4px rgba(255, 215, 0, 0.8)'
              }}
            />
          ))}
        </>
      )}
      
      {/* Crescent moon (night only) */}
      {!isDaytime && (
        <div style={{
          position: 'absolute',
          top: '15%',
          right: '15%',
          fontSize: '3rem',
          animation: 'float 4s ease-in-out infinite',
          filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.6))'
        }}>
          🌙
        </div>
      )}
      
      {/* Sun (day only) */}
      {isDaytime && (
        <div style={{
          position: 'absolute',
          top: '15%',
          right: '15%',
          fontSize: '3rem',
          animation: 'spin 30s linear infinite',
          filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.8))'
        }}>
          ☀️
        </div>
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        {/* Current time - large display */}
        <div style={{ 
          fontSize: '2.8rem', 
          fontWeight: 700, 
          color: isDaytime ? '#1e4d3a' : '#ffffff',
          fontFamily: 'Georgia, serif',
          marginBottom: '.5rem',
          textShadow: isDaytime ? '0 2px 4px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.6)',
          letterSpacing: '2px'
        }}>
          {timeStr}
        </div>

        {/* Prayer info row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          maxWidth: '350px',
          margin: '0 auto',
          padding: '0.8rem 1rem',
          background: isDaytime 
            ? 'rgba(255, 255, 255, 0.85)' 
            : 'rgba(0, 0, 0, 0.3)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          boxShadow: isDaytime 
            ? '0 4px 12px rgba(0,0,0,0.1)' 
            : '0 4px 12px rgba(0,0,0,0.4)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '0.65rem', 
              color: isDaytime ? 'var(--muted)' : 'rgba(255,255,255,0.7)',
              fontFamily: 'var(--bn)',
              marginBottom: '.2rem'
            }}>
              {currentPrayer}
            </div>
            <div style={{ 
              fontSize: '0.85rem', 
              fontWeight: 600,
              color: isDaytime ? 'var(--green)' : 'var(--gold)',
              fontFamily: 'var(--bn)'
            }}>
              চলমান
            </div>
          </div>
          
          <div style={{
            width: '1px',
            height: '30px',
            background: isDaytime ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)'
          }} />
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '0.65rem', 
              color: isDaytime ? 'var(--muted)' : 'rgba(255,255,255,0.7)',
              fontFamily: 'var(--bn)',
              marginBottom: '.2rem'
            }}>
              {nextPrayerName}
            </div>
            <div style={{ 
              fontSize: '0.85rem', 
              fontWeight: 600,
              color: isDaytime ? 'var(--terra)' : 'var(--gold)',
              fontFamily: 'Georgia, serif'
            }}>
              {nextPrayerTime}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Ramadan Progress ───────────────────────────────────── */
function RamadanProgress() {
  const today = new Date();
  const total = 30;
  const day = Math.max(1, Math.min(total, Math.floor((today - RAMADAN_START) / 86400000) + 1));
  const pct = Math.round((day / total) * 100);
  const left = total - day;

  const thirds = [
    { n: 'রহমত', s: 'দয়া', d: '১-১০ দিন', Icon: Heart,      c: 'var(--green2)',  t: 'আল্লাহর অসীম দয়া বর্ষিত হয়' },
    { n: 'মাগফেরাত', s: 'ক্ষমা', d: '১১-২০ দিন', Icon: ShieldCheck, c: 'var(--saffron)',  t: 'তওবা ও ক্ষমা প্রার্থনার সময়' },
    { n: 'নাজাত', s: 'মুক্তি', d: '২১-ৣ০ দিন', Icon: Sparkles,   c: 'var(--terra)',   t: 'জাহান্নাম থেকে মুক্তি' },
  ];

  return (
    <div className="hub-card">
      <div className="card-lbl"><BarChart3 size={14} /> রমজান অগ্রগতি ১৪৪৭</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.3rem', fontSize: '.7rem', fontFamily: 'var(--bn)' }}>
        <span style={{ color: 'var(--green)', fontWeight: 600 }}>{toBn(day)}/{toBn(total)} দিন</span>
        <span style={{ color: 'var(--muted2)' }}>{toBn(left)} দিন বাকি</span>
      </div>
      <div className="prog-bar" style={{ height: '7px', marginBottom: '.75rem' }}>
        <div className="prog-fill" style={{ width: `${pct}%`, height: '100%' }} />
      </div>
      <div className="thirds">
        {thirds.map((t) => (
          <div key={t.n} className="third-box">
            <div style={{ color: t.c, marginBottom: '.15rem' }}><t.Icon size={16} /></div>
            <div style={{ fontSize: '.7rem', fontWeight: 600, color: t.c, fontFamily: 'var(--bn)' }}>
              {t.n} <small style={{ color: 'var(--muted2)', fontWeight: 400 }}>({t.s})</small>
            </div>
            <div style={{ fontSize: '.6rem', color: 'var(--muted2)', fontFamily: 'var(--bn)' }}>{t.d}</div>
            <div style={{ fontSize: '.6rem', color: 'var(--muted2)', marginTop: '.1rem', lineHeight: 1.4, fontFamily: 'var(--bn)' }}>{t.t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Verse card ─────────────────────────────────────────── */
function VerseCard() {
  const [allVerses, setAllVerses] = useState([]);
  const [currentVerse, setCurrentVerse] = useState(null);

  useEffect(() => {
    fetch('quran/quran.json')
      .then((r) => r.json())
      .then((data) => {
        // Collect all verses from all surahs
        const verses = [];
        data.forEach((surah) => {
          surah.verses.forEach((verse, index) => {
            verses.push({
              ar: verse.text,
              bn: verse.translation,
              ref: `সূরা ${surah.transliteration} ${toBn(surah.id)}:${toBn(index + 1)}`
            });
          });
        });
        setAllVerses(verses);
        // Show random verse on initial load
        if (verses.length > 0) {
          const randomIndex = Math.floor(Math.random() * verses.length);
          setCurrentVerse(verses[randomIndex]);
        }
      })
      .catch(() => {});
  }, []);

  const showRandomVerse = () => {
    if (allVerses.length > 0) {
      const randomIndex = Math.floor(Math.random() * allVerses.length);
      setCurrentVerse(allVerses[randomIndex]);
    }
  };

  if (!currentVerse) return <div className="hub-card"><div className="card-lbl"><BookOpen size={14} /> আজকের আয়াত</div><div className="loader" /></div>;

  return (
    <div className="hub-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.6rem' }}>
        <div className="card-lbl" style={{ margin: 0 }}><BookOpen size={14} /> আজকের আয়াত</div>
        <button className="ref-btn" onClick={showRandomVerse}><RefreshCw size={12} /> পরবর্তী</button>
      </div>
      <div className="fade-in" key={currentVerse.ref}>
        <div className="verse-ar">{currentVerse.ar}</div>
        <div className="verse-bn">{currentVerse.bn}</div>
        <div className="verse-ref"><Bookmark size={12} /> {currentVerse.ref}</div>
      </div>
    </div>
  );
}

/* ── Dua card ───────────────────────────────────────────── */
function DuaCard() {
  const [currentDua, setCurrentDua] = useState(() => {
    // Show random dua on initial load
    const randomIndex = Math.floor(Math.random() * DUAS.length);
    return DUAS[randomIndex];
  });

  const showRandomDua = () => {
    const randomIndex = Math.floor(Math.random() * DUAS.length);
    setCurrentDua(DUAS[randomIndex]);
  };

  return (
    <div className="hub-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.6rem' }}>
        <div className="card-lbl" style={{ margin: 0 }}><HeartHandshake size={14} /> আজকের দোয়া</div>
        <button className="ref-btn" onClick={showRandomDua}><RefreshCw size={12} /> পরবর্তী</button>
      </div>
      <div className="fade-in" key={currentDua.ar}>
        <div className="dua-ar">{currentDua.ar}</div>
        <div className="dua-trans">{currentDua.trans}</div>
        <div className="dua-bn">{currentDua.bn}</div>
        <div style={{ marginTop: '.4rem' }}><span className="badge-g"><Star size={11} fill="currentColor" /> {currentDua.occ}</span></div>
      </div>
    </div>
  );
}

/* ── Main Home page ─────────────────────────────────────── */
export default function Home({ city, coords, calcMethod, asrMethod }) {
  const [hijri, setHijri] = useState(null);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [nextPrayer, setNextPrayer] = useState({ label: 'লোড হচ্ছে…', target: null });

  /* Fetch hijri date */
  useEffect(() => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const BM = { Muharram: 'মুহাররম', Safar: 'সফর', "Rabi' I": 'রবিউল আউয়াল', "Rabi' II": 'রবিউস সানি', "Jumada I": 'জুমাদাল উলা', "Jumada II": 'জুমাদাল আখিরা', Rajab: 'রজব', "Sha'ban": 'শাবান', Ramadan: 'রমজান', Shawwal: 'শাওয়াল', "Dhu al-Qi'dah": 'জিলকদ', "Dhu al-Hijjah": 'জিলহজ' };
    fetch(`https://api.aladhan.com/v1/gToH/${dd}-${mm}-${d.getFullYear()}`)
      .then((r) => r.json())
      .then((j) => {
        const h = j.data.hijri;
        setHijri({ day: h.day, month: BM[h.month.en] || h.month.en, year: h.year, monthAr: h.month.ar, greg: d.toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) });
      })
      .catch(() => setHijri({ day: '১', month: 'রমজান', year: '১৪৪৭', monthAr: 'رَمَضَان', greg: '' }));
  }, []);

  /* Calculate prayer times */
  useEffect(() => {
    if (!city) return;
    const cityCoords = coords || BD_CITIES[city] || BD_CITIES['Dhaka'];
    const method = CALCULATION_METHODS[calcMethod];
    const asrCode = ASR_METHODS[asrMethod].apiCode;
    
    getPrayerTimes(new Date(), cityCoords.lat, cityCoords.lng, method.apiCode, asrCode).then(times => {
      setPrayerTimes(times);

    const PRAYERS = [
      { k: 'fajr', bn: 'ফজর' }, { k: 'dhuhr', bn: 'যোহর' },
      { k: 'asr', bn: 'আসর' }, { k: 'maghrib', bn: 'মাগরিব' }, { k: 'isha', bn: 'এশা' },
    ];
    const now = new Date();
    let found = null;
    for (const p of PRAYERS) {
      const [hh, mm] = times[p.k];
      const pd = new Date(); pd.setHours(hh, mm, 0, 0);
      if (pd > now) { found = { label: 'পরবর্তী: ' + p.bn, target: pd.getTime() }; break; }
    }
      if (!found) {
        const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
        getPrayerTimes(tomorrow, cityCoords.lat, cityCoords.lng, method.apiCode, asrCode).then(tt => {
          const fajrT = new Date(tomorrow); fajrT.setHours(tt.fajr[0], tt.fajr[1], 0, 0);
          found = { label: 'পরবর্তী: ফজর (আগামীকাল)', target: fajrT.getTime() };
          setNextPrayer(found);
        });
      } else {
        setNextPrayer(found);
      }
    });
  }, [city, coords, calcMethod, asrMethod]);

  const diff = useCountdown(nextPrayer.target);
  const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
  const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
  const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');

  const sehriTime  = prayerTimes ? fmt12(prayerTimes.fajr[0], prayerTimes.fajr[1]) : '--:--';
  const iftarTime  = prayerTimes ? fmt12(prayerTimes.maghrib[0], prayerTimes.maghrib[1]) : '--:--';

  return (
    <div className="page active">
      {/* Day/Night Tracker */}
      <DayNightTracker prayerTimes={prayerTimes} />

      {/* Date + Countdown */}
      <div className="date-cd-row" style={{ textAlign: 'center' }}>
        <div className="hub-card green-accent" style={{ marginBottom: 0 }}>
          <div className="card-lbl"><CalendarDays size={14} /> ইসলামিক তারিখ</div>
          {hijri ? (
            <div className="fade-in">
              <div className="hijri-day">{toBn(hijri.day)}</div>
              <div className="hijri-month">{hijri.month} {toBn(hijri.year)} হিজরি</div>
              <div className="hijri-ar">{hijri.monthAr}</div>
              <div className="hijri-greg">{hijri.greg}</div>
            </div>
          ) : <div className="loader" />}
        </div>
        <div className="hub-card terra-accent" style={{ marginBottom: 0 }}>
          <div className="card-lbl"><Hourglass size={14} /> পরবর্তী নামাজ</div>
          <div className="cd-wrap">
            <div className="cd-unit" style={{ minWidth: '2.5rem' }}><span className="cd-num">{toBn(h)}</span><div className="cd-lbl">ঘণ্টা</div></div>
            <div className="cd-sep">:</div>
            <div className="cd-unit" style={{ minWidth: '2.5rem' }}><span className="cd-num">{toBn(m)}</span><div className="cd-lbl">মিনিট</div></div>
            <div className="cd-sep">:</div>
            <div className="cd-unit" style={{ minWidth: '2.5rem' }}><span className="cd-num">{toBn(s)}</span><div className="cd-lbl">সেকেন্ড</div></div>
          </div>
          <div className="cd-next" style={{ fontSize: '0.72rem', fontWeight: 600, marginTop: '.3rem', minHeight: '1.5rem' }}>{nextPrayer.label}</div>
        </div>
      </div>

      {/* Sehri / Iftar */}
      <div className="si-row">
        <div className="si-box sehri">
          <span className="si-icon"><Moon size={22} color="var(--green)" strokeWidth={1.5} /></span>
          <div className="si-label">সেহরির শেষ</div>
          <div className="si-time">{sehriTime}</div>
          <div className="si-bn">ফজরের আযানের আগে</div>
        </div>
        <div className="si-box iftar">
          <span className="si-icon"><Sunset size={22} color="var(--terra)" strokeWidth={1.5} /></span>
          <div className="si-label">ইফতারের সময়</div>
          <div className="si-time">{iftarTime}</div>
          <div className="si-bn">মাগরিবের আযানে</div>
        </div>
      </div>

      <RamadanProgress />
      <VerseCard />
      <DuaCard />

      <footer>
        <div style={{ fontFamily: 'var(--ar)', fontSize: '1rem', color: 'var(--green)', opacity: .7, marginBottom: '.35rem' }}>اللَّهُمَّ بَلِّغْنَا لَيْلَةَ الْقَدْرِ</div>
        <div style={{ fontSize: '.65rem', color: 'var(--muted2)', marginBottom: '.65rem', fontFamily: 'var(--bn)' }}>হে আল্লাহ, আমাদের লাইলাতুল কদর পর্যন্ত পৌঁছে দিন</div>
        <a href="https://www.facebook.com/arafathossain000" target="_blank" rel="noopener" className="dev-link">
          <Globe size={13} style={{ color: '#4267B2' }} />
          তৈরি করেছেন <strong style={{ color: 'var(--green)' }}>Arafat Hossain Ar</strong>
          <ExternalLink size={11} />
        </a>
        <div style={{ fontSize: '.6rem', color: 'var(--muted2)', marginTop: '.45rem', fontFamily: 'var(--bn)' }}>© ২০২৬ রমজান হাব · উম্মাহর জন্য 🌙</div>
      </footer>
    </div>
  );
}
