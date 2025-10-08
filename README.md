# Vexa E-Commerce Backend

A complete e-commerce backend API built with Node.js, Express, MongoDB, featuring mobile authentication, Google Sign-In, and comprehensive e-commerce functionality.

## 🌟 Features

### 🔐 Authentication & Authorization
- **Mobile Authentication** with OTP/SMS
- **Google OAuth 2.0** integration
- **JWT-based authentication** with refresh tokens
- **Role-based access control** (User, Admin, Vendor)
- **Secure password hashing** with bcrypt
- **Session management**

### 🛍️ E-Commerce Features
- **Product Management** with categories, variants, and inventory
- **Shopping Cart** functionality
- **Order Management** with status tracking
- **Payment Integration** (Stripe/Razorpay)
- **Wishlist** functionality
- **Product Reviews & Ratings**
- **Inventory Management**

### 📱 Additional Features
- **Image Upload** with cloud storage
- **Email Notifications** (order confirmations, password reset)
- **Search & Filtering** with advanced queries
- **Pagination** for large datasets

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **Redis** (for session storage)
- **Cloudinary account** (for image storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Apurv3027/vexa-e-commerce-backend.git
   cd vexa-ecommerce-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=http://localhost:3000

   # Database
   MONGODB_URI=mongodb://localhost:27017/vexa-ecommerce
   REDIS_URL=redis://localhost:6379

   # JWT Secrets
   JWT_SECRET=your-jwt-secret-key
   JWT_REFRESH_SECRET=your-refresh-token-secret
   JWT_EXPIRES_IN=1d
   JWT_REFRESH_EXPIRES_IN=7d

   # OAuth Configuration
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # SMS Service (Twilio)
   TWILIO_ACCOUNT_SID=your-twilio-account-sid
   TWILIO_AUTH_TOKEN=your-twilio-auth-token
   TWILIO_PHONE_NUMBER=your-twilio-phone

   # Email Service
   EMAIL_SERVICE=gmail
   EMAIL_USERNAME=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Payment Gateways
   STRIPE_SECRET_KEY=your-stripe-secret-key
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-secret
   ```

4. **Start the application**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 🔄 Authentication Flows

### Mobile OTP Flow
1. User requests OTP via phone number
2. System generates 6-digit OTP (valid for 10 minutes)
3. OTP sent via SMS using Twilio
4. User submits OTP for verification
5. System issues JWT tokens upon successful verification

### Google OAuth Flow
1. User clicks "Sign in with Google"
2. Redirect to Google OAuth consent screen
3. User grants permission
4. Google redirects with authorization code
5. Backend exchanges code for access token
6. Create or find user in database
7. Issue application-specific JWT tokens

## 🛒 E-Commerce Flow

1. **Product Browsing**: Users browse products with filters and search
2. **Cart Management**: Add/remove items from shopping cart
3. **Checkout Process**: Address selection, payment method, order review
4. **Payment Processing**: Secure payment via Stripe/Razorpay
5. **Order Confirmation**: Email/SMS confirmation with order details