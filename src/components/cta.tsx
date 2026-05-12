import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RFStudioBanner } from "@/components/rf-studio-banner";
import type { Rank } from "@/lib/types";

export function CtaBlock({
  rank = "D",
  showFitnessBanner = true,
}: {
  rank?: Rank;
  showFitnessBanner?: boolean;
}) {
  return (
    <div className="mt-6 grid gap-4">
      <p className="text-center text-sm font-black text-sky-800">【企業での体力測定をご検討の方へ】</p>
      <Card className="overflow-hidden border-sky-100 bg-white shadow-md">
        <CardContent className="p-0">
          <div className="relative overflow-hidden bg-gradient-to-r from-white via-sky-50/70 to-sky-100/80">
            <Image
              src="/brand/corporate-trainer-stopwatch.png"
              alt="ストップウォッチを持って笑顔を見せるトレーナー"
              fill
              className="object-cover object-[88%_center] opacity-48"
              sizes="(max-width: 768px) 100vw, 640px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/82 to-white/28" />

            <div className="relative z-10 flex max-w-[67%] flex-col justify-center space-y-4 p-4 sm:p-5 md:max-w-[62%]">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-sky-600">For Companies</p>
                  <h2 className="text-lg font-black leading-snug text-slate-950 sm:text-xl">
                    体力測定イベント実施しませんか？
                  </h2>
                </div>
              </div>

              <p className="text-sm font-semibold leading-7 text-slate-700">
                高年齢労働対策、労災のリスクアセスメント、健康経営の取り組みに。
                現場の体力課題を見える化し、軽労化につながる運動提案まで支援します。
              </p>

            </div>
          </div>

          <div className="relative z-10 space-y-3 border-t border-white/50 bg-white/75 p-4 backdrop-blur-sm">
            <div className="grid grid-cols-3 gap-2">
              <span className="flex min-h-10 items-center justify-center rounded-full bg-white px-2 py-1.5 text-center text-[11px] font-bold leading-4 text-sky-700 shadow-sm sm:text-xs">
                高年齢労働対策
              </span>
              <span className="flex min-h-10 items-center justify-center rounded-full bg-white px-2 py-1.5 text-center text-[11px] font-bold leading-4 text-sky-700 shadow-sm sm:text-xs">
                労災リスクアセスメント
              </span>
              <span className="flex min-h-10 items-center justify-center rounded-full bg-white px-2 py-1.5 text-center text-[11px] font-bold leading-4 text-sky-700 shadow-sm sm:text-xs">
                健康経営
              </span>
            </div>

            <Button
              asChild
              size="lg"
              className="mx-auto h-14 w-full rounded-full bg-sky-600 text-base hover:bg-sky-700"
            >
              <Link href="/business">
                企業向けページを見る
                <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {showFitnessBanner && (
        <div className="grid gap-3">
          <p className="text-center text-sm font-black text-red-700">
            【本格的に運動したい方へのおすすめジム】
          </p>
          <RFStudioBanner rank={rank} />
        </div>
      )}
    </div>
  );
}
