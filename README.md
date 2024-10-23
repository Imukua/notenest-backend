# NoteNest

NoteNest is a powerful and intuitive note-taking application built with NestJS and PostgreSQL. It allows users to create, manage, and organize their notes efficiently. This README provides a comprehensive guide on how to set up, run, and use the application.

## Live Links

- Frontend: [https://notenestd.vercel.app/](https://notenestd.vercel.app/)
- Backend API Documentation: [https://notenest-backend-dev.vercel.app/api-docs#/](https://notenest-backend-dev.vercel.app/api-docs#/)

These links provide access to the live version of NoteNest. The frontend link allows you to interact with the application directly, while the backend API documentation link provides detailed information about the available endpoints and how to use them.

## Features

- User authentication (register, login, logout)
- Create, read, update, and delete journal entries
- Categorize journal entries
- Search and filter journal entries
- Pagination for journal entries
- User profile management

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (version 14.x or later)
- npm (usually comes with Node.js)
- Git
- Docker and Docker Compose

## Detailed Setup and Running Instructions

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/notenest.git
   cd notenest
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy the example environment file:
     ```
     cp .env.example .env
     ```
   - Open the `.env` file and update the following variables:
     ```
     DATABASE_URL="postgresql://mukua:password@localhost:5432/notenestdb"
     JWT_REFRESH_TOKEN_SECRET="your_refresh_token_secret"
     JWT_ACCESS_TOKEN_SECRET="your_access_token_secret"
     CORS_ORIGIN="http://localhost:3000,https://notenestd.vercel.app,https://notenest-afz0kf469-imukuas-projects.vercel.app,https://notenest-git-main-imukuas-projects.vercel.app,https://*.vercel.app"
     ```
     Replace `your_refresh_token_secret` and `your_access_token_secret` with your own secure secrets.

4. Set up Docker environment:
   ```
   cd docker
   cp .env.example .env
   ```
   The `.env` file in the `docker` directory should contain:
   ```
   POSTGRES_PASSWORD=password
   POSTGRES_USER=mukua
   POSTGRES_DB=notenestdb
   ```

5. Start the PostgreSQL database using Docker:
   ```
   docker-compose up -d
   ```
   This command starts both the PostgreSQL database and Adminer (a database management tool).

6. Run database migrations:
   ```
   cd ..  # Return to the root directory
   npx prisma migrate dev
   ```

7. Start the development server:
   ```
   npm run start:dev
   ```

The NoteNest application should now be running on `http://localhost:3000`.

## Using NoteNest

1. Register a new user account using the `/auth/register` endpoint.
2. Log in with your credentials using the `/auth/login` endpoint.
3. Use the returned JWT token for authentication in subsequent requests.
4. Create, read, update, and delete journal entries using the respective endpoints.
5. Use query parameters for searching, filtering, and paginating journal entries.

## Accessing the Database

You can access the PostgreSQL database using Adminer:
- Open `http://localhost:8080` in your browser
- Use the following credentials:
  - System: PostgreSQL
  - Server: db
  - Username: mukua
  - Password: password
  - Database: notenestdb

## Troubleshooting

If you encounter any issues:

1. Ensure all dependencies are installed correctly (`npm install`).
2. Verify that your `.env` files (both in the root and `docker` directory) are set up with the correct variables.
3. Make sure Docker is running and the database container is up (`docker ps`).
4. Check the console for any error messages.
5. Ensure the database migrations have run successfully.

If problems persist, please open an issue on the GitHub repository.

## API Documentation

NoteNest provides interactive API documentation using Swagger UI. To access the documentation:

1. Start the application
2. Open your browser and navigate to `http://localhost:3000`
3. You will see the Swagger UI interface with all available endpoints
4. You can try out the API directly from this interface

The Swagger UI provides detailed information about each endpoint, including:
- Required parameters
- Request body schemas
- Response schemas
- Authentication requirements

This makes it easy to understand and interact with the NoteNest API.

## Contributing

Please read the CONTRIBUTING.md file (if available) for details on our code of conduct and the process for submitting pull requests.

## License

This project's license information is not provided in the given files. Consider adding a LICENSE.md file to your project.


