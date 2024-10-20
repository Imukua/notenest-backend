# Journal Entry Application

This is a NestJS-based backend application for managing personal journal entries. It provides user authentication and CRUD operations for journal entries.

## Key Components

1. **Authentication System**
   - Uses JWT (JSON Web Token) for authentication
   - Implements both access and refresh token strategies
   - Supports user registration, login, logout, and token refresh

2. **User Management**
   - Allows users to update their username and password
   - Stores user data securely with hashed passwords

3. **Journal Entries**
   - Users can create, read, update, and delete their journal entries
   - Entries include title, content, category, and date
   - Supports pagination, search, and filtering by category and date range

4. **Database**
   - Uses PostgreSQL with Prisma ORM
   - Schema includes User, JournalEntry, and RefreshToken models

## Routing and Controllers

### Auth Controller (/auth)
- POST /login: Authenticate user and return tokens
- POST /register: Create a new user account
- POST /logout: Invalidate refresh tokens
- POST /refresh: Get a new access token using a refresh token
- PATCH /username: Update user's username
- PATCH /password: Update user's password
- PATCH /profile: Update user's profile information

### Journals Controller (/journals)
- POST /create: Create a new journal entry
- PATCH /:id: Update an existing journal entry
- GET /: Retrieve all journal entries (with pagination and filtering)
- GET /:id: Retrieve a specific journal entry
- DELETE /:id: Delete a journal entry

## Authentication Details

1. **JWT Strategy**
   - Used for protecting routes that require authentication
   - Extracts JWT from the Authorization header as a Bearer token
   - Validates token using `JWT_ACCESS_TOKEN_SECRET`
   - Expiration time: 15 minutes

2. **JWT Refresh Strategy**
   - Used for refreshing access tokens
   - Validates refresh tokens stored in the database
   - Expiration time: 7 days

3. **Local Strategy**
   - Used for initial user authentication (login)
   - Validates username and password against the database

4. **Guards**
   - JwtAuthGuard: Protects routes requiring a valid access token
   - JwtRefreshGuard: Protects the refresh token endpoint
   - LocalGuard: Used for the login endpoint

## Security Features

- Password hashing using bcrypt (10 salt rounds)
- JWT token expiration and refresh mechanism
- CORS configuration for allowed origins (configurable via environment variables)
- Automatic deletion of expired refresh tokens

## Database Schema

1. **User**
   - id: UUID (primary key)
   - username: String (unique)
   - passwordHash: String
   - createdAt: DateTime

2. **JournalEntry**
   - id: UUID (primary key)
   - title: String
   - content: String
   - category: String
   - date: DateTime
   - userId: UUID (foreign key to User)

3. **RefreshToken**
   - id: UUID (primary key)
   - token: String
   - expiry: DateTime
   - userId: UUID (foreign key to User)

## API Error Handling

- Custom HTTP exceptions for various error scenarios
- Proper error messages and status codes for client-side handling

## Deployment

- Configured for deployment on Vercel
- Environment variables for database connection and JWT secrets
- Vercel-specific configuration in vercel.json for routing and CORS headers

## Technical Stack

- NestJS framework
- PostgreSQL database
- Prisma ORM
- Passport.js for authentication strategies
- JWT for token-based authentication
- bcrypt for password hashing

## Key Features

- Secure user authentication and authorization with JWT
- Efficient journal entry management with advanced querying capabilities
- Scalable architecture suitable for cloud deployment
- Comprehensive API for user and journal entry management
