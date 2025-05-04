# 🚴 Bi-Cycle Store Backend

## 📌 Overview
Bi-Cycle Store Backend is a robust backend application built with **Express.js and TypeScript**, integrating **MongoDB with Mongoose** to manage a bicycle store. The API implements user authentication and authorization with role-based access control for administrators and regular users. Now with integrated payment processing via SSLCommerz!

## 🌐 Live API Testing
Test the API endpoints using the deployed version:
```
https://bi-cicle-backend.vercel.app/
```

## 🛠️ Features
- ✅ **User Management** – Register, login, and manage user accounts
- ✅ **Authentication** – JWT-based authentication with access & refresh tokens
- ✅ **Role-Based Access Control** – Different permissions for admin and user roles
- ✅ **Product Management** – Add, view, update, and delete bicycles
- ✅ **Order Management** – Place, view, and manage orders
- ✅ **Analytics** – Comprehensive analytics including revenue, top products, and yearly trends
- ✅ **Payment Integration** – SSLCommerz payment gateway integration for secure checkout
- ✅ **Password Management** – Change, forget, and reset password functionality
- ✅ **Email Notifications** – Integration with Nodemailer for email alerts
- ✅ **Validation** – Request validation using Zod middleware

## 🎯 API Endpoints

### 🔹 Authentication
* **POST** `/api/auth/login` – User login
* **POST** `/api/auth/change-password` – Change user password (authenticated)
* **POST** `/api/auth/refresh-token` – Obtain new access token using refresh token
* **POST** `/api/auth/forget-password` – Request password reset
* **POST** `/api/auth/reset-password` – Reset password with token

### 🔹 Users
* **POST** `/api/users` – Create a new user
* **GET** `/api/users` – Get all users (admin only)
* **GET** `/api/users/me` – Get current user profile
* **GET** `/api/users/:id` – Get a specific user (admin only)
* **PATCH** `/api/users/me` – Update current user profile
* **PATCH** `/api/users/:id` – Update a user (admin only)
* **PATCH** `/api/users/:id/toggle-state` – Enable/disable a user (admin only)

### 🔹 Products
* **GET** `/api/products` – Get all products
* **POST** `/api/products` – Create a product (admin only)
* **GET** `/api/products/:productId` – Get a specific product
* **PATCH** `/api/products/:productId` – Update a product (admin only)
* **DELETE** `/api/products/:productId` – Delete a product (admin only)

### 🔹 Orders
* **GET** `/api/orders` – Get all orders (admin only)
* **GET** `/api/orders/my-orders` – Get orders for current user
* **GET** `/api/orders/:orderId` – Get a specific order
* **GET** `/api/orders/success/:tranId` – Get order by transaction ID
* **PATCH** `/api/orders/:orderId` – Update an order (admin only)
* **PATCH** `/api/orders/status/:orderId` – Update order status (admin only)
* **DELETE** `/api/orders/:orderId` – Delete an order (admin only)
* **POST** `/api/orders/checkout` – Process checkout and payment

### 🔹 Analytics
* **GET** `/api/analytics/analyze-orders` – Get order analytics (admin only)
* **GET** `/api/analytics/over-year-analytics` – Get 12-month analytics data (admin only)
* **GET** `/api/analytics/top-selling-products` – Get top 10 selling products (admin only)

## Prerequisites

Before running this project, make sure you have the following installed:
- Node.js (v14 or higher)
- npm (Node Package Manager)
- MongoDB (local installation or MongoDB Atlas account)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/junayet4o12/bi-cicle-backend.git
cd bi-cicle-backend
```

2. Install dependencies:
```bash
npm install
```

3. Environment Setup

Create a `.env` file in the root directory with the following variables:
```env
NODE_ENV=development
PORT=5000
DB_URL=your_mongodb_connection_string
BCRYPT_SALT_ROUNDS=12
DEFAULT_PASS=your_default_password
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=365d
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
SUPER_ADMIN_DEFAULT_PASS=your_admin_default_password
SSL_STORE_ID=your_sslcommerz_store_id
SSL_SECRET_KEY=your_sslcommerz_secret_key
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```

## Available Scripts

- **Development Mode**:
```bash
npm run start:dev
```
Runs the application in development mode with hot-reload using ts-node-dev.

- **Production Build**:
```bash
npm run build
```
Compiles TypeScript code to JavaScript in the `dist` directory.

- **Production Mode**:
```bash
npm run start:prod
```
Runs the compiled application from the `dist` directory.

- **Linting**:
```bash
npm run lint       # Check for linting issues
npm run lint:fix   # Fix automatic linting issues
```

## Project Structure

```
bi-cycle-store-backend/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   ├── interfaces/
│   ├── middlewares/
│   │   ├── auth.ts
│   │   └── validateRequest.ts
│   ├── modules/
│   │   ├── analytics/
│   │   ├── auth/
│   │   ├── order/
│   │   ├── product/
│   │   └── user/
│   └── routes/
├── dist/
├── .env
├── .eslintrc
├── package.json
├── tsconfig.json
└── README.md
```

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT (Authentication)
- bcrypt (Password hashing)
- Zod (Schema validation)
- Nodemailer (Email services)
- SSLCommerz (Payment gateway)
- ESLint (Code linting)
- Cookie Parser
- CORS

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Request validation with Zod
- Password reset flow with email notifications
- Secure payment processing

## Security Note

For security reasons, it's recommended to:
- Never commit the `.env` file to version control
- Use environment-specific configuration for different deployment environments
- Regularly update dependencies to patch security vulnerabilities
- Use strong, unique secrets for JWT tokens
- Implement rate limiting for authentication endpoints

## Payment Integration

The project integrates SSLCommerz payment gateway for handling online payments. The checkout process is streamlined with:
- Secure payment processing
- Transaction verification
- Order status tracking
- Success/failure handling

## Analytics Features

The backend provides comprehensive analytics capabilities:
- Order analysis with metrics on sales and revenue
- 12-month historical data on users, orders, and revenue
- Top-selling products identification
- Data visualization support

## Development

For local development:
1. Ensure MongoDB is running locally or you have access to a MongoDB Atlas cluster
2. Configure your `.env` file with appropriate values
3. Run `npm run start:dev` to start the development server
4. The API will be available at `http://localhost:5000`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request