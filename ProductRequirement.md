# PRODUCT_REQUIREMENTS.md

## 1. Project Name

**FurniFlow**

*Tagline: Rent furniture, not clutter.*

A multi-sided marketplace connecting customers who need furniture temporarily with retailers who own inventory, facilitated by delivery partners and overseen by platform admins.

---

## 2. Problem Statement

### What problem does this solve?
Buying furniture is expensive, wasteful, and impractical for people who move often, live in temporary housing, or simply don't want to commit to owning heavy, hard-to-resell items. At the same time, furniture retailers and owners have inventory sitting idle between sales, representing lost revenue potential. FurniFlow solves both sides of this gap: it lets customers rent quality furniture for exactly as long as they need it, and lets retailers monetize furniture as a recurring-revenue asset instead of a one-time sale.

### Who faces this problem?
- **Renters/movers**: students, young professionals, expats, and military/corporate relocators who move every 1-3 years and don't want to buy-and-dump furniture each time.
- **Short-term residents**: people on temporary work assignments, interns, or those in transitional housing (post-divorce, waiting on a new home, etc.).
- **Budget-conscious households**: people who want quality furniture without a large upfront capital outlay.
- **Furniture retailers/owners**: small-to-mid-size furniture businesses and warehouses with unsold or underutilized stock who want a new, recurring revenue channel.

### Why are existing solutions insufficient?
- **Traditional furniture stores** are built for one-time purchase, not rental - no lifecycle for returns, condition checks, or recurring billing.
- **Classified sites** (OLX, Craigslist, Facebook Marketplace) offer secondhand furniture but have no trust layer: no verified retailers, no standardized delivery, no deposit protection, no dispute resolution.
- **Existing rental furniture companies** are often regional, offline-heavy (phone/email bookings), and lack a self-serve digital experience with real-time tracking, in-app payments, and reviews.
- **No single platform** currently unifies discovery, booking, payment, logistics, and returns into one trustworthy, end-to-end digital experience for furniture rental specifically.

---

## 3. Target Users

### Customer
- **Who they are**: Individuals or households looking to furnish a space (apartment, office, temporary housing) without buying outright.
- **What they want to accomplish**: Easily browse and compare furniture, book items for a flexible rental duration, get them delivered on time, pay securely, track their order, resolve issues via chat, and return items hassle-free at the end of the rental - with a fair deposit refund.

### Retailer
- **Who they are**: Furniture businesses, warehouses, or individual owners with inventory (new or gently used) who want to generate recurring rental income instead of relying solely on one-time sales.
- **What they want to accomplish**: List furniture with photos, pricing, and availability; manage incoming booking requests; track which items are rented out vs. available; verify item condition on return; get paid reliably and on time; build reputation through customer reviews.

### Delivery Partner
- **Who they are**: Individual drivers or logistics agencies (in-house or third-party) responsible for physically moving furniture between retailer, customer, and back.
- **What they want to accomplish**: Receive clear delivery/pickup assignments with addresses and time windows, update job status in real time, navigate efficiently, and get paid per completed job.

### Admin
- **Who they are**: The FurniFlow platform operations team responsible for the health, trust, and safety of the marketplace.
- **What they want to accomplish**: Onboard and verify retailers and delivery partners, monitor orders and resolve disputes, manage commissions and payouts, moderate reviews/listings, track platform-wide metrics, and enforce policy violations.

---

## 4. Core Features

Features marked **(V2)** are explicitly deferred - see Section 12 (MVP Scope) for the rationale.

### Customer
- Register/Login (email, phone OTP)
- ~~Social login~~ **(V2)**
- Browse/search furniture by category, price, location, availability
- Filter & sort (price, rental duration, rating, distance)
- View furniture details (photos, dimensions, monthly rental price, deposit amount, available quantity)
- Book furniture (select rental start date + duration in months)
- Pay online (rental fee + refundable deposit)
- Track order status in real time (per Booking Status Lifecycle - Section 7)
- In-app chat with retailer/delivery partner/support
- Request rental extension
- Request return / schedule pickup
- Cancel booking (per cancellation policy)
- Upload photo evidence if disputing a damage assessment
- Review & rate retailer and furniture
- View order history and invoices
- Manage saved addresses and payment methods

### Retailer
- Register/Login + KYC/business verification
- List furniture (photos, description, category, dimensions, monthly rental price, deposit, total quantity owned)
- Manage inventory & real-time availability (see Section 5)
- Accept/reject booking requests
- View and manage active/past orders
- Coordinate with assigned delivery partner
- Verify returned item condition (approve/flag damage, attach photo evidence)
- Raise damage/deposit deduction claims
- Receive payouts (view earnings dashboard, commission breakdown)
- Chat with customers
- View ratings/reviews received
- ~~Promote listings (paid featured placement)~~ **(V2)**

### Delivery Partner
- Register/Login + document/vehicle verification
- View assigned delivery/pickup jobs
- Accept/decline job assignments
- View pickup and drop-off addresses with navigation
- Update job status (assigned to picked up to in transit to delivered/returned)
- Capture proof of delivery/pickup (photo, signature, condition notes)
- Chat with customer/retailer for coordination
- View earnings and completed job history
- Set availability/working hours

