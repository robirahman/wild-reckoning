import type { TimeState, Month, TimeOfDay, LunarPhase } from '../types/world';
import { MONTHS, MONTH_TO_SEASON } from '../types/world';

const TIME_OF_DAY_ORDER: TimeOfDay[] = ['dawn', 'day', 'dusk', 'night'];
const LUNAR_PHASE_ORDER: LunarPhase[] = ['new', 'waxing', 'full', 'waning'];

export function createInitialTime(startMonth: number = 5, startYear: number = 1): TimeState {
  const month = MONTHS[startMonth];
  return {
    turn: 0,
    week: 1,
    month,
    monthIndex: startMonth,
    year: startYear,
    season: MONTH_TO_SEASON[month],
    timeOfDay: 'dawn',
    lunarPhase: 'new',
  };
}

export function advanceTime(time: TimeState, turnUnit: 'week' | 'month' | 'day' = 'week'): TimeState {
  const newTurn = time.turn + 1;

  // Circadian Cycle
  const currentTodoIdx = TIME_OF_DAY_ORDER.indexOf(time.timeOfDay);
  const newTodoIdx = (currentTodoIdx + 1) % TIME_OF_DAY_ORDER.length;
  const newTimeOfDay = TIME_OF_DAY_ORDER[newTodoIdx];

  if (turnUnit === 'month') {
    // Each turn = 1 month. Circadian is just flavor.
    const newMonthIndex = (time.monthIndex + 1) % 12;
    const newYear = newMonthIndex === 0 ? time.year + 1 : time.year;
    const newMonth: Month = MONTHS[newMonthIndex];
    const newSeason = MONTH_TO_SEASON[newMonth];

    return {
      turn: newTurn,
      week: 1,
      month: newMonth,
      monthIndex: newMonthIndex,
      year: newYear,
      season: newSeason,
      timeOfDay: newTimeOfDay,
      lunarPhase: time.lunarPhase, // progress lunar monthly?
    };
  }

  if (turnUnit === 'day') {
    // Each turn advances 6 hours (4 turns per day)
    let newDay = time.dayInMonth ?? 1;
    let newMonthIndex = time.monthIndex;
    let newYear = time.year;

    if (newTimeOfDay === 'dawn') {
      newDay += 1;
    }

    if (newDay > 28) {
      newDay = 1;
      newMonthIndex = (newMonthIndex + 1) % 12;
      if (newMonthIndex === 0) {
        newYear += 1;
      }
    }

    const newWeek = (Math.floor((newDay - 1) / 7) + 1) as 1 | 2 | 3 | 4;
    const newMonth: Month = MONTHS[newMonthIndex];
    const newSeason = MONTH_TO_SEASON[newMonth];
    
    // Progress lunar phase every week
    const newLunarPhase = LUNAR_PHASE_ORDER[newWeek - 1];

    return {
      turn: newTurn,
      week: newWeek,
      dayInMonth: newDay,
      month: newMonth,
      monthIndex: newMonthIndex,
      year: newYear,
      season: newSeason,
      timeOfDay: newTimeOfDay,
      lunarPhase: newLunarPhase,
    };
  }

  // Default: each turn = 1 week. 
  // Circadian advances, but major unit advances every turn.
  let newWeek = (time.week + 1) as 1 | 2 | 3 | 4;
  let newMonthIndex = time.monthIndex;
  let newYear = time.year;

  if (newWeek > 4) {
    newWeek = 1;
    newMonthIndex = (newMonthIndex + 1) % 12;
    if (newMonthIndex === 0) {
      newYear += 1;
    }
  }

  const newMonth: Month = MONTHS[newMonthIndex];
  const newSeason = MONTH_TO_SEASON[newMonth];
  const newLunarPhase = LUNAR_PHASE_ORDER[newWeek - 1];

  return {
    turn: newTurn,
    week: newWeek,
    month: newMonth,
    monthIndex: newMonthIndex,
    year: newYear,
    season: newSeason,
    timeOfDay: newTimeOfDay,
    lunarPhase: newLunarPhase,
  };
}
