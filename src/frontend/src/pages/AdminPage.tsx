import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { AlertTriangle, Loader2, LogIn, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsCallerAdmin } from "../hooks/useQueries";

export default function AdminPage() {
  const { login, isLoggingIn, isLoginError, identity, isInitializing } =
    useInternetIdentity();
  const navigate = useNavigate();

  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  useEffect(() => {
    if (isAdmin && !adminLoading) {
      void navigate({ to: "/admin/dashboard" });
    }
  }, [isAdmin, adminLoading, navigate]);

  const isLoading = isInitializing || adminLoading;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="cyber-border rounded-2xl p-8 text-center">
          {/* BR MODS Logo */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 blur-xl bg-signal-call/20 rounded-full scale-150" />
              <img
                src="/assets/uploads/Screenshot-2025-12-05-042219-3.png"
                alt="BR MODS"
                className="relative h-16 w-auto object-contain"
              />
            </div>
          </div>

          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-signal-call-bg border border-signal-call/30 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-call" />
          </div>

          <h1 className="font-display text-3xl font-bold mb-1 neon-text">
            অ্যাডমিন প্যানেল
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            BR MODS V2.0 — প্রবেশ করতে আপনার পরিচয় যাচাই করুন
          </p>

          {isLoading && (
            <div
              className="flex items-center justify-center gap-2 text-muted-foreground py-4"
              data-ocid="admin.loading_state"
            >
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">যাচাই করা হচ্ছে...</span>
            </div>
          )}

          {!isLoading && isLoginError && (
            <div
              className="flex items-center gap-2 text-destructive bg-destructive/10 rounded-lg p-3 mb-4 text-sm"
              data-ocid="admin.error_state"
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।</span>
            </div>
          )}

          {!isLoading && !identity && (
            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="w-full bg-signal-call hover:bg-signal-call/90 text-background font-semibold glow-cyan border-0"
              data-ocid="admin.login_button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  লগইন হচ্ছে...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Internet Identity দিয়ে লগইন করুন
                </>
              )}
            </Button>
          )}

          {!isLoading && identity && !isAdmin && (
            <div className="text-center p-4" data-ocid="admin.error_state">
              <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-3" />
              <p className="text-destructive font-semibold mb-1">অ্যাক্সেস নেই</p>
              <p className="text-muted-foreground text-sm">
                আপনার অ্যাকাউন্টে অ্যাডমিন অ্যাক্সেস নেই।
              </p>
            </div>
          )}

          <div className="mt-6 p-3 bg-muted/30 rounded-lg border border-signal-call/20">
            <p className="text-xs text-muted-foreground">
              🔒 Internet Identity ব্যবহার করে নিরাপদভাবে লগইন করুন
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