### Admin
- Manage user accounts (customers, retailers, delivery partners) - approve, suspend, ban
- Verify retailer and delivery partner onboarding documents
- Monitor all orders and their statuses
- Resolve disputes: review customer/retailer photo evidence and decide final refund/deduction amount
- Manage commission rates and platform fees
- Manage payouts to retailers and delivery partners
- Moderate listings and reviews (remove fraudulent/inappropriate content)
- View platform analytics dashboard (GMV, active orders, top categories, churn)
- ~~Configure featured/promoted listing slots~~ **(V2)**
- Send platform-wide notifications/announcements

---

## 5. Furniture Availability & Inventory Logic

Every furniture listing tracks quantity at three levels. This distinction drives the database's inventory logic and every "is this bookable?" check.

```
Total Quantity   = total units the retailer owns and has listed
Active Rentals   = units currently booked (any status from Confirmed
                    through Returned, inclusive - i.e. NOT YET
                    Completed or Cancelled)
Available Qty    = Total Quantity - Active Rentals
```

**Example - Retailer's inventory:**

| Item          | Total Qty | Active Rentals | Available |
|---------------|-----------|-----------------|-----------|
| Chair         | 5         | 3               | 2         |
| Sofa          | 2         | 2               | 0         |
| Dining Table  | 1         | 0               | 1         |

### Rules
- A booking can only be created if `Available Qty >= 1` at the time of the request.
- `Active Rentals` increments the moment a booking reaches **Confirmed** status (retailer accepted + payment cleared) - not at earlier "pending" stages, so unpaid/unapproved requests never block inventory.
- `Active Rentals` decrements when a booking reaches **Completed** or **Cancelled** status.
- Availability is tracked per unit, not per listing - if 2 of 5 chairs are rented, the other 3 remain independently bookable by different customers with different rental windows.
- Availability must be checked inside a locking transaction at the moment of checkout to prevent overbooking from concurrent requests (a DB-level constraint/row lock is required, not just an application-level check).
- Retailers can increase/decrease `Total Quantity` at any time; a decrease can never bring the count below the current `Active Rentals`.

---

## 6. Rental Pricing Rules

**v1 supports monthly pricing only.** No daily or weekly rates in the MVP - this keeps proration, billing cycles, and extension logic simple. Daily/weekly tiers are a later consideration once the monthly flow is proven.

**Example listing:**

```
Chair
Rs.300/month

Deposit
Rs.1000

Minimum Rental
1 month
```

### Rules
- Every listing has exactly one price: `pricePerMonth`.
- Every listing has one refundable `depositAmount`, fixed regardless of rental duration.
- Minimum rental duration = **1 month**. Maximum rental duration = configurable by admin (default 24 months).
- Customers select rental duration in whole-month increments only (no partial months in v1).
- Total rental fee at checkout = `pricePerMonth x numberOfMonths`.
- Total amount charged at checkout = `rental fee + deposit`.
- Extensions add whole additional months at the same `pricePerMonth` (no mid-rental price changes in v1).
- Late returns are billed at `pricePerMonth / 30` per day late (see Section 10 - Revenue Model).

---

## 7. Booking Status Lifecycle

This is the exact, exhaustive set of states a booking can be in. It maps directly to a database enum (`booking_status`) - no other values are permitted.

```
Pending Payment
      |
Pending Retailer Approval
      |
Confirmed
      |
Delivery Assigned
      |
Out for Delivery
      |
Delivered
      |
Rental Active
      |
Return Requested
      |
Pickup Scheduled
      |
Returned
      |
Completed

Cancelled  (terminal - reachable only from Pending Payment,
            Pending Retailer Approval, or Confirmed;
            NOT reachable once status is Delivered or later)
```

### Notes
- `Active Rentals` (Section 5) counts any order in `Confirmed` through `Returned` inclusive.
- Every status transition should be timestamped and logged (who changed it, when, from what to what) for audit/dispute purposes.
- Transitions are role-gated: e.g. only the retailer can move `Pending Retailer Approval -> Confirmed`; only the delivery partner can move `Out for Delivery -> Delivered`; only the customer (or an auto-timer) can trigger `Return Requested`.

---

## 8. Damage Policy & Dispute Resolution

1. Delivery partner returns the item to the retailer.
2. Retailer inspects the item and marks it **No Damage** or **Damage Found**, attaching photos as evidence either way.
3. **If No Damage** -> full deposit is refunded to the customer automatically.
4. **If Damage Found** -> retailer specifies a proposed deduction amount with photo evidence attached to the claim.
5. Customer is notified of the claim and can either:
   - **Accept** the deduction -> refund (deposit - deduction) is processed immediately, or
   - **Dispute** the claim -> customer uploads their own photo evidence (e.g. delivery-day condition photos) countering the retailer's claim.
6. If disputed, an **Admin** reviews both sets of evidence and makes the final, binding decision on the refund amount.
7. Once resolved (auto-approved, customer-accepted, or admin-decided), the deposit refund is processed and the order moves to `Completed`.

