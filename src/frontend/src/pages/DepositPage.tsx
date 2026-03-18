import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Copy, Loader2, Wallet } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateDepositRequest } from "../hooks/useQueries";

const PAYMENT_NUMBERS = { bkash: "01305211080", nagad: "01305211080" };
const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

export default function DepositPage() {
  const depositMutation = useCreateDepositRequest();
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [transactionId, setTransactionId] = useState("");

  function copyNumber(num: string) {
    navigator.clipboard.writeText(num);
    toast.success("নম্বর কপি হয়েছে!");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amountNum = Number(amount);
    if (!amountNum || amountNum <= 0) {
      toast.error("সঠিক পরিমাণ লিখুন");
      return;
    }
    try {
      await depositMutation.mutateAsync({
        amount: BigInt(amountNum),
        paymentMethod,
        transactionId,
      });
      toast.success(
        "ডিপোজিট রিকোয়েস্ট পাঠানো হয়েছে! অ্যাডমিন অ্যাপ্রুভ করলে ব্যালেন্স যোগ হবে।",
      );
      setAmount("");
      setTransactionId("");
    } catch {
      toast.error("ডিপোজিট রিকোয়েস্ট ব্যর্থ হয়েছে।");
    }
  }

  return (
    <div className="min-h-[calc(100vh-130px)] px-4 py-6 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        {/* Header */}
        <div
          className="rounded-2xl p-5 text-center"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.18 0.08 162), oklch(0.26 0.11 162))",
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ background: "oklch(0.76 0.13 85 / 0.2)" }}
          >
            <Wallet
              className="w-7 h-7"
              style={{ color: "oklch(0.76 0.13 85)" }}
            />
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "oklch(0.76 0.13 85)" }}
          >
            জমা করুন
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            নিচের নম্বরে টাকা পাঠিয়ে TXN ID দিন
          </p>

          {/* Amount input prominently */}
          <div className="mt-4">
            <div className="relative">
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold"
                style={{ color: "oklch(0.76 0.13 85)" }}
              >
                ৳
              </span>
              <input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-2xl font-bold text-center rounded-xl border border-border bg-background outline-none focus:border-gold transition-colors"
                style={{
                  color: amount ? "oklch(0.76 0.13 85)" : undefined,
                  borderColor: amount ? "oklch(0.76 0.13 85 / 0.5)" : undefined,
                }}
                data-ocid="deposit.input"
              />
            </div>

            {/* Quick amounts */}
            <div className="flex gap-2 mt-3 justify-center">
              {QUICK_AMOUNTS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(String(q))}
                  className="px-3 py-1.5 rounded-full text-sm font-semibold border transition-all"
                  style={{
                    borderColor:
                      amount === String(q)
                        ? "oklch(0.76 0.13 85)"
                        : "oklch(0.76 0.13 85 / 0.3)",
                    background:
                      amount === String(q)
                        ? "oklch(0.76 0.13 85)"
                        : "oklch(0.76 0.13 85 / 0.1)",
                    color:
                      amount === String(q) ? "black" : "oklch(0.76 0.13 85)",
                  }}
                  data-ocid="deposit.button"
                >
                  ৳{q.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Numbers */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <p className="text-xs text-muted-foreground font-semibold mb-2">
            📋 পেমেন্ট নম্বর
          </p>
          {[
            { label: "বিকাশ", num: PAYMENT_NUMBERS.bkash, color: "#e2136e" },
            { label: "নগদ", num: PAYMENT_NUMBERS.nagad, color: "#f7941d" },
          ].map((m) => (
            <div
              key={m.label}
              className="flex items-center justify-between p-3 rounded-lg bg-background border border-border"
            >
              <div>
                <span className="text-xs font-bold" style={{ color: m.color }}>
                  {m.label}
                </span>
                <p className="font-mono font-bold text-lg text-foreground">
                  {m.num}
                </p>
                <p className="text-xs text-muted-foreground">
                  Personal Send করুন
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyNumber(m.num)}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                data-ocid="deposit.button"
              >
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-border bg-card p-4"
        >
          {/* Payment method */}
          <div className="space-y-1">
            <Label>পেমেন্ট পদ্ধতি</Label>
            <div className="flex gap-2">
              {[
                { v: "bkash", l: "বিকাশ", c: "#e2136e" },
                { v: "nagad", l: "নগদ", c: "#f7941d" },
              ].map((m) => (
                <button
                  key={m.v}
                  type="button"
                  onClick={() => setPaymentMethod(m.v)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-semibold transition-all ${
                    paymentMethod === m.v
                      ? "border-current"
                      : "border-border bg-card text-muted-foreground"
                  }`}
                  style={
                    paymentMethod === m.v
                      ? { color: m.c, borderColor: m.c, background: `${m.c}15` }
                      : undefined
                  }
                  data-ocid="deposit.radio"
                >
                  {m.l}
                </button>
              ))}
            </div>
          </div>

          {/* Amount (hidden if already filled above, but kept for form submission) */}
          <div className="space-y-1">
            <Label htmlFor="amount">পরিমাণ নিশ্চিত করুন (টাকা)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
              className="bg-background"
              data-ocid="deposit.input"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="dep-txn">ট্রানজেকশন ID</Label>
            <Input
              id="dep-txn"
              placeholder="TXN ID লিখুন"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              required
              className="bg-background"
              data-ocid="deposit.input"
            />
          </div>

          <Button
            type="submit"
            className="w-full font-bold text-black"
            style={{ background: "oklch(0.76 0.13 85)" }}
            disabled={depositMutation.isPending}
            data-ocid="deposit.submit_button"
          >
            {depositMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            ডিপোজিট রিকোয়েস্ট পাঠান
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
