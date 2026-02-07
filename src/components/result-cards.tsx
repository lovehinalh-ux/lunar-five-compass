import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ComputeOutput } from "@/lib/types";

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-dashed border-[#E6D5C3] py-2 sm:grid-cols-[120px_1fr] sm:gap-3">
      <dt className="font-semibold text-[#8A6F55]">{label}</dt>
      <dd className="m-0 text-[#3A2A1E]">{value}</dd>
    </div>
  );
}

export function ResultCards({ result }: { result: ComputeOutput }) {
  return (
    <section className="grid gap-5 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>農曆生日與歲數</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-1">
            <ResultRow label="國曆生日" value={result.solarBirthday} />
            <ResultRow label="農曆生日" value={result.lunarBirthday} />
            <ResultRow label="今天（國曆）" value={result.todaySolar} />
            <ResultRow label="今天（農曆）" value={result.todayLunar} />
            <ResultRow label="農曆足歲" value={result.lunarAge} />
            <ResultRow label="農曆虛歲" value={result.virtualAge} />
          </dl>
          <p className="mt-3 text-sm leading-7 text-[#8A6F55]">{result.ageNote}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>後天五行結果</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-1">
            <ResultRow label="民國出生年" value={result.rocYear} />
            <ResultRow label="後天卦數" value={result.guaNumber} />
            <ResultRow label="五行 / 卦象" value={result.elementGua} />
            <ResultRow label="類型" value={result.personalityType} />
          </dl>
          <p className="mt-3 text-sm leading-7 text-[#8A6F55]">{result.personalityText}</p>
          <p className="text-sm leading-7 text-[#8A6F55]">{result.healthText}</p>
          <p className="text-sm leading-7 text-[#8A6F55]">{result.kuaNote}</p>
        </CardContent>
      </Card>
    </section>
  );
}
