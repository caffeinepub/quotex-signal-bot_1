import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle, Copy, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useRegisterUser } from "../hooks/useQueries";

const PAYMENT_NUMBERS = {
  bkash: "01305211080",
  nagad: "01305211080",
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const registerMutation = useRegisterUser();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [transactionId, setTransactionId] = useState("");

  function copyNumber(num: string) {
    navigator.clipboard.writeText(num);
    toast.success("নম্বর কপি হয়েছে!");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const success = await registerMutation.mutateAsync({
        name,
        phone,
        password,
        paymentMethod,
        transactionId,
      });
      if (success) {
        toast.success("রেজিস্ট্রেশন সফল! অ্যাডমিন অ্যাপ্রুভ করলে অ্যাক্সেস পাবেন।");
        navigate({ to: "/login" });
      } else {
        toast.error("রেজিস্ট্রেশন ব্যর্থ। এই নম্বর ইতিমধ্যে রেজিস্টার্ড হতে পারে।");
      }
    } catch {
      toast.error("রেজিস্ট্রেশন ব্যর্থ হয়েছে।");
    }
  }

  return (
    <div className="min-h-[calc(100vh-130px)] px-4 py-6 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Payment Info */}
        <div className="rounded-xl border border-border bg-card p-4 mb-5">
          <p className="text-sm font-bold text-foreground mb-3">
            💳 পেমেন্ট করুন
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            নিচের নম্বরে Personal Send করুন
          </p>

          {[
            { label: "বিকাশ", num: PAYMENT_NUMBERS.bkash, color: "#e2136e" },
            { label: "নগদ", num: PAYMENT_NUMBERS.nagad, color: "#f7941d" },
          ].map((m) => (
            <div
              key={m.label}
              className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border mb-2"
            >
              <div>
                <span className="text-xs font-bold" style={{ color: m.color }}>
                  {m.label}
                </span>
                <p className="font-mono font-bold text-foreground">{m.num}</p>
                <p className="text-[10px] text-muted-foreground">
                  Personal Send করুন
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyNumber(m.num)}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                data-ocid="register.button"
              >
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="name">আপনার নাম</Label>
            <Input
              id="name"
              placeholder="নাম লিখুন"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-background"
              data-ocid="register.input"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="reg-phone">
              যে নম্বর থেকে টাকা পাঠাবেন সেই নম্বর দিন
            </Label>
            <Input
              id="reg-phone"
              type="tel"
              placeholder="01XXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="bg-background"
              data-ocid="register.input"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="reg-password">পাসওয়ার্ড তৈরি করুন</Label>
            <Input
              id="reg-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-background"
              data-ocid="register.input"
            />
          </div>

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
                  data-ocid="register.radio"
                >
                  {m.l}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="txn">ট্রানজেকশন ID</Label>
            <Input
              id="txn"
              placeholder="TXN ID লিখুন"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              required
              className="bg-background"
              data-ocid="register.input"
            />
          </div>

          <Button
            type="submit"
            className="w-full font-bold text-black mt-2"
            style={{ background: "oklch(0.76 0.13 85)" }}
            disabled={registerMutation.isPending}
            data-ocid="register.submit_button"
          >
            {registerMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            রেজিস্ট্রেশন সম্পন্ন করুন
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
          <Link
            to="/login"
            className="font-semibold hover:underline"
            style={{ color: "oklch(0.76 0.13 85)" }}
            data-ocid="register.link"
          >
            লগইন করুন
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
