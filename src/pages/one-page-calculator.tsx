import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { buildBirthdateFromParts, toAdYear, toRocYear } from "@/lib/date-input";
import { computeResult } from "@/lib/calculator";
import type { ComputeOutput, Gender } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ResultCards } from "@/components/result-cards";
import {
  ElementSystemSection,
  RulesSection,
  TranscriptSection,
} from "@/components/guide-sections";

const monthOptions = Array.from({ length: 12 }, (_, i) => String(i + 1));
const dayOptions = Array.from({ length: 31 }, (_, i) => String(i + 1));

interface FormState {
  year: string; // AD year
  month: string;
  day: string;
  gender: Gender | "";
}

const DEFAULT_FORM_STATE: FormState = {
  year: "",
  month: "",
  day: "",
  gender: "",
};

type PanelValue = "input" | "result" | "guide";

function parseSearchParams(searchParams: URLSearchParams): {
  hasAnyQuery: boolean;
  isComplete: boolean;
  formState: FormState;
  error: string;
} {
  const yearModeRaw = searchParams.get("yearMode"); // legacy support
  const adYearRaw = searchParams.get("adYear"); // legacy support
  const yearRaw = adYearRaw ?? searchParams.get("year") ?? "";
  const month = searchParams.get("month") ?? "";
  const day = searchParams.get("day") ?? "";
  const genderRaw = searchParams.get("gender");

  const hasAnyQuery = Boolean(yearModeRaw || yearRaw || month || day || genderRaw);
  if (!hasAnyQuery) {
    return { hasAnyQuery: false, isComplete: false, formState: DEFAULT_FORM_STATE, error: "" };
  }

  let normalizedYear = yearRaw;
  if (yearModeRaw === "roc" && /^\d+$/.test(yearRaw)) {
    const rocYear = Number.parseInt(yearRaw, 10);
    normalizedYear = String(toAdYear("roc", rocYear));
  }

  const gender: Gender | "" = genderRaw === "male" || genderRaw === "female" ? genderRaw : "";
  const formState: FormState = { year: normalizedYear, month, day, gender };
  const isComplete = Boolean(normalizedYear && month && day && gender);

  if (!isComplete) {
    return {
      hasAnyQuery,
      isComplete: false,
      formState,
      error: "網址參數不完整，請重新輸入生日與性別後產生結果。",
    };
  }

  if (!gender) {
    return {
      hasAnyQuery,
      isComplete: false,
      formState,
      error: "網址中的性別參數無效，請重新選擇。",
    };
  }

  return { hasAnyQuery, isComplete: true, formState, error: "" };
}

