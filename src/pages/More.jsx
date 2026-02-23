import { useState, useEffect } from 'react';
import { Circle, RotateCcw, Calculator, FileText, FileCheck, Star, MoonStar, LayoutGrid, RefreshCw } from 'lucide-react';
import { toBn } from '../utils/helpers';
import { PHRASES, HADITH_SEEDS, HADITH_COLLECTIONS } from '../utils/constants';

/* ── Tasbih Counter ─────────────────────────────────────── */
function Tasbih() {
  const [count, setCount] = useState(0);
  const [phraseIdx, setPhraseIdx] = useState(0);

  const tap = () => setCount((c) => c + 1);
  const reset = () => { setCount(0); };
  const mod = count % 33;

  return (
    <div className="hub-card">
      <div className="card-lbl"><Circle size={14} /> তাসবিহ কাউন্টার</div>
      <div className="phrase-btns">
        {PHRASES.map((p, i) => (
          <button key={i} className={`phrase-btn${phraseIdx === i ? ' ap' : ''}`} onClick={() => { setPhraseIdx(i); setCount(0); }}>{p.bn}</button>
        ))}
      </div>
      <button className="tasbih-btn" onClick={tap}>
        <span>{toBn(count)}</span>
        <span className="t-sub">চাপুন</span>
      </button>
      <div className="tasbih-ar">{PHRASES[phraseIdx].ar}</div>
      <div className="prog-bar" style={{ marginTop: '.5rem' }}>
        <div className="prog-fill" style={{ width: `${(mod / 33) * 100}%` }} />
      </div>
      <div style={{ fontSize: '.62rem', color: 'var(--muted2)', textAlign: 'center', marginTop: '.12rem', fontFamily: 'var(--bn)' }}>
        {toBn(mod)}/৩৩ &nbsp;·&nbsp; মোট: {toBn(count)}
      </div>
      <div style={{ textAlign: 'center', marginTop: '.4rem' }}>
        <button className="ref-btn" onClick={reset}><RotateCcw size={12} /> রিসেট</button>
      </div>
    </div>
  );
}

/* ── Zakat Calculator ───────────────────────────────────── */
function ZakatCalc() {
  const [asset, setAsset] = useState('');
  const [debt, setDebt] = useState('');

  const net = Math.max(0, (parseFloat(asset) || 0) - (parseFloat(debt) || 0));
  const zakat = net >= 680000 ? (net * 0.025).toFixed(2) : null;

  return (
    <div className="hub-card">
      <div className="card-lbl"><Calculator size={14} /> যাকাত ক্যালকুলেটর</div>
      <div style={{ fontSize: '.72rem', color: 'var(--muted)', marginBottom: '.65rem', lineHeight: 1.65, fontFamily: 'var(--bn)' }}>
        নিসাব: ৮৫ গ্রাম সোনা বা ৫৯৫ গ্রাম রূপার সমতুল্য সম্পদ থাকলে যাকাত ফরজ। বর্তমান নিসাব আনুমানিক ৬,৮০,০০০ টাকা।
      </div>
      <label style={{ fontSize: '.7rem', color: 'var(--muted)', display: 'block', marginBottom: '.2rem', fontFamily: 'var(--bn)' }}>মোট সম্পদ (টাকায়)</label>
      <input className="zakat-input" type="number" placeholder="যেমন: 1000000" value={asset} onChange={(e) => setAsset(e.target.value)} />
      <label style={{ fontSize: '.7rem', color: 'var(--muted)', display: 'block', marginBottom: '.2rem', fontFamily: 'var(--bn)' }}>মোট ঋণ বা দায় (টাকায়)</label>
      <input className="zakat-input" type="number" placeholder="যেমন: 200000" value={debt} onChange={(e) => setDebt(e.target.value)} />
      {(asset || debt) && (
        <div style={{ background: 'rgba(30,77,58,.06)', border: '1px solid rgba(30,77,58,.18)', borderRadius: 'var(--r-sm)', padding: '.75rem', textAlign: 'center', marginTop: '.4rem' }}>
          <div style={{ fontSize: '.6rem', color: 'var(--muted2)', marginBottom: '.2rem', fontFamily: 'var(--bn)' }}>আপনার প্রদেয় যাকাত</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--green)', fontFamily: 'var(--bn)' }}>
            {zakat ? `${parseFloat(zakat).toLocaleString('bn-BD')} টাকা` : (net > 0 ? 'যাকাত ফরজ নয়' : 'পরিমাণ লিখুন')}
          </div>
          {zakat && <div style={{ fontSize: '.58rem', color: 'var(--muted2)', marginTop: '.15rem', fontFamily: 'var(--bn)' }}>নিট সম্পদের ২.৫%</div>}
        </div>
      )}
    </div>
  );
}

