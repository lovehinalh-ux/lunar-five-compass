import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { elementInsights, elementOrder, houtianProfiles, transcriptOrder } from "@/lib/data";
import type { ElementKey } from "@/lib/types";

export function ElementSystemSection({ activeElement }: { activeElement?: ElementKey }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>五行相生相剋說明</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-7 text-[#8A6F55]">
          對照第二張圖：生我者為父母、我生者為子孫、比和者為兄弟、剋我者為官鬼、我剋者為錢財。
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <article className="rounded-2xl border border-[#E6D5C3] bg-[#FFF9F0] p-4">
            <h3 className="font-semibold text-[#3A2A1E]">相生循環</h3>
            <p className="mt-1 text-sm text-[#8A6F55]">木 → 火 → 土 → 金 → 水 → 木</p>
          </article>
          <article className="rounded-2xl border border-[#E6D5C3] bg-[#FFF9F0] p-4">
            <h3 className="font-semibold text-[#3A2A1E]">相剋循環</h3>
            <p className="mt-1 text-sm text-[#8A6F55]">木剋土、土剋水、水剋火、火剋金、金剋木</p>
          </article>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {elementOrder.map((element) => {
            const info = elementInsights[element];
            const active = element === activeElement;
            return (
              <article
                key={element}
                className={`flex h-full flex-col rounded-2xl border p-4 transition ${
                  active
                    ? "border-[#C97A2B] bg-[#F5E6D3] shadow-[0_12px_30px_rgba(58,42,30,0.14)]"
                    : "border-[#E6D5C3] bg-[#FFF9F0]"
                }`}
              >
                <div className="grid justify-items-center">
                  <h3 className="text-center font-semibold text-[#3A2A1E]">{info.title}</h3>
                  <span className="mt-2 block h-px w-20 bg-[#E6D5C3]" aria-hidden />
                </div>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#8A6F55]">
                  {info.summary}
                </p>
                <p className="whitespace-pre-line text-sm leading-6 text-[#8A6F55]">{info.system}</p>
                <div className="mt-auto grid gap-3 rounded-xl border border-[#E6D5C3] bg-white/40 p-4 pt-4">
                  <div className="grid gap-1">
                    <p className="text-sm font-semibold text-[#3A2A1E]">適合顏色：</p>
                    <p className="text-sm font-medium leading-6 text-[#8A6F55]">{info.suitableColors}</p>
                  </div>
                  <div className="grid gap-1 border-t border-[#E6D5C3]/70 pt-3">
                    <p className="text-sm font-semibold text-[#3A2A1E]">不適合顏色：</p>
                    <p className="text-sm font-medium leading-6 text-[#8A6F55]">
                      {info.unsuitableColors}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function TranscriptSection() {
  const [openPanels, setOpenPanels] = useState<string[]>([]);

  return (
    <Accordion value={openPanels} onValueChange={setOpenPanels}>
      <AccordionItem value="transcript">
        <AccordionTrigger>後天五行一覽表</AccordionTrigger>
        <AccordionContent className="px-5 pb-5">
          <p className="text-sm leading-7 text-[#8A6F55]">
            已依你提供的圖片整理成可閱讀版本。若你有更高解析圖，我可再幫你逐字校對。
          </p>
          <div className="mt-4 grid gap-3">
            {transcriptOrder.map((gua) => {
              const profile = houtianProfiles[gua];
              return (
                <article
                  key={gua}
                  className="rounded-2xl border border-dashed border-[#E6D5C3] bg-[#FFF9F0] p-4"
                >
                  <h3 className="font-semibold text-[#3A2A1E]">
                    {gua}｜{profile.element}
                    {profile.gua}
                    {profile.symbol}｜{profile.type}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[#8A6F55]">{profile.transcript}</p>
                </article>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function RulesSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>計算規則（目前版本）</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="grid gap-2 pl-4 text-sm leading-7 text-[#8A6F55] marker:font-bold marker:text-[#C97A2B]">
          <li>使用瀏覽器內建 `Intl` 的農曆曆法（Chinese Calendar）進行國曆轉農曆。</li>
          <li>農曆虛歲 = 當前農曆年 - 出生農曆年 + 1。</li>
          <li>農曆足歲以今年農曆生日是否已到計算；遇閏月/小月時以最接近可用日期替代。</li>
          <li>後天五行依民國出生年 + 性別的對照表判讀。</li>
          <li>若命卦為 5，男命歸 2（土坤），女命歸 8（土艮）後再套入說明。</li>
        </ol>
      </CardContent>
    </Card>
  );
}
