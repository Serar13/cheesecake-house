# Cheesecake House

Monorepo for The Cheesecake House customer apps and admin tools. Firebase
(Auth + Firestore + Storage + Hosting) is the **single source of truth** for all
dynamic content — products, categories, promotions, orders, reservations,
tables, locations, event requests, reviews and loyalty are managed from the
**webadmin** dashboard and consumed live by the **mobile** app and public
**site**.

## Projects

- `mobile` — Expo / React Native customer app.
- `site` — Public customer website → Firebase Hosting (`chessecakehouse`).
- `webadmin` — Admin dashboard → Firebase Hosting (`chessecakehouse-admin`).
- `seed` — One-off Firestore seeding script + canonical seed data.

## Live URLs

- Public site: https://chessecakehouse.web.app
- Web admin: https://chessecakehouse-admin.web.app

## Firebase

Project ID: `chessecakehouse`. The Firebase web config is shipped in the client
apps (it is not a secret); access is protected by Firebase Auth + Firestore /
Storage security rules. **Never** commit service account keys, tokens or
`.env` files.

Hosting targets:

- `chessecakehouse` — public website (deployed from `site/`)
- `chessecakehouse-admin` — admin dashboard (deployed from `webadmin/`)

---

## Running locally

Each project manages its own dependencies.

### Mobile

```bash
cd mobile
npm install
npm run iphone:dev      # or: npm run start:device / npm run iphone
```

### Public site

```bash
cd site
npm install
npm run dev             # local dev server
npm run build           # production build → dist/
```

### Web admin

```bash
cd webadmin
npm install
npm run dev
npm run build           # production build → dist/
```

---

## Deploying

Firestore + Storage **rules live in `site/`** and deploy alongside the public
site. The two hosting targets deploy independently.

```bash
# Public site + Firestore/Storage rules
cd site
npm run build
firebase deploy --only hosting,firestore:rules,storage

# Web admin (hosting only)
cd ../webadmin
npm run build
firebase deploy --only hosting:admin
```

---

## Authentication & admin access

- The **webadmin** has its own login screen (email/password, Firebase Auth).
- After sign-in the dashboard loads the caller's `users/{uid}` profile and only
  grants access when `role === "admin"`. Authenticated non-admins see an
  **Access denied** screen; unauthenticated users see the login screen.
- Customers signing up through the site/mobile apps get `role: "customer"`
  (or no role). Security rules forbid a user from granting themselves `admin`.

### How to make a user an admin

1. The person must sign up once (in the site, mobile app, or webadmin login)
   so a `users/{uid}` document exists.
2. Find their UID: Firebase Console → **Authentication → Users**.
3. Open Firestore → **users** collection → their document and set:

   ```
   role: "admin"
   ```

   (string field, exact value `admin`). Save.
4. They can now sign in to the webadmin. Existing admins can also promote other
   users from the **Clienți & Fidelitate** module ("Fă admin" button).

---

## Firestore schema

All admin-managed documents carry `createdAt` / `updatedAt` (Firestore
Timestamps written with `serverTimestamp()`). Collection names are centralized
in each app's `services/collections.js`.

```txt
users/{uid}
  name, email, phone
  role            "admin" | "customer"
  vipPoints       number   (loyalty points; alias: loyaltyPoints)
  stamps          number   (loyalty stamps 0–9; alias: loyaltyStamps)
  loyaltyTier     string?  (else derived: Bronze/Silver/Gold from points)
  balance         number   (wallet)
  birthdayVoucherActive  boolean
  createdAt, updatedAt

categories/{id}            # id == slug
  name, slug, icon
  sortOrder       number
  active          boolean
  createdAt, updatedAt

products/{id}
  name, description
  price           number
  categoryId      -> categories/{id}
  imageUrl        string   (Storage URL or /images/*.png)
  unit, weight    string
  active          boolean  (visible in apps)
  featured        boolean
  availability    "available" | "unavailable"
  sortOrder       number
  createdAt, updatedAt

promotions/{id}
  title, description, code
  discountType    "percent" | "fixed"
  discountValue   number
  active          boolean
  startsAt, endsAt        Timestamp | null
  targetProductId  -> products/{id} | null
  targetCategoryId -> categories/{id} | null
  exclusive       boolean  (VIP / exclusive offer)
  createdAt, updatedAt

locations/{id}
  name, city, address, phone, email, schedule
  coordinates     { lat, lng }
  active          boolean
  createdAt, updatedAt

tables/{id}
  locationId      -> locations/{id}
  name, notes
  seats           number
  active          boolean
  createdAt, updatedAt

orders/{id}
  userId          -> users/{uid}
  customerName
  source          "site" | "mobile"
  locationId      -> locations/{id}
  items           [{ productId, name, price, quantity }]
  total           number
  status          "pending" | "preparing" | "ready" | "delivered" | "cancelled"
  createdAt, updatedAt

reservations/{id}
  userId          -> users/{uid}
  customerName
  locationId      -> locations/{id}
  tableId         -> tables/{id}
  date            "YYYY-MM-DD"
  time            "HH:mm"
  durationMinutes number
  guests          number
  status          "pending" | "confirmed" | "cancelled"
  createdAt, updatedAt

offerRequests/{id}          # candy bar / event enquiries
  customerName, email, phone
  eventType, eventDate
  guestCount      number
  message
  status          "new" | "contacted" | "quoted" | "accepted" | "rejected"
  createdAt, updatedAt

reviews/{id}
  name
  rating          number 1–5
  text
  approved        boolean  (only approved reviews show on the site)
  createdAt, updatedAt
```

