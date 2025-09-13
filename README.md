**JWT_API** is a standalone Authentication API built using **Node.js, Express.js**, and **MySQL**. It is designed to provide robust and secure user authentication services.

Key features of this API include:

* **User Management:** Secure `signup` and `login` functionalities.
* **Session Security:** Token revocation (`logout`) to invalidate JWTs and secure user sessions.
* **Protected Resources:** A `/profile` endpoint that requires a valid JWT for access.
* **Password Security:** Passwords are never stored in plain text; they are securely hashed using **bcrypt**.

The project structure is modular, making it easy to maintain and scale. It includes separate directories for controllers, middleware, and routes to ensure a clean separation of concerns.

---

## 🚀 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need the following software installed on your machine:

* **Node.js** (LTS version recommended)
* **MySQL**

### Installation

Follow these steps to set up the project locally:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/yourusername/JWT_API.git](https://github.com/yourusername/JWT_API.git)
    cd JWT_API
    ```

2.  **Install NPM packages:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Copy the example environment file and update it with your MySQL credentials and a strong JWT secret. **Do not commit your real `.env` file.**
    ```bash
    cp .env.example .env
    ```

    _**.env.example**_
    ```bash
    # Database Configuration
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_password
    DB_DATABASE=lab_auth

    # JWT Configuration
    JWT_SECRET=your_super_secret_jwt_key
    JWT_EXPIRES_IN=1h

    # Server Port
    PORT=3000
    ```

4.  **Create the MySQL database and tables:**
    Connect to your MySQL server and execute the following SQL script to set up the required schema:
    ```sql
    CREATE DATABASE lab_auth;

    USE lab_auth;

    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        role VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE revoked_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        jti VARCHAR(255) UNIQUE NOT NULL,
        expires_at DATETIME NOT NULL
    );
    ```

### Running the Server

* **Development mode:**
    ```bash
    npm run dev
    ```
* **Production mode:**
    ```bash
    npm start
    ```

---

## 🔗 API Endpoints

The API base URL is `http://localhost:3000/api`.

### Health Check

* `GET /api/health`
    * **Description:** Checks the API and database connection status.
    * **Response:**
        ```json
        { "status": "ok", "db": "connected" }
        ```

### Authentication

| Method | Endpoint | Description | Request Body (JSON) |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Registers a new user. | `{ "email": "...", "password": "...", "full_name": "...", "role": "..." }` |
| `POST` | `/api/auth/login` | Authenticates a user and returns a JWT. | `{ "email": "...", "password": "..." }` |
| `POST` | `/api/auth/logout` | Invalidates the current user's JWT. | **Header:** `Authorization: Bearer <token>` |

### Protected Route

* `GET /api/profile`
    * **Description:** Retrieves the profile of the authenticated user.
    * **Authorization:** Requires a valid JWT in the `Authorization` header.
    * **Header:** `Authorization: Bearer <token>`