import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle,
  Crown,
  ShieldCheck,
  Swords,
  Target,
  Wallet,
  Zap,
} from "lucide-react";
import { type Variants, motion } from "motion/react";
import { useState } from "react";

// ─── BR MODS Packages (hardcoded) ─────────────────────────────────────────────
export const BR_PACKAGES = [
  { months: 1, label: "১ মাস", price: 250, originalPrice: 500, popular: false },
  { months: 2, label: "২ মাস", price: 400, originalPrice: 800, popular: false },
  { months: 3, label: "৩ মাস", price: 600, originalPrice: 1200, popular: true },
  {
    months: 6,
    label: "৬ মাস",
    price: 1000,
    originalPrice: 2000,
    popular: false,
  },
  {
    months: 12,
    label: "১ বছর",
    price: 1600,
    originalPrice: 3200,
    popular: false,
  },
];

// ─── Panel Features ────────────────────────────────────────────────────────────
const PANEL_FEATURES = [
  { name: "TELEKILL", icon: "🎯", desc: "দূর থেকে কিল করুন" },
  { name: "UP PLAYER", icon: "⬆️", desc: "প্লেয়ার পজিশন আপ" },
  { name: "Esp Players", icon: "👁️", desc: "দেওয়ালের আড়াল দেখুন" },
  { name: "SHOW LINE", icon: "📐", desc: "টার্গেট লাইন দেখুন" },
  { name: "SHOW BOX", icon: "📦", desc: "প্লেয়ার বক্স দেখুন" },
  { name: "Memory Hack", icon: "💾", desc: "মেমোরি অ্যাক্সেস" },
  { name: "Silent Aim", icon: "🔇", desc: "অটো টার্গেট লক" },
  { name: "Head (Black List)", icon: "🎮", desc: "হেড শট মোড" },
  { name: "Speed Hack", icon: "⚡", desc: "স্পিড বুস্ট" },
  { name: "Angle Fov", icon: "🔭", desc: "ফিল্ড অফ ভিউ এক্সপ্যান্ড" },
];

