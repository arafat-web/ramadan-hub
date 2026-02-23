import { MapPin, ChevronDown } from 'lucide-react';

export default function TopNav({ cityName, onCityClick }) {
  return (
    <nav className="top-nav">
      <div className="top-wrapper">
        <div className="nav-brand">
          <img src="icons/icon.svg" alt="" className="nav-logo" />
          <div className="nav-brand-text">
            <span className="nav-title">রমজান হাব</span>
            <small>১৪৪৭ হিজরি · বাংলাদেশ</small>
          </div>
        </div>

        <div className="nav-spacer" />

        <button className="city-badge" onClick={onCityClick}>
          <span className="city-dot" />
          <MapPin size={11} />
          <span>{cityName}</span>
          <ChevronDown size={11} className="city-chevron" />
        </button>
      </div>
    </nav>
  );
}