/* ── Daily Hadith ───────────────────────────────────────── */
function DailyHadith() {
  const [hadiths, setHadiths] = useState([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    Promise.all(
      HADITH_SEEDS.map(async (seed) => {
        try {
          const col = HADITH_COLLECTIONS[seed.col];
          const r = await fetch(`hadithbangla/${col.folder}/hadith/${seed.id}.json`);
          if (!r.ok) return null;
          const data = await r.json();
          const h = data.hadith || data;
          return h.bn && h.bn.length > 20 ? { t: h.bn, s: `${col.name} • হাদিস ${toBn(h.hadith_id)}`, ar: h.ar || '' } : null;
        } catch { return null; }
      })
    ).then((results) => setHadiths(results.filter(Boolean)));
  }, []);

  if (!hadiths.length) return (
    <div className="hub-card">
      <div className="card-lbl"><FileText size={14} /> আজকের হাদিস</div>
      <div className="loader" />
    </div>
  );

  const h = hadiths[idx % hadiths.length];
  return (
    <div className="hub-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.6rem' }}>
        <div className="card-lbl" style={{ margin: 0 }}><FileText size={14} /> আজকের হাদিস</div>
        <button className="ref-btn" onClick={() => setIdx((i) => i + 1)}><RefreshCw size={12} /> পরবর্তী</button>
      </div>
      <div className="fade-in" key={idx}>
        {h.ar && <div style={{ fontFamily: "'Amiri',serif", fontSize: '1rem', textAlign: 'right', direction: 'rtl', color: 'var(--green)', lineHeight: 1.9, marginBottom: '.5rem', padding: '.6rem', background: 'var(--parchment)', borderRadius: 'var(--r-sm)', borderLeft: '3px solid var(--green3)' }}>{h.ar}</div>}
        <div style={{ fontSize: '.82rem', color: 'var(--ink)', lineHeight: 1.85, marginBottom: '.4rem', fontFamily: 'var(--bn)' }}>"{h.t}"</div>
        <span className="badge-a"><FileCheck size={11} /> {h.s}</span>
      </div>
    </div>
  );
}

