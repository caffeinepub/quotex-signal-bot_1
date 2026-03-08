import { Toaster } from "@/components/ui/sonner";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Gamepad2, Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import PanelAccessPage from "./pages/SignalsPage";

// ─── Layout ──────────────────────────────────────────────────────────────────
function RootLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none scanline z-50 opacity-20" />
      {/* Grid background */}
      <div className="fixed inset-0 grid-bg opacity-100 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-signal-call/20 bg-background/90 backdrop-blur-md">
        <div className="container mx-auto px-4 flex items-center justify-between h-14">
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            data-ocid="nav.link"
          >
            <img
              src="/assets/uploads/Screenshot-2025-12-05-042219-3.png"
              alt="BR MODS"
              className="h-8 w-auto object-contain"
            />
            <div className="hidden sm:block">
              <span className="font-display font-bold text-base tracking-wide neon-text">
                BR MODS
              </span>
              <span className="font-mono text-xs text-muted-foreground ml-1.5">
                V2.0
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" label="হোম" />
            <NavLink to="/register" label="প্যাকেজ কিনুন" />
            <NavLink to="/signals" label="প্যানেল অ্যাক্সেস" />
            <NavLink to="/admin" label="অ্যাডমিন" />
          </nav>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md hover:bg-accent"
            onClick={() => setMobileMenuOpen((v) => !v)}
            data-ocid="nav.toggle"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-signal-call/20 bg-card"
          >
            <nav className="flex flex-col p-3 gap-1">
              <MobileNavLink
                to="/"
                label="হোম"
                onClick={() => setMobileMenuOpen(false)}
              />
              <MobileNavLink
                to="/register"
                label="প্যাকেজ কিনুন"
                onClick={() => setMobileMenuOpen(false)}
              />
              <MobileNavLink
                to="/signals"
                label="প্যানেল অ্যাক্সেস চেক করুন"
                onClick={() => setMobileMenuOpen(false)}
              />
              <MobileNavLink
                to="/admin"
                label="অ্যাডমিন প্যানেল"
                onClick={() => setMobileMenuOpen(false)}
              />
            </nav>
          </motion.div>
        )}
      </header>

      <main className="flex-1 relative">
        <Outlet />
      </main>

      <Footer />
      <Toaster theme="dark" />
    </div>
  );
}

function NavLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="px-3 py-1.5 text-sm rounded-md text-muted-foreground hover:text-call hover:bg-signal-call-bg/50 transition-colors font-body"
      activeProps={{
        className: "text-call bg-signal-call-bg border border-signal-call/30",
      }}
    >
      {label}
    </Link>
  );
}

function MobileNavLink({
  to,
  label,
  onClick,
}: {
  to: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="px-3 py-2.5 text-sm rounded-md text-muted-foreground hover:text-call hover:bg-signal-call-bg/50 transition-colors"
      activeProps={{
        className: "text-call bg-signal-call-bg border border-signal-call/30",
      }}
    >
      {label}
    </Link>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="border-t border-signal-call/20 bg-card mt-16 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-signal-call/40 to-transparent" />
      <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Gamepad2 className="w-4 h-4 text-call" />
          <span className="font-mono neon-text font-semibold">
            BR MODS V2.0
          </span>
          <span>— Free Fire Panel</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © {year}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-call transition-colors"
          >
            Built with ❤️ using caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}

// ─── Routes ───────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({ component: RootLayout });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

const signalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signals",
  component: PanelAccessPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/dashboard",
  component: AdminDashboardPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  registerRoute,
  signalsRoute,
  adminRoute,
  adminDashboardRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
