import { useEffect, useState } from 'react';
import { History, MapPin, Compass, Crosshair, Info } from 'lucide-react';
import { fmt12 } from '../utils/helpers';
import { getPrayerTimes } from '../utils/prayerTimes';
import { BD_CITIES, PRAYER_LIST, CALCULATION_METHODS, ASR_METHODS } from '../utils/constants';

export default function Namaz({ city, coords, calcMethod, asrMethod }) {
  const [rows, setRows] = useState([]);
  const [dateLabel, setDateLabel] = useState('');
  const [qiblaDeg, setQiblaDeg] = useState('নিচের বোতামে চাপুন');
  const [needleAngle, setNeedleAngle] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!city) return;
    setLoading(true);
    const c = coords || BD_CITIES[city] || BD_CITIES['Dhaka'];
    const method = CALCULATION_METHODS[calcMethod];
    const asrCode = ASR_METHODS[asrMethod].apiCode;
    
    getPrayerTimes(new Date(), c.lat, c.lng, method.apiCode, asrCode).then(times => {
      const now = new Date();

      setDateLabel(now.toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

      const rowData = PRAYER_LIST.map((p) => {
        const [hh, mm] = times[p.k] || [0, 0];
        const pd = new Date(); pd.setHours(hh, mm, 0, 0);
        return { ...p, hh, mm, isNext: pd > now };
      });

      // Mark only first upcoming prayer
      let marked = false;
      const final = rowData.map((r) => {
        if (r.isNext && !marked) { marked = true; return { ...r, isNext: true }; }
        return { ...r, isNext: false };
      });

      setRows(final);
      setLoading(false);
    });
  }, [city, coords, calcMethod, asrMethod]);

  const handleQibla = () => {
    const K = { lat: 21.4225, lng: 39.8262 };
    setQiblaDeg('অবস্থান শনাক্ত হচ্ছে…');
    if (!navigator.geolocation) { fallback(); return; }
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        const dL = (K.lng - lng) * Math.PI / 180;
        const l1 = lat * Math.PI / 180, l2 = K.lat * Math.PI / 180;
        const y = Math.sin(dL) * Math.cos(l2);
        const x = Math.cos(l1) * Math.sin(l2) - Math.sin(l1) * Math.cos(l2) * Math.cos(dL);
        const angle = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
        setNeedleAngle(angle);
        setQiblaDeg(`উত্তর থেকে ${Math.round(angle)}° কোণে কিবলা`);
      },
      fallback
    );
  };

  const fallback = () => {
    setNeedleAngle(277);
    setQiblaDeg('~২৭৭° — ঢাকা');
  };

  return (
    <div className="page active">
      <div className="section-title"><History size={18} /> নামাজের সময়সূচি</div>

      {/* Prayer timetable */}
      <div className="hub-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.7rem' }}>
          <div className="card-lbl" style={{ margin: 0 }}><MapPin size={13} /> {city || 'ঢাকা'}</div>
          <span style={{ fontSize: '.6rem', color: 'var(--muted2)', fontFamily: 'var(--bn)' }}>{dateLabel}</span>
        </div>
        {loading ? <div className="loader" /> : (
          <div className="fade-in">
            {rows.map((p) => (
              <div key={p.k} className={`p-row${p.isNext ? ' next-up' : ''}`}>
                <span className="p-name"><p.Ic size={15} />{p.bn}</span>
                <span className="p-time">{fmt12(p.hh, p.mm)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Qibla */}
      <div className="hub-card" style={{ textAlign: 'center' }}>
        <div className="card-lbl" style={{ justifyContent: 'center' }}><Compass size={16} /> কিবলা দিকনির্দেশনা</div>
        <div className="compass">
          <span className="cl n">উ</span><span className="cl s">দ</span><span className="cl e">পূ</span><span className="cl w">প</span>
          <div className="needle" style={{ transform: `rotate(${needleAngle}deg)` }} />
          <div className="needle-c" />
        </div>
        <div id="qiblaDeg" style={{ fontSize: '.7rem', color: 'var(--muted2)', margin: '.3rem 0', fontFamily: 'var(--bn)' }}>{qiblaDeg}</div>
        <button className="ref-btn" onClick={handleQibla}><Crosshair size={13} /> কিবলা খুঁজুন</button>
      </div>

      {/* Info */}
      <div className="hub-card">
        <div className="card-lbl"><Info size={14} /> নামাজের ওয়াক্ত</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.45rem' }}>
          {[
            { p: PRAYER_LIST[0], desc: 'সুবহে সাদিক থেকে সূর্যোদয়ের আগ পর্যন্ত' },
            { p: PRAYER_LIST[2], desc: 'দুপুরের পর থেকে আসরের আগ পর্যন্ত' },
            { p: PRAYER_LIST[3], desc: 'বিকেল থেকে সূর্যাস্তের আগ পর্যন্ত' },
            { p: PRAYER_LIST[4], desc: 'সূর্যাস্তের পর থেকে এশার আগ পর্যন্ত' },
            { p: PRAYER_LIST[5], desc: 'সন্ধ্যার পর থেকে মধ্যরাত পর্যন্ত' },
          ].map(({ p, desc }) => (
            <div key={p.k} style={{ display: 'flex', alignItems: 'center', gap: '.55rem', padding: '.3rem .4rem', borderRadius: 'var(--r-sm)', background: 'var(--parchment2)' }}>
              <span style={{ color: 'var(--green)', flexShrink: 0 }}><p.Ic size={15} strokeWidth={1.6} /></span>
              <strong style={{ fontSize: '.78rem', color: 'var(--ink)', fontFamily: 'var(--bn)', flexShrink: 0 }}>{p.bn}</strong>
              <span style={{ fontSize: '.72rem', color: 'var(--muted)', fontFamily: 'var(--bn)', lineHeight: 1.4 }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
