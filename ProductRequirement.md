FurniFlow – Furniture Rental Platform (MVP)

Version: 1.0

1. Project Overview
Problem Statement

People who frequently relocate for jobs, education, internships, or personal reasons often hesitate to buy furniture because:

Purchasing furniture is expensive.
Transporting furniture between cities is difficult.
Selling used furniture causes financial loss.
Rental options are scattered across multiple local vendors.

There is currently no simple platform that connects furniture owners with people who need furniture temporarily while providing secure payments and communication.

Solution

FurniFlow is a furniture rental marketplace where customers can rent furniture directly from verified sellers.

The platform allows:

Customers to browse and rent furniture
Sellers to list furniture for rent
Secure online payments
Real-time in-app chat between customer and seller
Booking management
Reviews and ratings

All communication happens inside the application so personal phone numbers remain private.

2. Users

The MVP contains 2 user roles.

Customer

Can:

Register/Login
Browse furniture
Search furniture
View furniture details
Book furniture
Pay online
Chat with sellers
View booking history
Review sellers
Seller

Can:

Register/Login
Create furniture listings
Upload furniture images
Edit/Delete listings
Accept or reject bookings
Chat with customers
View active bookings
View completed bookings
View earnings summary
3. Core Features
Authentication

Both customers and sellers can:

Register
Login
Logout
Reset password
JWT Authentication
Furniture Listings

Seller can:

Add furniture
Upload multiple images
Enter rental price
Add security deposit
Set available quantity
Choose category
Edit listing
Remove listing

Customer can:

Browse listings
Filter listings
Search listings
View details
Categories

Example categories:

Sofa
Chair
Bed
Mattress
Dining Table
Study Table
Wardrobe
TV Unit
Office Chair
Booking System

Customer selects:

Furniture
Rental start date
Rental duration (months)

System calculates:

Rental Cost

Security Deposit

=

Total Amount

After successful payment:

Booking is created.

Seller receives booking request.

Seller can:

Accept booking
Reject booking
Payment

Online payment through:

Razorpay

Supported methods:

UPI
Credit Card
Debit Card
Net Banking

Payment status:

Pending
Success
Failed
Chat

Customer and Seller can chat after a booking request is created.

Features:

Real-time messaging
Booking-specific conversation
Text messages
Read receipts
Online/offline status (optional)
Message timestamps

Communication happens only inside the application.

Reviews

After booking completion:

Customer can:

Give rating (1–5)
Write review

Seller's average rating is displayed on profile.

4. Booking Lifecycle
Browse Furniture

↓

Book Furniture

↓

Payment

↓

Booking Created

↓

Seller Accepts

↓

Rental Active

↓

Completed

↓

Review

If seller rejects:

Booking

↓

Rejected

↓

Refund initiated (future enhancement)

MVP Note: Automatic refunds are out of scope for version 1. A rejected booking will simply be marked as rejected. Refund handling can be added in a future version.

5. Search & Filters

Customer can search by:

Furniture name
Category

Filter by:

Price range
Category
City
Seller rating

Sort by:

Lowest price
Highest price
Newest
Highest rated
6. Seller Dashboard

Seller can view:

Total Listings
Active Listings
Active Bookings
Completed Bookings
Total Earnings
Pending Booking Requests
7. Customer Dashboard

Customer can view:

Active Rentals
Upcoming Rentals
Completed Rentals
Saved Addresses
Payment History
8. Notifications

Users receive notifications for:

Booking confirmed
Booking rejected
Payment successful
New chat message
Booking completed
9. Non-Functional Requirements
Security
JWT Authentication
Password hashing (bcrypt)
Protected APIs
Role-based authorization
Input validation
Performance
Pagination for furniture listings
Optimized database queries
Image optimization
Scalability

The architecture should allow future addition of:

Delivery partners
Admin dashboard
Damage claims
Refund system
Wishlist
Coupons
Multi-city support

without major database redesign.

10. Technology Stack
Frontend
React
Tailwind CSS
React Router
Axios
Socket.IO Client
Backend
Node.js
Express.js
MongoDB
Mongoose
JWT
bcrypt
Socket.IO
Multer
Cloudinary
Razorpay
11. Future Enhancements
Delivery partner system
Live order tracking
Damage claims
Refund management
Wishlist
Coupon system
AI furniture recommendations
Rental extensions
Multi-language support
Admin panel
Analytics dashboard
12. Success Criteria

The MVP is considered complete when:

Users can register and log in.
Sellers can create and manage furniture listings.
Customers can search and book furniture.
Payments are processed successfully.
Sellers can accept or reject bookings.
Customers and sellers can chat in real time.
Customers can leave reviews after completed bookings.
The application is responsive and works across desktop and mobile devices.