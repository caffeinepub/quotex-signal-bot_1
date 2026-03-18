import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import { Crown, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useLoginUser } from "../hooks/useQueries";

export default function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLoginUser();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const success = await loginMutation.mutateAsync({ phone, password });
      if (success) {
        toast.success("সফলভাবে লগইন হয়েছে!");
        navigate({ to: "/profile" });
      } else {
        toast.error("ফোন নম্বর বা পাসওয়ার্ড ভুল!");
      }
    } catch {
      toast.error("লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
    }
  }

  return (
    <div className="min-h-[calc(100vh-130px)] flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <Crown
              className="w-10 h-10 mb-2"
              style={{ color: "oklch(0.76 0.13 85)" }}
            />
            <h1
              className="text-2xl font-bold"
              style={{ color: "oklch(0.76 0.13 85)" }}
            >
              WINX888
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              আপনার অ্যাকাউন্টে লগইন করুন
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="phone">ফোন নম্বর</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="01XXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="bg-background border-border"
                data-ocid="login.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">পাসওয়ার্ড</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background border-border"
                data-ocid="login.input"
              />
            </div>

            <Button
              type="submit"
              className="w-full font-bold text-black"
              style={{ background: "oklch(0.76 0.13 85)" }}
              disabled={loginMutation.isPending}
              data-ocid="login.submit_button"
            >
              {loginMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              লগইন করুন
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              to="/register"
              className="font-semibold hover:underline"
              style={{ color: "oklch(0.76 0.13 85)" }}
              data-ocid="login.link"
            >
              রেজিস্টার করুন
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
