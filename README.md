# Express Mongoose Authentication and Authorization RESTful API.

A boilerplate for quickly setting up a Node.js application using Express, Mongoose, and a custom error handling API.

## Table of Contents
- [API Routes Documentation](#documentation)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)



## Documentation

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

### Profile Management Routes
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


### Role Routes Management

#### 1. Get All Roles

- **Endpoint:** `GET /`
- **Description:** Get a list of all user roles in the system.
- **Request Parameters:** None
- **Response:**
  - **Status Code:** 200 (OK)
  - **Response Body:**
    ```json
    [
      {
        "_id": "role_id",
        "name": "Role Name",
        "description": "Role Description"
      },
      // Additional role objects...
    ]
    ```

#### 2. Get Role by ID

- **Endpoint:** `GET /:id`
- **Description:** Get details of a specific user role by its ID.
- **Request Parameters:**
  - `id` (String): The ID of the role to retrieve.
- **Response:**
  - **Status Code:** 200 (OK)
  - **Response Body:**
    ```json
    {
      "_id": "role_id",
      "name": "Role Name",
      "description": "Role Description"
    }
    ```

#### 3. Create New Role

- **Endpoint:** `POST /`
- **Description:** Create a new user role in the system.
- **Request Body:**
  - `name` (String, required): The name of the new role.
  - `description` (String): A description of the new role (optional).
- **Response:**
  - **Status Code:** 201 (Created)
  - **Response Body:**
    ```json
    {
      "_id": "new_role_id",
      "name": "New Role Name",
      "description": "New Role Description"
    }
    ```

#### 4. Update Role by ID

- **Endpoint:** `PATCH /:id`
- **Description:** Update an existing user role by its ID.
- **Request Parameters:**
  - `id` (String): The ID of the role to update.
- **Request Body:**
  - `name` (String): The updated name of the role (optional).
  - `description` (String): The updated description of the role (optional).
- **Response:**
  - **Status Code:** 200 (OK)
  - **Response Body:**
    ```json
    {
      "_id": "role_id",
      "name": "Updated Role Name",
      "description": "Updated Role Description"
    }
    ```

#### 5. Delete Role by ID

- **Endpoint:** `DELETE /:id`
- **Description:** Delete an existing user role by its ID.
- **Request Parameters:**
  - `id` (String): The ID of the role to delete.
- **Response:**
  - **Status Code:** 204 (No Content)

### Error Responses

- **Status Code:** 401 (Unauthorized)
  - **Response Body:**
    ```json
    {
      "error": "Unauthorized",
      "message": "Only administrators are allowed to access this endpoint."
    }
    ```
- **Status Code:** 404 (Not Found)
  - **Response Body:**
    ```json
    {
      "error": "Not Found",
      "message": "Role with ID 'role_id' not found."
    }
    ```
- **Status Code:** 422 (Unprocessable Entity)
  - **Response Body:**
    ```json
    {
      "error": "Unprocessable Entity",
      "message": "Validation failed. Please provide a valid name for the role."
    }
    ```

---

Please note that this is a basic template for API documentation. You should customize it to match your specific requirements and provide more details as needed, such as examples of request and response payloads, additional error scenarios, and any specific usage instructions.

## Features

- Express.js for building RESTful APIs.
- Mongoose for MongoDB database interaction.
- Custom Error Handling middleware for consistent error responses.
- Basic project structure to kickstart your Node.js project.
- Password Validation for Strong Password.
- Change Password.
- Update Profile.
- Update Avatar.
- Email Verification.
- Reset Password.
- CRUD Operation for Users.
- CRUD Operation for Roles.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your machine.
- MongoDB server up and running (locally or on a remote server).

## Installation

1. Clone the repository:

```bash
git clone https://github.com/bistaalish/node-auth-rbac.git
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
