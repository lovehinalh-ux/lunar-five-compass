import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { buildBirthdateFromParts, toAdYear, toRocYear } from "@/lib/date-input";
import { computeResult } from "@/lib/calculator";
import type { ComputeOutput, Gender, YearMode } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  yearMode: YearMode;
  year: string;
  month: string;
  day: string;
  gender: Gender | "";
}

const DEFAULT_FORM_STATE: FormState = {
  yearMode: "ad",
  year: "",
  month: "",
  day: "",
  gender: "",
};

type PanelValue = "result" | "guide" | null;

function parseSearchParams(searchParams: URLSearchParams): {
  hasAnyQuery: boolean;
  isComplete: boolean;
  formState: FormState;
  error: string;
} {
  const yearModeRaw = searchParams.get("yearMode");
  const year = searchParams.get("year") ?? "";
  const month = searchParams.get("month") ?? "";
  const day = searchParams.get("day") ?? "";
  const genderRaw = searchParams.get("gender");

  const hasAnyQuery = Boolean(yearModeRaw || year || month || day || genderRaw);
  if (!hasAnyQuery) {
    return { hasAnyQuery: false, isComplete: false, formState: DEFAULT_FORM_STATE, error: "" };
  }

  const yearMode: YearMode = yearModeRaw === "roc" ? "roc" : "ad";
  const gender: Gender | "" = genderRaw === "male" || genderRaw === "female" ? genderRaw : "";
  const formState: FormState = { yearMode, year, month, day, gender };
  const isComplete = Boolean(year && month && day && gender);

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
  const [activePanel, setActivePanel] = useState<PanelValue>(null);

  const yearHint = useMemo(() => {
    if (!/^\d+$/.test(formState.year)) return "";
    const yearNumber = Number.parseInt(formState.year, 10);
    if (yearNumber < 1) return "";
    const adYear = toAdYear(formState.yearMode, yearNumber);
    const rocYear = toRocYear(adYear);
    return `年份對照：西元 ${adYear} 年 / 民國 ${rocYear} 年`;
  }, [formState.yearMode, formState.year]);

  useEffect(() => {
    const parsed = parseSearchParams(searchParams);
    if (!parsed.hasAnyQuery) return;

    setFormState(parsed.formState);

    if (!parsed.isComplete) {
      setResult(null);
      setActivePanel(null);
      setError(parsed.error);
      return;
    }

    const birthdateParsed = buildBirthdateFromParts(parsed.formState);
    if (!birthdateParsed.value) {
      setResult(null);
      setActivePanel(null);
      setError(birthdateParsed.error);
      return;
    }

    const computed = computeResult({
      birthdate: birthdateParsed.value.birthdate,
      gender: parsed.formState.gender,
    });

    if (!computed.result) {
      setResult(null);
      setActivePanel(null);
      setError(computed.error);
      return;
    }

    setResult(computed.result);
    setError("");
    setActivePanel("result");
  }, [searchParams]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.gender) {
      setError("請先選擇性別。");
      setResult(null);
      setActivePanel(null);
      return;
    }

    const birthdateParsed = buildBirthdateFromParts(formState);
    if (!birthdateParsed.value) {
      setError(birthdateParsed.error);
      setResult(null);
      setActivePanel(null);
      return;
    }

    const computed = computeResult({
      birthdate: birthdateParsed.value.birthdate,
      gender: formState.gender,
    });

    if (!computed.result) {
      setError(computed.error);
      setResult(null);
      setActivePanel(null);
      return;
    }

    setResult(computed.result);
    setError("");
    setActivePanel("result");
    setSearchParams({
      yearMode: formState.yearMode,
      year: formState.year,
      month: formState.month,
      day: formState.day,
      gender: formState.gender,
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_16%_8%,#fffaf0_0%,transparent_35%),radial-gradient(circle_at_92%_15%,#dfeee7_0%,transparent_26%),linear-gradient(180deg,#f7f1e5_0%,#ece2d5_100%)] px-4 py-8">
      <div className="mx-auto grid w-full max-w-6xl gap-5">
        <header className="rounded-3xl border border-[#d5cdbf] bg-[#fffdf8] px-6 py-5 shadow-[0_16px_40px_rgba(34,24,12,0.08)]">
          <p className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold tracking-[0.14em] text-emerald-800">
            LUNAR FIVE COMPASS
          </p>
          <h1 className="mt-2 font-['Noto_Serif_TC'] text-2xl font-bold text-zinc-900">
            Lunar Five Compass
          </h1>
          <p className="mt-2 text-sm leading-7 text-zinc-700">
            一頁式流程：先輸入生日與性別，按下「產生結果」，再以折頁方式查看結果頁與說明頁。
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>輸入資料</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-3 md:max-w-2xl" onSubmit={onSubmit}>
              <div className="grid gap-3 md:grid-cols-4">
                <label className="grid gap-1 text-sm font-semibold text-zinc-700">
                  年份格式
                  <Select
                    value={formState.yearMode}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        yearMode: event.target.value as YearMode,
                      }))
                    }
                    required
                  >
                    <option value="ad">西元</option>
                    <option value="roc">民國</option>
                  </Select>
                </label>
                <label className="grid gap-1 text-sm font-semibold text-zinc-700">
                  年
                  <Input
                    value={formState.year}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        year: event.target.value.replace(/[^\d]/g, ""),
                      }))
                    }
                    inputMode="numeric"
                    placeholder={formState.yearMode === "ad" ? "例如 1990" : "例如 79"}
                    required
                  />
                </label>
                <label className="grid gap-1 text-sm font-semibold text-zinc-700">
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
                <label className="grid gap-1 text-sm font-semibold text-zinc-700">
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
              </div>
              <p className="text-xs text-zinc-600">
                {yearHint || "輸入年份後會顯示西元/民國對照。"}
              </p>
              <label className="grid gap-1 text-sm font-semibold text-zinc-700 md:max-w-xs">
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
              <Button type="submit" className="md:max-w-xs">
                產生結果
              </Button>
              <p aria-live="polite" className="min-h-5 text-sm font-semibold text-red-700">
                {error}
              </p>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>資安與部署基線</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="flex items-center gap-2 text-sm text-zinc-700">
              <ShieldCheck size={16} className="text-emerald-700" />
              React + TypeScript、ESLint Security、npm audit、GitHub Actions build 驗證。
            </p>
          </CardContent>
        </Card>

        {result ? (
          <Accordion value={activePanel} onValueChange={(value) => setActivePanel(value as PanelValue)}>
            <AccordionItem value="result">
              <AccordionTrigger>結果頁</AccordionTrigger>
              <AccordionContent className="px-5 pb-5">
                <ResultCards result={result} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="guide">
              <AccordionTrigger>說明頁</AccordionTrigger>
              <AccordionContent className="grid gap-5 px-5 pb-5">
                <ElementSystemSection activeElement={result.activeElement} />
                <TranscriptSection />
                <RulesSection />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <Card>
            <CardContent className="py-5">
              <p className="flex items-center gap-2 text-sm text-zinc-700">
                <AlertTriangle size={16} className="text-amber-600" />
                請先輸入生日與性別，點「產生結果」後會顯示折頁內容。
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