// ─── Animation Variants ───────────────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HomePage() {
  const [selectedPackage, setSelectedPackage] = useState<number>(3); // months

  return (
    <div className="relative overflow-hidden">
      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative pt-10 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* BR MODS Logo + Title */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="text-center mb-10"
          >
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 blur-2xl bg-signal-call/20 rounded-full scale-150" />
                <img
                  src="/assets/uploads/Screenshot-2025-12-05-042219-1-6.png"
                  alt="BR MODS Logo"
                  className="relative h-24 w-auto object-contain drop-shadow-[0_0_20px_oklch(0.78_0.18_195/0.8)]"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Badge
                variant="outline"
                className="gap-2 px-4 py-1.5 border-signal-call/50 text-call bg-signal-call-bg font-mono text-xs mb-4"
              >
                <span className="w-2 h-2 rounded-full bg-signal-call animate-pulse" />
                PREMIUM PANEL ACCESS
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4"
            >
              <span className="neon-text">BR MODS</span>{" "}
              <span className="text-foreground font-mono text-3xl sm:text-4xl md:text-5xl align-middle opacity-70">
                V2.0
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-muted-foreground mb-8 font-body max-w-xl mx-auto"
            >
              Free Fire-এর সেরা মড প্যানেল — এখনই অ্যাক্সেস নিন
            </motion.p>

            <motion.div variants={itemVariants}>
              <Button
                asChild
                size="lg"
                className="bg-signal-call hover:bg-signal-call/90 text-background font-bold px-10 glow-cyan border-0 text-base"
                data-ocid="home.primary_button"
              >
                <Link to="/register">
                  এখনই প্যাকেজ কিনুন
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── 50% OFF Banner + Package Selection ─────────────────────────────── */}
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* 50% Offer Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-7"
          >
            <div className="relative rounded-2xl overflow-hidden border border-orange-500/50 bg-gradient-to-r from-red-950/80 via-orange-950/80 to-red-950/80 p-5 text-center shadow-lg shadow-orange-900/30">
              <div className="absolute inset-0 rounded-2xl animate-pulse bg-gradient-to-r from-red-500/10 via-orange-400/15 to-red-500/10 pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-400/80 to-transparent" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/40 rounded-full px-4 py-1 mb-3">
                  <span className="text-orange-300 text-xs font-bold tracking-wider uppercase">
                    সীমিত সময়
                  </span>
                </div>
                <p className="font-display text-xl sm:text-2xl font-bold text-orange-100 leading-tight">
                  🔥 সকল প্যাকেজে{" "}
                  <span className="text-orange-400 text-2xl sm:text-3xl">
                    ৫০% ছাড়
                  </span>{" "}
                  চলছে!
                </p>
                <p className="text-orange-300/80 text-sm mt-2">
                  এখনই অর্ডার করুন — অফার যেকোনো সময় শেষ হতে পারে
                </p>
                <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
                  {["⏰ সীমিত অফার", "🎮 তাৎক্ষণিক অ্যাক্সেস", "🔒 নিরাপদ পেমেন্ট"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="text-[10px] text-orange-300/70 font-semibold"
                      >
                        {tag}
                      </span>
                    ),
                  )}
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent" />
            </div>
          </motion.div>

          {/* Package title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-call" />
              <h2 className="font-display text-2xl font-bold">
                প্যাকেজ নির্বাচন করুন
              </h2>
              <Crown className="w-5 h-5 text-call" />
            </div>
            <p className="text-muted-foreground text-sm">
              কতদিনের প্যাকেজ কিনতে চান তা নির্বাচন করুন
            </p>
          </motion.div>

          {/* Package Cards */}
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6"
            data-ocid="home.package.list"
          >
            {BR_PACKAGES.map((pkg) => (
              <motion.button
                key={pkg.months}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                onClick={() => setSelectedPackage(pkg.months)}
                className={`relative rounded-xl p-4 border-2 text-center transition-all cursor-pointer ${
                  selectedPackage === pkg.months
                    ? "border-signal-call bg-signal-call-bg glow-cyan"
                    : "border-border bg-card hover:border-signal-call/40"
                }`}
                data-ocid={`home.package.item.${pkg.months}`}
                type="button"
              >
                {/* 50% OFF badge */}
                <div className="absolute -top-2.5 left-0 right-0 flex justify-center">
                  <span className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow shadow-orange-900/40">
                    ৫০% অফার
                  </span>
                </div>
                {pkg.popular && (
                  <div className="absolute -bottom-2.5 left-0 right-0 flex justify-center">
                    <span className="bg-signal-call text-background text-[9px] font-bold px-2 py-0.5 rounded-full">
                      জনপ্রিয়
                    </span>
                  </div>
                )}
                {/* Original strikethrough price */}
                <div className="text-[10px] text-muted-foreground line-through mt-1">
                  ৳{pkg.originalPrice}
                </div>
                {/* Current price */}
                <div className="font-display text-2xl font-bold text-call leading-tight">
                  {pkg.price}
                </div>
                <div className="text-xs text-muted-foreground mb-1">টাকা</div>
                <div className="font-semibold text-sm text-foreground">
                  {pkg.label}
                </div>
                {selectedPackage === pkg.months && (
                  <div className="mt-2 flex justify-center">
                    <CheckCircle className="w-4 h-4 text-call" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Button
              asChild
              size="lg"
              className="bg-signal-call hover:bg-signal-call/90 text-background font-bold px-10 glow-cyan border-0"
              data-ocid="home.register_button"
            >
              <Link to="/register">
                এখনই কিনুন —{" "}
                {BR_PACKAGES.find((p) => p.months === selectedPackage)?.price}{" "}
                টাকা (
                {BR_PACKAGES.find((p) => p.months === selectedPackage)?.label})
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ─── Payment Section ────────────────────────────────────────────────── */}
      <section className="py-14 px-4">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="cyber-border rounded-2xl p-8"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-call" />
              <h2 className="font-display text-2xl font-bold text-center">
                পেমেন্ট করুন
              </h2>
              <Crown className="w-5 h-5 text-call" />
            </div>
            <p className="text-sm font-semibold text-call text-center mb-1">
              সিগন্যাল নিতে এখনই প্রিমিয়াম প্যাকেজ ক্রয় করুন
            </p>
            <p className="text-xs text-muted-foreground text-center mb-8">
              Bkash অথবা Nagad-এ Personal Send করুন
            </p>

            <div className="space-y-4">
              <PaymentMethodCard
                method="Bkash"
                icon="💗"
                number="01305211080"
                sendType="Personal Send"
                color="oklch(0.65 0.20 355)"
                bgColor="oklch(0.14 0.06 355)"
              />
              <PaymentMethodCard
                method="Nagad"
                icon="🟠"
                number="01305211080"
                sendType="Personal Send"
                color="oklch(0.65 0.22 35)"
                bgColor="oklch(0.14 0.06 35)"
              />
            </div>

            <div className="mt-5 p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-center">
              <p className="text-xs text-amber-400 font-semibold">
                ⚠️ Finance অপশন ব্যবহার করবেন না — শুধুমাত্র Personal Send করুন
              </p>
            </div>

            <div className="mt-5 text-center">
              <Button
                asChild
                size="lg"
                className="bg-signal-call hover:bg-signal-call/90 text-background font-bold glow-cyan border-0 px-8"
                data-ocid="home.payment_register_button"
              >
                <Link to="/register">
                  পেমেন্টের পর রেজিস্ট্রেশন করুন{" "}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Screenshots Grid ────────────────────────────────────────────────── */}
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl mx-auto mb-10 space-y-3"
          >
            {/* Row 1: Free Fire banner - full width */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative rounded-xl overflow-hidden border border-signal-call/30 shadow-lg shadow-signal-call/10 group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent z-10" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-2 border-signal-call/60 rounded-xl z-20 pointer-events-none" />
              <img
                src="/assets/uploads/images-2--2.jpeg"
                alt="Free Fire"
                className="w-full h-40 object-cover object-center"
                loading="lazy"
              />
              <div className="absolute bottom-2 left-2 right-2 z-20">
                <span className="text-[10px] font-mono text-call/90 bg-background/80 px-2 py-0.5 rounded">
                  Free Fire — 50 Players | 10 Minutes | 1 Survivor
                </span>
              </div>
            </motion.div>

            {/* Row 2: 2 cols - Login + Panel */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  src: "/assets/uploads/images-1-1.png",
                  alt: "BR MODS External Login",
                  label: "Login Screen",
                },
                {
                  src: "/assets/uploads/images-1-5.jpeg",
                  alt: "BR MODS Panel Features",
                  label: "Panel Controls",
                },
              ].map((img, i) => (
                <motion.div
                  key={img.alt}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="relative rounded-xl overflow-hidden border border-signal-call/30 shadow-lg shadow-signal-call/10 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent z-10" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-2 border-signal-call/60 rounded-xl z-20 pointer-events-none" />
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full aspect-[4/5] object-cover object-center"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 left-2 right-2 z-20">
                    <span className="text-[10px] font-mono text-call/90 bg-background/80 px-2 py-0.5 rounded">
                      {img.label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Row 3: 2 cols - Free Fire Max + Gameplay */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  src: "/assets/uploads/images-3--4.jpeg",
                  alt: "Free Fire Max",
                  label: "Free Fire MAX",
                },
                {
                  src: "/assets/uploads/Screenshot_2026-03-08-20-25-27-380-edit_com.google.android.youtube-1-7.jpg",
                  alt: "BR MODS Gameplay",
                  label: "Live Gameplay",
                },
              ].map((img, i) => (
                <motion.div
                  key={img.alt}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="relative rounded-xl overflow-hidden border border-signal-call/30 shadow-lg shadow-signal-call/10 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent z-10" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-2 border-signal-call/60 rounded-xl z-20 pointer-events-none" />
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full aspect-video object-cover object-center"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 left-2 right-2 z-20">
                    <span className="text-[10px] font-mono text-call/90 bg-background/80 px-2 py-0.5 rounded">
                      {img.label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Row 4: Free Fire character - full width */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative rounded-xl overflow-hidden border border-signal-call/30 shadow-lg shadow-signal-call/10 group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent z-10" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-2 border-signal-call/60 rounded-xl z-20 pointer-events-none" />
              <img
                src="/assets/uploads/images-1--3.jpeg"
                alt="Free Fire Character"
                className="w-full h-36 object-cover object-top"
                loading="lazy"
              />
              <div className="absolute bottom-2 left-2 right-2 z-20">
                <span className="text-[10px] font-mono text-call/90 bg-background/80 px-2 py-0.5 rounded">
                  Free Fire — Premium Access
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-3 gap-4 max-w-sm mx-auto"
          >
            {[
              { value: "10+", label: "ফিচার" },
              { value: "24/7", label: "সক্রিয়" },
              { value: "ফ্রি ফায়ার", label: "গেম" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center cyber-border rounded-lg p-3"
              >
                <div className="font-mono text-lg font-bold text-call">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Panel Features Grid ─────────────────────────────────────────────── */}
      <section className="py-14 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Swords className="w-5 h-5 text-call" />
              <h2 className="font-display text-2xl sm:text-3xl font-bold">
                প্যানেল ফিচার সমূহ
              </h2>
              <Swords className="w-5 h-5 text-call" />
            </div>
            <p className="text-muted-foreground text-sm">
              BR MODS V2.0 প্যানেলে যা যা পাচ্ছেন
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {PANEL_FEATURES.map((feature, i) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="cyber-border rounded-xl p-4 text-center group hover:border-signal-call/60 transition-all hover:shadow-[0_0_20px_oklch(0.78_0.18_195/0.2)]"
              >
                <div className="text-2xl mb-2">{feature.icon}</div>
                <p className="font-mono text-xs font-bold text-call mb-1">
                  {feature.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ──────────────────────────────────────────────────── */}
      <section className="py-14 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-2xl font-bold mb-2">
              কিভাবে কাজ করে?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: "০১",
                icon: Wallet,
                title: "পেমেন্ট করুন",
                desc: "Bkash বা Nagad-এ 01305211080 নম্বরে Personal Send করুন",
              },
              {
                step: "০২",
                icon: CheckCircle,
                title: "রেজিস্ট্রেশন করুন",
                desc: "আপনার নাম, ফোন, Free Fire UID ও ট্রানজেকশন ID দিয়ে রেজিস্ট্রেশন করুন",
              },
              {
                step: "০৩",
                icon: Target,
                title: "প্যানেল অ্যাক্সেস পান",
                desc: "অ্যাডমিন অ্যাপ্রুভালের পর সম্পূর্ণ BR MODS প্যানেল অ্যাক্সেস পাবেন",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="cyber-border rounded-xl p-6 relative"
              >
                <div className="font-mono text-4xl font-bold text-border mb-4 leading-none">
                  {item.step}
                </div>
                <item.icon className="w-6 h-6 text-call mb-3" />
                <h3 className="font-display text-lg font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── App Features ──────────────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-card/20">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: Zap,
                title: "তাৎক্ষণিক অ্যাক্সেস",
                desc: "পেমেন্ট ও রেজিস্ট্রেশনের পর অ্যাডমিন অ্যাপ্রুভাল হলেই সক্রিয়",
              },
              {
                icon: ShieldCheck,
                title: "নিরাপদ প্যানেল",
                desc: "শুধুমাত্র যাচাইকৃত ব্যবহারকারীরা BR MODS প্যানেল অ্যাক্সেস পাবেন",
              },
              {
                icon: Target,
                title: "১০+ ফিচার",
                desc: "TELEKILL, Silent Aim, ESP, Speed Hack সহ সকল প্রিমিয়াম ফিচার",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="cyber-border rounded-xl p-5"
              >
                <div className="w-10 h-10 rounded-lg bg-signal-call-bg border border-signal-call/30 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-call" />
                </div>
                <h3 className="font-display text-base font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Payment Method Card ───────────────────────────────────────────────────────
function PaymentMethodCard({
  method,
  icon,
  number,
  sendType,
  color,
  bgColor,
}: {
  method: string;
  icon: string;
  number: string;
  sendType?: string;
  color: string;
  bgColor: string;
}) {
  return (
    <div
      className="rounded-xl p-4 border"
      style={{
        background: bgColor,
        borderColor: `${color}50`,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <p className="font-bold text-base" style={{ color }}>
            {method}
          </p>
        </div>
        <p className="font-mono text-lg font-bold" style={{ color }}>
          {number}
        </p>
      </div>
      {sendType && (
        <div
          className="mt-1 text-center text-xs font-semibold py-1.5 px-3 rounded-md border"
          style={{
            color,
            borderColor: `${color}40`,
            background: `${color}15`,
          }}
        >
          ✅ {sendType} — এই নম্বরে পাঠান
        </div>
      )}
    </div>
  );
}
