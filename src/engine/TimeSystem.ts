import type { TimeState, Month } from '../types/world';
import { MONTHS, MONTH_TO_SEASON } from '../types/world';

export function createInitialTime(startMonth: number = 5, startYear: number = 1): TimeState {
  const month = MONTHS[startMonth];
  return {
    turn: 0,
    week: 1,
    month,
    monthIndex: startMonth,
    year: startYear,
    season: MONTH_TO_SEASON[month],
  };
}

export function advanceTime(time: TimeState): TimeState {
  const newTurn = time.turn + 1;
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

  return {
    turn: newTurn,
    week: newWeek,
    month: newMonth,
    monthIndex: newMonthIndex,
    year: newYear,
    season: newSeason,
  };
}
