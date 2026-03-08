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
import { Slider } from "@/components/ui/slider";
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
  Activity,
  CheckCircle,
  Clock,
  CreditCard,
  Loader2,
  LogOut,
  Plus,
  RefreshCw,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type Signal,
  SignalDirection,
  type User,
  UserStatus,
  useActivateUser,
  useActiveSignals,
  useAddSignal,
  useAllUsers,
  useDeactivateUser,
  useDeleteSignal,
  usePaymentInfo,
  usePendingUsers,
  useUpdatePaymentInfo,
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
  const {
    data: activeSignals,
    isLoading: signalsLoading,
    refetch: refetchSignals,
  } = useActiveSignals();
  const { data: paymentInfo, isLoading: paymentLoading } = usePaymentInfo();

  const { mutateAsync: activateUser } = useActivateUser();
  const { mutateAsync: deactivateUser } = useDeactivateUser();
  const { mutateAsync: addSignal } = useAddSignal();
  const { mutateAsync: deleteSignal } = useDeleteSignal();
  const { mutateAsync: updatePaymentInfo } = useUpdatePaymentInfo();

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
          <div>
            <h1 className="font-display text-2xl font-bold">অ্যাডমিন ড্যাশবোর্ড</h1>
            <p className="text-muted-foreground text-sm mt-1">
              ব্যবহারকারী ও সিগন্যাল পরিচালনা
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-border hover:border-destructive/50 hover:text-destructive hover:bg-destructive/10"
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
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
        >
          <StatCard
            label="মোট ব্যবহারকারী"
            value={allUsers?.length ?? 0}
            icon={Users}
            loading={allUsersLoading}
          />
          <StatCard
            label="পেন্ডিং"
            value={pendingUsers?.length ?? 0}
            icon={Clock}
            loading={pendingLoading}
            highlight
          />
          <StatCard
            label="সক্রিয় ব্যবহারকারী"
            value={
              allUsers?.filter((u) => u.status === UserStatus.active).length ??
              0
            }
            icon={UserCheck}
            loading={allUsersLoading}
          />
          <StatCard
            label="সক্রিয় সিগন্যাল"
            value={activeSignals?.length ?? 0}
            icon={Activity}
            loading={signalsLoading}
          />
        </motion.div>

        {/* Main tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList className="bg-muted/50 border border-border w-full sm:w-auto grid grid-cols-2 sm:grid-cols-4 gap-0">
              <TabsTrigger
                value="pending"
                className="data-[state=active]:bg-signal-call-bg data-[state=active]:text-call"
                data-ocid="admin.pending_tab"
              >
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                <span className="hidden sm:inline">পেন্ডিং</span>
                <span className="sm:hidden">পেন্ডিং</span>
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
                <span>ব্যবহারকারী</span>
              </TabsTrigger>
              <TabsTrigger
                value="signals"
                className="data-[state=active]:bg-signal-call-bg data-[state=active]:text-call"
                data-ocid="admin.signals_tab"
              >
                <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                <span className="hidden sm:inline">সিগন্যাল</span>
                <span className="sm:hidden">সিগন্যাল</span>
              </TabsTrigger>
              <TabsTrigger
                value="payment"
                className="data-[state=active]:bg-signal-call-bg data-[state=active]:text-call"
                data-ocid="admin.payment_tab"
              >
                <CreditCard className="w-3.5 h-3.5 mr-1.5" />
                <span className="hidden sm:inline">পেমেন্ট</span>
                <span className="sm:hidden">পেমেন্ট</span>
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

            {/* Tab: Signals */}
            <TabsContent value="signals">
              <SignalsTab
                signals={activeSignals ?? []}
                isLoading={signalsLoading}
                onAdd={async (data) => {
                  try {
                    await addSignal(data);
                    toast.success("সিগন্যাল যোগ করা হয়েছে");
                    void refetchSignals();
                  } catch {
                    toast.error("সিগন্যাল যোগ করা ব্যর্থ হয়েছে");
                  }
                }}
                onDelete={async (id) => {
                  try {
                    await deleteSignal(id);
                    toast.success("সিগন্যাল মুছে ফেলা হয়েছে");
                    void refetchSignals();
                  } catch {
                    toast.error("মুছতে ব্যর্থ হয়েছে");
                  }
                }}
              />
            </TabsContent>

            {/* Tab: Payment info */}
            <TabsContent value="payment">
              <PaymentTab
                initialBkash={paymentInfo?.bkashNumber ?? ""}
                initialNagad={paymentInfo?.nagadNumber ?? ""}
                initialBinance={paymentInfo?.binanceId ?? ""}
                isLoading={paymentLoading}
                onSave={async (data) => {
                  try {
                    await updatePaymentInfo(data);
                    toast.success("পেমেন্ট তথ্য আপডেট হয়েছে");
                  } catch {
                    toast.error("আপডেট ব্যর্থ হয়েছে");
                  }
                }}
              />
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
      className={`terminal-border rounded-xl p-4 ${highlight && value > 0 ? "border-signal-call/30 bg-signal-call-bg/30" : ""}`}
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
    <div className="terminal-border rounded-xl overflow-hidden">
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
        <div className="p-8 text-center" data-ocid="admin.empty_state">
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
                  পেমেন্ট পদ্ধতি
                </TableHead>
                <TableHead className="text-muted-foreground hidden lg:table-cell">
                  ট্রানজেকশন ID
                </TableHead>
                <TableHead className="text-muted-foreground">একশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, idx) => (
                <TableRow
                  key={user.id}
                  className="border-border hover:bg-muted/30"
                  data-ocid={`admin.row.${idx + 1}`}
                >
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {user.phone}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <PaymentBadge method={user.paymentMethod} />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell font-mono text-xs text-muted-foreground">
                    {user.transactionId}
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
              ))}
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
    <div className="terminal-border rounded-xl overflow-hidden">
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
              {users.map((user, idx) => (
                <TableRow
                  key={user.id}
                  className="border-border hover:bg-muted/30"
                  data-ocid={`admin.row.${idx + 1}`}
                >
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {user.phone}
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
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ─── Signals Tab ──────────────────────────────────────────────────────────────
function SignalsTab({
  signals,
  isLoading,
  onAdd,
  onDelete,
}: {
  signals: Signal[];
  isLoading: boolean;
  onAdd: (data: {
    asset: string;
    direction: SignalDirection;
    accuracy: bigint;
    expiryMinutes: bigint;
  }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [asset, setAsset] = useState("");
  const [direction, setDirection] = useState<SignalDirection>(
    SignalDirection.call,
  );
  const [accuracy, setAccuracy] = useState(88);
  const [expiry, setExpiry] = useState("5");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asset.trim() || !expiry) return;
    setAdding(true);
    await onAdd({
      asset: asset.trim(),
      direction,
      accuracy: BigInt(accuracy),
      expiryMinutes: BigInt(Number.parseInt(expiry, 10)),
    });
    setAsset("");
    setAdding(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* Add signal form */}
      <div className="lg:col-span-2 terminal-border rounded-xl p-5">
        <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-call" />
          নতুন সিগন্যাল যোগ করুন
        </h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">অ্যাসেট নাম</Label>
            <Input
              placeholder="যেমন: USD/PKR OTC"
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              className="bg-muted/50 border-border focus:border-signal-call/50 font-mono text-sm"
              data-ocid="admin.signal_asset_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">দিকনির্দেশ</Label>
            <Select
              value={direction}
              onValueChange={(v) => setDirection(v as SignalDirection)}
            >
              <SelectTrigger
                className="bg-muted/50 border-border"
                data-ocid="admin.signal_direction_select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SignalDirection.call}>
                  ⬆️ CALL (UP)
                </SelectItem>
                <SelectItem value={SignalDirection.put}>
                  ⬇️ PUT (DOWN)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">নির্ভুলতা</Label>
              <span
                className="font-mono text-sm text-call"
                data-ocid="admin.signal_accuracy_input"
              >
                {accuracy}%
              </span>
            </div>
            <Slider
              min={80}
              max={99}
              step={1}
              value={[accuracy]}
              onValueChange={([v]) => setAccuracy(v)}
              className="[&_[role=slider]]:bg-signal-call [&_[role=slider]]:border-signal-call"
              data-ocid="admin.signal_accuracy_input"
            />
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>80%</span>
              <span>99%</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              মেয়াদ (মিনিট)
            </Label>
            <Input
              type="number"
              min={1}
              max={60}
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="bg-muted/50 border-border focus:border-signal-call/50 font-mono text-sm"
              data-ocid="admin.signal_expiry_input"
            />
          </div>

          <Button
            type="submit"
            disabled={adding || !asset.trim()}
            className="w-full bg-signal-call hover:bg-signal-call/90 text-background font-semibold border-0"
            data-ocid="admin.add_signal_button"
          >
            {adding ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                যোগ হচ্ছে...
              </>
            ) : (
              <>
                <Plus className="mr-2 w-4 h-4" />
                সিগন্যাল যোগ করুন
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Active signals list */}
      <div className="lg:col-span-3 terminal-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-display font-semibold">
            সক্রিয় সিগন্যাল ({signals.length})
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.reload()}
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>

        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : signals.length === 0 ? (
          <div
            className="p-8 text-center"
            data-ocid="admin.signals_empty_state"
          >
            <TrendingUp className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground text-sm">
              কোনো সক্রিয় সিগন্যাল নেই
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {signals.map((signal, idx) => (
              <div
                key={signal.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors"
                data-ocid={`admin.signal_row.${idx + 1}`}
              >
                <div className="flex items-center gap-3">
                  <Badge
                    className={
                      signal.direction === SignalDirection.call
                        ? "bg-signal-call/20 text-call border-signal-call/40 font-mono text-xs"
                        : "bg-signal-put/20 text-put border-signal-put/40 font-mono text-xs"
                    }
                  >
                    {signal.direction === SignalDirection.call
                      ? "⬆️ CALL"
                      : "⬇️ PUT"}
                  </Badge>
                  <div>
                    <p className="font-mono text-sm font-semibold">
                      {signal.asset}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {Number(signal.accuracy)}% •{" "}
                      {Number(signal.expiryMinutes)}মিনিট
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={deletingId === signal.id}
                  onClick={async () => {
                    setDeletingId(signal.id);
                    await onDelete(signal.id);
                    setDeletingId(null);
                  }}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive h-7 w-7 p-0"
                  data-ocid={`admin.delete_button.${idx + 1}`}
                >
                  {deletingId === signal.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Payment Tab ──────────────────────────────────────────────────────────────
function PaymentTab({
  initialBkash,
  initialNagad,
  initialBinance,
  isLoading,
  onSave,
}: {
  initialBkash: string;
  initialNagad: string;
  initialBinance: string;
  isLoading: boolean;
  onSave: (data: {
    bkash: string;
    nagad: string;
    binance: string;
  }) => Promise<void>;
}) {
  const [bkash, setBkash] = useState(initialBkash);
  const [nagad, setNagad] = useState(initialNagad);
  const [binance, setBinance] = useState(initialBinance);
  const [saving, setSaving] = useState(false);

  // Sync when loaded
  const [synced, setSynced] = useState(false);
  if (
    !synced &&
    !isLoading &&
    (initialBkash || initialNagad || initialBinance)
  ) {
    setBkash(initialBkash);
    setNagad(initialNagad);
    setBinance(initialBinance);
    setSynced(true);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave({ bkash, nagad, binance });
    setSaving(false);
  };

  return (
    <div className="max-w-xl">
      <div className="terminal-border rounded-xl p-6">
        <h3 className="font-display font-semibold mb-5 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-call" />
          পেমেন্ট অ্যাকাউন্ট আপডেট করুন
        </h3>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-10 rounded-lg" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium flex items-center gap-2">
                <span>💗</span> Bkash নম্বর
              </Label>
              <Input
                placeholder="01XXXXXXXXX"
                value={bkash}
                onChange={(e) => setBkash(e.target.value)}
                className="bg-muted/50 border-border focus:border-signal-call/50 font-mono"
                data-ocid="admin.bkash_input"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium flex items-center gap-2">
                <span>🟠</span> Nagad নম্বর
              </Label>
              <Input
                placeholder="01XXXXXXXXX"
                value={nagad}
                onChange={(e) => setNagad(e.target.value)}
                className="bg-muted/50 border-border focus:border-signal-call/50 font-mono"
                data-ocid="admin.nagad_input"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium flex items-center gap-2">
                <span>🟡</span> Binance ID
              </Label>
              <Input
                placeholder="Binance Pay ID"
                value={binance}
                onChange={(e) => setBinance(e.target.value)}
                className="bg-muted/50 border-border focus:border-signal-call/50 font-mono"
                data-ocid="admin.binance_input"
              />
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="w-full bg-signal-call hover:bg-signal-call/90 text-background font-semibold border-0 mt-2"
              data-ocid="admin.payment_save_button"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  সংরক্ষণ হচ্ছে...
                </>
              ) : (
                "পেমেন্ট তথ্য সংরক্ষণ করুন"
              )}
            </Button>
          </form>
        )}
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
    Binance: { icon: "🟡", color: "#f5c542" },
  };
  const info = map[method] ?? { icon: "💳", color: "#666" };
  return (
    <span className="flex items-center gap-1 text-xs font-mono">
      <span>{info.icon}</span>
      <span style={{ color: info.color }}>{method}</span>
    </span>
  );
}
