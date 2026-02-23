import { useState, useEffect, useCallback } from 'react';
import './App.css';

import TopNav       from './components/TopNav';
import BottomNav    from './components/BottomNav';
import CityModal    from './components/CityModal';
import LoadingOverlay from './components/LoadingOverlay';

import Home     from './pages/Home';
import Namaz    from './pages/Namaz';
import Hadith   from './pages/Hadith';
import Calendar from './pages/Calendar';
import More     from './pages/More';

import { BD_CITIES } from './utils/constants';

function findNearestCity(lat, lng) {
  let nearest = 'Dhaka', minDist = Infinity;
  for (const [city, coords] of Object.entries(BD_CITIES)) {
    const dist = Math.sqrt((coords.lat - lat) ** 2 + (coords.lng - lng) ** 2);
    if (dist < minDist) { minDist = dist; nearest = city; }
  }
  return nearest;
}

async function detectLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) { 
      resolve(null); 
      return; 
    }
    
    // Request geolocation permission
    navigator.geolocation.getCurrentPosition(
      // Success: Location granted
      ({ coords: { latitude, longitude } }) => {
        const city = findNearestCity(latitude, longitude);
        resolve({ city, coords: { lat: latitude, lng: longitude } });
      },
      // Error: Permission denied, unavailable, or timeout
      (error) => {
        console.log('Location detection failed:', error.message);
        resolve(null);
      },
      { 
        timeout: 10000, // Give user 10 seconds to grant permission
        enableHighAccuracy: false,
        maximumAge: 0
      }
    );
  });
}

export default function App() {
  const [activePage, setActivePage]   = useState('home');
  const [cityName, setCityName]       = useState('ঢাকা');
  const [cityKey, setCityKey]         = useState('Dhaka');
  const [coords, setCoords]           = useState(null);
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [loading, setLoading]         = useState(true);
  const [loadMsg, setLoadMsg]         = useState('তথ্য লোড হচ্ছে…');
  
  // Prayer calculation settings
  const [calcMethod, setCalcMethod] = useState(() => {
    const saved = localStorage.getItem('calcMethod');
    return saved || 'karachi';
  });
  const [asrMethod, setAsrMethod] = useState(() => {
    const saved = localStorage.getItem('asrMethod');
    return saved || 'hanafi';
  });

  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('calcMethod', calcMethod);
    localStorage.setItem('asrMethod', asrMethod);
  }, [calcMethod, asrMethod]);

  /* Deep-link support (?tab=namaz etc.) */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && ['home','namaz','history','calendar','more'].includes(tab)) setActivePage(tab);
  }, []);

  /* Auto-detect location on load */
  useEffect(() => {
    (async () => {
      setLoadMsg('আপনার অবস্থানের অনুমতি চাওয়া হচ্ছে…');
      setLoading(true);
      
      const result = await detectLocation();
      
      if (result && result.city) {
        // Location permission granted and city detected
        setCityKey(result.city);
        setCityName(result.city);
        setCoords(result.coords);
        setLoading(false);
        // Explicitly ensure modal stays closed
        setCityModalOpen(false);
      } else {
        // Permission denied or failed - show city selector
        setLoading(false);
        setTimeout(() => setCityModalOpen(true), 100);
      }
    })();
  }, []);

  /* Service Worker */
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }, []);

  const handleCitySelect = useCallback((city, geocodedCoords = null) => {
    setCityKey(city);
    setCityName(city);
    // Use geocoded coordinates if provided, otherwise set to null (will use BD_CITIES lookup)
    setCoords(geocodedCoords);
    setCityModalOpen(false);
  }, []);

  const handleCityClick = useCallback(() => setCityModalOpen(true), []);

  const renderPage = () => {
    switch (activePage) {
      case 'home':     return <Home     city={cityKey} coords={coords} calcMethod={calcMethod} asrMethod={asrMethod} />;
      case 'namaz':    return <Namaz    city={cityKey} coords={coords} calcMethod={calcMethod} asrMethod={asrMethod} />;
      case 'history':  return <Hadith />;
      case 'calendar': return <Calendar />;
      case 'more':     return <More />;
      default:         return <Home city={cityKey} coords={coords} calcMethod={calcMethod} asrMethod={asrMethod} />;
    }
  };

  return (
    <>
      <LoadingOverlay visible={loading} message={loadMsg} />

      <TopNav 
        cityName={cityName} 
        onCityClick={handleCityClick}
      />

      <CityModal
        open={cityModalOpen}
        onClose={() => setCityModalOpen(false)}
        onSelect={handleCitySelect}
        calcMethod={calcMethod}
        setCalcMethod={setCalcMethod}
        asrMethod={asrMethod}
        setAsrMethod={setAsrMethod}
      />

      <div className="page-wrap">
        {renderPage()}
      </div>

      <BottomNav active={activePage} onNav={setActivePage} />
    </>
  );
}
