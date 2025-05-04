# Bi-Cycle Store Backend

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-v14+-green)
![Express](https://img.shields.io/badge/express-4.21.2-lightgrey)
![TypeScript](https://img.shields.io/badge/typescript-5.7.3-blue)
![MongoDB](https://img.shields.io/badge/mongodb-8.9.5-green)

A robust, feature-rich REST API for bicycle store management built with Express.js, TypeScript, and MongoDB. Includes JWT authentication, SSLCommerz payment integration, and comprehensive analytics.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Live API](#live-api)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Development](#development)
- [Security Implementation](#security-implementation)
- [Production Deployment](#production-deployment)
- [Contributing](#contributing)

## Overview

Bi-Cycle Store Backend provides a comprehensive API solution for bicycle e-commerce operations. The system supports inventory management, order processing with integrated payments, user authentication with role-based access control, and business analytics.

## Key Features

- **Authentication & Authorization**
  - JWT-based authentication with access & refresh tokens
  - Role-based access control (Admin/User)
  - Secure password management with hashing
  - Password reset flow with email verification

- **E-Commerce Operations**
  - Product catalog management
  - Order processing and tracking
  - User account management
  - Shopping cart functionality

- **Payment Processing**
  - SSLCommerz payment gateway integration
  - Transaction verification and processing
  - Order status management

- **Business Intelligence**
  - Revenue analytics and reporting
  - Sales trend visualization
  - Top product analysis
  - Customer insights and metrics

- **Security**
  - Data validation with Zod
  - Encrypted credentials and sensitive data
  - Protected routes with middleware
  - CORS implementation

## Live API

Test the API endpoints using the deployed version:
```
https://bi-cicle-backend.vercel.app/
```

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/auth/login` | Authenticate user | Public |
| `POST` | `/api/auth/change-password` | Update password | Authenticated |
| `POST` | `/api/auth/refresh-token` | Refresh access token | Public |
| `POST` | `/api/auth/forget-password` | Request password reset | Public |
| `POST` | `/api/auth/reset-password` | Complete password reset | Public |

### User Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/users` | Register new user | Public |
| `GET` | `/api/users` | List all users | Admin |
| `GET` | `/api/users/me` | Get current user profile | Authenticated |
| `GET` | `/api/users/:id` | Get specific user | Admin |
| `PATCH` | `/api/users/me` | Update profile | Authenticated |
| `PATCH` | `/api/users/:id` | Update user | Admin |
| `PATCH` | `/api/users/:id/toggle-state` | Enable/disable user | Admin |

### Product Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/products` | List all products | Public |
| `POST` | `/api/products` | Create product | Admin |
| `GET` | `/api/products/:productId` | Get product details | Public |
| `PATCH` | `/api/products/:productId` | Update product | Admin |
| `DELETE` | `/api/products/:productId` | Remove product | Admin |

### Order Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/orders` | List all orders | Admin |
| `GET` | `/api/orders/my-orders` | Get user orders | Authenticated |
| `GET` | `/api/orders/:orderId` | Get order details | Authenticated |
| `GET` | `/api/orders/success/:tranId` | Get by transaction ID | Authenticated |
| `PATCH` | `/api/orders/:orderId` | Update order | Admin |
| `PATCH` | `/api/orders/status/:orderId` | Update status | Admin |
| `DELETE` | `/api/orders/:orderId` | Remove order | Admin |
| `POST` | `/api/orders/checkout` | Process payment | Authenticated |

### Analytics Dashboard

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/analytics/analyze-orders` | Order metrics | Admin |
| `GET` | `/api/analytics/over-year-analytics` | 12-month trends | Admin |
| `GET` | `/api/analytics/top-selling-products` | Top products | Admin |

## Architecture

```
├── src/
│   ├── app.ts                 # Express application setup
│   ├── server.ts              # Server initialization
│   ├── config/                # Application configuration
│   ├── interfaces/            # TypeScript interfaces
│   ├── middlewares/           # Express middlewares
│   │   ├── auth.ts            # Authentication middleware
│   │   └── validateRequest.ts # Request validation
│   ├── modules/               # Feature modules
│   │   ├── analytics/         # Business intelligence
│   │   ├── auth/              # Authentication
│   │   ├── order/             # Order management
│   │   ├── product/           # Product catalog
│   │   └── user/              # User management
│   └── routes/                # API routes
└── dist/                      # Compiled JavaScript
```

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Security**: bcrypt
- **Email Service**: Nodemailer
- **Payment Gateway**: SSLCommerz
- **Development Tools**: ESLint, ts-node-dev

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/junayet4o12/bi-cicle-backend.git
   cd bi-cicle-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see [Configuration](#configuration))

4. Start development server:
   ```bash
   npm run start:dev
   ```

## Configuration

Create a `.env` file in the project root with the following variables:

```env
# Application
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

# Database
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/database

# Authentication
BCRYPT_SALT_ROUNDS=12
DEFAULT_PASS=your_default_password
SUPER_ADMIN_DEFAULT_PASS=your_admin_password
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=365d

# Cloud Storage
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET=your_cloudinary_secret

# Payment Gateway
SSL_STORE_ID=your_sslcommerz_store_id
SSL_SECRET_KEY=your_sslcommerz_secret_key
```

## Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run start:prod` | Run production server from compiled files |
| `npm run lint` | Check code for linting issues |
| `npm run lint:fix` | Automatically fix linting issues |

### Code Style

The project uses ESLint with TypeScript-specific rules to ensure code quality and consistency. Configure your editor to use the project's ESLint configuration for the best development experience.

## Security Implementation

- **Authentication**: JWT tokens with short-lived access tokens and long-lived refresh tokens
- **Password Security**: Bcrypt hashing with salt rounds
- **Input Validation**: Zod schema validation before processing
- **Authorization**: Role-based middleware for route protection
- **Payment Security**: SSLCommerz secure gateway integration

### Best Practices

- Store environment variables securely
- Use HTTPS in production
- Implement rate limiting on authentication endpoints
- Regularly update dependencies
- Validate and sanitize all user inputs

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set environment variables for production

3. Start the production server:
   ```bash
   npm run start:prod
   ```

The application is optimized for deployment on Vercel, but can be deployed to any Node.js hosting service.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

© 2025 Bi-Cycle Store Backend | Licensed under MIT