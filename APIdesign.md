Base URL
/api/v1

Authentication: JWT Bearer Token

1. Authentication
POST   /auth/register
POST   /auth/login
POST   /auth/logout
POST   /auth/forgot-password
POST   /auth/reset-password
GET    /auth/me
2. Users
Current User
GET    /users/me
PATCH  /users/me
DELETE /users/me
Public User
GET    /users/:id
3. Address
GET    /addresses
POST   /addresses
PATCH  /addresses/:id
DELETE /addresses/:id
4. Categories
GET    /categories
GET    /categories/:id
5. Furniture
Public
GET    /furniture
GET    /furniture/:id
Search
GET /furniture?
    category=
    city=
    minPrice=
    maxPrice=
    search=
    sort=
    page=
    limit=

Example

GET /furniture?category=Chair&city=Delhi&page=1
Seller
GET    /seller/furniture
POST   /seller/furniture
PATCH  /seller/furniture/:id
DELETE /seller/furniture/:id
Furniture Images
POST   /seller/furniture/:id/images
DELETE /seller/furniture/:id/images/:imageId
PATCH  /seller/furniture/:id/images/:imageId/primary
6. Booking
Customer
POST   /bookings
GET    /bookings
GET    /bookings/:id
Seller
GET    /seller/bookings
GET    /seller/bookings/:id
Booking Status
PATCH  /bookings/:id/status

Example

{
    "status":"confirmed"
}

Allowed values

pending

confirmed

rejected

rental_active

completed

cancelled
Extend Rental
PATCH /bookings/:id/extend

Example

{
   "months":2
}
7. Payments
Create Payment
POST /payments/create-order

Returns

Razorpay Order ID
Verify Payment
POST /payments/verify
Payment History
GET /payments
GET /payments/:id
Webhook
POST /payments/webhook
8. Chat
Conversations
GET    /conversations
POST   /conversations
GET    /conversations/:id
Messages
GET    /conversations/:id/messages
POST   /conversations/:id/messages

Socket Events

connection

disconnect

joinConversation

leaveConversation

sendMessage

receiveMessage

typing

stopTyping

markAsRead
9. Reviews

Customer

POST /reviews

Public

GET /reviews/:sellerId

Seller

GET /seller/reviews
10. Notifications
GET    /notifications
PATCH  /notifications/:id/read
PATCH  /notifications/read-all
11. Seller Dashboard
GET /seller/dashboard

Returns

Total Listings

Active Listings

Active Bookings

Completed Bookings

Total Earnings

Average Rating
12. Customer Dashboard
GET /customer/dashboard

Returns

Active Rentals

Completed Rentals

Pending Bookings

Recent Payments
API Flow
Register
POST /auth/register

↓

POST /auth/login

↓

JWT Token
Seller Creates Listing
POST /seller/furniture

↓

POST /seller/furniture/:id/images

↓

Furniture Live
Customer Books Furniture
GET /furniture

↓

GET /furniture/:id

↓

POST /bookings

↓

POST /payments/create-order

↓

POST /payments/verify

↓

Booking Created

↓

Seller Notification
Seller Accepts Booking
PATCH /bookings/:id/status

{
   "status":"confirmed"
}
Chat Flow
Customer

↓

POST /conversations

↓

Socket Connected

↓

sendMessage

↓

receiveMessage
Complete Booking
PATCH /bookings/:id/status

{
   "status":"completed"
}

↓

POST /reviews
Total Endpoints
Module	Endpoints
Authentication	6
Users	4
Address	4
Categories	2
Furniture	10
Booking	7
Payments	4
Chat	5
Reviews	3
Notifications	3
Dashboards	2
Total	50