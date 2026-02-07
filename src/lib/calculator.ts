import { houtianProfiles, kuaMapByGender } from "./data";
import type { ComputeInput, ComputeOutput, Gender } from "./types";

interface LunarInfo {
  lunarYear: number;
  month: number;
  day: number;
  isLeap: boolean;
  display: string;
}

interface KuaResult {
  rocYear: number;
  rawGuaNumber: number;
  normalizedGuaNumber: number;
  kuaNote: string;
  profile: (typeof houtianProfiles)[number];
}

const parserFormatter = new Intl.DateTimeFormat("en-u-ca-chinese", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

const lunarDisplayFormatter = new Intl.DateTimeFormat("zh-Hant-TW-u-ca-chinese", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const solarDisplayFormatter = new Intl.DateTimeFormat("zh-Hant-TW", {
  dateStyle: "long",
});

function toStartOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const output = new Date(date);
  output.setDate(output.getDate() + days);
  return output;
}

function getLunarInfo(date: Date): LunarInfo {
  const parts = parserFormatter.formatToParts(date);
  const monthToken = parts.find((part) => part.type === "month")?.value ?? "";
  const dayToken = parts.find((part) => part.type === "day")?.value ?? "";
  const yearToken = parts.find((part) => part.type === "relatedYear")?.value ?? "";

  const isLeap = monthToken.endsWith("bis");
  const month = Number.parseInt(monthToken.replace("bis", ""), 10);
  const day = Number.parseInt(dayToken, 10);
  const lunarYear = Number.parseInt(yearToken, 10);

  return {
    lunarYear,
    month,
    day,
    isLeap,
    display: lunarDisplayFormatter.format(date),
  };
}

function findDateByLunar(
  targetLunarYear: number,
  targetMonth: number,
  targetDay: number,
  targetLeap: boolean,
  centerDate: Date,
): Date | null {
  const baseDate = toStartOfDay(centerDate);
  for (let delta = -220; delta <= 220; delta += 1) {
    const candidate = addDays(baseDate, delta);
    const info = getLunarInfo(candidate);
    if (
      info.lunarYear === targetLunarYear &&
      info.month === targetMonth &&
      info.day === targetDay &&
      info.isLeap === targetLeap
    ) {
      return candidate;
    }
  }
  return null;
}

function resolveBirthdayInCurrentLunarYear(today: Date, birthLunar: LunarInfo) {
  const todayLunar = getLunarInfo(today);
  const targetLunarYear = todayLunar.lunarYear;
  const attempts: Array<{ month: number; day: number; isLeap: boolean; note: string }> = [];

  attempts.push({
    month: birthLunar.month,
    day: birthLunar.day,
    isLeap: birthLunar.isLeap,
    note: "",
  });

  if (birthLunar.isLeap) {
    attempts.push({
      month: birthLunar.month,
      day: birthLunar.day,
      isLeap: false,
      note: "今年無對應閏月，改用同月同日。",
    });
  }

  for (let day = birthLunar.day - 1; day >= 1; day -= 1) {
    attempts.push({
      month: birthLunar.month,
      day,
      isLeap: birthLunar.isLeap,
      note: `本年該月無 ${birthLunar.day} 日，改用該月 ${day} 日計算。`,
    });
    if (birthLunar.isLeap) {
      attempts.push({
        month: birthLunar.month,
        day,
        isLeap: false,
        note: `本年該閏月無 ${birthLunar.day} 日，改用同月 ${day} 日計算。`,
      });
    }
  }

  for (const attempt of attempts) {
    const found = findDateByLunar(
      targetLunarYear,
      attempt.month,
      attempt.day,
      attempt.isLeap,
      today,
    );
    if (found) {
      return { date: found, note: attempt.note };
    }
  }

  return { date: null, note: "無法準確定位本年農曆生日，足歲改為近似估算。" };
}

function calculateLunarAges(birthDate: Date, today: Date) {
  const birthLunar = getLunarInfo(birthDate);
  const todayLunar = getLunarInfo(today);
  const birthdayResolution = resolveBirthdayInCurrentLunarYear(today, birthLunar);

  let lunarAge = todayLunar.lunarYear - birthLunar.lunarYear;
  const virtualAge = lunarAge + 1;
  let note = birthdayResolution.note;

  if (birthdayResolution.date) {
    if (toStartOfDay(today) < toStartOfDay(birthdayResolution.date)) {
      lunarAge -= 1;
    }
  } else {
    const monthReached = todayLunar.month > birthLunar.month;
    const sameMonthDayReached =
      todayLunar.month === birthLunar.month && todayLunar.day >= birthLunar.day;
    if (!monthReached && !sameMonthDayReached) {
      lunarAge -= 1;
    }
  }

  lunarAge = Math.max(0, lunarAge);
  if (!note) note = "足歲以今年農曆生日是否已到為準。";

  return {
    birthLunar,
    todayLunar,
    lunarAge,
    virtualAge: Math.max(1, virtualAge),
    note,
  };
}

function getKuaResult(gender: Gender, birthDate: Date): KuaResult {
  const rocYear = birthDate.getFullYear() - 1911;
  const mod = ((rocYear % 9) + 9) % 9;
  const rawGuaNumber = kuaMapByGender[gender][mod];
  let normalizedGuaNumber = rawGuaNumber;
  let kuaNote = "";

  if (rawGuaNumber === 5) {
    if (gender === "male") {
      normalizedGuaNumber = 2;
      kuaNote = "命卦 5（男）依傳統用坤二土判讀。";
    } else {
      normalizedGuaNumber = 8;
      kuaNote = "命卦 5（女）依傳統用艮八土判讀。";
    }
  }

  return {
    rocYear,
    rawGuaNumber,
    normalizedGuaNumber,
    kuaNote,
    profile: houtianProfiles[normalizedGuaNumber],
  };
}

export function computeResult(input: ComputeInput): { error: string; result: ComputeOutput | null } {
  if (!input.birthdate || !input.gender) {
    return { error: "請先輸入生日並選擇性別。", result: null };
  }

  const birthDate = new Date(`${input.birthdate}T00:00:00`);
  const today = toStartOfDay(new Date());
  if (Number.isNaN(birthDate.getTime())) {
    return { error: "生日格式有誤，請重新選擇。", result: null };
  }
  if (birthDate > today) {
    return { error: "生日不能是未來日期。", result: null };
  }

  const rocYear = birthDate.getFullYear() - 1911;
  if (rocYear < 1) {
    return { error: "目前版本僅支援民國元年（西元 1912）之後出生者。", result: null };
  }

  const ageResult = calculateLunarAges(birthDate, today);
  const kuaResult = getKuaResult(input.gender, birthDate);

  return {
    error: "",
    result: {
      solarBirthday: solarDisplayFormatter.format(birthDate),
      lunarBirthday: `${ageResult.birthLunar.display}（${
        ageResult.birthLunar.isLeap ? "閏" : ""
      }${ageResult.birthLunar.month}月${ageResult.birthLunar.day}日）`,
      todaySolar: solarDisplayFormatter.format(today),
      todayLunar: `${ageResult.todayLunar.display}（${
        ageResult.todayLunar.isLeap ? "閏" : ""
      }${ageResult.todayLunar.month}月${ageResult.todayLunar.day}日）`,
      lunarAge: `${ageResult.lunarAge} 歲`,
      virtualAge: `${ageResult.virtualAge} 歲`,
      ageNote: ageResult.note,
      rocYear: `${kuaResult.rocYear} 年`,
      guaNumber:
        kuaResult.rawGuaNumber === kuaResult.normalizedGuaNumber
          ? `${kuaResult.normalizedGuaNumber}`
          : `${kuaResult.rawGuaNumber} → ${kuaResult.normalizedGuaNumber}`,
      elementGua: `${kuaResult.profile.element} / ${kuaResult.profile.gua}${kuaResult.profile.symbol}`,
      personalityType: kuaResult.profile.type,
      personalityText: `個性：${kuaResult.profile.personality}`,
      healthText: `健康提醒：${kuaResult.profile.health}`,
      kuaNote: kuaResult.kuaNote || "命卦以民國出生年與性別對照圖表推算。",
      activeElement: kuaResult.profile.element,
    },
  };
}
