// Single source of truth for Firestore collection names, shared by every module.
export const COLLECTIONS = {
  USERS: "users",
  PRODUCTS: "products",
  CATEGORIES: "categories",
  PROMOTIONS: "promotions",
  ORDERS: "orders",
  RESERVATIONS: "reservations",
  TABLES: "tables",
  LOCATIONS: "locations",
  OFFER_REQUESTS: "offerRequests",
  REVIEWS: "reviews"
};

// Allowed status enums (kept here so UI dropdowns never drift from the schema).
export const ORDER_STATUSES = ["pending", "preparing", "ready", "delivered", "cancelled"];
export const RESERVATION_STATUSES = ["pending", "confirmed", "cancelled"];
export const OFFER_REQUEST_STATUSES = ["new", "contacted", "quoted", "accepted", "rejected"];
export const DISCOUNT_TYPES = ["percent", "fixed"];
export const AVAILABILITY = ["available", "unavailable"];
