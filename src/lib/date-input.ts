import type { YearMode } from "./types";

export interface BirthdatePartsInput {
  yearMode: YearMode;
  year: string;
  month: string;
  day: string;
}

export interface BirthdatePartsOutput {
  birthdate: string;
  adYear: number;
  rocYear: number;
}

export function toAdYear(yearMode: YearMode, year: number): number {
  return yearMode === "roc" ? year + 1911 : year;
}

export function toRocYear(adYear: number): number {
  return adYear - 1911;
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function isIntegerString(value: string): boolean {
  return /^\d+$/.test(value);
}

export function buildBirthdateFromParts(
  input: BirthdatePartsInput,
): { error: string; value: BirthdatePartsOutput | null } {
  const { yearMode, year, month, day } = input;

  if (!year || !month || !day) {
    return { error: "請完整輸入年、月、日。", value: null };
  }

  if (!isIntegerString(year) || !isIntegerString(month) || !isIntegerString(day)) {
    return { error: "年月日需為數字。", value: null };
  }

  const yearNumber = Number.parseInt(year, 10);
  const monthNumber = Number.parseInt(month, 10);
  const dayNumber = Number.parseInt(day, 10);

  if (yearNumber < 1) {
    return { error: "年份需大於 0。", value: null };
  }
  if (monthNumber < 1 || monthNumber > 12) {
    return { error: "月份需介於 1 到 12。", value: null };
  }
  if (dayNumber < 1 || dayNumber > 31) {
    return { error: "日期需介於 1 到 31。", value: null };
  }

  const adYear = toAdYear(yearMode, yearNumber);
  const rocYear = toRocYear(adYear);
  if (adYear < 1) {
    return { error: "換算後年份無效。", value: null };
  }

  const date = new Date(adYear, monthNumber - 1, dayNumber);
  if (
    date.getFullYear() !== adYear ||
    date.getMonth() !== monthNumber - 1 ||
    date.getDate() !== dayNumber
  ) {
    return { error: "輸入的日期不存在，請重新確認。", value: null };
  }

  const birthdate = `${adYear}-${pad2(monthNumber)}-${pad2(dayNumber)}`;
  return { error: "", value: { birthdate, adYear, rocYear } };
}
