# E-Commerce Project

## Overview
This project is a backend implementation for an e-commerce platform, designed to manage products, users, and authentication functionalities. The application allows for seamless product management, user registration, login, and cart management. It is built using modern backend technologies and provides APIs for integration with a frontend application.

## Features

### 1. Product Management
- **Add Products:** Allows admin users to add new products to the catalog with attributes such as name, image, category, new price, and old price.
- **View Products:** Fetches all products from the database.
- **Delete Products:** Enables the removal of products from the catalog.

### 2. User Authentication
- **Sign Up:** New users can register with their email, username, and password.
- **Login:** Existing users can log in using their credentials.
- **JWT Authentication:** Ensures secure API access by issuing JSON Web Tokens (JWT) upon successful login.

### 3. File Uploads
- Supports image uploads for products using `multer`.
- Stores uploaded images in a local directory and serves them as static assets.

### 4. Cart Management
- Initializes a default cart for each user, tracking the quantity of up to 300 products.

## Technologies Used

### Backend Technologies
- **Node.js:** Runtime environment for executing JavaScript code.
- **Express.js:** Web framework for building RESTful APIs.
- **Mongoose:** ODM (Object Data Modeling) library for MongoDB.
- **MongoDB:** NoSQL database for storing product and user data.
- **JWT:** Secure user authentication.
- **Multer:** Middleware for handling file uploads.

### Development Tools
- **dotenv:** Manages environment variables.
- **Cors:** Enables Cross-Origin Resource Sharing.

## APIs

### Product APIs
1. **Add Product**
   - **Endpoint:** `POST /addproduct`
   - **Description:** Adds a new product to the database.

2. **View All Products**
   - **Endpoint:** `GET /allproducts`
   - **Description:** Fetches all products from the database.

3. **Delete Product**
   - **Endpoint:** `POST /removeproduct`
   - **Description:** Deletes a product by ID.

### User APIs
1. **Sign Up**
   - **Endpoint:** `POST /signup`
   - **Description:** Registers a new user.

2. **Login**
   - **Endpoint:** `POST /login`
   - **Description:** Authenticates a user and returns a JWT.

### Image Upload API
1. **Upload Image**
   - **Endpoint:** `POST /upload`
   - **Description:** Uploads a product image and returns the image URL.

## Installation and Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/
   JWT_SECRET=your_secret_key
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. The server will run on `http://localhost:5000`.

## Folder Structure
```
project/
├── upload/                # Directory for storing uploaded images
├── models/                # MongoDB models
├── routes/                # API routes
├── .env                   # Environment variables
├── server.js              # Entry point for the application
└── package.json           # Project dependencies
```

## Future Enhancements
- **Admin Panel:** Add an interface for managing products and users.
- **Order Management:** Include APIs for managing orders and payments.
- **Deployment:** Deploy the application on a cloud platform like AWS, Heroku, or Vercel.
- **Search and Filtering:** Implement advanced search and filtering options for products.

## License
This project is licensed under the MIT License.

## Acknowledgments
Special thanks to the open-source community for providing valuable resources and tools.

