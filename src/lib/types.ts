export type Gender = "male" | "female";
export type ElementKey = "木" | "火" | "土" | "金" | "水";
export type YearMode = "ad" | "roc";

export interface HoutianProfile {
  element: ElementKey;
  gua: string;
  symbol: string;
  type: string;
  personality: string;
  health: string;
  transcript: string;
}

export interface ElementInsight {
  title: string;
  summary: string;
  system: string;
  suitableColors: string;
  unsuitableColors: string;
}

export interface ComputeInput {
  birthdate: string;
  gender: Gender | "";
}

export interface ComputeOutput {
  solarBirthday: string;
  lunarBirthday: string;
  todaySolar: string;
  todayLunar: string;
  lunarAge: string;
  virtualAge: string;
  ageNote: string;
  rocYear: string;
  guaNumber: string;
  elementGua: string;
  personalityType: string;
  personalityText: string;
  healthText: string;
  kuaNote: string;
  activeElement: ElementKey;
}
