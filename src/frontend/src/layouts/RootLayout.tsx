import { cn } from "@/lib/utils";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Crown, Gamepad2, Gift, Home, LogIn, User, Wallet } from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "হোম", icon: Home },
  { to: "/games", label: "গেমস", icon: Gamepad2 },
  { to: "/deposit", label: "জমা", icon: Wallet },
  { to: "/promotion", label: "প্রোমোশন", icon: Gift },
  { to: "/profile", label: "প্রোফাইল", icon: User },
];

export default function RootLayout() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-card/95 backdrop-blur-md">
        <div className="flex items-center justify-between h-14 px-4 max-w-screen-lg mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" data-ocid="nav.link">
            <div className="flex items-center gap-1.5">
              <Crown
                className="w-6 h-6"
                style={{ color: "oklch(0.76 0.13 85)" }}
              />
              <span
                className="font-bold text-lg tracking-wide"
                style={{ color: "oklch(0.76 0.13 85)" }}
              >
                WINX888
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md transition-colors",
                  currentPath === item.to
                    ? "text-primary-foreground bg-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
                data-ocid="nav.link"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/login"
              className={cn(
                "px-3 py-1.5 text-sm rounded-md transition-colors",
                currentPath === "/login"
                  ? "text-primary-foreground bg-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
              )}
              data-ocid="nav.link"
            >
              লগইন
            </Link>
            <Link
              to="/admin"
              className="px-3 py-1.5 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              data-ocid="nav.link"
            >
              অ্যাডমিন
            </Link>
          </nav>

          {/* Mobile header buttons */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/login"
              className="px-3 py-1.5 text-sm rounded-md font-semibold text-primary-foreground bg-primary"
              data-ocid="nav.primary_button"
            >
              লগইন
            </Link>
            <Link
              to="/register"
              className="px-3 py-1.5 text-sm rounded-md font-semibold border border-primary text-primary"
              data-ocid="nav.secondary_button"
            >
              রেজিস্টার
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 bottom-nav-safe">
        <Outlet />
      </main>

      {/* Footer (desktop only) */}
      <footer className="hidden md:block border-t border-border/40 bg-card/50 py-4 text-center">
        <p className="text-xs text-muted-foreground">
          © {year}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold transition-colors"
          >
            Built with ❤️ using caffeine.ai
          </a>
        </p>
      </footer>

      {/* Bottom Navigation (mobile) */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border/50 bg-card"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-stretch h-16">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPath === item.to ||
              (item.to === "/" && currentPath === "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors relative",
                  isActive ? "text-gold" : "text-muted-foreground",
                )}
                data-ocid={`nav.${item.label}`}
              >
                <Icon
                  className="w-5 h-5"
                  style={
                    isActive ? { color: "oklch(0.76 0.13 85)" } : undefined
                  }
                />
                <span>{item.label}</span>
                {isActive && (
                  <span
                    className="absolute bottom-0 h-0.5 w-10 rounded-full"
                    style={{ background: "oklch(0.76 0.13 85)" }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
