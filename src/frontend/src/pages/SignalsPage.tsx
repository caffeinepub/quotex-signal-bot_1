import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Clock,
  Gamepad2,
  Loader2,
  Lock,
  Search,
  Shield,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { UserStatus, useUserStatus } from "../hooks/useQueries";

// Panel features list
const PANEL_FEATURES = [
  { name: "TELEKILL", icon: "🎯" },
  { name: "UP PLAYER", icon: "⬆️" },
  { name: "Esp Players", icon: "👁️" },
  { name: "SHOW LINE", icon: "📐" },
  { name: "SHOW BOX", icon: "📦" },
  { name: "Memory Hack", icon: "💾" },
  { name: "Silent Aim", icon: "🔇" },
  { name: "Head (Black List)", icon: "🎮" },
  { name: "Speed Hack", icon: "⚡" },
  { name: "Angle Fov", icon: "🔭" },
];

export default function PanelAccessPage() {
  const [userId, setUserId] = useState("");
  const [submittedId, setSubmittedId] = useState("");

  const {
    data: status,
    isLoading: statusLoading,
    isError: statusError,
    refetch: refetchStatus,
  } = useUserStatus(submittedId);

  const isActive = status === UserStatus.active;

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId.trim()) {
      setSubmittedId(userId.trim());
    }
  };

  return (
    <div className="py-10 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Gamepad2 className="w-6 h-6 text-call" />
            <h1 className="font-display text-3xl sm:text-4xl font-bold">
              প্যানেল অ্যাক্সেস চেক করুন
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            আপনার ফোন নম্বর দিয়ে BR MODS প্যানেল অ্যাক্সেস যাচাই করুন
          </p>
        </motion.div>

        {/* Search form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="cyber-border rounded-xl p-6 mb-6"
        >
          <form onSubmit={handleCheck} className="flex gap-3">
            <Input
              placeholder="আপনার ফোন নম্বর লিখুন..."
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="bg-muted/50 border-border focus:border-signal-call/50 font-mono flex-1"
              inputMode="numeric"
              data-ocid="panel.user_id_input"
            />
            <Button
              type="submit"
              disabled={!userId.trim() || statusLoading}
              className="bg-signal-call hover:bg-signal-call/90 text-background font-semibold border-0 glow-cyan"
              data-ocid="panel.check_button"
            >
              {statusLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span className="ml-2 hidden sm:inline">চেক করুন</span>
            </Button>
          </form>
        </motion.div>

        {/* Status area */}
        <AnimatePresence mode="wait">
          {statusLoading && submittedId && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
              data-ocid="panel.loading_state"
            >
              <Loader2 className="w-8 h-8 text-call animate-spin mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">যাচাই করা হচ্ছে...</p>
            </motion.div>
          )}

          {statusError && submittedId && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="cyber-border rounded-xl p-6 text-center border-destructive/30"
              data-ocid="panel.error_state"
            >
              <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-3" />
              <p className="text-destructive font-semibold mb-2">ত্রুটি হয়েছে</p>
              <p className="text-muted-foreground text-sm mb-4">
                ব্যবহারকারী খুঁজে পাওয়া যায়নি। সঠিক ফোন নম্বর দিয়ে আবার চেষ্টা করুন।
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchStatus()}
                className="border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                আবার চেষ্টা করুন
              </Button>
            </motion.div>
          )}

          {!statusLoading && submittedId && status === UserStatus.pending && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="cyber-border rounded-xl p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-muted-foreground animate-pulse" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">
                অনুমোদন বাকি আছে
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                আপনার পেমেন্ট যাচাই হচ্ছে। অ্যাডমিন অ্যাপ্রুভালের পর আপনি BR MODS প্যানেল
                অ্যাক্সেস পাবেন। সাধারণত ১-২৪ ঘণ্টার মধ্যে সম্পন্ন হয়।
              </p>
              <Badge className="mt-4 bg-muted text-muted-foreground border-border">
                পেন্ডিং
              </Badge>
            </motion.div>
          )}

          {!statusLoading && submittedId && status === UserStatus.inactive && (
            <motion.div
              key="inactive"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="signal-put rounded-xl p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-signal-put-bg border border-signal-put/30 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-put" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2 text-put">
                অ্যাকাউন্ট নিষ্ক্রিয়
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto mb-5">
                আপনার অ্যাকাউন্ট নিষ্ক্রিয় আছে। প্যানেল অ্যাক্সেস পেতে প্যাকেজ কিনুন।
              </p>
              <Button
                asChild
                className="bg-signal-call hover:bg-signal-call/90 text-background font-bold glow-cyan border-0"
                data-ocid="panel.buy_button"
              >
                <Link to="/register">
                  প্যাকেজ কিনুন <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          )}

          {!statusLoading && submittedId && isActive && (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Active badge */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-signal-call animate-pulse" />
                  <span className="text-sm text-call font-bold font-mono">
                    প্যানেল অ্যাক্সেস সক্রিয়
                  </span>
                </div>
                <Badge className="bg-signal-call-bg text-call border-signal-call/40 font-mono text-xs">
                  ✅ ACTIVE
                </Badge>
              </div>

              {/* Active banner */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="cyber-border rounded-2xl p-6 mb-6 text-center"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full bg-signal-call-bg border-2 border-signal-call/50 flex items-center justify-center glow-cyan">
                    <Shield className="w-7 h-7 text-call" />
                  </div>
                </div>
                <h3 className="font-display text-2xl font-bold neon-text mb-2">
                  BR MODS প্যানেল সক্রিয়!
                </h3>
                <p className="text-muted-foreground text-sm mb-5">
                  আপনার অ্যাকাউন্ট সক্রিয়। নিচের সকল ফিচার এখন উপলব্ধ।
                </p>

                {/* Screenshots */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="rounded-xl overflow-hidden border border-signal-call/30">
                    <img
                      src="/assets/uploads/images-1.png"
                      alt="BR MODS Login"
                      className="w-full aspect-video object-cover object-top"
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden border border-signal-call/30">
                    <img
                      src="/assets/uploads/images-2.jpeg"
                      alt="BR MODS Panel"
                      className="w-full aspect-video object-cover object-top"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Panel Features */}
              <div className="cyber-border rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-4 h-4 text-call" />
                  <h4 className="font-display font-semibold">সক্রিয় ফিচার সমূহ</h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PANEL_FEATURES.map((feature, i) => (
                    <motion.div
                      key={feature.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="flex items-center gap-2 bg-signal-call-bg/50 border border-signal-call/25 rounded-lg px-3 py-2"
                      data-ocid={`panel.feature.item.${i + 1}`}
                    >
                      <span className="text-lg">{feature.icon}</span>
                      <span className="font-mono text-xs font-bold text-call">
                        {feature.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions when no search */}
        {!submittedId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10 text-muted-foreground"
          >
            <div className="w-16 h-16 rounded-full bg-signal-call-bg/30 border border-signal-call/20 flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="w-8 h-8 text-call/40" />
            </div>
            <p className="text-sm">
              আপনার ফোন নম্বর লিখে "চেক করুন" বাটনে ক্লিক করুন
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              রেজিস্ট্রেশনে যে নম্বর দিয়েছিলেন সেটি ব্যবহার করুন
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
