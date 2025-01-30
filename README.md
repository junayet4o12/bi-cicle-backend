# 🚴 Bi-Cycle Store Backend

## 📌 Overview
Bi-Cycle Store Backend is a backend application built with **Express.js and TypeScript**, integrating **MongoDB with Mongoose** to manage a bicycle store. The API allows users to perform CRUD operations on **bicycles** and **orders**, ensuring data integrity with Mongoose schema validation.

## 🌐 Live API Testing
Test the API endpoints using the deployed version:
```
https://bi-cicle-backend.vercel.app/
```
## 🛠️ Features
- ✅ **Product Management** – Add, view, update, and delete bicycles
- ✅ **Order Management** – Place orders and update inventory automatically
- ✅ **Search & Filter** – Retrieve bicycles based on name, brand, or type
- ✅ **Revenue Calculation** – Compute total revenue from all orders
- ✅ **Error Handling** – Standardized error responses for validation and resource handling

## 🎯 API Endpoints

### 🔹 Bicycles
* **POST** `/api/products` – Create a bicycle
* **GET** `/api/products` – Get all bicycles (search & filter supported)
* **GET** `/api/products/:productId` – Get a specific bicycle
* **PUT** `/api/products/:productId` – Update a bicycle
* **DELETE** `/api/products/:productId` – Delete a bicycle

### 🔹 Orders
* **POST** `/api/orders` – Place an order & update stock
* **GET** `/api/orders/revenue` – Calculate total revenue

## Prerequisites

Before running this project, make sure you have the following installed:
- Node.js (v14 or higher)
- npm (Node Package Manager)
- MongoDB (local installation or MongoDB Atlas account)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/junayet4o12/bi-cicle-backend
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
│   └── server.ts
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
- Zod (Schema validation)
- bcrypt (Password hashing)
- ESLint (Code linting)

## Security Note

For security reasons, it's recommended to:
- Never commit the `.env` file to version control
- Use environment-specific configuration for different deployment environments
- Regularly update dependencies to patch security vulnerabilities

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