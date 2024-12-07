
# Corvisquire - A Robust and Comprehensive Authentication Service for Secure User Access Management

Corvisquire is a secure and efficient authentication server built to handle user authentication workflows. It provides developers with an easy-to-integrate solution for managing user registration, login, password recovery, and email verification, using email/password authentication and JSON Web Tokens (JWT).

## Features

- 🔐 Secure email/password authentication
- 🎫 JWT-based session management
- ✉️ Email verification system
- 🔑 Password recovery workflow
- 🛡️ Rate limiting and brute force protection
- 📝 User profile management
- 🔄 Token refresh mechanism
- 📱 2FA (Two-Factor Authentication) support
- 🔍 Audit logging
- 🌐 CORS configuration

## Quick Start

### Default URL
```
https://corvisquire-nu.vercel.app/
```

## API Documentation

### Authentication Endpoints

#### 1. User Login
- **Endpoint:** `POST /api/auth/login`
- **Description:** Authenticates a user using email and password
- **Request Body:**
  ```json
  {
    "email": "example@example.com",
    "password": "password"
  }
  ```
- **Response:**
  ```json
  {
    "token": "jwt-token",
    "user": {
      "id": "user-id",
      "email": "example@example.com",
      "username": "example"
    }
  }
  ```

#### 2. User Registration
- **Endpoint:** `POST /api/auth/register`
- **Description:** Registers a new user
- **Request Body:**
  ```json
  {
    "username": "example",
    "email": "example@example.com",
    "password": "password"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Registration successful",
    "user": {
      "id": "user-id",
      "email": "example@example.com",
      "username": "example"
    }
  }
  ```

#### 3. Forgot Password
- **Endpoint:** `POST /api/auth/forgot-password`
- **Description:** Sends a password recovery email
- **Request Body:**
  ```json
  {
    "email": "example@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Recovery email sent successfully"
  }
  ```

#### 4. Reset Password
- **Endpoint:** `POST /api/auth/reset-password`
- **Description:** Resets user password using recovery token
- **Request Body:**
  ```json
  {
    "token": "recovery-token",
    "newPassword": "new-password"
  }
  ```

#### 5. Verify Email
- **Endpoint:** `POST /api/auth/verify-email`
- **Description:** Verifies user email address
- **Request Body:**
  ```json
  {
    "token": "verification-token"
  }
  ```

#### 6. Refresh Token
- **Endpoint:** `POST /api/auth/refresh`
- **Description:** Refreshes JWT access token
- **Request Body:**
  ```json
  {
    "refreshToken": "refresh-token"
  }
  ```

### User Management Endpoints

#### 1. Get User Profile
- **Endpoint:** `GET /api/users/profile`
- **Description:** Retrieves authenticated user's profile
- **Headers:** `Authorization: Bearer <token>`

#### 2. Update User Profile
- **Endpoint:** `PUT /api/users/profile`
- **Description:** Updates user profile information
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "username": "new-username",
    "bio": "User bio",
    "avatar": "avatar-url"
  }
  ```

## Security Features

### Rate Limiting
- Login attempts: 5 per minute
- Password reset requests: 3 per hour
- Email verification: 3 per hour

### JWT Configuration
- Access token expiry: 15 minutes
- Refresh token expiry: 7 days
- Signed using RS256 algorithm

## Error Handling

All API endpoints return standard error responses:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

Common error codes:
- `AUTH001`: Invalid credentials
- `AUTH002`: Account locked
- `AUTH003`: Email not verified
- `AUTH004`: Invalid token
- `AUTH005`: Token expired

## Development

### Prerequisites
- Node.js 16+
- PostgreSQL 13+
- Redis (for rate limiting)

### Local Setup
```bash
# Clone repository
git clone https://github.com/your-org/corvisquire.git

# Install dependencies
cd corvisquire
npm install

# Set up environment variables
cp .env.example .env

# Run migrations
npm run migrate

# Start development server
npm run dev
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📚 [Documentation](https://docs.corvisquire.dev)
- 📧 [Email](support@corvisquire.dev)

## Extra