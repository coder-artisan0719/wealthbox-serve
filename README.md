# Wealthbox Backend
## Overview
The Wealthbox backend is a Node.js application that provides API services for the Wealthbox frontend. It handles organization management, user authentication, Wealthbox user management and integration with the Wealthbox CRM system.

## Technology Stack
- Runtime : Node.js
- Framework : Express.js
- Database : PostgreSQL
- ORM : Prisma
- Authentication : JWT (JSON Web Tokens)
## Project Structure
```plaintext
backend/
├── prisma/
│   ├── schema.prisma    # Prisma schema definition
│   └── migrations/      # Database migrations
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── index.ts        # Server entry point
└── package.json         # Dependencies and scripts
 ```

## Setup and Installation
### Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn
### Installation Steps
1. Clone the repository
2. Install dependencies:
   ```plaintext
   npm install
    ```
3. Create a .env file with the following variables:
   ```plaintext
   NODE_ENV=development
   PORT=5000
   DATABASE_URL="postgresql://neondb_owner:npg_vRsVp2Sm8liu@ep-blue-king-a5macpb1.us-east-2.aws.neon.tech/wealthbox?schema=neondb_owner"
   JWT_SECRET="9e4f6d75f3a24f8e88a1cb5f5b9f1d02b3e7d8470e104c859c2ed9bd9278b5c1"
   ```
4. Run database migrations:
   ```plaintext
   npx prisma migrate dev
    ```
5. Start the development server:
   ```plaintext
   npm run dev
    ```

## Security
- All passwords are hashed using bcrypt
- API endpoints are protected with JWT authentication
- Input validation is performed on all requests
- CORS is configured to allow only the frontend domain