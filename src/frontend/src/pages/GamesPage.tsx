import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback, useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────
// Shared balance state lifted to page level
// ─────────────────────────────────────────────

const INITIAL_BALANCE = 1000;

// ─────────────────────────────────────────────
// CRASH GAME
// ─────────────────────────────────────────────

type CrashHistoryEntry = { value: number; id: number };

function CrashGame({
  balance,
  setBalance,
}: { balance: number; setBalance: (fn: (b: number) => number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const stateRef = useRef({
    running: false,
    multiplier: 1.0,
    crashPoint: 1.0,
    cashedOut: false,
    startTime: 0,
    points: [] as { x: number; y: number }[],
  });

  const [phase, setPhase] = useState<
    "idle" | "running" | "cashedout" | "crashed"
  >("idle");
  const [multiplier, setMultiplier] = useState(1.0);
  const [bet, setBet] = useState(100);
  const [history, setHistory] = useState<CrashHistoryEntry[]>([]);
  const [resultMsg, setResultMsg] = useState("");

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0a1a0f";
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = (H / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    const s = stateRef.current;
    const pts = s.points;
    if (pts.length < 2) {
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("বেট করুন এবং শুরু করুন", W / 2, H / 2);
      return;
    }

    const maxX = Math.max(...pts.map((p) => p.x));
    const maxY = Math.max(...pts.map((p) => p.y), 2);
    const scaleX = (W - 40) / Math.max(maxX, 1);
    const scaleY = (H - 40) / Math.max(maxY, 1);

    ctx.beginPath();
    ctx.moveTo(20, H - 20);
    for (const p of pts) {
      ctx.lineTo(20 + p.x * scaleX, H - 20 - p.y * scaleY);
    }

    const isCrashed = phase === "crashed";
    ctx.strokeStyle = isCrashed ? "#ef4444" : "#22c55e";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.shadowColor = isCrashed ? "#ef4444" : "#22c55e";
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;

    const lastPt = pts[pts.length - 1];
    const px = 20 + lastPt.x * scaleX;
    const py = H - 20 - lastPt.y * scaleY;
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fillStyle = isCrashed ? "#ef4444" : "#fbbf24";
    ctx.fill();
  }, [phase]);

  const loop = useCallback(() => {
    const s = stateRef.current;
    if (!s.running) return;
    const elapsed = (Date.now() - s.startTime) / 1000;
    const m = Math.E ** (0.15 * elapsed) * 1.0;
    s.multiplier = m;
    s.points.push({ x: elapsed, y: m - 1 });
    setMultiplier(Math.round(m * 100) / 100);

    if (m >= s.crashPoint) {
      s.running = false;
      setPhase("crashed");
      setHistory((prev) => [
        { value: Math.round(s.crashPoint * 100) / 100, id: Date.now() },
        ...prev.slice(0, 9),
      ]);
      setResultMsg(
        `💥 ক্র্যাশ! ${(Math.round(s.crashPoint * 100) / 100).toFixed(2)}x`,
      );
      drawCanvas();
      return;
    }
    drawCanvas();
    rafRef.current = requestAnimationFrame(loop);
  }, [drawCanvas]);

  const startGame = () => {
    if (balance < bet) {
      setResultMsg("পর্যাপ্ত কয়েন নেই!");
      return;
    }
    setBalance((b) => b - bet);
    const crashPoint = Math.max(1.01, -Math.log(Math.random()) * 2 + 1);
    stateRef.current = {
      running: true,
      multiplier: 1.0,
      crashPoint,
      cashedOut: false,
      startTime: Date.now(),
      points: [],
    };
    setPhase("running");
    setMultiplier(1.0);
    setResultMsg("");
    rafRef.current = requestAnimationFrame(loop);
  };

  const cashOut = () => {
    const s = stateRef.current;
    if (!s.running || s.cashedOut) return;
    s.running = false;
    s.cashedOut = true;
    cancelAnimationFrame(rafRef.current);
    const win = Math.floor(bet * s.multiplier);
    setBalance((b) => b + win);
    setPhase("cashedout");
    setResultMsg(`🎉 জিতেছেন! +${win} কয়েন (${s.multiplier.toFixed(2)}x)`);
    setHistory((prev) => [
      { value: Math.round(s.crashPoint * 100) / 100, id: Date.now() },
      ...prev.slice(0, 9),
    ]);
  };

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="space-y-4">
      <div className="relative rounded-xl overflow-hidden border border-border">
        <canvas
          ref={canvasRef}
          width={600}
          height={280}
          className="w-full"
          style={{ background: "#0a1a0f" }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className="text-5xl font-bold tabular-nums"
            style={{
              color: phase === "crashed" ? "#ef4444" : "oklch(0.76 0.13 85)",
              textShadow: "0 0 20px currentColor",
            }}
          >
            {multiplier.toFixed(2)}x
          </span>
        </div>
      </div>

      {resultMsg && (
        <div
          className="text-center py-2 rounded-lg text-sm font-semibold"
          style={{
            background: resultMsg.includes("জিতেছেন")
              ? "oklch(0.3 0.12 145 / 0.4)"
              : "oklch(0.3 0.1 25 / 0.4)",
            color: resultMsg.includes("জিতেছেন") ? "#86efac" : "#fca5a5",
            border: `1px solid ${resultMsg.includes("জিতেছেন") ? "#22c55e40" : "#ef444440"}`,
          }}
          data-ocid="crash.success_state"
        >
          {resultMsg}
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-2">
          {[50, 100, 200, 500].map((v) => (
            <Button
              key={v}
              variant={bet === v ? "default" : "outline"}
              size="sm"
              onClick={() => setBet(v)}
              disabled={phase === "running"}
              className="text-xs"
              data-ocid="crash.toggle"
            >
              {v}
            </Button>
          ))}
        </div>
        {phase !== "running" ? (
          <Button
            onClick={startGame}
            className="flex-1 font-bold"
            style={{ background: "oklch(0.76 0.13 85)", color: "#0a1a0f" }}
            data-ocid="crash.primary_button"
          >
            🚀 শুরু করুন ({bet} কয়েন)
          </Button>
        ) : (
          <Button
            onClick={cashOut}
            className="flex-1 font-bold animate-pulse"
            style={{ background: "oklch(0.55 0.18 145)", color: "white" }}
            data-ocid="crash.secondary_button"
          >
            💰 ক্যাশ আউট ({multiplier.toFixed(2)}x)
          </Button>
        )}
      </div>

      {history.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground self-center">
            ইতিহাস:
          </span>
          {history.map((h) => (
            <Badge
              key={h.id}
              style={{
                background:
                  h.value >= 2 ? "oklch(0.35 0.12 145)" : "oklch(0.35 0.1 25)",
                color: h.value >= 2 ? "#86efac" : "#fca5a5",
              }}
            >
              {h.value.toFixed(2)}x
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SLOT MACHINE
// ─────────────────────────────────────────────

const SYMBOLS = ["🍋", "🍒", "🍇", "💎", "🔔", "⭐", "7️⃣"];
const BET_OPTIONS = [10, 20, 50];

function SlotMachine({
  balance,
  setBalance,
}: { balance: number; setBalance: (fn: (b: number) => number) => void }) {
  const [reels, setReels] = useState(["🍒", "🍒", "🍒"]);
  const [spinning, setSpinning] = useState(false);
  const [bet, setBet] = useState(10);
  const [msg, setMsg] = useState("");
  const [spinIdx, setSpinIdx] = useState(0);

  const spin = () => {
    if (spinning || balance < bet) {
      if (balance < bet) setMsg("পর্যাপ্ত কয়েন নেই!");
      return;
    }
    setBalance((b) => b - bet);
    setSpinning(true);
    setMsg("");
    setSpinIdx((i) => i + 1);

    let tick = 0;
    const interval = setInterval(() => {
      setReels([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      ]);
      tick++;
      if (tick >= 15) {
        clearInterval(interval);
        const final = [
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        ];
        setReels(final);
        setSpinning(false);

        let mult = 0;
        if (final[0] === "💎" && final[1] === "💎" && final[2] === "💎")
          mult = 50;
        else if (final[0] === final[1] && final[1] === final[2]) mult = 10;
        else if (
          final[0] === final[1] ||
          final[1] === final[2] ||
          final[0] === final[2]
        )
          mult = 2;

        if (mult > 0) {
          const win = bet * mult;
          setBalance((b) => b + win);
          setMsg(
            mult === 50
              ? `💎 জ্যাকপট! +${win} কয়েন`
              : `🎉 জিতেছেন! +${win} কয়েন (${mult}x)`,
          );
        } else {
          setMsg("😞 হারলেন। আবার চেষ্টা করুন!");
        }
      }
    }, 60);
  };

  return (
    <div className="space-y-6">
      <div
        className="flex justify-center gap-3 p-6 rounded-2xl"
        style={{ background: "linear-gradient(135deg, #0a1a0f, #0d2010)" }}
      >
        {reels.map((sym, i) => (
          <div
            key={`${i}-${spinIdx}`}
            className="w-20 h-20 rounded-xl flex items-center justify-center text-4xl"
            style={{
              background: "oklch(0.22 0.08 162)",
              border: "2px solid oklch(0.76 0.13 85 / 0.5)",
              animation: spinning ? "slotSpin 0.1s linear infinite" : "none",
            }}
          >
            {sym}
          </div>
        ))}
      </div>

      {msg && (
        <div
          className="text-center py-2 rounded-lg text-sm font-semibold"
          style={{
            background:
              msg.includes("জিতেছেন") || msg.includes("জ্যাকপট")
                ? "oklch(0.3 0.12 145 / 0.4)"
                : "oklch(0.3 0.1 25 / 0.4)",
            color:
              msg.includes("জিতেছেন") || msg.includes("জ্যাকপট")
                ? "#86efac"
                : "#fca5a5",
          }}
          data-ocid="slot.success_state"
        >
          {msg}
        </div>
      )}

      <div className="flex items-center gap-3 justify-center">
        <span className="text-sm text-muted-foreground">বেট:</span>
        {BET_OPTIONS.map((v) => (
          <Button
            key={v}
            variant={bet === v ? "default" : "outline"}
            size="sm"
            onClick={() => setBet(v)}
            disabled={spinning}
            data-ocid="slot.toggle"
          >
            {v}
          </Button>
        ))}
      </div>

      <Button
        onClick={spin}
        disabled={spinning}
        className="w-full h-12 text-lg font-bold"
        style={{ background: "oklch(0.76 0.13 85)", color: "#0a1a0f" }}
        data-ocid="slot.primary_button"
      >
        {spinning ? "⏳ ঘুরছে..." : "🎰 স্পিন করুন"}
      </Button>

      <div className="grid grid-cols-3 gap-2 text-xs text-center">
        <div className="p-2 rounded-lg bg-card/50 border border-border/50">
          <div>💎💎💎</div>
          <div className="font-bold" style={{ color: "oklch(0.76 0.13 85)" }}>
            50x
          </div>
        </div>
        <div className="p-2 rounded-lg bg-card/50 border border-border/50">
          <div>AAA</div>
          <div className="font-bold" style={{ color: "oklch(0.76 0.13 85)" }}>
            10x
          </div>
        </div>
        <div className="p-2 rounded-lg bg-card/50 border border-border/50">
          <div>AA_</div>
          <div className="font-bold" style={{ color: "oklch(0.76 0.13 85)" }}>
            2x
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// COIN FLIP
// ─────────────────────────────────────────────

function CoinFlip({
  balance,
  setBalance,
}: { balance: number; setBalance: (fn: (b: number) => number) => void }) {
  const [choice, setChoice] = useState<"heads" | "tails" | null>(null);
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [bet, setBet] = useState(50);
  const [msg, setMsg] = useState("");
  const [flipKey, setFlipKey] = useState(0);

  const flip = () => {
    if (!choice || flipping || balance < bet) {
      if (!choice) setMsg("প্রথমে হেড বা টেইল বেছে নিন");
      if (balance < bet) setMsg("পর্যাপ্ত কয়েন নেই!");
      return;
    }
    setBalance((b) => b - bet);
    setFlipping(true);
    setMsg("");
    setFlipKey((k) => k + 1);

    setTimeout(() => {
      const r = Math.random() < 0.5 ? "heads" : "tails";
      setResult(r);
      setFlipping(false);
      if (r === choice) {
        setBalance((b) => b + bet * 2);
        setMsg(
          `🎉 ${r === "heads" ? "হেড" : "টেইল"}! জিতেছেন +${bet * 2} কয়েন!`,
        );
      } else {
        setMsg(`😞 ${r === "heads" ? "হেড" : "টেইল"}! হারলেন।`);
      }
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div
          key={flipKey}
          className="w-32 h-32 rounded-full flex items-center justify-center text-5xl"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.76 0.13 85), oklch(0.62 0.12 75))",
            boxShadow: "0 8px 32px oklch(0.76 0.13 85 / 0.4)",
            animation: flipping ? "coinFlip 1.2s ease-in-out" : "none",
          }}
        >
          {result === "tails" ? "🦅" : "👑"}
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <Button
          onClick={() => setChoice("heads")}
          variant={choice === "heads" ? "default" : "outline"}
          className="flex-1 max-w-32"
          style={
            choice === "heads"
              ? { background: "oklch(0.76 0.13 85)", color: "#0a1a0f" }
              : {}
          }
          data-ocid="coin.toggle"
        >
          👑 হেড
        </Button>
        <Button
          onClick={() => setChoice("tails")}
          variant={choice === "tails" ? "default" : "outline"}
          className="flex-1 max-w-32"
          style={
            choice === "tails"
              ? { background: "oklch(0.76 0.13 85)", color: "#0a1a0f" }
              : {}
          }
          data-ocid="coin.toggle"
        >
          🦅 টেইল
        </Button>
      </div>

      <div className="flex items-center gap-3 justify-center">
        <span className="text-sm text-muted-foreground">বেট:</span>
        {[50, 100, 200].map((v) => (
          <Button
            key={v}
            variant={bet === v ? "default" : "outline"}
            size="sm"
            onClick={() => setBet(v)}
            disabled={flipping}
            data-ocid="coin.toggle"
          >
            {v}
          </Button>
        ))}
      </div>

      {msg && (
        <div
          className="text-center py-2 rounded-lg text-sm font-semibold"
          style={{
            background: msg.includes("জিতেছেন")
              ? "oklch(0.3 0.12 145 / 0.4)"
              : "oklch(0.3 0.1 25 / 0.4)",
            color: msg.includes("জিতেছেন") ? "#86efac" : "#fca5a5",
          }}
          data-ocid="coin.success_state"
        >
          {msg}
        </div>
      )}

      <Button
        onClick={flip}
        disabled={flipping}
        className="w-full h-12 text-lg font-bold"
        style={{ background: "oklch(0.76 0.13 85)", color: "#0a1a0f" }}
        data-ocid="coin.primary_button"
      >
        {flipping ? "⏳ উড়ছে..." : "🪙 কয়েন ছুড়ুন"}
      </Button>
    </div>
  );
}

// ─────────────────────────────────────────────
// DICE ROLL
// ─────────────────────────────────────────────

const DICE_FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

function DiceRoll({
  balance,
  setBalance,
}: { balance: number; setBalance: (fn: (b: number) => number) => void }) {
  const [dice, setDice] = useState([1, 1]);
  const [rolling, setRolling] = useState(false);
  const [bet, setBet] = useState(50);
  const [betType, setBetType] = useState<"low" | "high" | number>("low");
  const [msg, setMsg] = useState("");
  const [rollKey, setRollKey] = useState(0);

  const roll = () => {
    if (rolling || balance < bet) {
      if (balance < bet) setMsg("পর্যাপ্ত কয়েন নেই!");
      return;
    }
    setBalance((b) => b - bet);
    setRolling(true);
    setMsg("");
    setRollKey((k) => k + 1);

    let tick = 0;
    const interval = setInterval(() => {
      setDice([Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)]);
      tick++;
      if (tick >= 12) {
        clearInterval(interval);
        const d1 = Math.ceil(Math.random() * 6);
        const d2 = Math.ceil(Math.random() * 6);
        const total = d1 + d2;
        setDice([d1, d2]);
        setRolling(false);

        let won = false;
        let mult = 1;
        if (betType === "low" && total <= 6) {
          won = true;
          mult = 2;
        } else if (betType === "high" && total >= 8) {
          won = true;
          mult = 2;
        } else if (typeof betType === "number" && total === betType) {
          won = true;
          mult = 6;
        }

        if (won) {
          setBalance((b) => b + bet * mult);
          setMsg(`🎉 মোট ${total}! জিতেছেন +${bet * mult} কয়েন! (${mult}x)`);
        } else {
          setMsg(`😞 মোট ${total}। হারলেন।`);
        }
      }
    }, 80);
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-center gap-6">
        {dice.map((d, i) => (
          <div
            key={`${i}-${rollKey}`}
            className="w-20 h-20 rounded-xl flex items-center justify-center text-5xl"
            style={{
              background: "oklch(0.22 0.08 162)",
              border: "2px solid oklch(0.76 0.13 85 / 0.5)",
              animation: rolling ? "diceRoll 0.2s ease infinite" : "none",
            }}
          >
            {DICE_FACES[d - 1]}
          </div>
        ))}
      </div>
      <div
        className="text-center text-lg font-bold"
        style={{ color: "oklch(0.76 0.13 85)" }}
      >
        মোট: {dice[0] + dice[1]}
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-2 text-center">
          বেট ধরন বেছে নিন
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {(["low", "high", 7] as ("low" | "high" | number)[]).map((bt) => (
            <Button
              key={String(bt)}
              variant={betType === bt ? "default" : "outline"}
              size="sm"
              onClick={() => setBetType(bt)}
              style={
                betType === bt
                  ? { background: "oklch(0.76 0.13 85)", color: "#0a1a0f" }
                  : {}
              }
              data-ocid="dice.toggle"
            >
              {bt === "low"
                ? "⬇️ লো (2-6) — 2x"
                : bt === "high"
                  ? "⬆️ হাই (8-12) — 2x"
                  : "🎯 ৭ — 6x"}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 justify-center">
        <span className="text-sm text-muted-foreground">বেট:</span>
        {[25, 50, 100].map((v) => (
          <Button
            key={v}
            variant={bet === v ? "default" : "outline"}
            size="sm"
            onClick={() => setBet(v)}
            disabled={rolling}
            data-ocid="dice.toggle"
          >
            {v}
          </Button>
        ))}
      </div>

      {msg && (
        <div
          className="text-center py-2 rounded-lg text-sm font-semibold"
          style={{
            background: msg.includes("জিতেছেন")
              ? "oklch(0.3 0.12 145 / 0.4)"
              : "oklch(0.3 0.1 25 / 0.4)",
            color: msg.includes("জিতেছেন") ? "#86efac" : "#fca5a5",
          }}
          data-ocid="dice.success_state"
        >
          {msg}
        </div>
      )}

      <Button
        onClick={roll}
        disabled={rolling}
        className="w-full h-12 text-lg font-bold"
        style={{ background: "oklch(0.76 0.13 85)", color: "#0a1a0f" }}
        data-ocid="dice.primary_button"
      >
        {rolling ? "⏳ ঘুরছে..." : "🎲 ডাইস ছুড়ুন"}
      </Button>
    </div>
  );
}

// ─────────────────────────────────────────────
// JELI GAME
// ─────────────────────────────────────────────

const JELLY_COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7"];

function JellyGame({
  setBalance,
}: { setBalance: (fn: (b: number) => number) => void }) {
  const COLS = 7;
  const ROWS = 8;

  const makeGrid = () =>
    Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () =>
        Math.random() > 0.1
          ? JELLY_COLORS[Math.floor(Math.random() * JELLY_COLORS.length)]
          : null,
      ),
    );

  const [grid, setGrid] = useState<(string | null)[][]>(makeGrid);
  const [score, setScore] = useState(0);
  const [msg, setMsg] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const floodFill = (
    g: (string | null)[][],
    r: number,
    c: number,
    color: string,
    visited: Set<string>,
  ): [number, number][] => {
    const key = `${r},${c}`;
    if (visited.has(key)) return [];
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return [];
    if (g[r][c] !== color) return [];
    visited.add(key);
    return [
      [r, c],
      ...floodFill(g, r - 1, c, color, visited),
      ...floodFill(g, r + 1, c, color, visited),
      ...floodFill(g, r, c - 1, color, visited),
      ...floodFill(g, r, c + 1, color, visited),
    ];
  };

  const handleCellClick = (r: number, c: number) => {
    if (gameOver) return;
    const color = grid[r][c];
    if (!color) return;
    const visited = new Set<string>();
    const cluster = floodFill(grid, r, c, color, visited);
    if (cluster.length < 2) {
      setMsg("কমপক্ষে ২টি একই রঙের জেলি বেছে নিন!");
      return;
    }
    setMsg("");
    const points = cluster.length * cluster.length * 10;
    const newGrid = grid.map((row) => [...row]);
    for (const [cr, cc] of cluster) newGrid[cr][cc] = null;

    for (let col = 0; col < COLS; col++) {
      const column = newGrid.map((row) => row[col]).filter((v) => v !== null);
      const padded = [...Array(ROWS - column.length).fill(null), ...column];
      for (let row = 0; row < ROWS; row++) newGrid[row][col] = padded[row];
    }

    setGrid(newGrid);
    setScore((s) => s + points);
    setBalance((b) => b + Math.floor(points / 10));

    const hasMoves = newGrid.some((row, ri) =>
      row.some((cell, ci) => {
        if (!cell) return false;
        const neighbors = [
          [ri - 1, ci],
          [ri + 1, ci],
          [ri, ci - 1],
          [ri, ci + 1],
        ];
        return neighbors.some(
          ([nr, nc]) =>
            nr >= 0 &&
            nr < ROWS &&
            nc >= 0 &&
            nc < COLS &&
            newGrid[nr][nc] === cell,
        );
      }),
    );
    if (!hasMoves) setGameOver(true);
  };

  const reset = () => {
    setGrid(makeGrid());
    setScore(0);
    setMsg("");
    setGameOver(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold">
          স্কোর: <span style={{ color: "oklch(0.76 0.13 85)" }}>{score}</span>
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={reset}
          data-ocid="jelly.secondary_button"
        >
          নতুন গেম
        </Button>
      </div>

      {gameOver && (
        <div
          className="text-center py-3 rounded-xl font-bold"
          style={{ background: "oklch(0.3 0.1 25 / 0.4)", color: "#fca5a5" }}
          data-ocid="jelly.success_state"
        >
          গেম শেষ! স্কোর: {score} | রিসেট করুন
        </div>
      )}

      {msg && !gameOver && (
        <div
          className="text-center text-xs py-1 rounded-lg"
          style={{ color: "#fca5a5" }}
        >
          {msg}
        </div>
      )}

      <div
        className="mx-auto rounded-xl overflow-hidden"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gap: "3px",
          background: "#0a1a0f",
          padding: "8px",
          maxWidth: "360px",
        }}
      >
        {grid.flatMap((row, ri) =>
          row.map((color, ci) => (
            <button
              type="button"
              // biome-ignore lint/suspicious/noArrayIndexKey: grid position keys
              key={`r${ri}c${ci}`}
              onClick={() => handleCellClick(ri, ci)}
              style={{
                width: "100%",
                aspectRatio: "1",
                borderRadius: "50%",
                background: color ?? "transparent",
                border: color ? "1px solid rgba(255,255,255,0.2)" : "none",
                cursor: color ? "pointer" : "default",
                transition: "transform 0.1s",
                boxShadow: color ? `0 2px 8px ${color}60` : "none",
              }}
              onMouseEnter={(e) => {
                if (color)
                  (e.currentTarget as HTMLElement).style.transform =
                    "scale(1.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }}
            />
          )),
        )}
      </div>

      <p className="text-xs text-center text-muted-foreground">
        একই রঙের ২+ জেলি ক্লিক করলে মুছে যাবে এবং কয়েন পাবেন!
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// FORTUNE GEMS
// ─────────────────────────────────────────────

const GEM_TYPES = ["💎", "🔵", "🟢", "🟡", "🔴", "🟣"];

function FortuneGems({
  balance,
  setBalance,
}: { balance: number; setBalance: (fn: (b: number) => number) => void }) {
  const [gemGrid, setGemGrid] = useState<string[]>(Array(9).fill("❓"));
  const [picked, setPicked] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [msg, setMsg] = useState("");
  const [bet, setBet] = useState(20);

  const spinGems = () => {
    if (!picked) {
      setMsg("প্রথমে একটি জেম বেছে নিন!");
      return;
    }
    if (balance < bet) {
      setMsg("পর্যাপ্ত কয়েন নেই!");
      return;
    }
    setBalance((b) => b - bet);
    setSpinning(true);
    setMsg("");

    let tick = 0;
    const interval = setInterval(() => {
      setGemGrid(
        Array(9)
          .fill(null)
          .map(() => GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)]),
      );
      tick++;
      if (tick >= 18) {
        clearInterval(interval);
        const final = Array(9)
          .fill(null)
          .map(() => GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)]);
        setGemGrid(final);
        setSpinning(false);
        const matchCount = final.filter((g) => g === picked).length;
        let mult = 0;
        if (matchCount >= 9) mult = 100;
        else if (matchCount >= 7) mult = 30;
        else if (matchCount >= 5) mult = 15;
        else if (matchCount >= 3) mult = 5;
        if (mult > 0) {
          const win = bet * mult;
          setBalance((b) => b + win);
          setMsg(`🎉 ${matchCount}টি মিলেছে! +${win} কয়েন (${mult}x)`);
        } else {
          setMsg(`😞 মাত্র ${matchCount}টি মিলেছে। হারলেন!`);
        }
      }
    }, 70);
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground text-center">
        একটি জেম বেছে নিন, তারপর স্পিন করুন!
      </p>

      {/* Gem picker */}
      <div className="flex gap-2 justify-center flex-wrap">
        {GEM_TYPES.map((g) => (
          <button
            type="button"
            key={g}
            onClick={() => setPicked(g)}
            className="text-3xl w-12 h-12 rounded-xl transition-all"
            style={{
              background:
                picked === g
                  ? "oklch(0.76 0.13 85 / 0.3)"
                  : "oklch(0.22 0.08 162)",
              border:
                picked === g
                  ? "2px solid oklch(0.76 0.13 85)"
                  : "2px solid transparent",
              transform: picked === g ? "scale(1.15)" : "scale(1)",
            }}
            data-ocid="gems.toggle"
          >
            {g}
          </button>
        ))}
      </div>

      {/* 3x3 Grid */}
      <div
        className="mx-auto rounded-xl p-3"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "8px",
          background: "#0a1a0f",
          maxWidth: "220px",
        }}
      >
        {gemGrid.map((g, i) => (
          <div
            key={`r${Math.floor(i / 3)}c${i % 3}`}
            className="w-full aspect-square rounded-xl flex items-center justify-center text-3xl"
            style={{
              background:
                g === picked && g !== "❓"
                  ? "oklch(0.76 0.13 85 / 0.25)"
                  : "oklch(0.22 0.08 162)",
              border:
                g === picked && g !== "❓"
                  ? "2px solid oklch(0.76 0.13 85)"
                  : "1px solid oklch(0.32 0.07 162)",
            }}
          >
            {g}
          </div>
        ))}
      </div>

      {msg && (
        <div
          className="text-center py-2 rounded-lg text-sm font-semibold"
          style={{
            background:
              msg.includes("জিতেছেন") || msg.includes("মিলেছে!")
                ? "oklch(0.3 0.12 145 / 0.4)"
                : "oklch(0.3 0.1 25 / 0.4)",
            color:
              msg.includes("জিতেছেন") || msg.includes("মিলেছে!")
                ? "#86efac"
                : "#fca5a5",
          }}
          data-ocid="gems.success_state"
        >
          {msg}
        </div>
      )}

      <div className="flex items-center gap-3 justify-center">
        <span className="text-sm text-muted-foreground">বেট:</span>
        {[20, 50, 100].map((v) => (
          <Button
            key={v}
            variant={bet === v ? "default" : "outline"}
            size="sm"
            onClick={() => setBet(v)}
            disabled={spinning}
            data-ocid="gems.toggle"
          >
            {v}
          </Button>
        ))}
      </div>

      <Button
        onClick={spinGems}
        disabled={spinning}
        className="w-full h-12 text-lg font-bold"
        style={{ background: "oklch(0.76 0.13 85)", color: "#0a1a0f" }}
        data-ocid="gems.primary_button"
      >
        {spinning ? "💎 ঘুরছে..." : "💎 স্পিন করুন"}
      </Button>

      <div className="grid grid-cols-4 gap-1 text-xs text-center">
        {[
          { n: "3+", m: "5x" },
          { n: "5+", m: "15x" },
          { n: "7+", m: "30x" },
          { n: "9", m: "100x" },
        ].map((r) => (
          <div
            key={r.n}
            className="p-1.5 rounded-lg bg-card/50 border border-border/50"
          >
            <div>{r.n}</div>
            <div className="font-bold" style={{ color: "oklch(0.76 0.13 85)" }}>
              {r.m}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SUPER ACE (Blackjack)
// ─────────────────────────────────────────────

type CardValue = { suit: string; rank: string; value: number };

function buildDeck(): CardValue[] {
  const suits = ["♠", "♥", "♦", "♣"];
  const ranks = [
    { r: "A", v: 11 },
    { r: "2", v: 2 },
    { r: "3", v: 3 },
    { r: "4", v: 4 },
    { r: "5", v: 5 },
    { r: "6", v: 6 },
    { r: "7", v: 7 },
    { r: "8", v: 8 },
    { r: "9", v: 9 },
    { r: "10", v: 10 },
    { r: "J", v: 10 },
    { r: "Q", v: 10 },
    { r: "K", v: 10 },
  ];
  const deck: CardValue[] = [];
  for (const s of suits)
    for (const r of ranks) deck.push({ suit: s, rank: r.r, value: r.v });
  return deck.sort(() => Math.random() - 0.5);
}

function calcHand(cards: CardValue[]): number {
  let total = cards.reduce((sum, c) => sum + c.value, 0);
  let aces = cards.filter((c) => c.rank === "A").length;
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

function CardDisplay({ card, hidden }: { card: CardValue; hidden?: boolean }) {
  const isRed = card.suit === "♥" || card.suit === "♦";
  return (
    <div
      className="w-12 h-16 rounded-lg flex flex-col items-center justify-center text-sm font-bold"
      style={{
        background: hidden ? "oklch(0.3 0.08 240)" : "white",
        border: "1px solid oklch(0.4 0.05 240)",
        color: hidden ? "white" : isRed ? "#dc2626" : "#111",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      {hidden ? (
        "🂠"
      ) : (
        <>
          <div>{card.rank}</div>
          <div>{card.suit}</div>
        </>
      )}
    </div>
  );
}

function SuperAce({
  balance,
  setBalance,
}: { balance: number; setBalance: (fn: (b: number) => number) => void }) {
  const [deck, setDeck] = useState<CardValue[]>([]);
  const [playerCards, setPlayerCards] = useState<CardValue[]>([]);
  const [dealerCards, setDealerCards] = useState<CardValue[]>([]);
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [msg, setMsg] = useState("");
  const [bet, setBet] = useState(50);
  const [dealerHidden, setDealerHidden] = useState(true);

  const deal = () => {
    if (balance < bet) {
      setMsg("পর্যাপ্ত কয়েন নেই!");
      return;
    }
    const newDeck = buildDeck();
    const pCards = [newDeck.pop()!, newDeck.pop()!];
    const dCards = [newDeck.pop()!, newDeck.pop()!];
    setDeck(newDeck);
    setPlayerCards(pCards);
    setDealerCards(dCards);
    setPhase("playing");
    setDealerHidden(true);
    setMsg("");
    setBalance((b) => b - bet);

    if (calcHand(pCards) === 21) {
      setDealerHidden(false);
      const dealerTotal = calcHand(dCards);
      if (dealerTotal === 21) {
        setMsg("🤝 উভয়ের ব্ল্যাকজ্যাক! টাই!");
        setBalance((b) => b + bet);
      } else {
        setMsg(`🎉 ব্ল্যাকজ্যাক! জিতেছেন! +${Math.floor(bet * 2.5)} কয়েন`);
        setBalance((b) => b + Math.floor(bet * 2.5));
      }
      setPhase("done");
    }
  };

  const hit = () => {
    if (phase !== "playing") return;
    const newCard = deck[deck.length - 1];
    const newDeck = deck.slice(0, -1);
    const newCards = [...playerCards, newCard];
    setDeck(newDeck);
    setPlayerCards(newCards);
    const total = calcHand(newCards);
    if (total > 21) {
      setDealerHidden(false);
      setMsg(`💥 বাস্ট! ${total} — হারলেন।`);
      setPhase("done");
    } else if (total === 21) {
      stand(newCards, deck.slice(0, -1));
    }
  };

  const stand = (pCards = playerCards, currentDeck = deck) => {
    setDealerHidden(false);
    let dCards = [...dealerCards];
    let d = currentDeck;
    while (calcHand(dCards) < 17 && d.length > 0) {
      dCards = [...dCards, d[d.length - 1]];
      d = d.slice(0, -1);
    }
    setDealerCards(dCards);
    const pTotal = calcHand(pCards);
    const dTotal = calcHand(dCards);
    if (dTotal > 21 || pTotal > dTotal) {
      setMsg(`🎉 জিতেছেন! ${pTotal} vs ${dTotal} — +${bet * 2} কয়েন`);
      setBalance((b) => b + bet * 2);
    } else if (pTotal === dTotal) {
      setMsg(`🤝 টাই! ${pTotal} vs ${dTotal}`);
      setBalance((b) => b + bet);
    } else {
      setMsg(`😞 হারলেন! ${pTotal} vs ${dTotal}`);
    }
    setPhase("done");
  };

  return (
    <div className="space-y-5">
      {/* Dealer */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">
          ডিলার ({dealerHidden ? "?" : calcHand(dealerCards)})
        </p>
        <div className="flex gap-2 flex-wrap">
          {dealerCards.map((c, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: card deck order
            <CardDisplay key={i} card={c} hidden={dealerHidden && i === 1} />
          ))}
          {dealerCards.length === 0 && (
            <div className="text-muted-foreground text-sm">কার্ড নেই</div>
          )}
        </div>
      </div>

      {/* Player */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">
          আপনি ({calcHand(playerCards)})
        </p>
        <div className="flex gap-2 flex-wrap">
          {playerCards.map((c, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: card deck order
            <CardDisplay key={i} card={c} />
          ))}
          {playerCards.length === 0 && (
            <div className="text-muted-foreground text-sm">কার্ড নেই</div>
          )}
        </div>
      </div>

      {msg && (
        <div
          className="text-center py-2 rounded-lg text-sm font-semibold"
          style={{
            background:
              msg.includes("জিতেছেন") || msg.includes("ব্ল্যাকজ্যাক")
                ? "oklch(0.3 0.12 145 / 0.4)"
                : "oklch(0.3 0.1 25 / 0.4)",
            color:
              msg.includes("জিতেছেন") || msg.includes("ব্ল্যাকজ্যাক")
                ? "#86efac"
                : msg.includes("টাই")
                  ? "#fbbf24"
                  : "#fca5a5",
          }}
          data-ocid="ace.success_state"
        >
          {msg}
        </div>
      )}

      <div className="flex items-center gap-3 justify-center">
        <span className="text-sm text-muted-foreground">বেট:</span>
        {[50, 100, 200].map((v) => (
          <Button
            key={v}
            variant={bet === v ? "default" : "outline"}
            size="sm"
            onClick={() => setBet(v)}
            disabled={phase === "playing"}
            data-ocid="ace.toggle"
          >
            {v}
          </Button>
        ))}
      </div>

      <div className="flex gap-3">
        {phase === "idle" || phase === "done" ? (
          <Button
            onClick={deal}
            className="flex-1 h-12 font-bold"
            style={{ background: "oklch(0.76 0.13 85)", color: "#0a1a0f" }}
            data-ocid="ace.primary_button"
          >
            🃏 ডিল করুন ({bet} কয়েন)
          </Button>
        ) : (
          <>
            <Button
              onClick={hit}
              className="flex-1 h-12 font-bold"
              style={{ background: "oklch(0.55 0.18 145)", color: "white" }}
              data-ocid="ace.secondary_button"
            >
              ➕ আরো নিন
            </Button>
            <Button
              onClick={() => stand()}
              className="flex-1 h-12 font-bold"
              variant="outline"
              data-ocid="ace.secondary_button"
            >
              ✋ থামুন
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FISHING GAME
// ─────────────────────────────────────────────

type Fish = {
  id: number;
  x: number;
  y: number;
  emoji: string;
  size: number;
  speed: number;
  dir: 1 | -1;
  coins: number;
};

const FISH_TYPES = [
  { emoji: "🐟", size: 30, coins: 15, speed: 1.5 },
  { emoji: "🐠", size: 32, coins: 20, speed: 1.2 },
  { emoji: "🐡", size: 34, coins: 25, speed: 1.0 },
  { emoji: "🦑", size: 38, coins: 40, speed: 0.7 },
  { emoji: "🦈", size: 44, coins: 80, speed: 0.5 },
];

function FishingGame({
  balance,
  setBalance,
}: { balance: number; setBalance: (fn: (b: number) => number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fishRef = useRef<Fish[]>([]);
  const rafRef = useRef<number>(0);
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [msg, setMsg] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const idCounterRef = useRef(0);

  const spawnFish = (W: number, H: number): Fish => {
    const type = FISH_TYPES[Math.floor(Math.random() * FISH_TYPES.length)];
    const dir = Math.random() > 0.5 ? 1 : -1;
    return {
      id: idCounterRef.current++,
      x: dir === 1 ? -50 : W + 50,
      y: 40 + Math.random() * (H - 80),
      emoji: type.emoji,
      size: type.size,
      speed: type.speed + Math.random() * 0.5,
      dir,
      coins: type.coins,
    };
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    // Ocean bg
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#0c4a6e");
    grad.addColorStop(1, "#082f49");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Bubbles
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      const bx = (W * (i + 1)) / 6;
      const by = H * 0.6 + Math.sin(Date.now() / 800 + i) * 20;
      ctx.arc(bx, by, 3 + i, 0, Math.PI * 2);
      ctx.fill();
    }

    // Fish
    ctx.font = "24px serif";
    ctx.textAlign = "center";
    for (const fish of fishRef.current) {
      ctx.save();
      if (fish.dir === -1) {
        ctx.translate(fish.x, fish.y);
        ctx.scale(-1, 1);
        ctx.fillText(fish.emoji, 0, 0);
      } else {
        ctx.fillText(fish.emoji, fish.x, fish.y);
      }
      ctx.restore();
    }
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: gameLoop is self-referential
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width;
    const H = canvas.height;

    // Move fish
    fishRef.current = fishRef.current
      .map((f) => ({ ...f, x: f.x + f.speed * f.dir }))
      .filter((f) => f.x > -100 && f.x < W + 100);

    // Spawn if needed
    while (fishRef.current.length < 7) {
      fishRef.current.push(spawnFish(W, H));
    }

    draw();
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [draw]);

  const startGame = () => {
    if (balance < 10) {
      setMsg("পর্যাপ্ত কয়েন নেই! (১০ কয়েন দরকার)");
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    fishRef.current = [];
    setRunning(true);
    setTimeLeft(30);
    setScore(0);
    setMsg("");
    rafRef.current = requestAnimationFrame(gameLoop);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setRunning(false);
          cancelAnimationFrame(rafRef.current);
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!running) return;
    if (balance < 10) return;
    setBalance((b) => b - 10);

    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const scaleX = (e.target as HTMLCanvasElement).width / rect.width;
    const scaleY = (e.target as HTMLCanvasElement).height / rect.height;
    const cx = (e.clientX - rect.left) * scaleX;
    const cy = (e.clientY - rect.top) * scaleY;

    const caught = fishRef.current.find(
      (f) => Math.abs(f.x - cx) < f.size && Math.abs(f.y - cy) < f.size,
    );

    if (caught) {
      fishRef.current = fishRef.current.filter((f) => f.id !== caught.id);
      setScore((s) => s + caught.coins);
      setBalance((b) => b + caught.coins);
      setMsg(`🎣 ${caught.emoji} ধরা পড়েছে! +${caught.coins} কয়েন`);
    } else {
      setMsg("🎯 মিস! (-10 কয়েন)");
    }
  };

  useEffect(() => {
    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [draw]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold">
          স্কোর: <span style={{ color: "oklch(0.76 0.13 85)" }}>{score}</span>
        </span>
        {running && (
          <Badge
            style={{
              background:
                timeLeft <= 10 ? "oklch(0.35 0.1 25)" : "oklch(0.35 0.12 145)",
              color: timeLeft <= 10 ? "#fca5a5" : "#86efac",
            }}
          >
            ⏱ {timeLeft}s
          </Badge>
        )}
      </div>

      <div className="relative rounded-xl overflow-hidden">
        <canvas
          ref={canvasRef}
          width={500}
          height={280}
          className="w-full cursor-crosshair"
          onClick={handleCanvasClick}
          onKeyDown={(e) => {
            if (e.key === "Enter")
              handleCanvasClick(
                e as unknown as React.MouseEvent<HTMLCanvasElement>,
              );
          }}
          tabIndex={0}
        />
        {!running && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center">
              <div className="text-4xl mb-2">🎣</div>
              <p className="text-white text-sm mb-3">
                মাছ ক্লিক করে ধরুন! প্রতি শট ১০ কয়েন
              </p>
              <Button
                onClick={startGame}
                style={{ background: "oklch(0.76 0.13 85)", color: "#0a1a0f" }}
                data-ocid="fishing.primary_button"
              >
                খেলা শুরু করুন
              </Button>
            </div>
          </div>
        )}
        {running && timeLeft === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">খেলা শেষ!</div>
              <div className="text-gold text-xl mb-3">মোট স্কোর: {score}</div>
              <Button
                onClick={startGame}
                style={{ background: "oklch(0.76 0.13 85)", color: "#0a1a0f" }}
                data-ocid="fishing.primary_button"
              >
                আবার খেলুন
              </Button>
            </div>
          </div>
        )}
      </div>

      {msg && (
        <div
          className="text-center py-1.5 rounded-lg text-sm font-semibold"
          style={{
            background:
              msg.includes("+") && !msg.includes("মিস")
                ? "oklch(0.3 0.12 145 / 0.4)"
                : "oklch(0.3 0.1 25 / 0.4)",
            color:
              msg.includes("+") && !msg.includes("মিস") ? "#86efac" : "#fca5a5",
          }}
          data-ocid="fishing.success_state"
        >
          {msg}
        </div>
      )}

      <div className="grid grid-cols-5 gap-1 text-xs text-center">
        {FISH_TYPES.map((f) => (
          <div
            key={f.emoji}
            className="p-1.5 rounded-lg bg-card/50 border border-border/50"
          >
            <div>{f.emoji}</div>
            <div className="font-bold" style={{ color: "oklch(0.76 0.13 85)" }}>
              +{f.coins}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// BINGO
// ─────────────────────────────────────────────

function makeBingoCard(): number[][] {
  const card: number[][] = [];
  for (let col = 0; col < 5; col++) {
    const min = col * 15 + 1;
    const nums: number[] = [];
    while (nums.length < 5) {
      const n = min + Math.floor(Math.random() * 15);
      if (!nums.includes(n)) nums.push(n);
    }
    card.push(nums);
  }
  // Transpose to row-major
  return Array.from({ length: 5 }, (_, r) => card.map((col) => col[r]));
}

function checkBingo(
  marked: Set<number>,
  card: number[][],
): { bingo: boolean; blackout: boolean } {
  const rows = card.map((row) => row.every((n) => n === 0 || marked.has(n)));
  const cols = Array.from({ length: 5 }, (_, ci) =>
    card.every((row) => row[ci] === 0 || marked.has(row[ci])),
  );
  const diag1 = card.every((row, ri) => row[ri] === 0 || marked.has(row[ri]));
  const diag2 = card.every(
    (row, ri) => row[4 - ri] === 0 || marked.has(row[4 - ri]),
  );
  const bingo = rows.some(Boolean) || cols.some(Boolean) || diag1 || diag2;
  const blackout = card.every((row) =>
    row.every((n) => n === 0 || marked.has(n)),
  );
  return { bingo, blackout };
}

function BingoGame({
  balance,
  setBalance,
}: { balance: number; setBalance: (fn: (b: number) => number) => void }) {
  const [card, setCard] = useState<number[][]>(makeBingoCard);
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [drawn, setDrawn] = useState<number[]>([]);
  const [bet, setBet] = useState(20);
  const [gameStarted, setGameStarted] = useState(false);
  const [msg, setMsg] = useState("");
  const [won, setWon] = useState(false);

  const allNums = Array.from({ length: 75 }, (_, i) => i + 1);
  const remaining = allNums.filter((n) => !drawn.includes(n));

  const startGame = () => {
    if (balance < bet) {
      setMsg("পর্যাপ্ত কয়েন নেই!");
      return;
    }
    setBalance((b) => b - bet);
    setCard(makeBingoCard());
    setMarked(new Set());
    setDrawn([]);
    setMsg("");
    setWon(false);
    setGameStarted(true);
  };

  const drawNumber = () => {
    if (!gameStarted || won || remaining.length === 0) return;
    const idx = Math.floor(Math.random() * remaining.length);
    const num = remaining[idx];
    const newDrawn = [...drawn, num];
    const newMarked = new Set(marked);
    if (card.some((row) => row.includes(num))) newMarked.add(num);
    setDrawn(newDrawn);
    setMarked(newMarked);

    const { bingo, blackout } = checkBingo(newMarked, card);
    if (blackout) {
      const win = bet * 50;
      setBalance((b) => b + win);
      setMsg(`🎉 ব্ল্যাকআউট! সব ঘর পূর্ণ! +${win} কয়েন (50x)`);
      setWon(true);
    } else if (bingo) {
      const win = bet * 5;
      setBalance((b) => b + win);
      setMsg(`🎉 বিঙ্গো! +${win} কয়েন (5x)`);
      setWon(true);
    }
  };

  const BINGO_LETTERS = ["B", "I", "N", "G", "O"];

  return (
    <div className="space-y-4">
      {/* Card */}
      <div className="mx-auto" style={{ maxWidth: "280px" }}>
        <div className="grid grid-cols-5 gap-1 mb-1">
          {BINGO_LETTERS.map((l) => (
            <div
              key={l}
              className="text-center text-xs font-bold py-1 rounded"
              style={{ background: "oklch(0.76 0.13 85)", color: "#0a1a0f" }}
            >
              {l}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-1">
          {card.flatMap((row, ri) =>
            row.map((num, ci) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: bingo cell positions
                key={`${ri}-${ci}`}
                className="aspect-square rounded flex items-center justify-center text-xs font-bold"
                style={{
                  background: marked.has(num)
                    ? "oklch(0.76 0.13 85)"
                    : "oklch(0.22 0.08 162)",
                  color: marked.has(num) ? "#0a1a0f" : "white",
                  border: "1px solid oklch(0.32 0.07 162)",
                }}
              >
                {num}
              </div>
            )),
          )}
        </div>
      </div>

      {/* Last drawn */}
      {drawn.length > 0 && (
        <div className="text-center">
          <span className="text-xs text-muted-foreground">সর্বশেষ: </span>
          <span
            className="text-2xl font-bold"
            style={{ color: "oklch(0.76 0.13 85)" }}
          >
            {drawn[drawn.length - 1]}
          </span>
        </div>
      )}

      {/* Drawn history */}
      {drawn.length > 1 && (
        <div className="flex flex-wrap gap-1">
          {drawn.slice(-10).map((n) => (
            <Badge
              key={n}
              style={{
                background: "oklch(0.35 0.08 240)",
                color: "white",
                fontSize: "10px",
              }}
            >
              {n}
            </Badge>
          ))}
        </div>
      )}

      {msg && (
        <div
          className="text-center py-2 rounded-lg text-sm font-semibold"
          style={{
            background:
              msg.includes("বিঙ্গো") || msg.includes("ব্ল্যাকআউট")
                ? "oklch(0.3 0.12 145 / 0.4)"
                : "oklch(0.3 0.1 25 / 0.4)",
            color:
              msg.includes("বিঙ্গো") || msg.includes("ব্ল্যাকআউট")
                ? "#86efac"
                : "#fca5a5",
          }}
          data-ocid="bingo.success_state"
        >
          {msg}
        </div>
      )}

      <div className="flex items-center gap-3 justify-center">
        <span className="text-sm text-muted-foreground">বেট:</span>
        {[20, 50, 100].map((v) => (
          <Button
            key={v}
            variant={bet === v ? "default" : "outline"}
            size="sm"
            onClick={() => setBet(v)}
            disabled={gameStarted && !won}
            data-ocid="bingo.toggle"
          >
            {v}
          </Button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={startGame}
          variant="outline"
          className="flex-1"
          data-ocid="bingo.secondary_button"
        >
          🆕 নতুন কার্ড ({bet} কয়েন)
        </Button>
        <Button
          onClick={drawNumber}
          disabled={!gameStarted || won}
          className="flex-1 font-bold"
          style={{ background: "oklch(0.76 0.13 85)", color: "#0a1a0f" }}
          data-ocid="bingo.primary_button"
        >
          🔮 বল টানুন
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LUCKY BALL
// ─────────────────────────────────────────────

function LuckyBall({
  balance,
  setBalance,
}: { balance: number; setBalance: (fn: (b: number) => number) => void }) {
  const [picked, setPicked] = useState<number[]>([]);
  const [drawn, setDrawn] = useState<number[]>([]);
  const [animating, setAnimating] = useState(false);
  const [bet, setBet] = useState(30);
  const [msg, setMsg] = useState("");
  const [visibleBalls, setVisibleBalls] = useState<number[]>([]);

  const togglePick = (n: number) => {
    if (animating) return;
    setPicked((prev) =>
      prev.includes(n)
        ? prev.filter((x) => x !== n)
        : prev.length < 3
          ? [...prev, n]
          : prev,
    );
  };

  const play = () => {
    if (picked.length !== 3) {
      setMsg("৩টি সংখ্যা বেছে নিন!");
      return;
    }
    if (balance < bet) {
      setMsg("পর্যাপ্ত কয়েন নেই!");
      return;
    }
    setBalance((b) => b - bet);
    setAnimating(true);
    setDrawn([]);
    setVisibleBalls([]);
    setMsg("");

    const nums = Array.from({ length: 20 }, (_, i) => i + 1);
    const shuffled = nums.sort(() => Math.random() - 0.5).slice(0, 5);

    // Reveal balls one by one
    shuffled.forEach((n, i) => {
      setTimeout(
        () => {
          setVisibleBalls((prev) => [...prev, n]);
          if (i === 4) {
            setDrawn(shuffled);
            setAnimating(false);
            const matches = picked.filter((p) => shuffled.includes(p)).length;
            let mult = 0;
            if (matches === 3) mult = 20;
            else if (matches === 2) mult = 5;
            else if (matches === 1) mult = 1.5;
            if (mult > 0) {
              const win = Math.floor(bet * mult);
              setBalance((b) => b + win);
              setMsg(`🎉 ${matches}টি মিলেছে! +${win} কয়েন (${mult}x)`);
            } else {
              setMsg("😞 কোনো মিল নেই। হারলেন!");
            }
          }
        },
        (i + 1) * 500,
      );
    });
  };

  const BALL_COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7"];

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground text-center">
        ১-২০ থেকে ৩টি সংখ্যা বেছে নিন
      </p>

      {/* Number picker */}
      <div className="grid grid-cols-10 gap-1.5">
        {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
          <button
            type="button"
            key={n}
            onClick={() => togglePick(n)}
            className="aspect-square rounded-full text-xs font-bold transition-all"
            style={{
              background: picked.includes(n)
                ? "oklch(0.76 0.13 85)"
                : "oklch(0.22 0.08 162)",
              color: picked.includes(n) ? "#0a1a0f" : "white",
              border: drawn.includes(n)
                ? "2px solid #22c55e"
                : "1px solid oklch(0.32 0.07 162)",
              transform: picked.includes(n) ? "scale(1.1)" : "scale(1)",
            }}
            data-ocid="lucky.toggle"
          >
            {n}
          </button>
        ))}
      </div>

      {/* Drawn balls display */}
      <div className="flex justify-center gap-3 min-h-[60px] items-center">
        {visibleBalls.map((n, i) => (
          <div
            key={n}
            className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              background: BALL_COLORS[i % BALL_COLORS.length],
              color: "white",
              boxShadow: `0 4px 12px ${BALL_COLORS[i % BALL_COLORS.length]}80`,
              animation: "ballDrop 0.4s ease-out",
              border: picked.includes(n) ? "3px solid white" : "none",
            }}
          >
            {n}
          </div>
        ))}
        {visibleBalls.length === 0 && (
          <span className="text-muted-foreground text-sm">বল টানা হয়নি</span>
        )}
      </div>

      {msg && (
        <div
          className="text-center py-2 rounded-lg text-sm font-semibold"
          style={{
            background:
              msg.includes("জিতেছেন") || msg.includes("মিলেছে!")
                ? "oklch(0.3 0.12 145 / 0.4)"
                : "oklch(0.3 0.1 25 / 0.4)",
            color:
              msg.includes("জিতেছেন") || msg.includes("মিলেছে!")
                ? "#86efac"
                : "#fca5a5",
          }}
          data-ocid="lucky.success_state"
        >
          {msg}
        </div>
      )}

      <div className="flex items-center gap-3 justify-center">
        <span className="text-sm text-muted-foreground">বেট:</span>
        {[30, 60, 120].map((v) => (
          <Button
            key={v}
            variant={bet === v ? "default" : "outline"}
            size="sm"
            onClick={() => setBet(v)}
            disabled={animating}
            data-ocid="lucky.toggle"
          >
            {v}
          </Button>
        ))}
      </div>

      <Button
        onClick={play}
        disabled={animating || picked.length !== 3}
        className="w-full h-12 font-bold"
        style={{ background: "oklch(0.76 0.13 85)", color: "#0a1a0f" }}
        data-ocid="lucky.primary_button"
      >
        {animating
          ? "🎱 বল টানা হচ্ছে..."
          : `🎱 খেলুন (${picked.length}/3 বেছেছেন)`}
      </Button>

      <div className="grid grid-cols-3 gap-2 text-xs text-center">
        {[
          { m: "1 মিল", r: "1.5x" },
          { m: "2 মিল", r: "5x" },
          { m: "3 মিল", r: "20x" },
        ].map((r) => (
          <div
            key={r.m}
            className="p-1.5 rounded-lg bg-card/50 border border-border/50"
          >
            <div>{r.m}</div>
            <div className="font-bold" style={{ color: "oklch(0.76 0.13 85)" }}>
              {r.r}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────

const GAME_TABS = [
  { value: "crash", label: "💥ক্র্যাশ" },
  { value: "slot", label: "🎰স্লট" },
  { value: "coin", label: "🪙কয়েন" },
  { value: "dice", label: "🎲ডাইস" },
  { value: "gems", label: "💎জেমস" },
  { value: "ace", label: "🃏ব্ল্যাক" },
  { value: "fishing", label: "🎣মাছ" },
  { value: "bingo", label: "🔮বিঙ্গো" },
  { value: "lucky", label: "🎱লাকি" },
  { value: "jelly", label: "🫧জেলি" },
];

export default function GamesPage() {
  const [balance, setBalanceRaw] = useState(INITIAL_BALANCE);

  const setBalance = (fn: (b: number) => number) => {
    setBalanceRaw((prev) => Math.max(0, fn(prev)));
  };

  const reset = () => setBalanceRaw(INITIAL_BALANCE);

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.15 0.05 162)" }}
    >
      {/* Balance bar */}
      <div
        className="sticky top-14 z-30 px-4 py-3 flex items-center justify-between"
        style={{
          background: "oklch(0.2 0.065 162 / 0.95)",
          borderBottom: "1px solid oklch(0.32 0.07 162)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🪙</span>
          <span
            className="font-bold text-lg"
            style={{ color: "oklch(0.76 0.13 85)" }}
          >
            {balance.toLocaleString("bn-BD")} কয়েন
          </span>
        </div>
        {balance === 0 && (
          <Button
            size="sm"
            onClick={reset}
            style={{ background: "oklch(0.76 0.13 85)", color: "#0a1a0f" }}
            data-ocid="games.primary_button"
          >
            রিসেট করুন
          </Button>
        )}
        <div className="text-xs text-muted-foreground">ভার্চুয়াল কয়েন</div>
      </div>

      <div className="px-4 py-4 max-w-2xl mx-auto">
        <Tabs defaultValue="crash" className="w-full">
          {/* Scrollable tab list */}
          <div
            className="overflow-x-auto pb-2 mb-4"
            style={{ scrollbarWidth: "none" }}
          >
            <TabsList
              className="flex w-max gap-1 h-auto p-1"
              style={{ background: "oklch(0.22 0.07 162)" }}
            >
              {GAME_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-shrink-0 text-xs px-3 py-2 whitespace-nowrap"
                  data-ocid="games.tab"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="crash">
            <Card
              style={{
                background: "oklch(0.22 0.07 162)",
                border: "1px solid oklch(0.32 0.07 162)",
              }}
            >
              <CardContent className="pt-5">
                <h2
                  className="text-lg font-bold mb-4"
                  style={{ color: "oklch(0.76 0.13 85)" }}
                >
                  💥 ক্র্যাশ গেম
                </h2>
                <CrashGame balance={balance} setBalance={setBalance} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="slot">
            <Card
              style={{
                background: "oklch(0.22 0.07 162)",
                border: "1px solid oklch(0.32 0.07 162)",
              }}
            >
              <CardContent className="pt-5">
                <h2
                  className="text-lg font-bold mb-4"
                  style={{ color: "oklch(0.76 0.13 85)" }}
                >
                  🎰 স্লট মেশিন
                </h2>
                <SlotMachine balance={balance} setBalance={setBalance} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coin">
            <Card
              style={{
                background: "oklch(0.22 0.07 162)",
                border: "1px solid oklch(0.32 0.07 162)",
              }}
            >
              <CardContent className="pt-5">
                <h2
                  className="text-lg font-bold mb-4"
                  style={{ color: "oklch(0.76 0.13 85)" }}
                >
                  🪙 কয়েন ফ্লিপ
                </h2>
                <CoinFlip balance={balance} setBalance={setBalance} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dice">
            <Card
              style={{
                background: "oklch(0.22 0.07 162)",
                border: "1px solid oklch(0.32 0.07 162)",
              }}
            >
              <CardContent className="pt-5">
                <h2
                  className="text-lg font-bold mb-4"
                  style={{ color: "oklch(0.76 0.13 85)" }}
                >
                  🎲 ডাইস রোল
                </h2>
                <DiceRoll balance={balance} setBalance={setBalance} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gems">
            <Card
              style={{
                background: "oklch(0.22 0.07 162)",
                border: "1px solid oklch(0.32 0.07 162)",
              }}
            >
              <CardContent className="pt-5">
                <h2
                  className="text-lg font-bold mb-4"
                  style={{ color: "oklch(0.76 0.13 85)" }}
                >
                  💎 ফর্চুন জেমস
                </h2>
                <FortuneGems balance={balance} setBalance={setBalance} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ace">
            <Card
              style={{
                background: "oklch(0.22 0.07 162)",
                border: "1px solid oklch(0.32 0.07 162)",
              }}
            >
              <CardContent className="pt-5">
                <h2
                  className="text-lg font-bold mb-4"
                  style={{ color: "oklch(0.76 0.13 85)" }}
                >
                  🃏 সুপার এস (ব্ল্যাকজ্যাক)
                </h2>
                <SuperAce balance={balance} setBalance={setBalance} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fishing">
            <Card
              style={{
                background: "oklch(0.22 0.07 162)",
                border: "1px solid oklch(0.32 0.07 162)",
              }}
            >
              <CardContent className="pt-5">
                <h2
                  className="text-lg font-bold mb-4"
                  style={{ color: "oklch(0.76 0.13 85)" }}
                >
                  🎣 ফিশিং গেম
                </h2>
                <FishingGame balance={balance} setBalance={setBalance} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bingo">
            <Card
              style={{
                background: "oklch(0.22 0.07 162)",
                border: "1px solid oklch(0.32 0.07 162)",
              }}
            >
              <CardContent className="pt-5">
                <h2
                  className="text-lg font-bold mb-4"
                  style={{ color: "oklch(0.76 0.13 85)" }}
                >
                  🔮 বিঙ্গো
                </h2>
                <BingoGame balance={balance} setBalance={setBalance} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lucky">
            <Card
              style={{
                background: "oklch(0.22 0.07 162)",
                border: "1px solid oklch(0.32 0.07 162)",
              }}
            >
              <CardContent className="pt-5">
                <h2
                  className="text-lg font-bold mb-4"
                  style={{ color: "oklch(0.76 0.13 85)" }}
                >
                  🎱 লাকি বল
                </h2>
                <LuckyBall balance={balance} setBalance={setBalance} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jelly">
            <Card
              style={{
                background: "oklch(0.22 0.07 162)",
                border: "1px solid oklch(0.32 0.07 162)",
              }}
            >
              <CardContent className="pt-5">
                <h2
                  className="text-lg font-bold mb-4"
                  style={{ color: "oklch(0.76 0.13 85)" }}
                >
                  🫧 জেলি গেম
                </h2>
                <JellyGame setBalance={setBalance} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <style>{`
        @keyframes coinFlip {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(900deg) scale(1.2); }
          100% { transform: rotateY(1800deg); }
        }
        @keyframes diceRoll {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(15deg); }
          75% { transform: rotate(-15deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes ballDrop {
          0% { transform: translateY(-30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
