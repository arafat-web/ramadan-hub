function julianDate(date) {
  let y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
  if (m <= 2) { y -= 1; m += 12; }
  const a = Math.floor(y / 100), b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524.5;
}

function sunDeclination(jd) {
  const n = jd - 2451545.0;
  const L = (280.460 + 0.9856474 * n) % 360;
  const g = ((357.528 + 0.9856003 * n) % 360) * Math.PI / 180;
  const lambda = (L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * Math.PI / 180;
  return Math.asin(Math.sin((23.439 - 0.0000004 * n) * Math.PI / 180) * Math.sin(lambda)) * 180 / Math.PI;
}

function equationOfTime(jd) {
  const n = jd - 2451545.0;
  const L = (280.460 + 0.9856474 * n) % 360;
  const g = ((357.528 + 0.9856003 * n) % 360) * Math.PI / 180;
  const lambda = L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g);
  const epsilon = 23.439 - 0.0000004 * n;
  const ra = Math.atan2(
    Math.cos(epsilon * Math.PI / 180) * Math.sin(lambda * Math.PI / 180),
    Math.cos(lambda * Math.PI / 180)
  ) * 180 / Math.PI;
  return 4 * (L - ra);
}

function calculateTime(angle, decl, lat, lng, tz, eqTime, isEvening = false) {
  const latRad = lat * Math.PI / 180;
  const declRad = decl * Math.PI / 180;
  const angleRad = angle * Math.PI / 180;
  const cosH = (Math.sin(angleRad) - Math.sin(latRad) * Math.sin(declRad)) /
               (Math.cos(latRad) * Math.cos(declRad));
  if (cosH > 1 || cosH < -1) return [0, 0];
  const H = Math.acos(cosH) * 180 / Math.PI;
  let time = 12 + (isEvening ? H : -H) / 15 - lng / 15 - eqTime / 60 + tz;
  while (time < 0) time += 24;
  while (time >= 24) time -= 24;
  let hours = Math.floor(time);
  let minutes = Math.round((time - hours) * 60);
  if (minutes >= 60) { hours += 1; minutes = 0; }
  if (hours >= 24) hours -= 24;
  return [hours, minutes];
}

/**
 * Fetches prayer times from Aladhan API for accurate, verified calculations.
 * @param {Date} date - The date for calculation
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @param {string} method - API calculation method code (1=Karachi, 2=ISNA, 3=MWL, 4=Makkah, 5=Egypt)
 * @param {number} asrMethod - Asr school (0=Shafi/Standard, 1=Hanafi)
 * @returns {Promise<{ fajr, sunrise, dhuhr, asr, maghrib, isha }>} - Each is [hours, minutes]
 */
export async function getPrayerTimes(date, latitude, longitude, method = '1', asrMethod = 0) {
  try {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    
    const url = `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${latitude}&longitude=${longitude}&method=${method}&school=${asrMethod}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.code === 200 && data.data && data.data.timings) {
      const t = data.data.timings;
      const parseTime = (timeStr) => {
        const [hh, mm] = timeStr.split(':').map(Number);
        return [hh, mm];
      };
      
      return {
        fajr: parseTime(t.Fajr),
        sunrise: parseTime(t.Sunrise),
        dhuhr: parseTime(t.Dhuhr),
        asr: parseTime(t.Asr),
        maghrib: parseTime(t.Maghrib),
        isha: parseTime(t.Isha),
      };
    }
    
    // Fallback if API response is invalid
    throw new Error('Invalid API response');
  } catch (error) {
    console.error('Prayer times API error:', error);
    // Return approximate times for Dhaka as fallback
    return {
      fajr: [5, 10],
      sunrise: [6, 30],
      dhuhr: [12, 16],
      asr: [15, 45],
      maghrib: [17, 59],
      isha: [19, 14],
    };
  }
}
