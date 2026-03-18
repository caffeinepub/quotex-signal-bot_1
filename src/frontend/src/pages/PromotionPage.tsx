import { Gift, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useActivePromotions } from "../hooks/useQueries";

const STATIC_PROMOS = [
  {
    id: "s1",
    description: "প্রথম ডিপোজিটে ৫০% বোনাস পান। সর্বনিম্ন ডিপোজিট ৫০০ টাকা।",
    bonusAmount: BigInt(500),
    emoji: "🎁",
  },
  {
    id: "s2",
    description: "প্রতিদিন লগইন করলে ৫ টাকা ক্যাশব্যাক।",
    bonusAmount: BigInt(5),
    emoji: "🎯",
  },
  {
    id: "s3",
    description: "বন্ধুকে রেফার করুন, প্রতি রেফারে ১০০ টাকা পান।",
    bonusAmount: BigInt(100),
    emoji: "👥",
  },
  {
    id: "s4",
    description: "সাপ্তাহিক টার্নওভার বোনাস — ২% অতিরিক্ত।",
    bonusAmount: BigInt(200),
    emoji: "📈",
  },
];

export default function PromotionPage() {
  const { data: promotions, isLoading } = useActivePromotions();
  const allPromos = [...STATIC_PROMOS, ...(promotions ?? [])];

  return (
    <div className="min-h-[calc(100vh-130px)] px-4 py-6 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col items-center mb-6">
          <Gift
            className="w-9 h-9 mb-1"
            style={{ color: "oklch(0.76 0.13 85)" }}
          />
          <h1
            className="text-xl font-bold"
            style={{ color: "oklch(0.76 0.13 85)" }}
          >
            প্রোমোশন
          </h1>
          <p className="text-sm text-muted-foreground">বর্তমান অফার ও বোনাস</p>
        </div>

        {isLoading && (
          <div
            className="flex justify-center py-8"
            data-ocid="promotion.loading_state"
          >
            <Loader2
              className="w-6 h-6 animate-spin text-gold"
              style={{ color: "oklch(0.76 0.13 85)" }}
            />
          </div>
        )}

        <div className="space-y-3" data-ocid="promotion.list">
          {allPromos.map((promo, i) => {
            const emoji = "emoji" in promo ? promo.emoji : "🎁";
            const bonusAmt =
              typeof promo.bonusAmount === "bigint"
                ? Number(promo.bonusAmount)
                : 0;
            return (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-border bg-card p-4 flex gap-3 items-start"
                data-ocid={`promotion.item.${i + 1}`}
              >
                <span className="text-2xl flex-shrink-0 mt-0.5">{emoji}</span>
                <div className="flex-1">
                  <p className="text-sm text-foreground leading-relaxed">
                    {promo.description}
                  </p>
                  <div
                    className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-black"
                    style={{ background: "oklch(0.76 0.13 85)" }}
                  >
                    বোনাস: ৳{bonusAmt}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {allPromos.length === 0 && !isLoading && (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="promotion.empty_state"
          >
            <Gift className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>কোনো সক্রিয় প্রোমোশন নেই</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
