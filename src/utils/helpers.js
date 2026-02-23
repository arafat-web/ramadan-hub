/** Convert ASCII digits to Bengali digits */
export const toBn = (n) =>
  String(n).replace(/[0-9]/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);

/** Format 24h hours+minutes to Bengali 12h string */
export const fmt12 = (h, m) => {
  const hour = h % 12 || 12;
  const minute = String(m).padStart(2, '0');
  let period;
  if (h >= 5 && h < 12) period = 'সকাল';      // 5 AM - 11:59 AM: Morning
  else if (h >= 12 && h < 15) period = 'দুপুর'; // 12 PM - 2:59 PM: Noon
  else if (h >= 15 && h < 18) period = 'বিকাল'; // 3 PM - 5:59 PM: Afternoon
  else if (h >= 18 && h < 20) period = 'সন্ধ্যা'; // 6 PM - 7:59 PM: Evening
  else period = 'রাত';                         // 8 PM - 4:59 AM: Night
  return `${toBn(hour)}:${toBn(minute)} ${period}`;
};
