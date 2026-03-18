import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { Clock, Loader2, User, Wallet } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { UserStatus } from "../backend.d";
import { useCallerUserProfile } from "../hooks/useQueries";

function StatusBadge({ status }: { status: UserStatus }) {
  const config: Record<UserStatus, { label: string; bg: string }> = {
    [UserStatus.active]: { label: "সক্রিয়", bg: "oklch(0.55 0.18 165)" },
    [UserStatus.pending]: { label: "অপেক্ষামান", bg: "oklch(0.76 0.13 85)" },
    [UserStatus.inactive]: { label: "নিষ্ক্রিয়", bg: "oklch(0.55 0.22 25)" },
  };
  const c = config[status];
  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-bold text-black"
      style={{ background: c.bg }}
    >
      {c.label}
    </span>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useCallerUserProfile();

  useEffect(() => {
    if (!isLoading && profile === null) {
      navigate({ to: "/login" });
    }
  }, [profile, isLoading, navigate]);

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-[300px]"
        data-ocid="profile.loading_state"
      >
        <Loader2
          className="w-8 h-8 animate-spin"
          style={{ color: "oklch(0.76 0.13 85)" }}
        />
      </div>
    );
  }

  if (!profile) return null;

  const registeredDate = new Date(
    Number(profile.registeredAt) / 1_000_000,
  ).toLocaleDateString("bn-BD");

  return (
    <div className="min-h-[calc(100vh-130px)] max-w-lg mx-auto pb-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Cover Banner */}
        <div
          className="w-full rounded-b-3xl relative"
          style={{
            height: "110px",
            background:
              "linear-gradient(135deg, oklch(0.18 0.08 162) 0%, oklch(0.28 0.12 162) 50%, oklch(0.22 0.10 180) 100%)",
          }}
        >
          {/* Decorative circles */}
          <div
            className="absolute top-3 right-6 w-16 h-16 rounded-full opacity-20"
            style={{ background: "oklch(0.76 0.13 85)" }}
          />
          <div
            className="absolute top-8 right-14 w-8 h-8 rounded-full opacity-15"
            style={{ background: "oklch(0.76 0.13 85)" }}
          />
        </div>

        {/* Avatar overlapping cover */}
        <div
          className="flex flex-col items-center"
          style={{ marginTop: "-44px" }}
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center border-4"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.76 0.13 85), oklch(0.65 0.14 70))",
              borderColor: "oklch(0.14 0.04 162)",
            }}
          >
            <User className="w-12 h-12 text-black" />
          </div>

          <h2 className="mt-3 text-xl font-bold text-foreground">
            {profile.name}
          </h2>
          <p className="text-sm text-muted-foreground">{profile.phone}</p>
          <div className="mt-2">
            <StatusBadge status={profile.status} />
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-5 px-4 grid grid-cols-2 gap-3">
          <div
            className="rounded-2xl p-4 flex flex-col items-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.20 0.07 162), oklch(0.25 0.09 162))",
            }}
            data-ocid="profile.card"
          >
            <Wallet
              className="w-5 h-5 mb-1"
              style={{ color: "oklch(0.76 0.13 85)" }}
            />
            <p className="text-xs text-muted-foreground">ব্যালেন্স</p>
            <p
              className="text-lg font-bold"
              style={{ color: "oklch(0.76 0.13 85)" }}
            >
              ৳{Number(profile.balance).toLocaleString()}
            </p>
          </div>
          <div
            className="rounded-2xl p-4 flex flex-col items-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.20 0.07 162), oklch(0.25 0.09 162))",
            }}
          >
            <Clock className="w-5 h-5 mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">যোগদান</p>
            <p className="text-sm font-bold text-foreground">
              {registeredDate}
            </p>
          </div>
        </div>

        {/* Account status info */}
        <div className="mt-3 mx-4 rounded-2xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">একাউন্ট স্ট্যাটাস</p>
          <p className="text-sm font-semibold text-foreground">
            {profile.status === UserStatus.active
              ? "✅ অ্যাক্টিভ — সব ফিচার ব্যবহার করতে পারবেন"
              : profile.status === UserStatus.pending
                ? "⏳ পেন্ডিং — অ্যাডমিন অ্যাপ্রুভের অপেক্ষায়"
                : "❌ নিষ্ক্রিয়"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 px-4 flex gap-3">
          <Link to="/deposit" className="flex-1">
            <Button
              className="w-full font-bold text-black"
              style={{ background: "oklch(0.76 0.13 85)" }}
              data-ocid="profile.primary_button"
            >
              <Wallet className="w-4 h-4 mr-2" /> জমা করুন
            </Button>
          </Link>
          <Link to="/promotion" className="flex-1">
            <Button
              variant="outline"
              className="w-full border-border"
              data-ocid="profile.secondary_button"
            >
              প্রোমোশন দেখুন
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
