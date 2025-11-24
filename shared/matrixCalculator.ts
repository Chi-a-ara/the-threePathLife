/**
 * Destiny Matrix Calculator
 * Calculates the 22 arcana numbers from a birth date
 */

export interface MatrixCalculation {
  // Core numbers from birth date
  day: number;
  month: number;
  year: number;
  
  // Calculated arcana (1-22)
  destiny: number;
  purpose: number;
  money: number;
  health: number;
  talents: number;
  relationships: number;
  spiritual: number;
  
  // All 22 positions in the matrix
  allArcana: number[];
}

/**
 * Reduce a number to 1-22 range by summing digits
 * Example: 25 → 2+5 = 7; 31 → 3+1 = 4
 */
function reduceToArcana(num: number): number {
  while (num > 22) {
    const digits = num.toString().split('').map(Number);
    num = digits.reduce((sum, digit) => sum + digit, 0);
  }
  return num === 0 ? 22 : num;
}

/**
 * Parse birth date string (DD.MM.YYYY) into components
 */
function parseBirthDate(birthDate: string): { day: number; month: number; year: number } {
  const [dayStr, monthStr, yearStr] = birthDate.split('.');
  return {
    day: parseInt(dayStr, 10),
    month: parseInt(monthStr, 10),
    year: parseInt(yearStr, 10),
  };
}

/**
 * Calculate the complete Destiny Matrix from birth date
 */
export function calculateMatrix(birthDate: string): MatrixCalculation {
  const { day, month, year } = parseBirthDate(birthDate);
  
  // Reduce day, month, year to arcana
  const dayArcana = reduceToArcana(day);
  const monthArcana = reduceToArcana(month);
  const yearArcana = reduceToArcana(year);
  
  // Calculate key positions
  // Destiny = sum of all components
  const destiny = reduceToArcana(day + month + year);
  
  // Purpose = day + month
  const purpose = reduceToArcana(day + month);
  
  // Money = month + year
  const money = reduceToArcana(month + year);
  
  // Health = day + year
  const health = reduceToArcana(day + year);
  
  // Talents = day + destiny
  const talents = reduceToArcana(day + destiny);
  
  // Relationships = month + destiny
  const relationships = reduceToArcana(month + destiny);
  
  // Spiritual = year + destiny
  const spiritual = reduceToArcana(year + destiny);
  
  // Additional positions for complete 22-position matrix
  const pos8 = reduceToArcana(dayArcana + monthArcana);
  const pos9 = reduceToArcana(monthArcana + yearArcana);
  const pos10 = reduceToArcana(dayArcana + yearArcana);
  const pos11 = reduceToArcana(purpose + money);
  const pos12 = reduceToArcana(money + health);
  const pos13 = reduceToArcana(health + purpose);
  const pos14 = reduceToArcana(talents + relationships);
  const pos15 = reduceToArcana(relationships + spiritual);
  const pos16 = reduceToArcana(spiritual + talents);
  const pos17 = reduceToArcana(pos11 + pos12);
  const pos18 = reduceToArcana(pos12 + pos13);
  const pos19 = reduceToArcana(pos13 + pos11);
  const pos20 = reduceToArcana(pos14 + pos15);
  const pos21 = reduceToArcana(pos15 + pos16);
  const pos22 = reduceToArcana(pos16 + pos14);
  
  return {
    day: dayArcana,
    month: monthArcana,
    year: yearArcana,
    destiny,
    purpose,
    money,
    health,
    talents,
    relationships,
    spiritual,
    allArcana: [
      dayArcana,
      monthArcana,
      yearArcana,
      destiny,
      purpose,
      money,
      health,
      talents,
      relationships,
      spiritual,
      pos8,
      pos9,
      pos10,
      pos11,
      pos12,
      pos13,
      pos14,
      pos15,
      pos16,
      pos17,
      pos18,
      pos19,
      pos20,
      pos21,
      pos22,
    ],
  };
}

/**
 * Get arcana name by number
 */
export function getArcanaName(number: number): string {
  const names: Record<number, string> = {
    1: "The Pioneer",
    2: "The Secret",
    3: "The Empress",
    4: "The Emperor",
    5: "The Pope",
    6: "Love",
    7: "Movement",
    8: "Justice",
    9: "The Hermit",
    10: "Fortune",
    11: "Strength",
    12: "Sacrifice",
    13: "Death",
    14: "Temperance",
    15: "The Devil",
    16: "The Tower",
    17: "The Star",
    18: "The Moon",
    19: "The Sun",
    20: "Judgment",
    21: "The World",
    22: "The Fool",
  };
  return names[number] || "Unknown";
}
