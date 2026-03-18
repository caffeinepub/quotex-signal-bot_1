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
export interface Promotion {
    id: string;
    bonusAmount: bigint;
    description: string;
    isActive: boolean;
    validUntil: bigint;
}
export interface User {
    id: string;
    status: UserStatus;
    paymentMethod: string;
    balance: bigint;
    password: string;
    name: string;
    phone: string;
    registeredAt: bigint;
    transactionId: string;
}
export interface DepositRequest {
    id: string;
    status: DepositStatus;
    paymentMethod: string;
    userId: Principal;
    createdAt: bigint;
    amount: bigint;
    transactionId: string;
}
export interface PaymentInfo {
    bkashNumber: string;
    binanceId: string;
    nagadNumber: string;
}
export interface UserProfile {
    status: UserStatus;
    balance: bigint;
    name: string;
    phone: string;
    registeredAt: bigint;
}
export enum DepositStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
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
    addPromotion(description: string, bonusAmount: bigint, validUntil: bigint): Promise<void>;
    addSignal(asset: string, direction: SignalDirection, accuracy: bigint, expiryMinutes: bigint): Promise<void>;
    approveDepositRequest(depositId: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createDepositRequest(amount: bigint, paymentMethod: string, transactionId: string): Promise<void>;
    deactivateUser(userId: string): Promise<void>;
    deletePromotion(promotionId: string): Promise<void>;
    deleteSignal(signalId: string): Promise<void>;
    getActivePromotions(): Promise<Array<Promotion>>;
    getActiveSignals(): Promise<Array<Signal>>;
    getAllUsers(): Promise<Array<User>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDepositRequests(): Promise<Array<DepositRequest>>;
    getPaymentInfo(): Promise<PaymentInfo>;
    getPendingUsers(): Promise<Array<User>>;
    getSignals(): Promise<Array<Signal>>;
    getUserBalance(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserStatus(): Promise<UserStatus>;
    isCallerAdmin(): Promise<boolean>;
    loginUser(phone: string, password: string): Promise<boolean>;
    processWithdrawalRequest(userPrincipal: Principal, amount: bigint): Promise<void>;
    registerUser(name: string, phone: string, password: string, paymentMethod: string, transactionId: string): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updatePaymentInfo(bkash: string, nagad: string, binance: string): Promise<void>;
}
