import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Bool "mo:core/Bool";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
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
    password : Text;
    paymentMethod : Text;
    transactionId : Text;
    balance : Int;
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

  type Promotion = {
    id : Text;
    description : Text;
    bonusAmount : Nat;
    validUntil : Int;
    isActive : Bool;
  };

  type DepositRequest = {
    id : Text;
    userId : Principal;
    amount : Nat;
    paymentMethod : Text;
    transactionId : Text;
    status : DepositStatus;
    createdAt : Int;
  };

  type UserRegistration = {
    name : Text;
    phone : Text;
    password : Text;
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

  public type DepositStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type UserProfile = {
    name : Text;
    phone : Text;
    balance : Int;
    status : UserStatus;
    registeredAt : Int;
  };

  let users = Map.empty<Text, User>();
  let userPrincipals = Map.empty<Principal, Text>(); // Map Principal to userId
  let userProfiles = Map.empty<Principal, UserProfile>();
  let signals = Map.empty<Text, Signal>();
  let promotions = Map.empty<Text, Promotion>();
  let depositRequests = Map.empty<Text, DepositRequest>();
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
    switch (users.get(userId)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) {
        users.add(
          userId,
          {
            id = user.id;
            name = user.name;
            phone = user.phone;
            password = user.password;
            paymentMethod = user.paymentMethod;
            transactionId = user.transactionId;
            balance = user.balance;
            status = #active;
            registeredAt = user.registeredAt;
          },
        );
      };
    };
  };

  // Admin only: Deactivate user
  public shared ({ caller }) func deactivateUser(userId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can deactivate user");
    };
    switch (users.get(userId)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) {
        users.add(
          userId,
          {
            id = user.id;
            name = user.name;
            phone = user.phone;
            password = user.password;
            paymentMethod = user.paymentMethod;
            transactionId = user.transactionId;
            balance = user.balance;
            status = #inactive;
            registeredAt = user.registeredAt;
          },
        );
      };
    };
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

  // User registration (public, no auth required)
  public shared ({ caller }) func registerUser(name : Text, phone : Text, password : Text, paymentMethod : Text, transactionId : Text) : async Bool {
    // Check if user already registered
    switch (userPrincipals.get(caller)) {
      case (?_) { Runtime.trap("User already registered") };
      case (null) {};
    };

    let id = generateId();
    let user : User = {
      id;
      name;
      phone;
      password;
      paymentMethod;
      transactionId;
      balance = 0;
      status = #pending;
      registeredAt = getCurrentTime();
    };

    users.add(id, user);
    userPrincipals.add(caller, id);
    
    // Assign user role
    AccessControl.assignRole(accessControlState, caller, caller, #user);
    
    // Create user profile
    let profile : UserProfile = {
      name;
      phone;
      balance = 0;
      status = #pending;
      registeredAt = getCurrentTime();
    };
    userProfiles.add(caller, profile);

    true;
  };

  // User login - verify credentials and return success
  public shared ({ caller }) func loginUser(phone : Text, password : Text) : async Bool {
    switch (userPrincipals.get(caller)) {
      case (null) { Runtime.trap("User not registered") };
      case (?userId) {
        switch (users.get(userId)) {
          case (null) { Runtime.trap("User not found") };
          case (?user) {
            if (user.phone == phone and user.password == password) {
              true;
            } else {
              Runtime.trap("Invalid credentials");
            };
          };
        };
      };
    };
  };

  // Get signals for caller (must be active user)
  public query ({ caller }) func getSignals() : async [Signal] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view signals");
    };

    switch (userPrincipals.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?userId) {
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
    };
  };

  // Get caller's user status
  public query ({ caller }) func getUserStatus() : async UserStatus {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view status");
    };

    switch (userPrincipals.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?userId) {
        switch (users.get(userId)) {
          case (null) { Runtime.trap("User not found") };
          case (?user) { user.status };
        };
      };
    };
  };

  // Get payment info (public, no auth required)
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

  // User: Create deposit request
  public shared ({ caller }) func createDepositRequest(amount : Nat, paymentMethod : Text, transactionId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create deposit requests");
    };

    let id = generateId();
    let deposit : DepositRequest = {
      id;
      userId = caller;
      amount;
      paymentMethod;
      transactionId;
      status = #pending;
      createdAt = getCurrentTime();
    };
    depositRequests.add(id, deposit);
  };

  // Admin only: Get all deposit requests
  public query ({ caller }) func getDepositRequests() : async [DepositRequest] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view deposit requests");
    };
    depositRequests.values().toArray();
  };

  // Admin only: Approve deposit request
  public shared ({ caller }) func approveDepositRequest(depositId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can approve deposits");
    };
    switch (depositRequests.get(depositId)) {
      case (null) { Runtime.trap("Deposit request not found") };
      case (?deposit) {
        let userIdText = switch (userPrincipals.get(deposit.userId)) {
          case (null) { Runtime.trap("User not found") };
          case (?id) { id };
        };
        
        let user = switch (users.get(userIdText)) {
          case (null) { Runtime.trap("User not found") };
          case (?user) { user };
        };
        
        users.add(
          userIdText,
          {
            id = user.id;
            name = user.name;
            phone = user.phone;
            password = user.password;
            paymentMethod = user.paymentMethod;
            transactionId = user.transactionId;
            balance = user.balance + deposit.amount;
            status = user.status;
            registeredAt = user.registeredAt;
          },
        );
        
        // Update user profile
        switch (userProfiles.get(deposit.userId)) {
          case (?profile) {
            userProfiles.add(
              deposit.userId,
              {
                name = profile.name;
                phone = profile.phone;
                balance = profile.balance + deposit.amount;
                status = profile.status;
                registeredAt = profile.registeredAt;
              },
            );
          };
          case (null) {};
        };
        
        depositRequests.add(
          depositId,
          {
            id = deposit.id;
            userId = deposit.userId;
            amount = deposit.amount;
            paymentMethod = deposit.paymentMethod;
            transactionId = deposit.transactionId;
            status = #approved;
            createdAt = deposit.createdAt;
          },
        );
      };
    };
  };

  // Get caller's balance
  public query ({ caller }) func getUserBalance() : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view balance");
    };

    switch (userPrincipals.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?userId) {
        switch (users.get(userId)) {
          case (null) { Runtime.trap("User not found") };
          case (?user) {
            Int.abs(user.balance);
          };
        };
      };
    };
  };

  // Admin only: Add promotion
  public shared ({ caller }) func addPromotion(description : Text, bonusAmount : Nat, validUntil : Int) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can add promotions");
    };
    let id = generateId();
    let promotion : Promotion = {
      id;
      description;
      bonusAmount;
      validUntil;
      isActive = true;
    };
    promotions.add(id, promotion);
  };

  // Admin only: Delete promotion
  public shared ({ caller }) func deletePromotion(promotionId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can delete promotions");
    };
    promotions.remove(promotionId);
  };

  // Get active promotions (public, no auth required)
  public query ({ caller }) func getActivePromotions() : async [Promotion] {
    promotions.values().toArray().filter(func(promo) { promo.isActive and promo.validUntil > getCurrentTime() });
  };

  // Admin only: Process withdrawal request
  public shared ({ caller }) func processWithdrawalRequest(userPrincipal : Principal, amount : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can withdraw funds");
    };
    
    let userId = switch (userPrincipals.get(userPrincipal)) {
      case (null) { Runtime.trap("User not found") };
      case (?id) { id };
    };
    
    switch (users.get(userId)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) {
        if (user.balance < amount) {
          Runtime.trap("Insufficient balance");
        };
        users.add(
          userId,
          {
            id = user.id;
            name = user.name;
            phone = user.phone;
            password = user.password;
            paymentMethod = user.paymentMethod;
            transactionId = user.transactionId;
            balance = user.balance - amount;
            status = user.status;
            registeredAt = user.registeredAt;
          },
        );
        
        // Update user profile
        switch (userProfiles.get(userPrincipal)) {
          case (?profile) {
            userProfiles.add(
              userPrincipal,
              {
                name = profile.name;
                phone = profile.phone;
                balance = profile.balance - amount;
                status = profile.status;
                registeredAt = profile.registeredAt;
              },
            );
          };
          case (null) {};
        };
      };
    };
  };

  // Get caller's user profile
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  // Get another user's profile (admin only or own profile)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Save caller's user profile
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
    
    // Update user data
    switch (userPrincipals.get(caller)) {
      case (?userId) {
        switch (users.get(userId)) {
          case (?user) {
            users.add(
              userId,
              {
                id = user.id;
                name = profile.name;
                phone = profile.phone;
                password = user.password;
                paymentMethod = user.paymentMethod;
                transactionId = user.transactionId;
                balance = profile.balance;
                status = profile.status;
                registeredAt = profile.registeredAt;
              },
            );
          };
          case (null) {};
        };
      };
      case (null) {};
    };
  };
};
