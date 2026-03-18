import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  Crown,
  Loader2,
  LogIn,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  DepositStatus,
  UserStatus,
  useActivateUser,
  useActivePromotions,
  useAddPromotion,
  useAllUsers,
  useApproveDepositRequest,
  useDeactivateUser,
  useDeletePromotion,
  useDepositRequests,
  useIsCallerAdmin,
  usePaymentInfo,
  useUpdatePaymentInfo,
} from "../hooks/useQueries";

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-emerald-700 text-white",
    pending: "bg-yellow-700 text-white",
    inactive: "bg-red-800 text-white",
    approved: "bg-emerald-700 text-white",
    rejected: "bg-red-800 text-white",
  };
  const labels: Record<string, string> = {
    active: "সক্রিয়",
    pending: "পেন্ডিং",
    inactive: "নিষ্ক্রিয়",
    approved: "অ্যাপ্রুভড",
    rejected: "রিজেক্টেড",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-bold ${colors[status] ?? "bg-secondary text-secondary-foreground"}`}
    >
      {labels[status] ?? status}
    </span>
  );
}

export default function AdminPage() {
  const { login, clear, isLoggingIn, identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  if (!identity) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-130px)] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <Crown
            className="w-14 h-14 mx-auto mb-4"
            style={{ color: "oklch(0.76 0.13 85)" }}
          />
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: "oklch(0.76 0.13 85)" }}
          >
            Admin Panel
          </h1>
          <p className="text-muted-foreground mb-6 text-sm">
            Internet Identity দিয়ে লগইন করুন
          </p>
          <Button
            onClick={() => login()}
            disabled={isLoggingIn}
            className="font-bold text-black px-8"
            style={{ background: "oklch(0.76 0.13 85)" }}
            data-ocid="admin.primary_button"
          >
            {isLoggingIn ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <LogIn className="w-4 h-4 mr-2" />
            )}
            Internet Identity লগইন
          </Button>
        </motion.div>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div
        className="flex justify-center py-20"
        data-ocid="admin.loading_state"
      >
        <Loader2
          className="w-8 h-8 animate-spin"
          style={{ color: "oklch(0.76 0.13 85)" }}
        />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[300px] gap-4"
        data-ocid="admin.error_state"
      >
        <p className="text-destructive">আপনার অ্যাডমিন অ্যাক্সেস নেই।</p>
        <Button
          variant="outline"
          onClick={() => clear()}
          data-ocid="admin.secondary_button"
        >
          লগআউট
        </Button>
      </div>
    );
  }

  return <AdminDashboard onLogout={() => clear()} />;
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { data: users = [] } = useAllUsers();
  const { data: deposits = [] } = useDepositRequests();
  const { data: promotions = [] } = useActivePromotions();
  const { data: paymentInfo } = usePaymentInfo();

  const activateUser = useActivateUser();
  const deactivateUser = useDeactivateUser();
  const approveDeposit = useApproveDepositRequest();
  const addPromotion = useAddPromotion();
  const deletePromotion = useDeletePromotion();
  const updatePayment = useUpdatePaymentInfo();

  const [promoDesc, setPromoDesc] = useState("");
  const [promoBonus, setPromoBonus] = useState("");
  const [bkash, setBkash] = useState(paymentInfo?.bkashNumber ?? "01305211080");
  const [nagad, setNagad] = useState(paymentInfo?.nagadNumber ?? "01305211080");

  async function handleAddPromo(e: React.FormEvent) {
    e.preventDefault();
    try {
      const validUntil =
        BigInt(Date.now() + 30 * 24 * 60 * 60 * 1000) * BigInt(1_000_000);
      await addPromotion.mutateAsync({
        description: promoDesc,
        bonusAmount: BigInt(Number(promoBonus)),
        validUntil,
      });
      toast.success("প্রোমোশন যোগ হয়েছে!");
      setPromoDesc("");
      setPromoBonus("");
    } catch {
      toast.error("প্রোমোশন যোগ ব্যর্থ");
    }
  }

  async function handleUpdatePayment(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updatePayment.mutateAsync({ bkash, nagad, binance: "" });
      toast.success("পেমেন্ট তথ্য আপডেট হয়েছে!");
    } catch {
      toast.error("আপডেট ব্যর্থ");
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Crown className="w-7 h-7" style={{ color: "oklch(0.76 0.13 85)" }} />
          <h1
            className="text-xl font-bold"
            style={{ color: "oklch(0.76 0.13 85)" }}
          >
            Admin Dashboard
          </h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onLogout}
          data-ocid="admin.secondary_button"
        >
          লগআউট
        </Button>
      </div>

      <Tabs defaultValue="users" data-ocid="admin.panel">
        <TabsList className="grid grid-cols-4 mb-4 bg-card border border-border">
          <TabsTrigger value="users" data-ocid="admin.tab">
            ব্যবহারকারী
          </TabsTrigger>
          <TabsTrigger value="deposits" data-ocid="admin.tab">
            ডিপোজিট
          </TabsTrigger>
          <TabsTrigger value="promotions" data-ocid="admin.tab">
            প্রোমোশন
          </TabsTrigger>
          <TabsTrigger value="payment" data-ocid="admin.tab">
            পেমেন্ট
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <div
            className="rounded-xl border border-border overflow-hidden"
            data-ocid="admin.table"
          >
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-card">
                  <TableHead className="text-muted-foreground">নাম</TableHead>
                  <TableHead className="text-muted-foreground">ফোন</TableHead>
                  <TableHead className="text-muted-foreground">স্ট্যাটাস</TableHead>
                  <TableHead className="text-muted-foreground">
                    পেমেন্ট
                  </TableHead>
                  <TableHead className="text-muted-foreground">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-8"
                      data-ocid="admin.empty_state"
                    >
                      কোনো ব্যবহারকারী নেই
                    </TableCell>
                  </TableRow>
                )}
                {users.map((user, i) => (
                  <TableRow
                    key={user.id}
                    className="border-border"
                    data-ocid={`admin.row.${i + 1}`}
                  >
                    <TableCell className="font-medium text-sm">
                      {user.name}
                    </TableCell>
                    <TableCell className="text-sm font-mono">
                      {user.phone}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={user.status} />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {user.paymentMethod} / {user.transactionId.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {user.status !== UserStatus.active && (
                          <button
                            type="button"
                            onClick={() => activateUser.mutate(user.id)}
                            className="p-1.5 rounded bg-emerald-800 hover:bg-emerald-700 transition-colors"
                            title="অ্যাক্টিভ করুন"
                            data-ocid={`admin.confirm_button.${i + 1}`}
                          >
                            <CheckCircle className="w-4 h-4 text-emerald-300" />
                          </button>
                        )}
                        {user.status === UserStatus.active && (
                          <button
                            type="button"
                            onClick={() => deactivateUser.mutate(user.id)}
                            className="p-1.5 rounded bg-red-900 hover:bg-red-800 transition-colors"
                            title="ডিঅ্যাক্টিভ করুন"
                            data-ocid={`admin.delete_button.${i + 1}`}
                          >
                            <XCircle className="w-4 h-4 text-red-300" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Deposits Tab */}
        <TabsContent value="deposits">
          <div
            className="rounded-xl border border-border overflow-hidden"
            data-ocid="admin.table"
          >
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-card">
                  <TableHead className="text-muted-foreground">পরিমাণ</TableHead>
                  <TableHead className="text-muted-foreground">পদ্ধতি</TableHead>
                  <TableHead className="text-muted-foreground">
                    TXN ID
                  </TableHead>
                  <TableHead className="text-muted-foreground">স্ট্যাটাস</TableHead>
                  <TableHead className="text-muted-foreground">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deposits.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-8"
                      data-ocid="admin.empty_state"
                    >
                      কোনো ডিপোজিট রিকোয়েস্ট নেই
                    </TableCell>
                  </TableRow>
                )}
                {deposits.map((dep, i) => (
                  <TableRow
                    key={dep.id}
                    className="border-border"
                    data-ocid={`admin.row.${i + 1}`}
                  >
                    <TableCell
                      className="font-bold"
                      style={{ color: "oklch(0.76 0.13 85)" }}
                    >
                      ৳{Number(dep.amount)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {dep.paymentMethod}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {dep.transactionId.slice(0, 12)}...
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={dep.status} />
                    </TableCell>
                    <TableCell>
                      {dep.status === DepositStatus.pending && (
                        <button
                          type="button"
                          onClick={() => approveDeposit.mutate(dep.id)}
                          className="px-2 py-1 text-xs rounded bg-emerald-800 hover:bg-emerald-700 text-white font-semibold transition-colors"
                          data-ocid={`admin.confirm_button.${i + 1}`}
                        >
                          অ্যাপ্রুভ
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Promotions Tab */}
        <TabsContent value="promotions">
          <form
            onSubmit={handleAddPromo}
            className="rounded-xl border border-border bg-card p-4 mb-4 space-y-3"
          >
            <h3 className="text-sm font-bold text-foreground">
              নতুন প্রোমোশন যোগ করুন
            </h3>
            <div className="space-y-1">
              <Label htmlFor="promo-desc">বিবরণ</Label>
              <Input
                id="promo-desc"
                placeholder="প্রোমোশনের বিবরণ"
                value={promoDesc}
                onChange={(e) => setPromoDesc(e.target.value)}
                required
                className="bg-background"
                data-ocid="admin.input"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="promo-bonus">বোনাস পরিমাণ (টাকা)</Label>
              <Input
                id="promo-bonus"
                type="number"
                placeholder="100"
                value={promoBonus}
                onChange={(e) => setPromoBonus(e.target.value)}
                required
                className="bg-background"
                data-ocid="admin.input"
              />
            </div>
            <Button
              type="submit"
              size="sm"
              className="font-bold text-black"
              style={{ background: "oklch(0.76 0.13 85)" }}
              disabled={addPromotion.isPending}
              data-ocid="admin.submit_button"
            >
              <Plus className="w-4 h-4 mr-1" /> যোগ করুন
            </Button>
          </form>

          <div className="space-y-2" data-ocid="admin.list">
            {promotions.map((promo, i) => (
              <div
                key={promo.id}
                className="flex items-start justify-between p-3 rounded-xl border border-border bg-card gap-3"
                data-ocid={`admin.item.${i + 1}`}
              >
                <div className="flex-1">
                  <p className="text-sm text-foreground">{promo.description}</p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "oklch(0.76 0.13 85)" }}
                  >
                    বোনাস: ৳{Number(promo.bonusAmount)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => deletePromotion.mutate(promo.id)}
                  className="p-1.5 rounded bg-red-900 hover:bg-red-800 transition-colors flex-shrink-0"
                  data-ocid={`admin.delete_button.${i + 1}`}
                >
                  <Trash2 className="w-4 h-4 text-red-300" />
                </button>
              </div>
            ))}
            {promotions.length === 0 && (
              <p
                className="text-center text-muted-foreground py-6 text-sm"
                data-ocid="admin.empty_state"
              >
                কোনো প্রোমোশন নেই
              </p>
            )}
          </div>
        </TabsContent>

        {/* Payment Settings Tab */}
        <TabsContent value="payment">
          <form
            onSubmit={handleUpdatePayment}
            className="rounded-xl border border-border bg-card p-4 space-y-4"
          >
            <h3 className="text-sm font-bold text-foreground">
              পেমেন্ট নম্বর আপডেট করুন
            </h3>
            <div className="space-y-1">
              <Label htmlFor="admin-bkash">বিকাশ নম্বর</Label>
              <Input
                id="admin-bkash"
                type="tel"
                value={bkash}
                onChange={(e) => setBkash(e.target.value)}
                className="bg-background"
                data-ocid="admin.input"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="admin-nagad">নগদ নম্বর</Label>
              <Input
                id="admin-nagad"
                type="tel"
                value={nagad}
                onChange={(e) => setNagad(e.target.value)}
                className="bg-background"
                data-ocid="admin.input"
              />
            </div>
            <Button
              type="submit"
              className="font-bold text-black"
              style={{ background: "oklch(0.76 0.13 85)" }}
              disabled={updatePayment.isPending}
              data-ocid="admin.save_button"
            >
              {updatePayment.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              সেভ করুন
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
