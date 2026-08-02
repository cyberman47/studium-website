const ACTIVE_DAYS_KEY = "studium_active_days";
const KP_PER_DAY = 10;

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD, UTC-based but consistent for same-session use
}

function getActiveDays(): string[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(ACTIVE_DAYS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function recordVisit() {
  if (typeof window === "undefined") return;
  const days = new Set(getActiveDays());
  days.add(toDateKey(new Date()));
  localStorage.setItem(ACTIVE_DAYS_KEY, JSON.stringify(Array.from(days)));
}

export function getStreak(): number {
  const days = new Set(getActiveDays());
  let streak = 0;
  const cursor = new Date();
  // if today isn't logged yet, start counting from yesterday
  if (!days.has(toDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (days.has(toDateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function getTotalKP(): number {
  return getActiveDays().length * KP_PER_DAY;
}

export type WeekDay = { label: string; date: string; active: boolean; isToday: boolean };

export function getWeekLog(): WeekDay[] {
  const days = new Set(getActiveDays());
  const today = new Date();
  const dayOfWeek = (today.getDay() + 6) % 7; // convert Sun=0..Sat=6 to Mon=0..Sun=6
  const monday = new Date(today);
  monday.setDate(today.getDate() - dayOfWeek);

  const labels = ["M", "T", "W", "T", "F", "S", "S"];
  return labels.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = toDateKey(d);
    return { label, date: key, active: days.has(key), isToday: key === toDateKey(today) };
  });
}
