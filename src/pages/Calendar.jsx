import { toBn } from '../utils/helpers';
import { CalendarRange, ListChecks, Moon, Heart, HandHeart, ShieldCheck, Sparkles, Star, PartyPopper } from 'lucide-react';
import { RAMADAN_START } from '../utils/constants';

const LAYLATUL = new Set([21, 23, 25, 27, 29]);
const SPECIAL   = new Set([1, 10, 15, 20, 30]);
const NOTES     = { 1: '১ম রোজা', 10: 'রহমত শেষ', 15: 'মাঝ রমজান', 20: 'মাগফেরাত শেষ', 21: 'সম্ভাব্য কদর', 23: 'সম্ভাব্য কদর', 25: 'সম্ভাব্য কদর', 27: 'কদরের রাত', 29: 'সম্ভাব্য কদর', 30: 'শেষ রোজা' };
const DAYS = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র', 'শনি'];

const IMPORTANT = [
  { Icon: Moon, label: '১ম রোজা',                   date: '১৯ ফেব্রুয়ারি',  color: 'var(--green)' },
  { Icon: Heart, label: '১ম জুমা',                    date: '২১ ফেব্রুয়ারি',  color: 'var(--green)' },
  { Icon: HandHeart, label: 'রহমতের ১০ দিন শেষ',         date: '২৮ ফেব্রুয়ারি',  color: 'var(--green)' },
  { Icon: ShieldCheck, label: 'মাগফেরাতের ১০ দিন শেষ',     date: '১০ মার্চ',        color: 'var(--green)' },
  { Icon: Sparkles, label: 'ইতিকাফ শুরু',                date: '১১ মার্চ',       color: 'var(--terra)' },
  { Icon: Star, label: '২৭তম রাত (সম্ভাব্য কদর)',    date: '১৭ মার্চ',       color: 'var(--terra)' },
  { Icon: PartyPopper, label: 'ঈদুল ফিতর (সম্ভাব্য)',       date: '২১ মার্চ',       color: 'var(--green)' },
];

export default function Calendar() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDow = RAMADAN_START.getDay();

  const cells = [];
  // Empty cells for days before start
  for (let i = 0; i < startDow; i++) cells.push(null);
  // Day cells
  for (let rd = 1; rd <= 30; rd++) {
    const d = new Date(RAMADAN_START);
    d.setDate(d.getDate() + rd - 1);
    d.setHours(0, 0, 0, 0);
    cells.push({ rd, d, isToday: d.getTime() === today.getTime(), isPast: d < today, isLaylatul: LAYLATUL.has(rd), isSpecial: SPECIAL.has(rd) && !LAYLATUL.has(rd), isFri: d.getDay() === 5 });
  }

  return (
    <div className="page active">
      <div className="section-title"><CalendarRange size={18} /> রমজানের ক্যালেন্ডার ১৪৪৭</div>

      <div className="hub-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.7rem', flexWrap: 'wrap', gap: '.4rem' }}>
          <div className="card-lbl" style={{ margin: 0 }}>১৯ ফেব্রুয়ারি — ২০ মার্চ ২০২৬</div>
          <span className="badge-g">৩০ দিন</span>
        </div>

        {/* Day headers */}
        <div className="cal-grid">
          {DAYS.map((d, i) => (
            <div key={d} className="cal-hd" style={i === 5 ? { color: 'var(--terra)' } : {}}>{d}</div>
          ))}
          {cells.map((cell, i) => {
            if (!cell) return <div key={`e${i}`} />;
            const { rd, d, isToday, isPast, isLaylatul, isSpecial, isFri } = cell;
            let cls = 'cal-day';
            if (isToday) cls += ' today';
            else if (isPast) cls += ' past';
            if (isLaylatul) cls += ' laylatul';
            else if (isSpecial) cls += ' special';
            const gs = d.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' });
            return (
              <div key={rd} className={cls}>
                <div className="cal-d-h">{toBn(rd)}</div>
                <div className="cal-d-g">{gs}</div>
                {isFri && <div className="cal-d-n" style={{ color: 'var(--terra)' }}>জুমা</div>}
                {NOTES[rd] && <div className="cal-d-n">{NOTES[rd]}</div>}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginTop: '.75rem', fontSize: '.62rem', color: 'var(--muted)', fontFamily: 'var(--bn)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.25rem' }}><div style={{ width: '9px', height: '9px', borderRadius: '2px', background: 'var(--green)' }} /> আজ</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.25rem' }}><div style={{ width: '9px', height: '9px', borderRadius: '2px', background: 'rgba(30,77,58,.2)', border: '1px solid rgba(30,77,58,.5)' }} /> লাইলাতুল কদর</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.25rem' }}><div style={{ width: '9px', height: '9px', borderRadius: '2px', background: 'rgba(181,69,27,.15)', border: '1px solid rgba(181,69,27,.4)' }} /> বিশেষ দিন</div>
        </div>
      </div>

      {/* Important dates */}
      <div className="hub-card">
        <div className="card-lbl"><ListChecks size={14} /> গুরুত্বপূর্ণ তারিখ</div>
        <div style={{ fontSize: '.76rem', color: 'var(--muted)', lineHeight: 1.9, fontFamily: 'var(--bn)' }}>
          {IMPORTANT.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '.28rem 0', borderBottom: i < IMPORTANT.length - 1 ? '1px solid var(--border2)' : 'none' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                <item.Icon size={14} style={{ color: item.color }} />
                {item.label}
              </span>
              <span style={{ color: item.color, fontWeight: 600 }}>{item.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
