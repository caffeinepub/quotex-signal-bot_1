import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Bool "mo:core/Bool";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  module User {
    public func compareByStatus(a : User, b : User) : Order.Order {
      switch (a.status, b.status) {
        case (#pending, #active) { #less };
        case (#active, #pending) { #greater };
        case (#pending, #inactive) { #less };
        case (#inactive, #pending) { #greater };
        case (#active, #inactive) { #less };
        case (#inactive, #active) { #greater };
        case (_, _) { Text.compare(a.id, b.id) };
      };
    };
  };

  type User = {
    id : Text;
    name : Text;
    phone : Text;
    paymentMethod : Text;
    transactionId : Text;
    status : UserStatus;
    registeredAt : Int;
  };

  type Signal = {
    id : Text;
    asset : Text;
    direction : SignalDirection;
    accuracy : Nat;
    expiryMinutes : Nat;
    createdAt : Int;
    isActive : Bool;
  };

  type PaymentInfo = {
    bkashNumber : Text;
    nagadNumber : Text;
    binanceId : Text;
  };

  type UserRegistration = {
    name : Text;
    phone : Text;
    paymentMethod : Text;
    transactionId : Text;
  };

  public type UserStatus = {
    #pending;
    #active;
    #inactive;
  };

  public type SignalDirection = {
    #call;
    #put;
  };

  let users = Map.empty<Text, User>();
  let signals = Map.empty<Text, Signal>();
  var paymentInfo : PaymentInfo = {
    bkashNumber = "017XXXXXXXX";
    nagadNumber = "018XXXXXXXX";
    binanceId = "123456";
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  func getCurrentTime() : Int {
    Time.now() / 1_000_000_000;
  };

  func generateId() : Text {
    getCurrentTime().toText();
  };

  // Admin only: Get all users
  public query ({ caller }) func getAllUsers() : async [User] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can get users");
    };
    users.values().toArray();
  };

  // Admin only: Activate user
  public shared ({ caller }) func activateUser(userId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can activate user");
    };
    let user = switch (users.get(userId)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) { user };
    };
    users.add(
      userId,
      {
        id = user.id;
        name = user.name;
        phone = user.phone;
        paymentMethod = user.paymentMethod;
        transactionId = user.transactionId;
        status = #active;
        registeredAt = user.registeredAt;
      },
    );
  };

  // Admin only: Deactivate user
  public shared ({ caller }) func deactivateUser(userId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can deactivate user");
    };
    let user = switch (users.get(userId)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) { user };
    };
    users.add(
      userId,
      {
        id = user.id;
        name = user.name;
        phone = user.phone;
        paymentMethod = user.paymentMethod;
        transactionId = user.transactionId;
        status = #inactive;
        registeredAt = user.registeredAt;
      },
    );
  };

  // Admin only: Add signal
  public shared ({ caller }) func addSignal(asset : Text, direction : SignalDirection, accuracy : Nat, expiryMinutes : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can add signals");
    };
    let id = generateId();
    let signal : Signal = {
      id;
      asset;
      direction;
      accuracy;
      expiryMinutes;
      createdAt = getCurrentTime();
      isActive = true;
    };
    signals.add(id, signal);
  };

  // Admin only: Delete signal
  public shared ({ caller }) func deleteSignal(signalId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can delete signals");
    };
    signals.remove(signalId);
  };

  // Admin only: Get active signals
  public query ({ caller }) func getActiveSignals() : async [Signal] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can get active signals");
    };
    signals.values().toArray().filter(func(signal) { signal.isActive });
  };

  // Admin only: Update payment info
  public shared ({ caller }) func updatePaymentInfo(bkash : Text, nagad : Text, binance : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update payment info");
    };
    paymentInfo := {
      bkashNumber = bkash;
      nagadNumber = nagad;
      binanceId = binance;
    };
  };

  // User registration (public)
  public shared ({ caller }) func registerUser(name : Text, phone : Text, paymentMethod : Text, transactionId : Text) : async Bool {
    let id = generateId();
    let user : User = {
      id;
      name;
      phone;
      paymentMethod;
      transactionId;
      status = #pending;
      registeredAt = getCurrentTime();
    };

    users.add(id, user);
    true;
  };

  // Get signals for active users only
  public query ({ caller }) func getSignals(userId : Text) : async [Signal] {
    switch (users.get(userId)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) {
        switch (user.status) {
          case (#active) {
            signals.values().toArray().filter(func(signal) { signal.isActive });
          };
          case (_) { Runtime.trap("User is not active. Payment required") };
        };
      };
    };
  };

  // Get user status (public)
  public query ({ caller }) func getUserStatus(userId : Text) : async UserStatus {
    switch (users.get(userId)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) { user.status };
    };
  };

  // Get payment info (public)
  public query ({ caller }) func getPaymentInfo() : async PaymentInfo {
    paymentInfo;
  };

  // Admin only: Get pending users
  public query ({ caller }) func getPendingUsers() : async [User] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin call this func");
    };

    users.values().toArray().filter(func(user) { user.status == #pending });
  };
};
