import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Crown,
  Shield,
  TrendingDown,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import { type Variants, motion } from "motion/react";
import { useState } from "react";
import { usePaymentInfo } from "../hooks/useQueries";

const PACKAGES = [
  {
    months: 1,
    days: 30,
    label: "১ মাস",
    price: 550,
    originalPrice: 1100,
    popular: false,
  },
  {
    months: 2,
    days: 60,
    label: "২ মাস",
    price: 1150,
    originalPrice: 2300,
    popular: false,
  },
  {
    months: 3,
    days: 90,
    label: "৩ মাস",
    price: 2100,
    originalPrice: 4200,
    popular: true,
  },
  {
    months: 6,
    days: 180,
    label: "৬ মাস",
    price: 4200,
    originalPrice: 8400,
    popular: false,
  },
  {
    months: 12,
    days: 365,
    label: "১ বছর",
    price: 8400,
    originalPrice: 16800,
    popular: false,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HomePage() {
  const { isLoading } = usePaymentInfo();
  const [selectedPackage, setSelectedPackage] = useState<number>(1); // months

  return (
    <div className="relative overflow-hidden">
      {/* Background grid */}
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-10 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Chat Preview Image */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <div className="relative w-full max-w-lg rounded-2xl overflow-hidden border border-signal-call/30 shadow-2xl shadow-signal-call/10">
              <img
                src="/assets/generated/chat-preview.dim_600x400.png"
                alt="Trading Signal Chat Preview"
                className="w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-0 right-0 text-center">
                <Badge
                  variant="outline"
                  className="gap-2 px-4 py-1.5 border-signal-call/50 text-call bg-background/90 font-mono text-xs backdrop-blur-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-signal-call animate-pulse" />
                  LIVE VIP SIGNALS — এখনই যোগ দিন
                </Badge>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="text-center"
          >
            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4"
            >
              <span className="text-foreground">Quotex</span>{" "}
              <span className="text-call">Signal Bot</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-muted-foreground mb-3 font-body max-w-xl mx-auto"
            >
              পেশাদার ট্রেডিং সিগন্যাল — সরাসরি আপনার হাতে
            </motion.p>

            {/* Premium CTA Banner */}
            <motion.div
              variants={itemVariants}
              className="mx-auto max-w-2xl mb-8"
            >
              <div className="relative rounded-2xl overflow-hidden border border-signal-call/40 bg-gradient-to-r from-signal-call-bg via-signal-call-bg/50 to-signal-call-bg p-6">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-signal-call/60 to-transparent" />
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-call" />
                  <span className="font-display text-lg font-bold text-call">
                    প্রিমিয়াম সিগন্যাল নিতে চান?
                  </span>
                  <Crown className="w-5 h-5 text-call" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  এখনই প্রিমিয়াম প্যাকেজ ক্রয় করুন এবং উচ্চ নির্ভুলতার লাইভ ট্রেডিং সিগন্যাল
                  পান
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-signal-call hover:bg-signal-call/90 text-background font-bold px-10 glow-green border-0 text-base"
                  data-ocid="home.premium_button"
                >
                  <Link to="/register">
                    এখনই প্রিমিয়াম প্যাকেজ ক্রয় করুন
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="mt-4 grid grid-cols-3 gap-4 max-w-sm mx-auto"
            >
              {[
                { value: "85-94%", label: "নির্ভুলতা" },
                { value: "24/7", label: "সক্রিয়" },
                { value: "Live", label: "রিয়েল-টাইম" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center terminal-border rounded-lg p-3"
                >
                  <div className="font-mono text-lg font-bold text-call">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Package Selection Section */}
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
              {/* Animated glow border */}
              <div className="absolute inset-0 rounded-2xl animate-pulse bg-gradient-to-r from-red-500/10 via-orange-400/15 to-red-500/10 pointer-events-none" />
              {/* Top shimmer line */}
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
                <div className="flex items-center justify-center gap-3 mt-3">
                  {[
                    "⏰ সীমিত অফার",
                    "💯 গ্যারান্টিড সিগন্যাল",
                    "🚀 তাৎক্ষণিক অ্যাক্সেস",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] text-orange-300/70 font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              {/* Bottom shimmer line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
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

          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6"
            data-ocid="home.package.list"
          >
            {PACKAGES.map((pkg) => (
              <motion.button
                key={pkg.months}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                onClick={() => setSelectedPackage(pkg.months)}
                className={`relative rounded-xl p-4 border-2 text-center transition-all cursor-pointer ${
                  selectedPackage === pkg.months
                    ? "border-signal-call bg-signal-call-bg glow-green"
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

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Button
              asChild
              size="lg"
              className="bg-signal-call hover:bg-signal-call/90 text-background font-bold px-10 glow-green border-0"
              data-ocid="home.register_button"
            >
              <Link to="/register">
                {PACKAGES.find((p) => p.months === selectedPackage)?.price} টাকায়{" "}
                {PACKAGES.find((p) => p.months === selectedPackage)?.label}ের
                প্যাকেজ কিনুন
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Sample signal cards */}
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="font-display text-2xl font-bold mb-2">
              সিগন্যাল কেমন দেখায়?
            </h2>
            <p className="text-muted-foreground text-sm">নমুনা সিগন্যাল কার্ড</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            {/* CALL sample */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="signal-call rounded-xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-muted-foreground font-mono mb-1">
                    ASSET
                  </p>
                  <p className="font-display text-xl font-bold text-call">
                    USD/PKR OTC
                  </p>
                </div>
                <div className="text-3xl">⬆️</div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-signal-call/20 text-call border-signal-call/40 font-mono text-sm">
                  CALL
                </Badge>
                <span className="text-sm font-mono text-call">91% নির্ভুল</span>
              </div>
              <p className="text-xs text-muted-foreground mt-3 font-mono">
                ⏱ ৫ মিনিট • পরবর্তী ক্যান্ডেলে প্রবেশ করুন
              </p>
            </motion.div>

            {/* PUT sample */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="signal-put rounded-xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-muted-foreground font-mono mb-1">
                    ASSET
                  </p>
                  <p className="font-display text-xl font-bold text-put">
                    EUR/USD OTC
                  </p>
                </div>
                <div className="text-3xl">⬇️</div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-signal-put/20 text-put border-signal-put/40 font-mono text-sm">
                  PUT
                </Badge>
                <span className="text-sm font-mono text-put">88% নির্ভুল</span>
              </div>
              <p className="text-xs text-muted-foreground mt-3 font-mono">
                ⏱ ৩ মিনিট • পরবর্তী ক্যান্ডেলে প্রবেশ করুন
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
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
              কিভাবে ব্যবহার করবেন?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: "০১",
                icon: Wallet,
                title: "পেমেন্ট করুন",
                desc: "Bkash, Nagad বা Binance-এর মাধ্যমে পেমেন্ট করুন",
                color: "text-call",
              },
              {
                step: "০২",
                icon: CheckCircle,
                title: "রেজিস্ট্রেশন করুন",
                desc: "আপনার নাম, ফোন ও ট্রানজেকশন ID দিয়ে রেজিস্ট্রেশন করুন",
                color: "text-call",
              },
              {
                step: "০৩",
                icon: TrendingUp,
                title: "সিগন্যাল পান",
                desc: "অ্যাডমিন অ্যাপ্রুভালের পর লাইভ সিগন্যাল দেখুন",
                color: "text-call",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="terminal-border rounded-xl p-6 relative"
              >
                <div className="font-mono text-4xl font-bold text-border mb-4 leading-none">
                  {item.step}
                </div>
                <item.icon className={`w-6 h-6 ${item.color} mb-3`} />
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

      {/* Payment Info Section */}
      <section className="py-14 px-4">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="terminal-border rounded-2xl p-8"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-call" />
              <h2 className="font-display text-2xl font-bold text-center">
                পেমেন্ট করুন
              </h2>
              <Crown className="w-5 h-5 text-call" />
            </div>
            <p className="text-sm text-muted-foreground text-center mb-2">
              সিগন্যাল নিতে এখনই প্রিমিয়াম প্যাকেজ ক্রয় করুন
            </p>
            <p className="text-xs text-muted-foreground text-center mb-8">
              Bkash অথবা Nagad-এ পেমেন্ট করুন
            </p>

            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-24 rounded-lg" />
                <Skeleton className="h-24 rounded-lg" />
              </div>
            ) : (
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
            )}

            <div className="mt-5 p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-center">
              <p className="text-xs text-amber-400 font-semibold">
                ⚠️ Finance অপশন ব্যবহার করবেন না — শুধুমাত্র Personal Send করুন
              </p>
            </div>

            <div className="mt-5 text-center">
              <Button
                asChild
                size="lg"
                className="bg-signal-call hover:bg-signal-call/90 text-background font-bold glow-green border-0 px-8"
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

      {/* Features */}
      <section className="py-14 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: Zap,
                title: "রিয়েল-টাইম সিগন্যাল",
                desc: "লাইভ মার্কেট ডেটার উপর ভিত্তি করে তাৎক্ষণিক সিগন্যাল",
              },
              {
                icon: Shield,
                title: "নিরাপদ অ্যাক্সেস",
                desc: "পেমেন্ট যাচাইয়ের পর শুধুমাত্র অ্যাক্টিভ ব্যবহারকারীরা সিগন্যাল দেখতে পারবে",
              },
              {
                icon: Clock,
                title: "২৪/৭ সক্রিয়",
                desc: "দিনরাত যেকোনো সময় সিগন্যাল চেক করুন",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="terminal-border rounded-xl p-5"
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

      {/* Quotex Trading Guide */}
      <section className="py-14 px-4 bg-card/30">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <Badge
              variant="outline"
              className="gap-2 px-4 py-1.5 border-signal-call/40 text-call bg-signal-call-bg font-mono text-xs mb-4"
            >
              <TrendingUp className="w-3 h-3" />
              Quotex ট্রেডিং গাইড
            </Badge>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">
              Quotex কী এবং কীভাবে ট্রেড করবেন?
            </h2>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              Quotex একটি আন্তর্জাতিক ডিজিটাল অপশন ট্রেডিং প্ল্যাটফর্ম। সঠিক সিগন্যাল ব্যবহার
              করে আপনি নির্ভরযোগ্যভাবে আয় করতে পারবেন।
            </p>
          </motion.div>

          {/* What is Quotex */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="terminal-border rounded-2xl p-6 sm:p-8 mb-6"
          >
            <h3 className="font-display text-xl font-bold mb-4 text-call flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Quotex কী?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Quotex (quotex.io) হলো একটি জনপ্রিয় অনলাইন বাইনারি/ডিজিটাল অপশন ট্রেডিং
              প্ল্যাটফর্ম। এখানে আপনি ফরেক্স (USD/EUR), ক্রিপ্টো (BTC/ETH), কমোডিটি
              (Gold, Oil) এবং OTC পেয়ারে ট্রেড করতে পারবেন। ট্রেডার নির্দিষ্ট সময়ের
              মধ্যে মূল্য বাড়বে (CALL) নাকি কমবে (PUT) তা পূর্বাভাস দেয়। সঠিক পূর্বাভাস হলে
              বিনিয়োগের উপর ৮০-৯৫% পর্যন্ত মুনাফা পাওয়া যায়।
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "মিনিমাম ডিপোজিট", value: "$10" },
                { label: "মিনিমাম ট্রেড", value: "$1" },
                { label: "সর্বোচ্চ রিটার্ন", value: "95%" },
                { label: "উইথড্র সময়", value: "১-৩ দিন" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-muted/40 rounded-lg p-3 text-center border border-border"
                >
                  <div className="font-mono font-bold text-call text-lg">
                    {item.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* How to trade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="terminal-border rounded-2xl p-6"
            >
              <h3 className="font-display text-lg font-bold mb-4 text-call">
                📊 CALL (UP) ট্রেড কখন করবেন?
              </h3>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {[
                  "সিগন্যাল বট CALL ⬆️ দেখালে",
                  "মার্কেট আপট্রেন্ডে আছে বলে মনে হলে",
                  "সাপোর্ট লেভেল থেকে বাউন্স করলে",
                  "বুলিশ ক্যান্ডেলস্টিক প্যাটার্ন দেখলে",
                  "RSI ৩০-এর নিচে থেকে উঠে আসলে",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2">
                    <span className="text-call mt-0.5">✅</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="terminal-border rounded-2xl p-6"
            >
              <h3 className="font-display text-lg font-bold mb-4 text-put">
                📉 PUT (DOWN) ট্রেড কখন করবেন?
              </h3>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {[
                  "সিগন্যাল বট PUT ⬇️ দেখালে",
                  "মার্কেট ডাউনট্রেন্ডে আছে বলে মনে হলে",
                  "রেজিস্ট্যান্স লেভেলে রিজেক্ট হলে",
                  "বেয়ারিশ ক্যান্ডেলস্টিক প্যাটার্ন দেখলে",
                  "RSI ৭০-এর উপরে থেকে নামতে শুরু করলে",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2">
                    <span className="text-put mt-0.5">🔴</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Trading Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="terminal-border rounded-2xl p-6 sm:p-8 mb-6"
          >
            <h3 className="font-display text-xl font-bold mb-5 text-call flex items-center gap-2">
              <Zap className="w-5 h-5" />
              সফল ট্রেডিং টিপস
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  num: "০১",
                  title: "সিগন্যাল আসার সাথে সাথে ট্রেড করুন",
                  desc: "সিগন্যাল পাওয়ার পর পরবর্তী ক্যান্ডেল শুরু হলে ট্রেড এন্টার করুন। দেরি করলে নির্ভুলতা কমে যায়।",
                },
                {
                  num: "০২",
                  title: "মানি ম্যানেজমেন্ট মেনে চলুন",
                  desc: "প্রতিটি ট্রেডে মোট ব্যালেন্সের ৫-১০% এর বেশি বিনিয়োগ করবেন না। একটানা লস হলে ট্রেড বন্ধ রাখুন।",
                },
                {
                  num: "০৩",
                  title: "OTC পেয়ারে মনোযোগ দিন",
                  desc: "সপ্তাহান্তে বা মার্কেট বন্ধ থাকলে OTC (Over-the-Counter) পেয়ারে ট্রেড করুন। এগুলো ২৪/৭ চলে।",
                },
                {
                  num: "০৪",
                  title: "এক্সপায়ারি টাইম সঠিক রাখুন",
                  desc: "সিগন্যালে উল্লিখিত এক্সপায়ারি টাইম মেনে চলুন (যেমন: ৩ মিনিট, ৫ মিনিট)। এটি না মানলে লস হওয়ার সম্ভাবনা বাড়ে।",
                },
              ].map((tip) => (
                <div key={tip.num} className="flex gap-4">
                  <div className="font-mono text-3xl font-bold text-border leading-none mt-0.5 shrink-0">
                    {tip.num}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground mb-1">
                      {tip.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {tip.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Warning */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5"
          >
            <p className="text-xs font-semibold text-amber-400 mb-1">
              ⚠️ ঝুঁকি সতর্কতা
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              ট্রেডিং ঝুঁকিপূর্ণ। সিগন্যালের নির্ভুলতা ৮৫-৯৪% হলেও ১০০% গ্যারান্টি নেই। শুধুমাত্র
              সেই অর্থ বিনিয়োগ করুন যা হারালে আপনার আর্থিক ক্ষতি হবে না। নতুন ট্রেডারদের
              প্রথমে ডেমো অ্যাকাউন্টে অভ্যাস করার পরামর্শ দেওয়া হচ্ছে।
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

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

// Silence unused import warning
void TrendingDown;
