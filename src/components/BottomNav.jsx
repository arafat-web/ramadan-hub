import { Home, Clock, BookOpen, CalendarDays, LayoutGrid } from 'lucide-react';

const TABS = [
  { id: 'home',     Icon: Home,         label: 'হোম' },
  { id: 'namaz',    Icon: Clock,        label: 'নামাজ' },
  { id: 'history',  Icon: BookOpen,     label: 'হাদিস' },
  { id: 'calendar', Icon: CalendarDays, label: 'ক্যালেন্ডার' },
  { id: 'more',     Icon: LayoutGrid,   label: 'আরও' },
];

export default function BottomNav({ active, onNav }) {
  return (
    <nav className="bottom-nav">
      <div className="bottom-wrapper">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`bnav-item${active === t.id ? ' active' : ''}`}
            onClick={() => onNav(t.id)}
          >
            <t.Icon size={20} />
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
