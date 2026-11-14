export type StudioPackageId = '1_month' | '3_month';

export interface StudioPackagePlan {
  id: StudioPackageId;
  title: string;
  shortTitle: string;
  durationMonths: number;
  price: string;
  priceNum: number;
  savings?: string;
  popular?: boolean;
  badge?: string;
  description: string;
}

export const STUDIO_PACKAGES: StudioPackagePlan[] = [
  {
    id: '1_month',
    title: '1 Month Reformer Program',
    shortTitle: '1 Month Package',
    durationMonths: 1,
    price: '₹6,000',
    priceNum: 6000,
    description: '30-day foundational studio access, classical reformer posture alignment, core activation & personalized nutrition guide.'
  },
  {
    id: '3_month',
    title: '3 Month Reformer Transformation',
    shortTitle: '3 Month Package',
    durationMonths: 3,
    price: '₹16,000',
    priceNum: 16000,
    savings: 'Save ₹2,000',
    popular: true,
    badge: 'Best Value • Save ₹2,000',
    description: '90-day comprehensive reformer mastery, posture restoration, progressive resistance, and tailored 7-day meal plan.'
  }
];

export function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function calculateEndDateFromStart(startDateStr: string, durationMonths: number): string {
  try {
    const [y, m, d] = startDateStr.split('-').map(Number);
    if (!y || !m || !d) return startDateStr;
    const date = new Date(y, m - 1, d);
    date.setMonth(date.getMonth() + durationMonths);
    const ey = date.getFullYear();
    const em = String(date.getMonth() + 1).padStart(2, '0');
    const ed = String(date.getDate()).padStart(2, '0');
    return `${ey}-${em}-${ed}`;
  } catch (e) {
    return startDateStr;
  }
}

export function formatDateReadable(dateStr?: string): string {
  if (!dateStr) return 'N/A';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts.map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
    return dateStr;
  } catch (e) {
    return dateStr;
  }
}

export function countSelectedDaysBetween(
  startDateStr: string,
  endDateStr: string,
  selectedDays: number[]
): number {
  if (!startDateStr || !endDateStr || !selectedDays || selectedDays.length === 0) return 0;
  try {
    const [sy, sm, sd] = startDateStr.split('-').map(Number);
    const start = new Date(sy, sm - 1, sd);
    const [ey, em, ed] = endDateStr.split('-').map(Number);
    const end = new Date(ey, em - 1, ed);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return 0;

    const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    let count = 0;
    for (let i = 0; i <= diffDays; i++) {
      const cur = new Date(start);
      cur.setDate(start.getDate() + i);
      if (selectedDays.includes(cur.getDay())) {
        count++;
      }
    }
    return count;
  } catch (e) {
    return 0;
  }
}