/* ── 99 Names ───────────────────────────────────────────── */
const BN_MAP = { 'Ar-Rahman':'পরম দয়ালু','Ar-Rahim':'অতি করুণাময়','Al-Malik':'সর্বোচ্চ অধিপতি','Al-Quddus':'পবিত্রতম','As-Salam':'শান্তিদাতা',"Al-Mu'min":'বিশ্বাসদাতা','Al-Muhaymin':'রক্ষক','Al-Aziz':'পরাক্রমশালী','Al-Jabbar':'মহাপ্রতাপশালী','Al-Mutakabbir':'মহামহিম','Al-Khaliq':'স্রষ্টা',"Al-Bari'":'উদ্ভাবক','Al-Musawwir':'রূপদানকারী','Al-Ghaffar':'ক্ষমাশীল','Ar-Razzaq':'রিজিকদাতা','Al-Fattah':'মুক্তিদাতা',"Al-'Alim":'সর্বজ্ঞ','Al-Qabid':'সংকুচিতকারী','Al-Basit':'প্রসারিতকারী',"Ar-Rafi'":'উন্নয়নকারী',"Al-Mu'izz":'সম্মানদাতা','Al-Mudhill':'অপমানকারী',"As-Sami'":'সর্বশ্রোতা','Al-Basir':'সর্বদ্রষ্টা','Al-Hakam':'বিচারক',"Al-'Adl":'ন্যায়বিচারক','Al-Latif':'সূক্ষ্মদর্শী','Al-Khabir':'সর্বজ্ঞাত','Al-Halim':'সহিষ্ণু',"Al-'Azim":'মহান','Al-Ghafur':'ক্ষমাকারী','Ash-Shakur':'কৃতজ্ঞতা গ্রাহক',"Al-'Ali":'সর্বোচ্চ','Al-Kabir':'সর্ববৃহৎ','Al-Hafiz':'রক্ষণাবেক্ষণকারী','Al-Muqit':'শক্তিদাতা','Al-Hasib':'হিসাবকারী','Al-Jalil':'মহিমান্বিত','Al-Karim':'উদার','Ar-Raqib':'তত্ত্বাবধায়ক','Al-Mujib':'সাড়াদাতা',"Al-Wasi'":'সর্বব্যাপক','Al-Hakim':'প্রজ্ঞাময়','Al-Wadud':'প্রেমময়','Al-Majid':'গৌরবান্বিত',"Al-Ba'ith":'পুনরুত্থানকারী','Ash-Shahid':'সাক্ষী','Al-Haqq':'সত্য','Al-Wakil':'কর্মবিধায়ক','Al-Qawiyy':'শক্তিমান','Al-Matin':'দৃঢ়','Al-Waliyy':'অভিভাবক','Al-Hamid':'প্রশংসিত','Al-Muhsi':'গণনাকারী',"Al-Mubdi'":'আরম্ভকারী',"Al-Mu'id":'পুনরাবর্তনকারী','Al-Muhyi':'জীবনদাতা','Al-Mumit':'মৃত্যুদাতা','Al-Hayy':'চিরঞ্জীব','Al-Qayyum':'স্বয়ংসম্পূর্ণ','Al-Wajid':'আবিষ্কারক','Al-Wahid':'একক','Al-Ahad':'অদ্বিতীয়','As-Samad':'অমুখাপেক্ষী','Al-Qadir':'সর্বশক্তিমান','Al-Muqtadir':'ক্ষমতাবান','Al-Muqaddim':'অগ্রগামী',"Al-Mu'akhkhir":'বিলম্বকারী',"Al-'Awwal":'প্রথম',"Al-'Akhir":'শেষ','Az-Zahir':'প্রকাশ্য','Al-Batin':'গোপন','Al-Wali':'শাসক',"Al-Muta'ali":'সর্বোচ্চ','Al-Barr':'পরম কল্যাণকর','At-Tawwab':'তওবা কবুলকারী','Al-Muntaqim':'প্রতিশোধ গ্রহণকারী',"Al-'Afuww":'ক্ষমাশীল',"Ar-Ra'uf":'স্নেহশীল','Malik-ul-Mulk':'রাজত্বের মালিক','Dhul-Jalal-wal-Ikram':'মহিমা ও সম্মানের মালিক','Al-Muqsit':'ন্যায়পরায়ণ',"Al-Jami'":'একত্রকারী','Al-Ghani':'অমুখাপেক্ষী','Al-Mughni':'সম্পদদাতা',"Al-Mani'":'নিবারণকারী','Ad-Darr':'ক্ষতিকারক',"An-Nafi'":'উপকারী','An-Nur':'আলো','Al-Hadi':'পথপ্রদর্শক',"Al-Badi'":'উদ্ভাবক','Al-Baqi':'চিরস্থায়ী','Al-Warith':'উত্তরাধিকারী','Ar-Rashid':'সুপথ প্রদর্শক','As-Sabur':'পরম ধৈর্যশীল' };

