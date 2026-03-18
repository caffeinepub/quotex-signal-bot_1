import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type DepositRequest,
  DepositStatus,
  type PaymentInfo,
  type Promotion,
  type Signal,
  SignalDirection,
  type User,
  type UserProfile,
  UserStatus,
} from "../backend.d";
import { useActor } from "./useActor";

// ─── Re-export enums so pages can import from one place ──────────────────────
export { SignalDirection, UserStatus, DepositStatus };
export type {
  Signal,
  User,
  PaymentInfo,
  Promotion,
  DepositRequest,
  UserProfile,
};

// ─── Payment Info ─────────────────────────────────────────────────────────────
export function usePaymentInfo() {
  const { actor, isFetching } = useActor();
  return useQuery<PaymentInfo>({
    queryKey: ["paymentInfo"],
    queryFn: async () => {
      if (!actor)
        return {
          bkashNumber: "01305211080",
          nagadNumber: "01305211080",
          binanceId: "",
        };
      return actor.getPaymentInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── User Profile ─────────────────────────────────────────────────────────────
export function useCallerUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["callerUserProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Active Promotions ────────────────────────────────────────────────────────
export function useActivePromotions() {
  const { actor, isFetching } = useActor();
  return useQuery<Promotion[]>({
    queryKey: ["activePromotions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActivePromotions();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── User status ─────────────────────────────────────────────────────────────
export function useUserStatus() {
  const { actor, isFetching } = useActor();
  return useQuery<UserStatus>({
    queryKey: ["userStatus"],
    queryFn: async () => {
      if (!actor) return UserStatus.inactive;
      return actor.getUserStatus();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Admin: all users ─────────────────────────────────────────────────────────
export function useAllUsers() {
  const { actor, isFetching } = useActor();
  return useQuery<User[]>({
    queryKey: ["allUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Admin: pending users ─────────────────────────────────────────────────────
export function usePendingUsers() {
  const { actor, isFetching } = useActor();
  return useQuery<User[]>({
    queryKey: ["pendingUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Admin: deposit requests ──────────────────────────────────────────────────
export function useDepositRequests() {
  const { actor, isFetching } = useActor();
  return useQuery<DepositRequest[]>({
    queryKey: ["depositRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDepositRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Admin: is caller admin ───────────────────────────────────────────────────
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────
export function useRegisterUser() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      name,
      phone,
      password,
      paymentMethod,
      transactionId,
    }: {
      name: string;
      phone: string;
      password: string;
      paymentMethod: string;
      transactionId: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.registerUser(
        name,
        phone,
        password,
        paymentMethod,
        transactionId,
      );
    },
  });
}

export function useLoginUser() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      phone,
      password,
    }: { phone: string; password: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.loginUser(phone, password);
    },
  });
}

export function useCreateDepositRequest() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      amount,
      paymentMethod,
      transactionId,
    }: {
      amount: bigint;
      paymentMethod: string;
      transactionId: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createDepositRequest(amount, paymentMethod, transactionId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["callerUserProfile"] });
    },
  });
}

export function useActivateUser() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.activateUser(userId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allUsers"] });
      qc.invalidateQueries({ queryKey: ["pendingUsers"] });
    },
  });
}

export function useDeactivateUser() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deactivateUser(userId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allUsers"] });
    },
  });
}

export function useApproveDepositRequest() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (depositId: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.approveDepositRequest(depositId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["depositRequests"] });
    },
  });
}

export function useAddPromotion() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      description,
      bonusAmount,
      validUntil,
    }: {
      description: string;
      bonusAmount: bigint;
      validUntil: bigint;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addPromotion(description, bonusAmount, validUntil);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activePromotions"] });
    },
  });
}

export function useDeletePromotion() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (promotionId: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deletePromotion(promotionId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activePromotions"] });
    },
  });
}

export function useUpdatePaymentInfo() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bkash,
      nagad,
      binance,
    }: { bkash: string; nagad: string; binance: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updatePaymentInfo(bkash, nagad, binance);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["paymentInfo"] });
    },
  });
}
