import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { GAMES, GAME_CATEGORIES, type Game } from "../data/games";

function useJackpotCounter(target: number, duration = 3000) {
  const [value, setValue] = useState(target * 0.9);
  const frameRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const startVal = useRef(target * 0.9);

  useEffect(() => {
    const animate = (time: number) => {
      if (!startRef.current) startRef.current = time;
      const elapsed = time - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(startVal.current + (target - startVal.current) * eased);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration]);

  return value;
}

function GameCard({
  game,
  index,
  onClick,
}: { game: Game; index: number; onClick?: () => void }) {
  const gradients: Record<string, string> = {
    "from-purple-900 to-purple-700":
      "linear-gradient(135deg, #3b0764, #7e22ce)",
    "from-blue-900 to-cyan-700": "linear-gradient(135deg, #1e3a5f, #0e7490)",
    "from-amber-900 to-amber-600": "linear-gradient(135deg, #78350f, #d97706)",
    "from-yellow-900 to-yellow-600":
      "linear-gradient(135deg, #713f12, #ca8a04)",
    "from-red-900 to-red-700": "linear-gradient(135deg, #7f1d1d, #b91c1c)",
    "from-green-900 to-emerald-600":
      "linear-gradient(135deg, #14532d, #059669)",
    "from-orange-900 to-red-700": "linear-gradient(135deg, #7c2d12, #b91c1c)",
    "from-indigo-900 to-purple-700":
      "linear-gradient(135deg, #1e1b4b, #7e22ce)",
    "from-red-900 to-pink-700": "linear-gradient(135deg, #7f1d1d, #be185d)",
    "from-orange-900 to-amber-600": "linear-gradient(135deg, #7c2d12, #d97706)",
    "from-pink-900 to-rose-600": "linear-gradient(135deg, #500724, #e11d48)",
    "from-stone-900 to-amber-800": "linear-gradient(135deg, #292524, #92400e)",
    "from-teal-900 to-green-700": "linear-gradient(135deg, #134e4a, #15803d)",
    "from-fuchsia-900 to-pink-600": "linear-gradient(135deg, #4a044e, #db2777)",
    "from-sky-900 to-blue-700": "linear-gradient(135deg, #0c4a6e, #1d4ed8)",
    "from-pink-900 to-purple-700": "linear-gradient(135deg, #500724, #7e22ce)",
    "from-cyan-900 to-teal-700": "linear-gradient(135deg, #164e63, #0f766e)",
    "from-red-950 to-orange-700": "linear-gradient(135deg, #450a0a, #c2410c)",
    "from-violet-900 to-indigo-700":
      "linear-gradient(135deg, #2e1065, #4338ca)",
    "from-blue-950 to-cyan-800": "linear-gradient(135deg, #172554, #155e75)",
    "from-teal-950 to-blue-700": "linear-gradient(135deg, #042f2e, #1d4ed8)",
    "from-green-950 to-teal-700": "linear-gradient(135deg, #052e16, #0f766e)",
    "from-amber-950 to-red-800": "linear-gradient(135deg, #451a03, #991b1b)",
    "from-gray-900 to-slate-700": "linear-gradient(135deg, #111827, #334155)",
    "from-orange-950 to-yellow-700":
      "linear-gradient(135deg, #431407, #a16207)",
    "from-indigo-950 to-blue-800": "linear-gradient(135deg, #1e1b4b, #1e40af)",
  };

  const bg =
    gradients[game.gradient] ?? "linear-gradient(135deg, #1a3a2a, #2a5a3a)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className={cn(
        "relative rounded-xl overflow-hidden cursor-pointer game-card-hover",
        game.muted && "opacity-40 grayscale",
      )}
      onClick={onClick}
      data-ocid={`games.item.${index + 1}`}
    >
      <div
        className="aspect-[3/4] flex flex-col items-center justify-center relative"
        style={{ background: bg }}
      >
        {/* Star bookmark */}
        <button
          type="button"
          className="absolute top-2 right-2 p-1 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
          data-ocid={`games.toggle.${index + 1}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Bookmark className="w-3 h-3 text-white" />
        </button>

        {/* Muted badge */}
        {game.muted && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/70 text-white z-10">
            শীঘ্রই
          </div>
        )}

        {/* Game emoji */}
        <span className="text-4xl mb-2">{game.emoji}</span>

        {/* Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
          <p className="text-white text-xs font-bold leading-tight truncate">
            {game.name}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: "oklch(0.76 0.13 85)" }}
          >
            {game.provider}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("popular");
  const jackpotValue = useJackpotCounter(10723904.44);
  const navigate = useNavigate();

  const filteredGames = GAMES.filter((g) => g.category === activeCategory);

  return (
    <div className="max-w-screen-lg mx-auto">
      {/* Hero Banner */}
      <section className="relative overflow-hidden" data-ocid="home.section">
        <img
          src="/assets/generated/winx888-hero-banner.dim_1200x400.jpg"
          alt="প্রথম ডিপোজিট পুরস্কার ৫০%"
          className="w-full object-cover"
          style={{ maxHeight: "200px", objectPosition: "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
          <div className="px-6">
            <h1 className="text-xl md:text-3xl font-bold text-white leading-tight">
              প্রথম ডিপোজিট
              <br />
              <span className="gold-gradient">পুরস্কার ৫০%</span>
            </h1>
            <Link
              to="/register"
              className="mt-3 inline-block px-5 py-2 rounded-full text-sm font-bold text-black transition-opacity hover:opacity-90"
              style={{ background: "oklch(0.76 0.13 85)" }}
              data-ocid="home.primary_button"
            >
              এখনি যোগদিন
            </Link>
          </div>
        </div>
      </section>

      <div className="px-3 pb-4">
        {/* Category Tabs */}
        <div
          className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide pb-1"
          data-ocid="home.panel"
        >
          {GAME_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium border transition-all",
                activeCategory === cat.id
                  ? "border-gold text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-gold/50 hover:text-foreground bg-card",
              )}
              style={
                activeCategory === cat.id
                  ? {
                      background: "oklch(0.76 0.13 85)",
                      borderColor: "oklch(0.76 0.13 85)",
                    }
                  : undefined
              }
              data-ocid="home.tab"
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Jackpot Section */}
        <section
          className="mt-4 rounded-2xl overflow-hidden relative"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.18 0.06 162), oklch(0.22 0.08 162))",
          }}
        >
          <img
            src="/assets/generated/winx888-jackpot.dim_800x300.jpg"
            alt="Jackpot"
            className="w-full object-cover opacity-40"
            style={{ height: "130px" }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p
              className="text-xs font-bold tracking-[0.3em] uppercase mb-1"
              style={{ color: "oklch(0.76 0.13 85)" }}
            >
              🏆 JACKPOT
            </p>
            <p
              className="text-3xl md:text-4xl font-bold jackpot-number animate-jackpot-pulse"
              style={{
                color: "oklch(0.85 0.12 85)",
                textShadow: "0 0 20px oklch(0.76 0.13 85 / 0.8)",
              }}
            >
              {jackpotValue.toLocaleString("en-BD", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              বর্তমান জ্যাকপট পুরস্কার
            </p>
          </div>
        </section>

        {/* Games Grid */}
        <section className="mt-5" data-ocid="games.section">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">
              {GAME_CATEGORIES.find((c) => c.id === activeCategory)?.icon}
            </span>
            <h2 className="font-bold text-base text-foreground">
              {GAME_CATEGORIES.find((c) => c.id === activeCategory)?.label}
            </h2>
            <span className="text-xs text-muted-foreground ml-1">
              ({filteredGames.length} গেম)
            </span>
          </div>

          {filteredGames.length === 0 ? (
            <div
              className="text-center py-10 text-muted-foreground"
              data-ocid="games.empty_state"
            >
              এই ক্যাটাগরিতে কোনো গেম নেই
            </div>
          ) : (
            <div
              className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2"
              data-ocid="games.list"
            >
              {filteredGames.map((game, i) => (
                <GameCard
                  key={game.id}
                  game={game}
                  index={i}
                  onClick={() => !game.muted && navigate({ to: "/games" })}
                />
              ))}
            </div>
          )}
        </section>

        {/* Footer credit */}
        <div className="mt-8 text-center text-xs text-muted-foreground pb-2">
          <p>
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
            >
              Built with ❤️ using caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
