import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Rank } from "@/lib/types";

type RFStudioBannerProps = {
  imageUrl?: string;
  rank?: Rank;
};

const rankTheme: Record<
  Rank,
  {
    border: string;
    eyebrow: string;
    headline: string;
    chip: string;
    panel: string;
    cta: string;
    accent: string;
  }
> = {
  A: {
    border: "border-teal-200",
    eyebrow: "text-teal-700",
    headline: "text-teal-700",
    chip: "bg-teal-700",
    panel: "border-teal-100 bg-teal-50/80",
    cta: "bg-teal-600 hover:bg-teal-700",
    accent: "text-teal-700",
  },
  B: {
    border: "border-emerald-200",
    eyebrow: "text-emerald-700",
    headline: "text-emerald-700",
    chip: "bg-emerald-700",
    panel: "border-emerald-100 bg-emerald-50/80",
    cta: "bg-emerald-600 hover:bg-emerald-700",
    accent: "text-emerald-700",
  },
  C: {
    border: "border-orange-200",
    eyebrow: "text-orange-700",
    headline: "text-orange-700",
    chip: "bg-orange-600",
    panel: "border-orange-100 bg-orange-50/80",
    cta: "bg-orange-600 hover:bg-orange-700",
    accent: "text-orange-700",
  },
  D: {
    border: "border-red-200",
    eyebrow: "text-red-700",
    headline: "text-red-700",
    chip: "bg-red-600",
    panel: "border-red-100 bg-red-50/80",
    cta: "bg-red-600 hover:bg-red-700",
    accent: "text-red-700",
  },
  E: {
    border: "border-rose-200",
    eyebrow: "text-rose-700",
    headline: "text-rose-700",
    chip: "bg-rose-600",
    panel: "border-rose-100 bg-rose-50/80",
    cta: "bg-rose-600 hover:bg-rose-700",
    accent: "text-rose-700",
  },
};

export function RFStudioBanner({
  imageUrl = "/brand/rf-studio-banner-main.png",
  rank = "D",
}: RFStudioBannerProps) {
  const theme = rankTheme[rank];

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border-2 bg-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl",
        theme.border,
      )}
    >
      <div className="overflow-hidden bg-white">
        {/* The banner intentionally accepts a plain img source so campaign assets can be swapped externally. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="RFスタジオ札幌のキックボクシングバナー"
          className="block h-auto w-full object-cover"
        />
      </div>

      <div className="space-y-3 border-t border-slate-100 bg-white/95 p-4 sm:p-5">
        <div className="grid grid-cols-3 gap-2">
          <span className="flex min-h-10 items-center justify-center rounded-full bg-white px-2 py-1.5 text-center text-[11px] font-bold leading-4 text-slate-700 shadow-sm sm:text-xs">
            楽しく続けられる
          </span>
          <span className="flex min-h-10 items-center justify-center rounded-full bg-white px-2 py-1.5 text-center text-[11px] font-bold leading-4 text-slate-700 shadow-sm sm:text-xs">
            全身運動
          </span>
          <span className="flex min-h-10 items-center justify-center rounded-full bg-white px-2 py-1.5 text-center text-[11px] font-bold leading-4 text-slate-700 shadow-sm sm:text-xs">
            ストレス発散
          </span>
        </div>

        <Button asChild className={cn("h-14 w-full rounded-full text-base transition-transform hover:scale-[1.01]", theme.cta)}>
          <a href="https://rfsapporo.com/" target="_blank" rel="noreferrer">
            RFスタジオ札幌 公式サイトはこちら
            <ExternalLink size={18} />
          </a>
        </Button>
      </div>
    </section>
  );
}

export function RFStudioBannerSample() {
  return <RFStudioBanner imageUrl="https://placehold.co/280x420/png?text=Kickboxing" rank="C" />;
}