function Names99() {
  const [names, setNames] = useState([]);

  useEffect(() => {
    fetch('https://api.aladhan.com/v1/asmaAlHusna')
      .then((r) => r.json())
      .then((j) => setNames(j.data.map((n) => ({ ar: n.name, tr: n.transliteration, bn: BN_MAP[n.transliteration] || n.transliteration }))))
      .catch(() => setNames([
        { ar: 'الرَّحْمَنُ', tr: 'Ar-Rahman', bn: 'পরম দয়ালু' },
        { ar: 'الرَّحِيمُ', tr: 'Ar-Rahim', bn: 'অতি করুণাময়' },
        { ar: 'الْمَلِكُ', tr: 'Al-Malik', bn: 'সর্বোচ্চ অধিপতি' },
        { ar: 'الْقُدُّوسُ', tr: 'Al-Quddus', bn: 'পবিত্রতম' },
        { ar: 'السَّلاَمُ', tr: 'As-Salam', bn: 'শান্তিদাতা' },
      ]));
  }, []);

  if (!names.length) return <div className="hub-card"><div className="card-lbl"><Star size={14} /> আল্লাহর ৯৯টি নাম</div><div className="loader" /></div>;
  return (
    <div className="hub-card">
      <div className="card-lbl"><Star size={14} /> আল্লাহর ৯৯টি নাম</div>
      <div className="name-grid">
        {names.map((n) => (
          <div key={n.tr} className="name-card">
            <div className="name-ar">{n.ar}</div>
            <div className="name-tr">{n.tr}</div>
            <div className="name-bn">{n.bn}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Islamic Months ─────────────────────────────────────── */
const MONTHS = [
  { n: 'মুহাররম',       ar: 'مُحَرَّم',             info: 'পবিত্র মাস, আশুরা এই মাসে' },
  { n: 'সফর',           ar: 'صَفَر',                info: 'দ্বিতীয় হিজরি মাস' },
  { n: 'রবিউল আউয়াল',  ar: 'رَبِيع الأَوَّل',        info: 'নবীজি ﷺ এর জন্ম ও ওফাতের মাস' },
  { n: 'রবিউস সানি',    ar: 'رَبِيع الثَّانِي',       info: 'চতুর্থ হিজরি মাস' },
  { n: 'জুমাদাল উলা',   ar: 'جُمَادَى الأُولَى',     info: 'পঞ্চম হিজরি মাস' },
  { n: 'জুমাদাল আখিরা', ar: 'جُمَادَى الآخِرَة',     info: 'ষষ্ঠ হিজরি মাস' },
  { n: 'রজব',           ar: 'رَجَب',                info: 'পবিত্র মাস, মিরাজ এই মাসে' },
  { n: 'শাবান',         ar: 'شَعْبَان',              info: 'শবে বরাত এই মাসে' },
  { n: 'রমজান',         ar: 'رَمَضَان',              info: 'কুরআন নাযিলের মাস ✨' },
  { n: 'শাওয়াল',       ar: 'شَوَّال',               info: 'ঈদুল ফিতর এই মাসে' },
  { n: 'জিলকদ',         ar: 'ذُو القَعْدَة',          info: 'পবিত্র মাস, হজের প্রস্তুতি' },
  { n: 'জিলহজ',         ar: 'ذُو الحِجَّة',           info: 'হজ ও ঈদুল আযহার মাস' },
];

function IslamicMonths() {
  return (
    <div className="hub-card">
      <div className="card-lbl"><MoonStar size={14} /> ইসলামিক মাসের নাম</div>
      {MONTHS.map((m, i) => (
        <div key={m.n} style={{ display: 'flex', alignItems: 'center', gap: '.55rem', padding: '.4rem 0', borderBottom: i < MONTHS.length - 1 ? '1px solid var(--border2)' : 'none' }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--parchment2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.58rem', color: 'var(--green)', flexShrink: 0, fontFamily: 'var(--bn)' }}>{toBn(i + 1)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--bn)' }}>{m.n}</div>
            <div style={{ fontSize: '.62rem', color: 'var(--muted2)', fontFamily: 'var(--bn)' }}>{m.info}</div>
          </div>
          <div style={{ fontFamily: "'Amiri',serif", fontSize: '.95rem', color: 'var(--green)', opacity: .65 }}>{m.ar}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Main More page ─────────────────────────────────────── */
export default function More() {
  return (
    <div className="page active">
      <div className="section-title"><LayoutGrid size={18} /> আরও ফিচার</div>
      <Tasbih />
      <ZakatCalc />
      <DailyHadith />
      <Names99 />
      <IslamicMonths />
    </div>
  );
}
