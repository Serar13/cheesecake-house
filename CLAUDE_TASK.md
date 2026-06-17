# Task: Dynamic Admin Sync

Work only on branch:

```bash
feature/dynamic-admin-sync
```

## Goal

Replace all dummy/static data in the mobile app, public site, and webadmin with Firebase-backed dynamic data controlled from the webadmin dashboard.

This repo contains:

- `mobile` - Expo / React Native customer app
- `site` - public customer website
- `webadmin` - admin dashboard

Firebase is already connected for Auth/Firestore/Hosting. Admin roles have been added manually or are expected to exist in Firestore/user profile data.

## Requirements

### 1. Auth And Authorization

- Add a login flow to `webadmin`.
- Only authenticated users with admin role can access the admin dashboard.
- Non-admin users should see an access denied state.
- Use the existing Firebase project.
- Use Firestore profile roles or custom claims, whichever fits the current project best.
- Update Firestore security rules accordingly.

### 2. Products

- Products must live in Firestore.
- `webadmin` can create, edit, delete, activate/deactivate products.
- `mobile` and `site` read products from Firestore.
- Remove hardcoded product dummy data.
- Suggested fields:
  - `name`
  - `description`
  - `price`
  - `category`
  - `imageUrl`
  - `active`
  - `featured`
  - `availability`
  - `createdAt`
  - `updatedAt`

### 3. Promotions And Offers

- `webadmin` can create, edit, delete promotions and exclusive offers.
- `mobile` and `site` display active promotions dynamically.
- Suggested fields:
  - `title`
  - `description`
  - `code`
  - `discountType`
  - `discountValue`
  - `active`
  - `startsAt`
  - `endsAt`
  - `targetProductId`
  - `targetCategory`
  - `exclusive`

### 4. Orders

- Orders from `mobile` and `site` should be saved in Firestore.
- `webadmin` shows all orders.
- Admin can update order status:
  - `pending`
  - `preparing`
  - `ready`
  - `delivered`
  - `cancelled`
- Show source: `mobile` or `site`.
- Show customer, items, total, location, created time, and status.

### 5. Reservations

- Reservations should be saved in Firestore.
- `webadmin` shows every reservation.
- Admin can confirm/cancel/change status.
- Show user, location, table, date/time, duration, party size, and status.

### 6. Tables

- Tables should be configurable from `webadmin`.
- Suggested fields:
  - `location`
  - `name`
  - `seats`
  - `active`
  - `notes`
- Reservation availability should use table/reservation data.

### 7. Loyalty And Users

- `webadmin` can view users.
- Show each user's loyalty card progress, stamps, points, and rank/tier.
- `mobile` reads loyalty data dynamically.
- Remove dummy loyalty state.

### 8. Sales Analytics

The `webadmin` dashboard should show:

- total sales
- orders today
- pending orders
- active reservations
- most sold products
- revenue by source: site/mobile
- recent orders and reservations

Start with Firestore queries and keep the solution simple.

### 9. Shared Firebase Access

- Create clean Firebase service modules in each app or a shared package if that is practical.
- Add loading, error, and empty states.
- Avoid duplicating collection names and data mapping all over the UI.

### 10. Documentation

Update `README.md` with:

- how to run each app
- how to deploy each web target
- Firestore collection schema
- admin role setup instructions

## Important

- Keep existing Firebase Hosting targets:
  - public site: `chessecakehouse`
  - webadmin: `chessecakehouse-admin`
- Do not commit secrets, service account keys, Firebase tokens, `node_modules`, or `dist`.
- Keep changes maintainable and scoped to this feature.
