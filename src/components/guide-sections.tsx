import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { elementInsights, elementOrder, houtianProfiles, transcriptOrder } from "@/lib/data";
import type { ElementKey } from "@/lib/types";

export function ElementSystemSection({ activeElement }: { activeElement?: ElementKey }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>五行相生相剋說明</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-7 text-zinc-700">
          對照第二張圖：生我者為父母、我生者為子孫、比和者為兄弟、剋我者為官鬼、我剋者為錢財。
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <article className="rounded-2xl border border-[#dfd6c8] bg-[#fff9f0] p-4">
            <h3 className="font-semibold text-zinc-900">相生循環</h3>
            <p className="mt-1 text-sm text-zinc-700">木 → 火 → 土 → 金 → 水 → 木</p>
          </article>
          <article className="rounded-2xl border border-[#dfd6c8] bg-[#fff9f0] p-4">
            <h3 className="font-semibold text-zinc-900">相剋循環</h3>
            <p className="mt-1 text-sm text-zinc-700">木剋土、土剋水、水剋火、火剋金、金剋木</p>
          </article>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {elementOrder.map((element) => {
            const info = elementInsights[element];
            const active = element === activeElement;
            return (
              <article
                key={element}
                className={`rounded-2xl border p-4 transition ${
                  active
                    ? "border-emerald-500 bg-emerald-50 shadow-[0_12px_30px_rgba(32,81,65,0.16)]"
                    : "border-[#d8cfbf] bg-[#fffefb]"
                }`}
              >
                <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                  {element}
                </span>
                <h3 className="mt-2 font-semibold text-zinc-900">{info.title}</h3>
                <p className="mt-1 text-sm leading-6 text-zinc-700">{info.summary}</p>
                <p className="text-sm leading-6 text-zinc-700">{info.system}</p>
              </article>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function TranscriptSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>照片文字版（後天卦數 1/2/3/4/6/7/8/9）</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-7 text-zinc-700">
          已依你提供的圖片整理成可閱讀版本。若你有更高解析圖，我可再幫你逐字校對。
        </p>
        <div className="mt-4 grid gap-3">
          {transcriptOrder.map((gua) => {
            const profile = houtianProfiles[gua];
            return (
              <article key={gua} className="rounded-2xl border border-dashed border-[#d8cfbf] bg-[#fffdfa] p-4">
                <h3 className="font-semibold text-zinc-900">
                  {gua}｜{profile.element}
                  {profile.gua}
                  {profile.symbol}｜{profile.type}
                </h3>
                <p className="mt-2 text-sm leading-7 text-zinc-700">{profile.transcript}</p>
              </article>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function RulesSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>計算規則（目前版本）</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="grid gap-2 pl-4 text-sm leading-7 text-zinc-700 marker:font-bold marker:text-amber-600">
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
