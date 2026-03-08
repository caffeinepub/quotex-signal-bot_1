import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle,
  Clock,
  CreditCard,
  Gamepad2,
  Loader2,
  LogOut,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type User,
  UserStatus,
  useActivateUser,
  useAllUsers,
  useDeactivateUser,
  usePendingUsers,
} from "../hooks/useQueries";

export default function AdminDashboardPage() {
  const { clear } = useInternetIdentity();
  const navigate = useNavigate();

  const {
    data: allUsers,
    isLoading: allUsersLoading,
    refetch: refetchAll,
  } = useAllUsers();
  const {
    data: pendingUsers,
    isLoading: pendingLoading,
    refetch: refetchPending,
  } = usePendingUsers();

  const { mutateAsync: activateUser } = useActivateUser();
  const { mutateAsync: deactivateUser } = useDeactivateUser();

  const handleLogout = () => {
    clear();
    void navigate({ to: "/admin" });
  };

  return (
    <div className="py-6 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <img
              src="/assets/uploads/Screenshot-2025-12-05-042219-3.png"
              alt="BR MODS"
              className="h-8 w-auto object-contain"
            />
            <div>
              <h1 className="font-display text-2xl font-bold neon-text">
                অ্যাডমিন ড্যাশবোর্ড
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                BR MODS V2.0 — ব্যবহারকারী ও প্যানেল পরিচালনা
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-border hover:border-destructive/50 hover:text-destructive hover:bg-destructive/10"
            data-ocid="admin.logout_button"
          >
            <LogOut className="w-4 h-4 mr-2" />
            লগআউট
          </Button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6"
        >
          <StatCard
            label="মোট ব্যবহারকারী"
            value={allUsers?.length ?? 0}
            icon={Users}
            loading={allUsersLoading}
          />
          <StatCard
            label="পেন্ডিং অনুমোদন"
            value={pendingUsers?.length ?? 0}
            icon={Clock}
            loading={pendingLoading}
            highlight
          />
          <StatCard
            label="সক্রিয় সদস্য"
            value={
              allUsers?.filter((u) => u.status === UserStatus.active).length ??
              0
            }
            icon={UserCheck}
            loading={allUsersLoading}
          />
        </motion.div>

        {/* Main tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList className="bg-muted/50 border border-border w-full sm:w-auto grid grid-cols-3 gap-0">
              <TabsTrigger
                value="pending"
                className="data-[state=active]:bg-signal-call-bg data-[state=active]:text-call"
                data-ocid="admin.pending_tab"
              >
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                পেন্ডিং
                {(pendingUsers?.length ?? 0) > 0 && (
                  <Badge className="ml-1.5 bg-signal-call text-background text-xs px-1.5 py-0 h-4">
                    {pendingUsers?.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-signal-call-bg data-[state=active]:text-call"
                data-ocid="admin.users_tab"
              >
                <Users className="w-3.5 h-3.5 mr-1.5" />
                ব্যবহারকারী
              </TabsTrigger>
              <TabsTrigger
                value="payment"
                className="data-[state=active]:bg-signal-call-bg data-[state=active]:text-call"
                data-ocid="admin.payment_tab"
              >
                <CreditCard className="w-3.5 h-3.5 mr-1.5" />
                পেমেন্ট
              </TabsTrigger>
            </TabsList>

            {/* Tab: Pending users */}
            <TabsContent value="pending">
              <PendingUsersTab
                users={pendingUsers ?? []}
                isLoading={pendingLoading}
                onActivate={async (id) => {
                  try {
                    await activateUser(id);
                    toast.success("ব্যবহারকারী সক্রিয় করা হয়েছে");
                    void refetchPending();
                    void refetchAll();
                  } catch {
                    toast.error("ব্যর্থ হয়েছে");
                  }
                }}
              />
            </TabsContent>

            {/* Tab: All users */}
            <TabsContent value="users">
              <AllUsersTab
                users={allUsers ?? []}
                isLoading={allUsersLoading}
                onActivate={async (id) => {
                  try {
                    await activateUser(id);
                    toast.success("ব্যবহারকারী সক্রিয় করা হয়েছে");
                    void refetchAll();
                  } catch {
                    toast.error("ব্যর্থ হয়েছে");
                  }
                }}
                onDeactivate={async (id) => {
                  try {
                    await deactivateUser(id);
                    toast.success("ব্যবহারকারী নিষ্ক্রিয় করা হয়েছে");
                    void refetchAll();
                  } catch {
                    toast.error("ব্যর্থ হয়েছে");
                  }
                }}
              />
            </TabsContent>

            {/* Tab: Payment info (read-only display) */}
            <TabsContent value="payment">
              <PaymentInfoTab />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  loading,
  highlight,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  loading?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`cyber-border rounded-xl p-4 ${highlight && value > 0 ? "border-signal-call/40 bg-signal-call-bg/30" : ""}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon
          className={`w-4 h-4 ${highlight && value > 0 ? "text-call" : "text-muted-foreground"}`}
        />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      {loading ? (
        <Skeleton className="h-7 w-12" />
      ) : (
        <p
          className={`font-mono text-2xl font-bold ${highlight && value > 0 ? "text-call" : "text-foreground"}`}
        >
          {value}
        </p>
      )}
    </div>
  );
}

// ─── Helper: Extract FF UID & Package from transactionId ────────────────────
function extractInfo(txId: string) {
  const uidMatch = txId.match(/uid:([^|]+)/);
  const pkgMatch = txId.match(/pkg:([^|]+)/);
  const cleanTx = txId.split("|")[0] ?? txId;
  return {
    ffUid: uidMatch?.[1] ?? "—",
    pkg: pkgMatch?.[1] ?? "—",
    txId: cleanTx,
  };
}

// ─── Pending Users Tab ────────────────────────────────────────────────────────
function PendingUsersTab({
  users,
  isLoading,
  onActivate,
}: {
  users: User[];
  isLoading: boolean;
  onActivate: (id: string) => Promise<void>;
}) {
  const [activating, setActivating] = useState<string | null>(null);

  return (
    <div className="cyber-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-display font-semibold">
          পেন্ডিং ব্যবহারকারী ({users.length})
        </h3>
      </div>

      {isLoading ? (
        <div className="p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="p-8 text-center" data-ocid="admin.pending_empty_state">
          <CheckCircle className="w-10 h-10 text-call mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground text-sm">
            কোনো পেন্ডিং ব্যবহারকারী নেই
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">নাম</TableHead>
                <TableHead className="text-muted-foreground">ফোন</TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">
                  FF UID
                </TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">
                  প্যাকেজ
                </TableHead>
                <TableHead className="text-muted-foreground hidden lg:table-cell">
                  পেমেন্ট
                </TableHead>
                <TableHead className="text-muted-foreground">একশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, idx) => {
                const info = extractInfo(user.transactionId);
                return (
                  <TableRow
                    key={user.id}
                    className="border-border hover:bg-muted/30"
                    data-ocid={`admin.pending.row.${idx + 1}`}
                  >
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {user.phone}
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-xs text-call">
                      {info.ffUid}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge className="bg-signal-call-bg text-call border-signal-call/30 font-mono text-xs">
                        {info.pkg}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <PaymentBadge method={user.paymentMethod} />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        disabled={activating === user.id}
                        onClick={async () => {
                          setActivating(user.id);
                          await onActivate(user.id);
                          setActivating(null);
                        }}
                        className="bg-signal-call hover:bg-signal-call/90 text-background border-0 text-xs"
                        data-ocid={`admin.activate_button.${idx + 1}`}
                      >
                        {activating === user.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            অ্যাক্টিভেট
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ─── All Users Tab ────────────────────────────────────────────────────────────
function AllUsersTab({
  users,
  isLoading,
  onActivate,
  onDeactivate,
}: {
  users: User[];
  isLoading: boolean;
  onActivate: (id: string) => Promise<void>;
  onDeactivate: (id: string) => Promise<void>;
}) {
  const [busy, setBusy] = useState<string | null>(null);

  return (
    <div className="cyber-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-display font-semibold">
          সকল ব্যবহারকারী ({users.length})
        </h3>
      </div>

      {isLoading ? (
        <div className="p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="p-8 text-center" data-ocid="admin.users_empty_state">
          <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground text-sm">কোনো ব্যবহারকারী নেই</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">নাম</TableHead>
                <TableHead className="text-muted-foreground">ফোন</TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">
                  FF UID
                </TableHead>
                <TableHead className="text-muted-foreground hidden sm:table-cell">
                  প্যাকেজ
                </TableHead>
                <TableHead className="text-muted-foreground hidden sm:table-cell">
                  স্ট্যাটাস
                </TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">
                  পেমেন্ট
                </TableHead>
                <TableHead className="text-muted-foreground">একশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, idx) => {
                const info = extractInfo(user.transactionId);
                return (
                  <TableRow
                    key={user.id}
                    className="border-border hover:bg-muted/30"
                    data-ocid={`admin.users.row.${idx + 1}`}
                  >
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {user.phone}
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-xs text-call">
                      {info.ffUid}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge className="bg-signal-call-bg text-call border-signal-call/30 font-mono text-xs">
                        {info.pkg}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <StatusBadge status={user.status} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <PaymentBadge method={user.paymentMethod} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user.status !== UserStatus.active && (
                          <Button
                            size="sm"
                            disabled={busy === user.id}
                            onClick={async () => {
                              setBusy(user.id);
                              await onActivate(user.id);
                              setBusy(null);
                            }}
                            className="bg-signal-call hover:bg-signal-call/90 text-background border-0 text-xs h-7 px-2"
                            data-ocid={`admin.activate_button.${idx + 1}`}
                          >
                            {busy === user.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              "সক্রিয়"
                            )}
                          </Button>
                        )}
                        {user.status === UserStatus.active && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busy === user.id}
                            onClick={async () => {
                              setBusy(user.id);
                              await onDeactivate(user.id);
                              setBusy(null);
                            }}
                            className="border-destructive/50 text-destructive hover:bg-destructive/10 text-xs h-7 px-2"
                            data-ocid={`admin.deactivate_button.${idx + 1}`}
                          >
                            {busy === user.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 mr-1" />
                                নিষ্ক্রিয়
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ─── Payment Info Tab (read-only) ─────────────────────────────────────────────
function PaymentInfoTab() {
  return (
    <div className="max-w-xl">
      <div className="cyber-border rounded-xl p-6">
        <h3 className="font-display font-semibold mb-5 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-call" />
          পেমেন্ট অ্যাকাউন্ট তথ্য
        </h3>
        <p className="text-xs text-muted-foreground mb-5">
          নিচের নম্বরগুলো ব্যবহারকারীদের পেমেন্ট করার জন্য প্রদর্শিত হচ্ছে।
        </p>

        <div className="space-y-4">
          {/* Bkash */}
          <div
            className="rounded-lg p-4 border"
            style={{ borderColor: "#e91e8c40", background: "#e91e8c0d" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">💗</span>
                <p className="font-bold text-base" style={{ color: "#e91e8c" }}>
                  Bkash
                </p>
              </div>
              <p
                className="font-mono text-lg font-bold"
                style={{ color: "#e91e8c" }}
              >
                01305211080
              </p>
            </div>
            <div
              className="mt-2 text-center text-xs font-semibold py-1.5 px-3 rounded-md border"
              style={{
                color: "#e91e8c",
                borderColor: "#e91e8c40",
                background: "#e91e8c15",
              }}
            >
              ✅ Personal Send — এই নম্বরে পাঠান
            </div>
          </div>

          {/* Nagad */}
          <div
            className="rounded-lg p-4 border"
            style={{ borderColor: "#f9731640", background: "#f973160d" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🟠</span>
                <p className="font-bold text-base" style={{ color: "#f97316" }}>
                  Nagad
                </p>
              </div>
              <p
                className="font-mono text-lg font-bold"
                style={{ color: "#f97316" }}
              >
                01305211080
              </p>
            </div>
            <div
              className="mt-2 text-center text-xs font-semibold py-1.5 px-3 rounded-md border"
              style={{
                color: "#f97316",
                borderColor: "#f9731640",
                background: "#f9731615",
              }}
            >
              ✅ Personal Send — এই নম্বরে পাঠান
            </div>
          </div>
        </div>

        <div className="mt-5 p-3 rounded-lg border border-amber-500/30 bg-amber-500/10">
          <p className="text-xs text-amber-400 font-semibold text-center">
            ⚠️ এই নম্বরগুলো পরিবর্তন করতে হলে ডেভেলপারের সাথে যোগাযোগ করুন
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Gamepad2 className="w-3 h-3 text-call" />
          <span>BR MODS V2.0 — Admin Panel</span>
        </div>
      </div>
    </div>
  );
}

// ─── Helper components ────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: UserStatus }) {
  if (status === UserStatus.active) {
    return (
      <Badge className="bg-signal-call-bg text-call border-signal-call/40 text-xs">
        সক্রিয়
      </Badge>
    );
  }
  if (status === UserStatus.pending) {
    return (
      <Badge
        variant="outline"
        className="border-border text-muted-foreground text-xs"
      >
        পেন্ডিং
      </Badge>
    );
  }
  return (
    <Badge className="bg-destructive/10 text-destructive border-destructive/30 text-xs">
      নিষ্ক্রিয়
    </Badge>
  );
}

function PaymentBadge({ method }: { method: string }) {
  const map: Record<string, { icon: string; color: string }> = {
    Bkash: { icon: "💗", color: "#e91e8c" },
    Nagad: { icon: "🟠", color: "#f97316" },
  };
  const info = map[method] ?? { icon: "💳", color: "#666" };
  return (
    <span className="flex items-center gap-1 text-xs font-mono">
      <span>{info.icon}</span>
      <span style={{ color: info.color }}>{method}</span>
    </span>
  );
}
