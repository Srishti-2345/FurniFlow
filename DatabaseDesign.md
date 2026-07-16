1. User Collection
Purpose

Stores every account on the platform.

Both customers and sellers use the same collection.

Fields
_id

fullName

email

phone

password

role
(customer | seller)

profileImage

isVerified

isActive

createdAt

updatedAt
Relationships
One User

↓

Many Addresses

Many Bookings

Many Conversations
2. Address Collection
Purpose

Stores reusable addresses.

A customer may save multiple addresses.

Fields
_id

userId

label
(Home, Office)

addressLine1

addressLine2

city

state

postalCode

isDefault

createdAt
Relationship
User

1

↓

Many Addresses
3. Category Collection
Purpose

Furniture categories.

Fields
_id

name

slug

icon

isActive

Examples

Chair

Bed

Sofa

Wardrobe

Study Table

Dining Table
4. Furniture Collection
Purpose

Furniture listed by sellers.

Fields
_id

sellerId

categoryId

title

description

pricePerMonth

securityDeposit

quantity

availableQuantity

length

width

height

weight

condition

city

status
(active/inactive)

createdAt

updatedAt
Relationship
Seller

↓

Many Furniture
5. FurnitureImage Collection

Instead of storing only one image.

Fields
_id

furnitureId

imageUrl

isPrimary

displayOrder

Relationship

Furniture

↓

Many Images
6. Booking Collection
Purpose

Stores rental bookings.

This is the most important collection.

Fields
_id

customerId

sellerId

furnitureId

deliveryAddressId

status

bookingDate

rentalStartDate

rentalMonths

rentalEndDate

priceSnapshot

depositSnapshot

totalAmount

paymentStatus

furnitureTitleSnapshot

primaryImageSnapshot

sellerNameSnapshot

createdAt

updatedAt
Booking Status
Pending Payment

Pending Seller Approval

Confirmed

Rejected

Rental Active

Completed

Cancelled

Relationship

Customer

↓

Many Bookings

Furniture

↓

Many Bookings
7. Payment Collection
Purpose

Stores payment information.

Fields
_id

bookingId

customerId

amount

paymentMethod

gateway

gatewayPaymentId

status

paidAt

createdAt

Payment Status

Pending

Success

Failed
8. Conversation Collection

Since every booking has one chat.

Fields
_id

bookingId

customerId

sellerId

lastMessage

lastMessageTime

createdAt

Relationship

Booking

↓

One Conversation
9. Message Collection

Every chat message.

Fields
_id

conversationId

senderId

receiverId

message

messageType
(text/image)

isRead

createdAt

Relationship

Conversation

↓

Many Messages
10. Review Collection

Customer reviews seller.

Fields
_id

bookingId

customerId

sellerId

rating

comment

createdAt

Relationship

Booking

↓

One Review
11. Notification Collection

Stores in-app notifications.

Fields
_id

userId

title

body

type

isRead

createdAt
Relationship Diagram
User
│
├── Address
│
├── Furniture (seller)
│      │
│      └── FurnitureImage
│
├── Booking
│      │
│      ├── Payment
│      ├── Conversation
│      │      │
│      │      └── Message
│      │
│      └── Review
│
└── Notification
Collections Summary
Collection	Purpose
User	Authentication and user accounts
Address	Saved addresses
Category	Furniture categories
Furniture	Rental listings
FurnitureImage	Multiple images for furniture
Booking	Rental orders
Payment	Razorpay transactions
Conversation	Chat session per booking
Message	Individual chat messages
Review	Customer reviews
Notification	In-app notifications
Recommended Mongoose Relationships

Use references (ObjectId) rather than embedding large documents:

Furniture.sellerId → User
Furniture.categoryId → Category
Booking.customerId → User
Booking.sellerId → User
Booking.furnitureId → Furniture
Booking.deliveryAddressId → Address
Payment.bookingId → Booking
Conversation.bookingId → Booking
Message.conversationId → Conversation
Review.bookingId → Booking
Notification.userId → User