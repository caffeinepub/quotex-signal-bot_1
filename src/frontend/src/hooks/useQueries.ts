import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type PaymentInfo,
  type Signal,
  SignalDirection,
  type User,
  UserStatus,
} from "../backend.d";
import { useActor } from "./useActor";

// ─── Re-export enums so pages can import from one place ──────────────────────
export { SignalDirection, UserStatus };
export type { Signal, User, PaymentInfo };

// ─── Payment Info ─────────────────────────────────────────────────────────────
export function usePaymentInfo() {
  const { actor, isFetching } = useActor();
  return useQuery<PaymentInfo>({
    queryKey: ["paymentInfo"],
    queryFn: async () => {
      if (!actor) return { bkashNumber: "", nagadNumber: "", binanceId: "" };
      return actor.getPaymentInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── User status ─────────────────────────────────────────────────────────────
export function useUserStatus(userId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<UserStatus>({
    queryKey: ["userStatus", userId],
    queryFn: async () => {
      if (!actor || !userId) return UserStatus.inactive;
      return actor.getUserStatus(userId);
    },
    enabled: !!actor && !isFetching && userId.length > 0,
  });
}

// ─── Get signals for user ─────────────────────────────────────────────────────
export function useSignals(userId: string, enabled: boolean) {
  const { actor, isFetching } = useActor();
  return useQuery<Signal[]>({
    queryKey: ["signals", userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getSignals(userId);
    },
    enabled: !!actor && !isFetching && enabled && userId.length > 0,
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

// ─── Admin: active signals ────────────────────────────────────────────────────
export function useActiveSignals() {
  const { actor, isFetching } = useActor();
  return useQuery<Signal[]>({
    queryKey: ["activeSignals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveSignals();
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
      paymentMethod,
      transactionId,
    }: {
      name: string;
      phone: string;
      paymentMethod: string;
      transactionId: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.registerUser(name, phone, paymentMethod, transactionId);
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

export function useAddSignal() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      asset,
      direction,
      accuracy,
      expiryMinutes,
    }: {
      asset: string;
      direction: SignalDirection;
      accuracy: bigint;
      expiryMinutes: bigint;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addSignal(asset, direction, accuracy, expiryMinutes);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activeSignals"] });
    },
  });
}

export function useDeleteSignal() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (signalId: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteSignal(signalId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activeSignals"] });
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
    }: {
      bkash: string;
      nagad: string;
      binance: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updatePaymentInfo(bkash, nagad, binance);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["paymentInfo"] });
    },
  });
}
