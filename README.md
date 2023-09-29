# Express Mongoose Authentication and Authorization RESTful API.

A boilerplate for quickly setting up a Node.js application using Express, Mongoose, and a custom error handling API.

## Table of Contents
- [API Routes Documentation](#API)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)


## API Routes Documentation

### Unauthenticated Routes

#### User Registration

- **Route**: POST `/api/auth/register`
- **Description**: Register a new user.
- **Controller**: `handleRegister`

#### User Login

- **Route**: POST `/api/auth/login`
- **Description**: Authenticate a user and issue an access token.
- **Controller**: `handleLogin`

#### Email Verification

- **Route**: GET `/api/auth/verify/:token`
- **Description**: Verify a user's email address using a verification token.
- **Controller**: `handleEmailVerification`

#### Resend Email Verification

- **Route**: PATCH `/api/auth/resend-email-verification`
- **Description**: Resend the email verification link to a user.
- **Controller**: `handleResendEmailVerification`

#### Password Reset Request

- **Route**: POST `/api/auth/reset-password`
- **Description**: Request a password reset for a user.
- **Controller**: `handlePasswordResetRequest`

#### Password Reset

- **Route**: POST `/api/auth/reset-password/:token`
- **Description**: Reset a user's password using a reset token.
- **Controller**: `handlePasswordReset`

### Authenticated Routes
These routes require authentication via an access token obtained during login.

#### Upload Profile Picture

- **Route**: PATCH `/api/auth/change-avatar`
- **Description**: Upload a new profile picture for the authenticated user.
- **Controller**: `handleUploadProfilePic`

#### Get User Profile

- **Route**: GET `/api/auth/profile`
- **Description**: Retrieve the profile information of the authenticated user.
- **Controller**: `handleGetProfile`

#### Update User Profile

- **Route**: PATCH `/api/auth/profile`
- **Description**: Update the profile information of the authenticated user.
- **Controller**: `handleUpdateProfile`

#### Change Password

- **Route**: POST `/api/auth/change-password`
- **Description**: Change the password of the authenticated user.
- **Controller**: `handleChangePassword`

#### Token Refresh

- **Route**: GET `/api/auth/refresh-token`
- **Description**: Refresh the access token for the authenticated user.
- **Controller**: `handleTokenRefresh`



## Features

- Express.js for building RESTful APIs.
- Mongoose for MongoDB database interaction.
- Custom Error Handling middleware for consistent error responses.
- Basic project structure to kickstart your Node.js project.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your machine.
- MongoDB server up and running (locally or on a remote server).

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/express-mongoose-custom-error-api-boilerplate.git
```

2. Change into the project directory:

```bash
cd npm-express-boilerplate
```

3. Install the dependencies:

```bash
npm install
```
  
## Usage

1. Copy .env.example to .env.
2. Add connection string to .env in MONGO_URI.
3. Start the server:

```bash
npm start
```
4. Your Express application will be running at `http://localhost:3000` by default.
5. Begin building your API `routes` and `models` in the routes and models directories.

## Contributing
Contributions are welcome! If you have any improvements or feature suggestions, please open an issue or submit a pull request.

## Liscense
This project is licensed under the MIT License - see the [LICENSE]() file for details.
