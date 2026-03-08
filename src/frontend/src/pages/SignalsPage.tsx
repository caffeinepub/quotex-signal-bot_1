import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  Clock,
  Loader2,
  Lock,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  type Signal,
  SignalDirection,
  UserStatus,
  useSignals,
  useUserStatus,
} from "../hooks/useQueries";

export default function SignalsPage() {
  const [userId, setUserId] = useState("");
  const [submittedId, setSubmittedId] = useState("");

  const {
    data: status,
    isLoading: statusLoading,
    isError: statusError,
    refetch: refetchStatus,
  } = useUserStatus(submittedId);

  const isActive = status === UserStatus.active;

  const { data: signals, isLoading: signalsLoading } = useSignals(
    submittedId,
    isActive,
  );

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId.trim()) {
      setSubmittedId(userId.trim());
    }
  };

  const isLoading = statusLoading || signalsLoading;

  return (
    <div className="py-10 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            সিগন্যাল চেক করুন
          </h1>
          <p className="text-muted-foreground text-sm">
            আপনার ফোন নম্বর বা ইউজার ID দিয়ে সিগন্যাল দেখুন
          </p>
        </motion.div>

        {/* Search form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="terminal-border rounded-xl p-6 mb-6"
        >
          <form onSubmit={handleCheck} className="flex gap-3">
            <Input
              placeholder="ফোন নম্বর বা ইউজার ID লিখুন..."
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="bg-muted/50 border-border focus:border-signal-call/50 font-mono flex-1"
              data-ocid="signals.user_id_input"
            />
            <Button
              type="submit"
              disabled={!userId.trim() || isLoading}
              className="bg-signal-call hover:bg-signal-call/90 text-background font-semibold border-0 glow-green"
              data-ocid="signals.check_button"
            >
              {isLoading ? (
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
          {isLoading && submittedId && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
              data-ocid="signals.loading_state"
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
              className="terminal-border rounded-xl p-6 text-center border-destructive/30"
              data-ocid="signals.error_state"
            >
              <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-3" />
              <p className="text-destructive font-semibold mb-2">ত্রুটি হয়েছে</p>
              <p className="text-muted-foreground text-sm mb-4">
                ইউজার খুঁজে পাওয়া যায়নি। সঠিক ID দিয়ে আবার চেষ্টা করুন।
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

          {!isLoading && submittedId && status === UserStatus.pending && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="terminal-border rounded-xl p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-muted-foreground animate-pulse" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">
                অনুমোদন বাকি আছে
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                আপনার পেমেন্ট যাচাই হচ্ছে। অ্যাডমিন অ্যাপ্রুভালের পর আপনি সিগন্যাল দেখতে পাবেন।
                সাধারণত ১-২৪ ঘণ্টার মধ্যে সম্পন্ন হয়।
              </p>
              <Badge className="mt-4 bg-muted text-muted-foreground border-border">
                পেন্ডিং
              </Badge>
            </motion.div>
          )}

          {!isLoading && submittedId && status === UserStatus.inactive && (
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
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                আপনার অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে। অ্যাডমিনের সাথে যোগাযোগ করুন।
              </p>
            </motion.div>
          )}

          {!isLoading && submittedId && isActive && (
            <motion.div
              key="signals"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Active badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-signal-call animate-pulse" />
                  <span className="text-sm text-call font-medium">
                    অ্যাকাউন্ট সক্রিয়
                  </span>
                </div>
                <Badge className="bg-signal-call-bg text-call border-signal-call/40 font-mono text-xs">
                  {signals?.length || 0} টি সিগন্যাল
                </Badge>
              </div>

              {/* Empty state */}
              {(!signals || signals.length === 0) && (
                <motion.div
                  className="terminal-border rounded-xl p-8 text-center"
                  data-ocid="signals.empty_state"
                >
                  <TrendingUp className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">
                    এই মুহূর্তে কোনো সক্রিয় সিগন্যাল নেই।
                  </p>
                </motion.div>
              )}

              {/* Signal cards */}
              <div className="space-y-4">
                {signals?.map((signal, index) => (
                  <SignalCard
                    key={signal.id}
                    signal={signal}
                    index={index + 1}
                  />
                ))}
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
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-sm">
              আপনার ফোন নম্বর বা ইউজার ID লিখে "চেক করুন" বাটনে ক্লিক করুন
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function SignalCard({
  signal,
  index,
}: {
  signal: Signal;
  index: number;
}) {
  const isCall = signal.direction === SignalDirection.call;
  const ocid = `signals.item.${index}` as `signals.item.${number}`;

  const expiryMs = Number(signal.expiryMinutes) * 60 * 1000;
  const createdMs = Number(signal.createdAt) / 1_000_000;
  const remaining = Math.max(
    0,
    Math.round((createdMs + expiryMs - Date.now()) / 60000),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={`rounded-xl p-5 ${isCall ? "signal-call" : "signal-put"}`}
      data-ocid={ocid}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              className={
                isCall
                  ? "bg-signal-call/20 text-call border-signal-call/40 font-mono"
                  : "bg-signal-put/20 text-put border-signal-put/40 font-mono"
              }
            >
              {isCall ? "CALL" : "PUT"}
            </Badge>
            <span
              className={`text-xs font-mono ${isCall ? "text-call" : "text-put"}`}
            >
              {Number(signal.accuracy)}% নির্ভুল
            </span>
          </div>
          <p
            className={`font-display text-xl font-bold ${isCall ? "text-call" : "text-put"}`}
          >
            {signal.asset}
          </p>
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground font-mono">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {remaining > 0 ? `${remaining} মিনিট বাকি` : "মেয়াদ শেষ"}
            </span>
            <span>•</span>
            <span>পরবর্তী ক্যান্ডেলে প্রবেশ করুন</span>
          </div>
        </div>
        <div className="text-4xl ml-4">
          {isCall ? (
            <TrendingUp className="w-10 h-10 text-call" />
          ) : (
            <TrendingDown className="w-10 h-10 text-put" />
          )}
        </div>
      </div>
    </motion.div>
  );
}
