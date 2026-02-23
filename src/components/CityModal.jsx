import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { CALCULATION_METHODS, ASR_METHODS } from '../utils/constants';

const QUICK = [
  { en: 'Dhaka',       bn: 'ঢাকা'       },
  { en: 'Chittagong',  bn: 'চট্টগ্রাম'    },
  { en: 'Sylhet',      bn: 'সিলেট'       },
  { en: 'Rajshahi',    bn: 'রাজশাহী'     },
  { en: 'Khulna',      bn: 'খুলনা'       },
  { en: 'Barisal',     bn: 'বরিশাল'      },
  { en: 'Comilla',     bn: 'কুমিল্লা'     },
  { en: 'Mymensingh',  bn: 'ময়মনসিংহ'   },
];

export default function CityModal({ open, onClose, onSelect, calcMethod, setCalcMethod, asrMethod, setAsrMethod }) {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const handleSearch = async () => {
    const city = input.trim() || 'Dhaka';
    
    // Try geocoding for the entered city
    try {
      const query = encodeURIComponent(city + ', Bangladesh');
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        // Pass coordinates along with city name
        onSelect(city, { lat: parseFloat(lat), lng: parseFloat(lon) });
      } else {
        // Fallback: use city name only (will try BD_CITIES lookup)
        onSelect(city);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      onSelect(city);
    }
    
    setInput('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  // Don't render modal at all if not open
  if (!open) return null;

  return (
    <div className="city-modal open" onClick={onClose}>
      <div className="city-modal-inner" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />
        <div style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--green)', marginBottom: '.8rem', fontFamily: 'var(--bn)' }}>
          📍 আপনার শহর বেছে নিন
        </div>
        <div className="search-wrap">
          <Search size={14} style={{ color: 'var(--muted2)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Dhaka, Chittagong, Sylhet…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button className="btn-gold" onClick={handleSearch}>খুঁজুন</button>
        </div>
        <div style={{ fontSize: '.57rem', color: 'var(--muted2)', marginBottom: '.4rem', letterSpacing: '.8px', textTransform: 'uppercase', fontFamily: 'var(--bn)' }}>
          জনপ্রিয় শহর
        </div>
        <div className="quick-cities">
          {QUICK.map((c) => (
            <span key={c.en} className="qcity" onClick={() => { onSelect(c.en, null); setInput(''); }}>
              {c.bn}
            </span>
          ))}
        </div>
        
        {/* Prayer Settings */}
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '.75rem', fontWeight: 600, color: 'var(--green)', marginBottom: '.6rem', fontFamily: 'var(--bn)' }}>
            ⚙️ নামাজের সেটিংস
          </div>
          
          <div style={{ marginBottom: '.6rem' }}>
            <label style={{ fontSize: '.7rem', color: 'var(--muted)', display: 'block', marginBottom: '.3rem', fontFamily: 'var(--bn)', fontWeight: 500 }}>
              ক্যালকুলেশন পদ্ধতি
            </label>
            <select 
              value={calcMethod} 
              onChange={(e) => setCalcMethod(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '.45rem', 
                fontSize: '.7rem', 
                fontFamily: 'var(--bn)', 
                borderRadius: 'var(--r-sm)', 
                border: '1px solid var(--border)', 
                background: 'var(--bg)',
                cursor: 'pointer'
              }}
            >
              {Object.entries(CALCULATION_METHODS).map(([key, method]) => (
                <option key={key} value={key}>{method.name}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '.6rem' }}>
            <label style={{ fontSize: '.7rem', color: 'var(--muted)', display: 'block', marginBottom: '.3rem', fontFamily: 'var(--bn)', fontWeight: 500 }}>
              আসর পদ্ধতি
            </label>
            <select 
              value={asrMethod} 
              onChange={(e) => setAsrMethod(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '.45rem', 
                fontSize: '.7rem', 
                fontFamily: 'var(--bn)', 
                borderRadius: 'var(--r-sm)', 
                border: '1px solid var(--border)', 
                background: 'var(--bg)',
                cursor: 'pointer'
              }}
            >
              {Object.entries(ASR_METHODS).map(([key, method]) => (
                <option key={key} value={key}>{method.name}</option>
              ))}
            </select>
          </div>
        </div>
        <button onClick={onClose} style={{ width: '100%', marginTop: '.85rem', background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: 'var(--r-sm)', padding: '.45rem', cursor: 'pointer', fontFamily: 'var(--bn)', fontSize: '.78rem' }}>
          বন্ধ করুন
        </button>
      </div>
    </div>
  );
}