### Security rules (summary)

Defined in `site/firestore.rules` and `site/storage.rules`:

- **Public read**: `products`, `categories`, `promotions`, `locations`,
  `tables`, and approved `reviews`.
- **Users**: read/update only their own `users/{uid}` profile; cannot grant
  themselves `role: admin`.
- **Orders / reservations**: a signed-in user may create their own
  (`userId == auth.uid`) and read their own; admins read/write all.
- **offerRequests**: anyone may create (`status: "new"`); only admins read.
- **reviews**: anyone may create (forced `approved: false`); admins manage.
- **Admin-managed collections** (`products`, `categories`, `promotions`,
  `locations`, `tables`): no public writes — admin only.
- **Storage**: public read of catalog media; only admins upload/replace.

---

## Seed data

Canonical starter content lives in `seed/seedData.json` (categories, products,
locations, tables, promotions, reviews — derived from the apps' former mock
data so no existing content is lost).

```bash
cd seed
# Firebase Console → Project settings → Service accounts → Generate new key
# Save it as seed/service-account.json   (gitignored)
npm install
npm run seed
```

The script uses the Firebase Admin SDK (bypasses security rules), writes each
collection idempotently with `merge`, and stamps `createdAt`/`updatedAt`.
After seeding, make yourself an admin (see above).

---

## Shared Firebase access

Every app has a small service layer so collection names and data mapping are
defined once:

- `site/src/services/` — `collections.js`, `catalog.js` (reads + `onSnapshot`),
  `submissions.js` (orders/reservations/offerRequests/reviews).
- `mobile/services/` — `collections.js`, `firestore.js` (reads + order/
  reservation writes, reservation conflict check).
- `webadmin/src/services/` — `collections.js`, `firestore.js` (generic live
  CRUD), `storage.js` (image upload). Modules live under `webadmin/src/modules/`.

---

## Webadmin modules

Login → Layout/Sidebar → **Dashboard** (sales, orders today, pending orders,
active reservations, revenue by source, most-sold products, recent orders &
reservations) · **Orders** · **Reservations** · **Products** · **Categories** ·
**Promotions** · **Tables** · **Locations** · **Offer Requests** · **Reviews** ·
**Users/Loyalty**. Orders & reservations update live via `onSnapshot`; all
catalog modules support create/edit/delete, inline activate/availability
toggles, search and sort, with loading/error/empty states.

---

## Known limitations

- **Reservation availability** uses simple per-table, same date+time conflict
  detection (pending/confirmed block the slot). It is not a full scheduling
  engine — adjacent overlapping ranges are checked but capacity planning is
  intentionally minimal.
- **Mobile category filter**: the Home screen still uses a fixed set of filter
  chips; products load from Firestore by `categoryId`. If your Firestore
  category ids differ from those chip slugs, the "All" tab is correct but a
  specific chip may not match until ids are aligned.
- **Bundle size**: the site/webadmin bundles exceed Vite's 500 kB advisory
  (Firebase SDK). Functional, but could be code-split later.
- Loyalty wallet/stamps logic remains in the mobile app; webadmin shows the
  values read-only (plus role management).

---

## Notes

- Do not commit `node_modules`, `dist`, Firebase tokens, service account keys,
  or local `.env` files.
- Keep Hosting deploys separated: public site from `site/`, admin from
  `webadmin/`.
