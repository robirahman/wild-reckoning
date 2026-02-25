export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export type Month =
  | 'January' | 'February' | 'March' | 'April'
  | 'May' | 'June' | 'July' | 'August'
  | 'September' | 'October' | 'November' | 'December';

export const MONTHS: Month[] = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
];

export const MONTH_TO_SEASON: Record<Month, Season> = {
  January: 'winter', February: 'winter', March: 'spring',
  April: 'spring', May: 'spring', June: 'summer',
  July: 'summer', August: 'summer', September: 'autumn',
  October: 'autumn', November: 'autumn', December: 'winter',
};

export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';
export type LunarPhase = 'new' | 'waxing' | 'full' | 'waning';

export interface TimeState {
  turn: number;
  week: 1 | 2 | 3 | 4;
  dayInMonth?: number; // 1-28
  month: Month;
  monthIndex: number; // 0-11
  year: number;
  season: Season;
  timeOfDay: TimeOfDay;
  lunarPhase: LunarPhase;
}

export interface ClimateProfile {
  temperatureByMonth: number[]; // Average temp in Fahrenheit, 12 entries
  precipitationByMonth: number[]; // Average inches, 12 entries
  firstFrostMonth: number; // Month index (0-11)
  lastFrostMonth: number;
}

export interface FloraEntry {
  id: string;
  name: string;
  availableSeasons: Season[];
  nutritiveValue: number; // 0-100
  abundanceByMonth: number[]; // 0-1 per month
}

export interface ParasitePrevalence {
  parasiteId: string;
  baseChance: number; // 0-1 base probability per turn
  seasonalModifier: Record<Season, number>; // Multiplier per season
}

export interface RegionDefinition {
  id: string;
  name: string;
  climate: ClimateProfile;
  flora: FloraEntry[];
  fauna: string[]; // Other species present
  predators: string[];
  parasitePrevalence: ParasitePrevalence[];
}
