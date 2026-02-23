import { X } from 'lucide-react';
import { CALCULATION_METHODS, ASR_METHODS } from '../utils/constants';

export default function SettingsModal({ isOpen, onClose, calcMethod, setCalcMethod, asrMethod, setAsrMethod }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '.9rem', fontWeight: 600, color: 'var(--green)', fontFamily: 'var(--bn)' }}>নামাজের সেটিংস</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: '.2rem' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ marginBottom: '.8rem' }}>
          <label style={{ fontSize: '.75rem', color: 'var(--muted)', display: 'block', marginBottom: '.4rem', fontFamily: 'var(--bn)', fontWeight: 500 }}>
            ক্যালকুলেশন পদ্ধতি
          </label>
          <select 
            value={calcMethod} 
            onChange={(e) => setCalcMethod(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '.5rem', 
              fontSize: '.75rem', 
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
          <div style={{ fontSize: '.65rem', color: 'var(--muted2)', marginTop: '.3rem', fontFamily: 'var(--bn)' }}>
            {CALCULATION_METHODS[calcMethod].nameEn}
          </div>
        </div>

        <div style={{ marginBottom: '.8rem' }}>
          <label style={{ fontSize: '.75rem', color: 'var(--muted)', display: 'block', marginBottom: '.4rem', fontFamily: 'var(--bn)', fontWeight: 500 }}>
            আসর পদ্ধতি
          </label>
          <select 
            value={asrMethod} 
            onChange={(e) => setAsrMethod(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '.5rem', 
              fontSize: '.75rem', 
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
          <div style={{ fontSize: '.65rem', color: 'var(--muted2)', marginTop: '.3rem', fontFamily: 'var(--bn)' }}>
            {ASR_METHODS[asrMethod].nameEn}
          </div>
        </div>

        <div style={{ 
          padding: '.6rem', 
          background: 'var(--parchment2)', 
          borderRadius: 'var(--r-sm)', 
          fontSize: '.68rem', 
          color: 'var(--muted)', 
          lineHeight: 1.5,
          fontFamily: 'var(--bn)'
        }}>
          <strong style={{ color: 'var(--green)' }}>বর্তমান সেটিংস:</strong><br />
          {CALCULATION_METHODS[calcMethod].name} • {ASR_METHODS[asrMethod].name}
          <div style={{ marginTop: '.3rem', fontSize: '.62rem', color: 'var(--muted2)' }}>
            এই সেটিংস সব পেজে প্রযোজ্য হবে
          </div>
        </div>
      </div>
    </div>
  );
}