This ensures every damage claim has an evidence trail and a clear resolution path, rather than a one-sided retailer decision.

---

## 9. Rental Flow (End-to-End)

```
Retailer registers & lists furniture (sets Total Quantity)
        |
Customer searches & filters furniture (sees live Available Qty)
        |
Customer selects rental duration (whole months) & books item
        |
Booking created -> status: Pending Payment
        |
Customer pays (rental fee + deposit) -> status: Pending Retailer Approval
        |
Retailer accepts -> status: Confirmed (Active Rentals +1, Available Qty -1)
        |
Delivery partner assigned -> status: Delivery Assigned
        |
Delivery partner picks up item from retailer -> status: Out for Delivery
        |
Delivery partner delivers item to customer -> status: Delivered
        |
Customer confirms delivery -> status: Rental Active
        |
    [Active Rental Period - extensions possible]
        |
Customer requests return (or rental period ends) -> status: Return Requested
        |
Delivery partner assigned for pickup -> status: Pickup Scheduled
        |
Delivery partner picks up item, returns to retailer -> status: Returned
        |
Retailer inspects & verifies item condition (see Section 8)
        |
Deposit refunded (full, partial, or admin-decided amount)
        |
Customer leaves review for retailer
        |
Order marked Completed (Active Rentals -1, Available Qty +1)
        |
Retailer & delivery partner payouts processed
```

*(`Cancelled` can branch off from any pre-`Delivered` status - see Section 7 for exact rules.)*

---

## 10. Revenue Model

Items marked **(V2)** are deferred alongside their corresponding feature.

- **Commission per order**: 10-15% commission on every completed rental transaction, charged to the retailer.
- **Delivery/logistics fee**: A flat or distance-based fee charged to the customer for pickup and drop-off, a portion of which is FurniFlow's margin on top of the delivery partner's payout.
- **Late return charges**: Daily late fee (`pricePerMonth / 30` per day) charged to customers who exceed their agreed rental period, split between platform and retailer.
- **Cancellation fee**: A partial fee retained on late-stage customer cancellations to compensate retailers/delivery partners.
- ~~Featured retailer listings~~ **(V2)**
- ~~Premium subscription (Retailer Pro)~~ **(V2)**

The MVP revenue model deliberately relies on the two most fundamental, always-on levers (commission + delivery fee), so revenue works from day one without needing a critical mass of retailers competing for promoted slots or subscribing to a paid tier.

---

## 11. Assumptions

- Retailers own (or have legal rights to rent out) the furniture they list; FurniFlow does not own inventory.
- The platform is a pure marketplace/aggregator - it does not manufacture, store, or warehouse furniture itself.
- Every order is associated with exactly one retailer (no split-retailer orders in v1).
- Every order is associated with exactly one delivery partner per leg (delivery and return may be the same or different partner).
- All payments (rental fees, deposits, refunds, payouts) are processed through the platform - no offline/cash transactions.
- Deposits are refundable by default and only withheld in case of verified damage or loss, following the evidence-based dispute process in Section 8.
- Delivery partners may be independent contractors or affiliated with a third-party logistics provider; the platform assigns jobs but does not employ them directly.
- Rental durations are billed in whole months only, bounded by a minimum of 1 month and a maximum configurable by admin (default 24 months).
- Retailers are responsible for the accuracy of listing information (condition, dimensions, pricing, quantity).
- Inventory availability (Section 5) is the single source of truth for whether an item can be booked - no listing can be booked below zero available units.
- The platform operates within a single country/currency in v1, with multi-region support planned as a future enhancement.

---

## 12. MVP Scope (V1 vs. V2)

To keep the MVP shippable, the following features are explicitly **deferred to V2**:

| Feature | Why deferred |
|---|---|
| Social login | Email/phone OTP alone is enough to ship auth; adding OAuth providers is additive, not blocking. |
| AI-based furniture recommendations | Needs usage data the platform won't have until after launch. |
| AR room preview | High effort, no bearing on the core booking/payment/logistics loop. |
| Featured/promoted retailer listings | A monetization layer that only makes sense once there's real retailer competition for visibility. |
| Premium subscriptions (Retailer Pro) | Needs a baseline of retailer usage data to design tiers around. |
| Multi-currency / multi-region support | Adds significant complexity to pricing, payments, and compliance for no v1 benefit in a single-market launch. |
| Loyalty/rewards program | A retention feature - only useful once there's a repeat-customer base to retain. |

**V1 (MVP) is scoped to exactly this:** account creation (email/phone), browse/search, monthly-only booking with live inventory checks, online payment (rental + deposit), the full booking status lifecycle, delivery partner assignment and status updates, in-app chat, the evidence-based return/damage/dispute flow, reviews, and the core admin dashboard (verification, dispute resolution, payouts, analytics). Everything in the table above is out of scope until V1 is live and validated.

---

## 13. Future Enhancements (Beyond V2)

Longer-horizon ideas not yet scheduled for V2 either:

- Multi-item cart / bundled rentals from multiple retailers in one checkout
- Retailer-to-retailer inventory sharing network
- Insurance add-on for accidental damage protection
- Daily/weekly pricing tiers (once monthly billing is proven in production)