export function OnePageCalculator() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
  const [result, setResult] = useState<ComputeOutput | null>(null);
  const [error, setError] = useState("");
  const [activePanels, setActivePanels] = useState<PanelValue[]>(["input"]);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const minYear = 1912;
    return Array.from({ length: currentYear - minYear + 1 }, (_, index) => {
      const adYear = currentYear - index;
      const rocYear = toRocYear(adYear);
      return {
        value: String(adYear),
        label: `西元 ${adYear} / 民國 ${rocYear}`,
      };
    });
  }, []);

  const yearHint = useMemo(() => {
    if (!/^\d+$/.test(formState.year)) return "";
    const adYear = Number.parseInt(formState.year, 10);
    if (adYear < 1) return "";
    const rocYear = toRocYear(adYear);
    return `年份對照：西元 ${adYear} 年 / 民國 ${rocYear} 年`;
  }, [formState.year]);

  useEffect(() => {
    const parsed = parseSearchParams(searchParams);
    if (!parsed.hasAnyQuery) return;

    setFormState(parsed.formState);

    if (!parsed.isComplete) {
      setResult(null);
      setActivePanels(["input"]);
      setError(parsed.error);
      return;
    }

    const birthdateParsed = buildBirthdateFromParts({
      yearMode: "ad",
      year: parsed.formState.year,
      month: parsed.formState.month,
      day: parsed.formState.day,
    });
    if (!birthdateParsed.value) {
      setResult(null);
      setActivePanels(["input"]);
      setError(birthdateParsed.error);
      return;
    }

    const computed = computeResult({
      birthdate: birthdateParsed.value.birthdate,
      gender: parsed.formState.gender,
    });

    if (!computed.result) {
      setResult(null);
      setActivePanels(["input"]);
      setError(computed.error);
      return;
    }

    setResult(computed.result);
    setError("");
    setActivePanels(["input", "result"]);
  }, [searchParams]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.gender) {
      setError("請先選擇性別。");
      setResult(null);
      setActivePanels(["input"]);
      return;
    }

    const birthdateParsed = buildBirthdateFromParts({
      yearMode: "ad",
      year: formState.year,
      month: formState.month,
      day: formState.day,
    });
    if (!birthdateParsed.value) {
      setError(birthdateParsed.error);
      setResult(null);
      setActivePanels(["input"]);
      return;
    }

    const computed = computeResult({
      birthdate: birthdateParsed.value.birthdate,
      gender: formState.gender,
    });

    if (!computed.result) {
      setError(computed.error);
      setResult(null);
      setActivePanels(["input"]);
      return;
    }

    setResult(computed.result);
    setError("");
    setActivePanels((prev) => {
      const next = [...prev];
      if (!next.includes("input")) next.push("input");
      if (!next.includes("result")) next.push("result");
      return next;
    });
    setSearchParams({
      year: formState.year,
      month: formState.month,
      day: formState.day,
      gender: formState.gender,
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_16%_8%,#FFF9F0_0%,transparent_35%),radial-gradient(circle_at_92%_15%,#EEDFCF_0%,transparent_26%),linear-gradient(180deg,#F5E6D3_0%,#EEDFCF_100%)] px-4 py-8">
      <div className="mx-auto grid w-full max-w-6xl gap-5">
        <header className="rounded-3xl border border-[#E6D5C3] bg-[#FFF9F0] px-6 py-5 shadow-[0_16px_40px_rgba(58,42,30,0.08)]">
          <p className="inline-flex rounded-full bg-[#F5E6D3] px-3 py-1 text-xs font-bold tracking-[0.14em] text-[#C97A2B]">
            LUNAR FIVE COMPASS
          </p>
          <h1 className="mt-2 font-['Noto_Serif_TC'] text-2xl font-bold text-[#3A2A1E]">
            Lunar Five Compass
          </h1>
          <p className="mt-2 text-sm leading-7 text-[#8A6F55]">
            一頁式流程：先輸入生日與性別，按下「產生結果」，再以折頁方式查看結果頁與說明頁。
          </p>
        </header>

        <Accordion value={activePanels} onValueChange={setActivePanels}>
          <AccordionItem value="input">
            <AccordionTrigger>輸入頁</AccordionTrigger>
            <AccordionContent className="px-5 pb-5">
              <form className="grid gap-4" onSubmit={onSubmit}>
                <div className="grid gap-3 lg:grid-cols-4">
                  <label className="grid gap-1 text-sm font-semibold text-[#8A6F55]">
                    年
                    <Select
                      value={formState.year}
                      onChange={(event) =>
                        setFormState((prev) => ({
                          ...prev,
                          year: event.target.value,
                        }))
                      }
                      required
                    >
                      <option value="">請選擇年份</option>
                      {yearOptions.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </Select>
                  </label>
                  <label className="grid gap-1 text-sm font-semibold text-[#8A6F55]">
                    月
                    <Select
                      value={formState.month}
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, month: event.target.value }))
                      }
                      required
                    >
                      <option value="">請選擇</option>
                      {monthOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </Select>
                  </label>
                  <label className="grid gap-1 text-sm font-semibold text-[#8A6F55]">
                    日
                    <Select
                      value={formState.day}
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, day: event.target.value }))
                      }
                      required
                    >
                      <option value="">請選擇</option>
                      {dayOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </Select>
                  </label>
                  <label className="grid gap-1 text-sm font-semibold text-[#8A6F55]">
                    性別
                    <Select
                      value={formState.gender}
                      onChange={(event) =>
                        setFormState((prev) => ({
                          ...prev,
                          gender: event.target.value as Gender | "",
                        }))
                      }
                      required
                    >
                      <option value="">請選擇</option>
                      <option value="male">男性</option>
                      <option value="female">女性</option>
                    </Select>
                  </label>
                </div>
                <p className="text-xs text-[#8A6F55]">
                  {yearHint || "輸入年份後會顯示西元/民國對照。"}
                </p>
                <Button type="submit" className="mx-auto w-full md:w-72">
                  產生結果
                </Button>
                <p aria-live="polite" className="min-h-5 text-sm font-semibold text-red-700">
                  {error}
                </p>
              </form>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="result">
            <AccordionTrigger>結果頁</AccordionTrigger>
            <AccordionContent className="px-5 pb-5">
              {result ? (
                <ResultCards result={result} />
              ) : (
                <p className="flex items-center gap-2 text-sm text-[#8A6F55]">
                  <AlertTriangle size={16} className="text-[#C97A2B]" />
                  請先在輸入頁完成資料，點「產生結果」後即可查看內容。
                </p>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="guide">
            <AccordionTrigger>說明頁</AccordionTrigger>
            <AccordionContent className="grid gap-5 px-5 pb-5">
              <ElementSystemSection activeElement={result?.activeElement} />
              <TranscriptSection />
              <RulesSection />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
