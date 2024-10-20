# NoteNest Test Summary

This document provides an overview of the test suites in the NoteNest application and what they are testing.

## 1. AuthService Tests (`auth.service.spec.ts`)

These tests cover the authentication service functionality:

- User registration
  - Successful registration of a new user
  - Error handling when trying to register an existing user
- User login
  - Successful login with correct credentials
  - Handling non-existent users
  - Error handling for incorrect passwords
- (Placeholder for additional tests on logout, token refresh, and profile updates)

## 2. AuthController Tests (`auth.controller.spec.ts`)

These tests cover the authentication controller endpoints:

- Login endpoint
- Registration endpoint
- Logout endpoint
- Token refresh endpoint
- Username update endpoint
- Password update endpoint
- Profile update endpoint

## 3. JournalsService Tests (`journals.service.spec.ts`)

These tests cover the journal entry service functionality:

- Creating journal entries
  - Successful creation
  - Error handling for missing required fields
- Updating journal entries
  - Successful update
  - Error handling for non-existent entries
- Retrieving journal entries
  - Getting all entries with pagination and category counts
  - Getting a specific entry
  - Error handling for non-existent entries
- Deleting journal entries
  - Successful deletion
  - Error handling for non-existent entries

## 4. JournalsController Tests (`journals.controller.spec.ts`)

These tests cover the journal entry controller endpoints:

- Create journal entry endpoint
- Update journal entry endpoint
- Get all journal entries endpoint (with pagination and filters)
- Get specific journal entry endpoint
- Delete journal entry endpoint

## 5. AppController Tests (`app.controller.spec.ts`)

These tests cover the main application controller:

- Root endpoint test (typically a health check or welcome message)

## 6. General Auth Tests (`auth.spec.ts`)

This file contains general authentication-related tests:

- (Placeholder for additional authentication tests)

## Test Coverage

These test suites provide coverage for:

1. User authentication flows (register, login, logout, token refresh)
2. User profile management (username and password updates)
3. CRUD operations for journal entries
4. Pagination and filtering of journal entries
5. Error handling and edge cases

The tests use mocking to isolate the units being tested and avoid dependencies on external services like the database.

To run the tests, use the command:

```
npm run test
```

To see test coverage, use:

```
npm run test:cov
```

Remember to keep these tests updated as you add new features or modify existing functionality in the NoteNest application.
