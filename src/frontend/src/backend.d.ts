import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Signal {
    id: string;
    direction: SignalDirection;
    asset: string;
    createdAt: bigint;
    isActive: boolean;
    expiryMinutes: bigint;
    accuracy: bigint;
}
export interface PaymentInfo {
    bkashNumber: string;
    binanceId: string;
    nagadNumber: string;
}
export interface User {
    id: string;
    status: UserStatus;
    paymentMethod: string;
    name: string;
    phone: string;
    registeredAt: bigint;
    transactionId: string;
}
export enum SignalDirection {
    put = "put",
    call = "call"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum UserStatus {
    active = "active",
    pending = "pending",
    inactive = "inactive"
}
export interface backendInterface {
    activateUser(userId: string): Promise<void>;
    addSignal(asset: string, direction: SignalDirection, accuracy: bigint, expiryMinutes: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deactivateUser(userId: string): Promise<void>;
    deleteSignal(signalId: string): Promise<void>;
    getActiveSignals(): Promise<Array<Signal>>;
    getAllUsers(): Promise<Array<User>>;
    getCallerUserRole(): Promise<UserRole>;
    getPaymentInfo(): Promise<PaymentInfo>;
    getPendingUsers(): Promise<Array<User>>;
    getSignals(userId: string): Promise<Array<Signal>>;
    getUserStatus(userId: string): Promise<UserStatus>;
    isCallerAdmin(): Promise<boolean>;
    registerUser(name: string, phone: string, paymentMethod: string, transactionId: string): Promise<boolean>;
    updatePaymentInfo(bkash: string, nagad: string, binance: string): Promise<void>;
}
