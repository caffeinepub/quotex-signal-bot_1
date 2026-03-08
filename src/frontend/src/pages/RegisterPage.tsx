import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, CheckCircle, Copy, Crown, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { usePaymentInfo, useRegisterUser } from "../hooks/useQueries";

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

export default function RegisterPage() {
  const { isLoading: paymentLoading } = usePaymentInfo();
  const { mutateAsync: registerUser, isPending } = useRegisterUser();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [selectedPackageMonths, setSelectedPackageMonths] = useState<number>(1);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "নাম প্রয়োজন";
    if (!phone.trim()) newErrors.phone = "ফোন নম্বর প্রয়োজন";
    else if (!/^01[3-9]\d{8}$/.test(phone.trim()))
      newErrors.phone = "সঠিক বাংলাদেশি ফোন নম্বর দিন";
    if (!paymentMethod) newErrors.paymentMethod = "পেমেন্ট পদ্ধতি নির্বাচন করুন";
    if (!transactionId.trim()) newErrors.transactionId = "ট্রানজেকশন ID প্রয়োজন";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const selectedPkg = PACKAGES.find(
        (p) => p.months === selectedPackageMonths,
      );
      const result = await registerUser({
        name: name.trim(),
        phone: phone.trim(),
        paymentMethod,
        transactionId: `${transactionId.trim()}|pkg:${selectedPkg?.months}mo-${selectedPkg?.price}tk`,
      });
      if (result) {
        setSuccess(true);
        toast.success("রেজিস্ট্রেশন সম্পন্ন হয়েছে!");
      } else {
        toast.error("ট্রানজেকশন ID যাচাই করা যায়নি");
      }
    } catch {
      toast.error("রেজিস্ট্রেশন ব্যর্থ হয়েছে, আবার চেষ্টা করুন");
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-signal-call-bg border border-signal-call/40 flex items-center justify-center mx-auto mb-6 glow-green">
            <CheckCircle className="w-10 h-10 text-call" />
          </div>
          <h2 className="font-display text-3xl font-bold mb-3 text-call">
            রেজিস্ট্রেশন সম্পন্ন!
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            আপনার রেজিস্ট্রেশন সম্পন্ন হয়েছে। অ্যাডমিন অ্যাপ্রুভালের জন্য অপেক্ষা করুন। অ্যাপ্রুভালের
            পর আপনি সিগন্যাল দেখতে পাবেন।
          </p>
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              আপনার ফোন নম্বর:{" "}
              <span className="font-mono text-foreground font-semibold">
                {phone}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              সিগন্যাল চেক করতে এই নম্বরটি ব্যবহার করুন
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-10 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            রেজিস্ট্রেশন করুন
          </h1>
          <p className="text-muted-foreground text-sm">
            পেমেন্ট করার পর নিচের ফর্ম পূরণ করুন
          </p>
        </motion.div>

        {/* Package Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-6 terminal-border rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-4 h-4 text-call" />
            <h2 className="font-display text-lg font-semibold">
              প্যাকেজ নির্বাচন করুন
            </h2>
          </div>
          {/* 50% Offer mini-banner */}
          <div className="mb-4 rounded-xl border border-orange-500/40 bg-gradient-to-r from-red-950/70 via-orange-950/60 to-red-950/70 px-4 py-3 text-center">
            <p className="text-sm font-bold text-orange-300">
              🔥 সীমিত সময়ের অফার — সকল প্যাকেজে{" "}
              <span className="text-orange-400">৫০% ছাড়</span> চলছে!
            </p>
          </div>
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
            data-ocid="register.package.list"
          >
            {PACKAGES.map((pkg) => (
              <button
                key={pkg.months}
                type="button"
                onClick={() => setSelectedPackageMonths(pkg.months)}
                className={`relative rounded-xl p-4 border-2 text-center transition-all cursor-pointer ${
                  selectedPackageMonths === pkg.months
                    ? "border-signal-call bg-signal-call-bg glow-green"
                    : "border-border bg-card hover:border-signal-call/40"
                }`}
                data-ocid={`register.package.item.${pkg.months}`}
              >
                {/* 50% OFF badge */}
                <div className="absolute -top-2.5 left-0 right-0 flex justify-center">
                  <span className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    ৫০% OFF
                  </span>
                </div>
                {/* Strikethrough original price */}
                <div className="text-[10px] text-muted-foreground line-through mt-1">
                  ৳{pkg.originalPrice}
                </div>
                {/* Current price */}
                <div className="font-display text-2xl font-bold text-call leading-tight">
                  {pkg.price}
                </div>
                <div className="text-[10px] text-muted-foreground">টাকা</div>
                <div className="font-semibold text-sm text-foreground mt-1">
                  {pkg.label}
                </div>
                {selectedPackageMonths === pkg.months && (
                  <Badge className="mt-2 bg-signal-call/20 text-call border-signal-call/40 text-[10px]">
                    নির্বাচিত
                  </Badge>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            নির্বাচিত প্যাকেজ:{" "}
            <span className="text-call font-semibold">
              {PACKAGES.find((p) => p.months === selectedPackageMonths)?.label}{" "}
              —{" "}
              {PACKAGES.find((p) => p.months === selectedPackageMonths)?.price}{" "}
              টাকা
            </span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="terminal-border rounded-2xl p-6 sm:p-8">
              <h2 className="font-display text-xl font-semibold mb-6">
                ব্যক্তিগত তথ্য
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm font-medium">
                    পূর্ণ নাম <span className="text-put">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="আপনার পূর্ণ নাম লিখুন"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-muted/50 border-border focus:border-signal-call/50 focus:ring-signal-call/20"
                    autoComplete="name"
                    data-ocid="register.name_input"
                  />
                  {errors?.name && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="register.name_error"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    ফোন নম্বর <span className="text-put">*</span>
                  </Label>
                  <Input
                    id="phone"
                    placeholder="01XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-muted/50 border-border focus:border-signal-call/50 focus:ring-signal-call/20 font-mono"
                    autoComplete="tel"
                    inputMode="numeric"
                    data-ocid="register.phone_input"
                  />
                  {errors?.phone && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="register.phone_error"
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Payment Method */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">
                    পেমেন্ট পদ্ধতি <span className="text-put">*</span>
                  </Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <SelectTrigger
                      className="bg-muted/50 border-border focus:border-signal-call/50"
                      data-ocid="register.payment_select"
                    >
                      <SelectValue placeholder="পেমেন্ট পদ্ধতি নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bkash">💗 Bkash</SelectItem>
                      <SelectItem value="Nagad">🟠 Nagad</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors?.paymentMethod && (
                    <p className="text-xs text-destructive">
                      {errors.paymentMethod}
                    </p>
                  )}
                </div>

                {/* Transaction ID */}
                <div className="space-y-1.5">
                  <Label htmlFor="txid" className="text-sm font-medium">
                    ট্রানজেকশন ID <span className="text-put">*</span>
                  </Label>
                  <Input
                    id="txid"
                    placeholder="পেমেন্টের ট্রানজেকশন ID লিখুন"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="bg-muted/50 border-border focus:border-signal-call/50 focus:ring-signal-call/20 font-mono"
                    data-ocid="register.txid_input"
                  />
                  {errors?.transactionId && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="register.txid_error"
                    >
                      {errors.transactionId}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-signal-call hover:bg-signal-call/90 text-background font-bold glow-green border-0 mt-2"
                  data-ocid="register.submit_button"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      রেজিস্ট্রেশন হচ্ছে...
                    </>
                  ) : (
                    `রেজিস্ট্রেশন করুন (${PACKAGES.find((p) => p.months === selectedPackageMonths)?.price} টাকা — ${PACKAGES.find((p) => p.months === selectedPackageMonths)?.label})`
                  )}
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Payment reference sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="terminal-border rounded-2xl p-6">
              <h3 className="font-display text-lg font-semibold mb-1">
                পেমেন্ট নম্বর
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                নিচের নম্বরে পেমেন্ট করুন এবং ট্রানজেকশন ID সংগ্রহ করুন
              </p>
              {paymentLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-14 rounded-lg" />
                  <Skeleton className="h-14 rounded-lg" />
                </div>
              ) : (
                <div className="space-y-3">
                  <CopyablePaymentRow
                    label="Bkash"
                    icon="💗"
                    value="01305211080"
                    color="#e91e8c"
                    sendType="Personal Send"
                  />
                  <CopyablePaymentRow
                    label="Nagad"
                    icon="🟠"
                    value="01305211080"
                    color="#f97316"
                    sendType="Personal Send"
                  />
                </div>
              )}

              <div className="mt-4 p-3 rounded-lg border border-amber-500/30 bg-amber-500/10">
                <p className="text-xs text-amber-400 font-semibold text-center">
                  ⚠️ Finance অপশন ব্যবহার করবেন না
                </p>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  শুধুমাত্র Personal Send করুন
                </p>
              </div>
            </div>

            <div className="terminal-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                ⚠️ পেমেন্টের পর রেজিস্ট্রেশন করুন। অ্যাডমিন যাচাই করার পর আপনার অ্যাকাউন্ট
                সক্রিয় হবে।
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function CopyablePaymentRow({
  label,
  icon,
  value,
  color,
  sendType,
}: {
  label: string;
  icon: string;
  value: string;
  color: string;
  sendType?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="rounded-lg p-3 border"
      style={{ borderColor: `${color}40`, background: `${color}0d` }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span>{icon}</span>
          <p className="text-sm font-bold" style={{ color }}>
            {label}
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          title="কপি করুন"
          type="button"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-call" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
      <p className="font-mono text-base font-bold text-foreground">{value}</p>
      {sendType && (
        <p className="text-xs mt-1" style={{ color }}>
          ✅ {sendType} করুন
        </p>
      )}
    </div>
  );
}
