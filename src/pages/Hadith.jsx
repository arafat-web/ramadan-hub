import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ChevronRight, CheckCircle, FileText, BookOpen, BookMarked, Copy, CopyCheck } from 'lucide-react';
import { toBn } from '../utils/helpers';
import { HADITH_COLLECTIONS } from '../utils/constants';

/* ── Copy hook ──────────────────────────────────────────── */
function useCopy() {
  const [copiedKey, setCopiedKey] = useState(null);
  const copy = useCallback((text, key) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  }, []);
  return { copiedKey, copy };
}

/* ── View states ────────────────────────────────────────── */
const VIEW = { BOOKS: 'books', CHAPTERS: 'chapters', HADITHS: 'hadiths', SURAHS: 'surahs', VERSES: 'verses' };

/* ── Back button ────────────────────────────────────────── */
function BackBtn({ label, onClick }) {
  return (
    <button onClick={onClick} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: '20px', padding: '.3rem .75rem', fontSize: '.7rem', cursor: 'pointer', marginBottom: '.75rem', fontFamily: 'var(--bn)', display: 'inline-flex', alignItems: 'center', gap: '.3rem' }}>
      <ArrowLeft size={14} /> {label}
    </button>
  );
}

/* ── Books list ─────────────────────────────────────────── */
function BooksList({ onSelectCollection, onSelectQuran }) {
  return (
    <>
      <div className="hist-card" onClick={onSelectQuran} style={{ borderLeft: '3px solid var(--saffron)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="hist-title" style={{ color: 'var(--green)', fontSize: '.9rem', display: 'flex', alignItems: 'center', gap: '.35rem' }}><BookOpen size={15} color="var(--saffron)" /> আল-কুরআন</div>
            <div style={{ fontSize: '.67rem', color: 'var(--muted2)', fontFamily: 'var(--bn)', marginTop: '.12rem' }}>১১৪ সূরা • ৬,২৩৬ আয়াত</div>
          </div>
          <ChevronRight size={14} style={{ color: 'var(--muted2)' }} />
        </div>
      </div>
      {Object.entries(HADITH_COLLECTIONS).map(([key, col]) => (
        <div key={key} className="hist-card" onClick={() => onSelectCollection(key)} style={{ borderLeft: `3px solid ${col.color}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="hist-title" style={{ color: col.color, display: 'flex', alignItems: 'center', gap: '.35rem' }}><BookMarked size={15} /> {col.name}</div>
              <div style={{ fontSize: '.67rem', color: 'var(--muted2)', fontFamily: 'var(--bn)', marginTop: '.12rem' }}>{toBn(col.chapters)} অধ্যায় • {toBn(col.hadiths)} হাদিস</div>
            </div>
            <ChevronRight size={14} style={{ color: 'var(--muted2)' }} />
          </div>
        </div>
      ))}
    </>
  );
}

/* ── Chapter list ───────────────────────────────────────── */
function ChaptersList({ collection, chapters, onSelectChapter, onBack }) {
  const col = HADITH_COLLECTIONS[collection];
  return (
    <>
      <BackBtn label="গ্রন্থ তালিকায় ফিরুন" onClick={onBack} />
      <div className="hub-card" style={{ marginBottom: '.75rem' }}>
        <div style={{ fontSize: '.93rem', fontWeight: 700, color: 'var(--green)', marginBottom: '.25rem', fontFamily: 'var(--bn)' }}>{col.name}</div>
        <div style={{ fontSize: '.68rem', color: 'var(--muted2)', fontFamily: 'var(--bn)' }}>{toBn(col.chapters)} অধ্যায় • {toBn(col.hadiths)} হাদিস</div>
      </div>
      {Object.entries(chapters).map(([num, ch]) => (
        <div key={num} className="hist-card" onClick={() => onSelectChapter(num)}>
          <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
            <div style={{ minWidth: '32px', height: '32px', borderRadius: '50%', background: 'var(--parchment)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.7rem', color: 'var(--green)', fontWeight: 700, flexShrink: 0, fontFamily: 'var(--bn)' }}>{toBn(num)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '.82rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '.12rem', fontFamily: 'var(--bn)' }}>{ch.title}</div>
              <div style={{ fontSize: '.62rem', color: 'var(--muted2)', fontFamily: 'var(--bn)' }}>{ch.hadis_range}</div>
            </div>
            <ChevronRight size={14} style={{ color: 'var(--muted2)' }} />
          </div>
        </div>
      ))}
    </>
  );
}

/* ── Hadiths list ───────────────────────────────────────── */
function HadithsList({ collection, chapter, hadiths, chapterTitle, onBack }) {
  const col = HADITH_COLLECTIONS[collection];
  const { copiedKey, copy } = useCopy();
  return (
    <>
      <BackBtn label="অধ্যায় তালিকায় ফিরুন" onClick={onBack} />
      <div className="hub-card" style={{ marginBottom: '.75rem' }}>
        <div style={{ fontSize: '.87rem', fontWeight: 700, color: 'var(--green)', fontFamily: 'var(--bn)' }}>{chapterTitle}</div>
      </div>
      {hadiths.map((h) => (
        <div key={h.hadith_id} className="hub-card" style={{ borderLeft: `3px solid ${col.color}`, marginBottom: '.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem' }}>
            <span className="badge-g" style={{ color: col.color, borderColor: `${col.color}33` }}>হাদিস {toBn(h.hadith_id)}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <span style={{ fontSize: '.58rem', color: 'var(--muted2)', fontFamily: 'var(--bn)' }}>{col.name}</span>
              <button
                onClick={() => copy(`${h.ar ? h.ar + '\n\n' : ''}${h.bn}${h.narrator ? '\n\nবর্ণনাকারী: ' + h.narrator : ''}\n\n— ${col.name}, হাদিস ${h.hadith_id}`, h.hadith_id)}
                style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '6px', padding: '.18rem .32rem', cursor: 'pointer', color: copiedKey === h.hadith_id ? 'var(--green)' : 'var(--muted2)', display: 'flex', alignItems: 'center', transition: 'color .2s, border-color .2s', borderColor: copiedKey === h.hadith_id ? 'var(--green)' : undefined }}
                title="কপি করুন"
              >
                {copiedKey === h.hadith_id ? <CopyCheck size={13} /> : <Copy size={13} />}
              </button>
            </div>
          </div>
          {h.ar && (
            <div style={{ fontFamily: "'Amiri',serif", fontSize: '1.05rem', textAlign: 'right', direction: 'rtl', color: 'var(--green)', lineHeight: 2.2, marginBottom: '.75rem', padding: '.65rem', background: 'var(--parchment)', borderRadius: 'var(--r-sm)' }}>{h.ar}</div>
          )}
          <div style={{ fontSize: '.8rem', color: 'var(--ink)', lineHeight: 1.85, marginBottom: '.5rem', fontFamily: 'var(--bn)' }}>{h.bn}</div>
          {h.narrator && (
            <div style={{ fontSize: '.7rem', color: 'var(--muted)', padding: '.42rem .55rem', background: 'var(--parchment)', borderRadius: 'var(--r-sm)', fontFamily: 'var(--bn)' }}>
              <strong style={{ color: 'var(--green)' }}>বর্ণনাকারী:</strong> {h.narrator}
            </div>
          )}
          <div style={{ marginTop: '.6rem', paddingTop: '.6rem', borderTop: '1px solid var(--border2)', display: 'flex', gap: '.35rem', flexWrap: 'wrap', fontSize: '.62rem', alignItems: 'center' }}>
            <span className="badge-g"><CheckCircle size={12} /> {h.grade || 'সহিহ হাদিস'}</span>
            <span style={{ color: 'var(--muted2)', fontFamily: 'var(--bn)' }}>{chapterTitle}</span>
          </div>
        </div>
      ))}
    </>
  );
}

/* ── Surah list ─────────────────────────────────────────── */
function SurahsList({ surahs, onSelect, onBack }) {
  return (
    <>
      <BackBtn label="গ্রন্থ তালিকায় ফিরুন" onClick={onBack} />
      <div className="hub-card" style={{ marginBottom: '.75rem' }}>
        <div style={{ fontSize: '.93rem', fontWeight: 700, color: 'var(--green)', marginBottom: '.25rem', fontFamily: 'var(--bn)' }}>আল-কুরআন</div>
        <div style={{ fontSize: '.68rem', color: 'var(--muted2)', fontFamily: 'var(--bn)' }}>১১৪ সূরা • ৬,২৩৬ আয়াত</div>
      </div>
      {surahs.map((s) => {
        const tc = s.type === 'Meccan' ? 'var(--terra)' : 'var(--green2)';
        const tt = s.type === 'Meccan' ? 'মক্কী' : 'মাদানী';
        return (
          <div key={s.id} className="hist-card" onClick={() => onSelect(s.id)}>
            <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
              <div style={{ minWidth: '32px', height: '32px', borderRadius: '50%', background: 'var(--parchment)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.7rem', color: 'var(--green)', fontWeight: 700, flexShrink: 0, fontFamily: 'var(--bn)' }}>{toBn(s.id)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.12rem' }}>
                  <div style={{ fontSize: '.82rem', fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--bn)' }}>{s.translation}</div>
                  <div style={{ fontFamily: "'Amiri',serif", fontSize: '.82rem', color: 'var(--green)', opacity: .8 }}>{s.name}</div>
                </div>
                <div style={{ fontSize: '.62rem', color: 'var(--muted2)', display: 'flex', alignItems: 'center', gap: '.4rem', fontFamily: 'var(--bn)' }}>
                  <span>{toBn(s.total_verses)} আয়াত</span>
                  <span style={{ color: tc }}>{tt}</span>
                </div>
              </div>
              <ChevronRight size={14} style={{ color: 'var(--muted2)' }} />
            </div>
          </div>
        );
      })}
    </>
  );
}

/* ── Verses list ────────────────────────────────────────── */
function VersesList({ surah, onBack }) {
  const { copiedKey, copy } = useCopy();
  return (
    <>
      <BackBtn label="সূরা তালিকায় ফিরুন" onClick={onBack} />
      <div className="hub-card" style={{ marginBottom: '.75rem' }}>
        <div style={{ fontSize: '.87rem', fontWeight: 700, color: 'var(--green)', fontFamily: 'var(--bn)' }}>{surah.translation} ({surah.transliteration})</div>
      </div>
      {surah.verses.map((v) => (
        <div key={v.id} className="hub-card" style={{ marginBottom: '.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem' }}>
            <span className="badge-g">আয়াত {toBn(v.id)}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <span style={{ fontSize: '.58rem', color: 'var(--muted2)', fontFamily: 'var(--bn)' }}>সূরা {surah.translation}</span>
              <button
                onClick={() => copy(`${v.text}\n\n${v.translation}\n\n— সূরা ${surah.translation} (${surah.transliteration}) ${surah.id}:${v.id}`, `${surah.id}-${v.id}`)}
                style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '6px', padding: '.18rem .32rem', cursor: 'pointer', color: copiedKey === `${surah.id}-${v.id}` ? 'var(--green)' : 'var(--muted2)', display: 'flex', alignItems: 'center', transition: 'color .2s, border-color .2s', borderColor: copiedKey === `${surah.id}-${v.id}` ? 'var(--green)' : undefined }}
                title="কপি করুন"
              >
                {copiedKey === `${surah.id}-${v.id}` ? <CopyCheck size={13} /> : <Copy size={13} />}
              </button>
            </div>
          </div>
          <div style={{ fontFamily: "'Amiri',serif", fontSize: '1.15rem', textAlign: 'right', direction: 'rtl', color: 'var(--green)', lineHeight: 2.4, marginBottom: '.75rem', padding: '.7rem', background: 'var(--parchment)', borderRadius: 'var(--r-sm)', borderLeft: '3px solid var(--saffron)' }}>{v.text}</div>
          <div style={{ fontSize: '.8rem', color: 'var(--ink)', lineHeight: 1.85, fontFamily: 'var(--bn)' }}>{v.translation}</div>
          <div style={{ marginTop: '.6rem', paddingTop: '.6rem', borderTop: '1px solid var(--border2)', display: 'flex', gap: '.35rem', fontSize: '.62rem', alignItems: 'center' }}>
            <span style={{ color: 'var(--muted2)', fontFamily: 'var(--bn)' }}>{toBn(surah.id)}:{toBn(v.id)}</span>
            <span className="badge-g">{surah.type === 'Meccan' ? 'মক্কী' : 'মাদানী'}</span>
          </div>
        </div>
      ))}
    </>
  );
}

/* ── Main Hadith page ───────────────────────────────────── */
export default function Hadith() {
  const [view, setView] = useState(VIEW.BOOKS);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [chapters, setChapters] = useState({});
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [hadiths, setHadiths] = useState([]);
  const [quranData, setQuranData] = useState(null);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [loadingMsg, setLoadingMsg] = useState(null);

  const goToCollection = async (key) => {
    setSelectedCollection(key);
    setLoadingMsg('অধ্যায় লোড হচ্ছে…');
    try {
      const col = HADITH_COLLECTIONS[key];
      const r = await fetch(`hadithbangla/${col.folder}/Meta/${col.folder.toLowerCase()}.json`);
      if (!r.ok) throw new Error();
      setChapters(await r.json());
      setView(VIEW.CHAPTERS);
    } catch { setLoadingMsg(null); }
    setLoadingMsg(null);
  };

  const goToChapter = async (num) => {
    setSelectedChapter(num);
    setLoadingMsg('হাদিস লোড হচ্ছে…');
    try {
      const col = HADITH_COLLECTIONS[selectedCollection];
      const r = await fetch(`hadithbangla/${col.folder}/Chapter/${num}.json`);
      if (!r.ok) throw new Error();
      setHadiths(await r.json());
      setView(VIEW.HADITHS);
    } catch { setLoadingMsg(null); }
    setLoadingMsg(null);
  };

  const goToQuran = async () => {
    setLoadingMsg('কুরআন লোড হচ্ছে…');
    try {
      if (!quranData) {
        const r = await fetch('quran/quran.json');
        setQuranData(await r.json());
      }
      setView(VIEW.SURAHS);
    } catch { setLoadingMsg(null); }
    setLoadingMsg(null);
  };

  const goToSurah = (id) => {
    setSelectedSurah(quranData.find((s) => s.id === id));
    setView(VIEW.VERSES);
  };

  const backToBooks = () => { setView(VIEW.BOOKS); setSelectedCollection(null); setSelectedChapter(null); window.scrollTo(0, 0); };
  const backToChapters = () => {
    setView(view === VIEW.VERSES ? VIEW.SURAHS : VIEW.CHAPTERS);
    setSelectedChapter(null);
    window.scrollTo(0, 0);
  };

  return (
    <div className="page active">
      <div className="section-title"><FileText size={18} /> হাদিস ও কুরআন</div>

      {loadingMsg && <div className="loader" style={{ margin: '2rem auto' }} />}

      {!loadingMsg && view === VIEW.BOOKS && (
        <BooksList onSelectCollection={goToCollection} onSelectQuran={goToQuran} />
      )}
      {!loadingMsg && view === VIEW.CHAPTERS && (
        <ChaptersList collection={selectedCollection} chapters={chapters} onSelectChapter={goToChapter} onBack={backToBooks} />
      )}
      {!loadingMsg && view === VIEW.HADITHS && (
        <HadithsList collection={selectedCollection} chapter={selectedChapter} hadiths={hadiths} chapterTitle={chapters[selectedChapter]?.title || ''} onBack={backToChapters} />
      )}
      {!loadingMsg && view === VIEW.SURAHS && quranData && (
        <SurahsList surahs={quranData} onSelect={goToSurah} onBack={backToBooks} />
      )}
      {!loadingMsg && view === VIEW.VERSES && selectedSurah && (
        <VersesList surah={selectedSurah} onBack={backToChapters} />
      )}
    </div>
  );
}
