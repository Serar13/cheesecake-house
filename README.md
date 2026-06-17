# Cheesecake House

Monorepo for The Cheesecake House customer apps and admin tools.

## Projects

- `mobile` - Expo / React Native customer app.
- `site` - Public customer website deployed to Firebase Hosting.
- `webadmin` - Admin dashboard deployed to Firebase Hosting.

## Live URLs

- Public site: https://chessecakehouse.web.app
- Web admin: https://chessecakehouse-admin.web.app

## Firebase

Firebase project ID:

```bash
chessecakehouse
```

Current Hosting sites:

- `chessecakehouse` - public website
- `chessecakehouse-admin` - admin dashboard

The Firebase web config is safe to use in client apps, but access must be protected with Firebase Auth and Firestore security rules.

## Local Development

Install dependencies separately in each project.

### Mobile

```bash
cd mobile
npm install
npm run iphone:dev
```

Useful scripts:

```bash
npm run start:device
npm run iphone:dev
npm run iphone
```

### Public Site

```bash
cd site
npm install
npm run dev
```

Build and deploy:

```bash
npm run build
firebase deploy --only hosting
```

### Web Admin

```bash
cd webadmin
npm install
npm run dev
```

Build and deploy:

```bash
npm run build
firebase deploy --only hosting:admin
```

## Branch For Dynamic Admin Sync

Branch:

```bash
feature/dynamic-admin-sync
```

Goal: replace dummy/static data in `mobile`, `site`, and `webadmin` with Firebase-backed dynamic data controlled from `webadmin`.

Suggested implementation scope:

- Webadmin login and admin-only access.
- Firestore roles for users, including admin role.
- Dynamic products managed from webadmin and consumed by mobile/site.
- Dynamic promotions/offers managed from webadmin.
- Orders stored in Firestore and visible/editable in webadmin.
- Reservations stored in Firestore and visible/editable in webadmin.
- Tables configured in webadmin and used for reservation availability.
- Loyalty and user profile data stored in Firestore.
- Admin dashboard analytics for sales, orders, reservations, users, and product performance.
- Updated Firestore rules.
- Loading, error, and empty states in all apps.

## Suggested Firestore Collections

This is a starting point and can be adjusted during implementation.

```txt
users/{userId}
  name
  email
  phone
  role
  loyaltyPoints
  loyaltyStamps
  loyaltyTier
  createdAt
  updatedAt

products/{productId}
  name
  description
  price
  category
  imageUrl
  active
  featured
  availability
  createdAt
  updatedAt

promotions/{promotionId}
  title
  description
  code
  discountType
  discountValue
  active
  startsAt
  endsAt
  targetProductId
  targetCategory
  exclusive
  createdAt
  updatedAt

orders/{orderId}
  userId
  customerName
  source
  location
  items
  total
  status
  createdAt
  updatedAt

tables/{tableId}
  location
  name
  seats
  active
  notes
  createdAt
  updatedAt

reservations/{reservationId}
  userId
  customerName
  location
  tableId
  date
  time
  durationMinutes
  guests
  status
  createdAt
  updatedAt
```

## Notes

- Do not commit `node_modules`, `dist`, Firebase tokens, service account keys, or local `.env` files.
- Keep Firebase Hosting deploys separated:
  - public site from `site`
  - admin dashboard from `webadmin`
