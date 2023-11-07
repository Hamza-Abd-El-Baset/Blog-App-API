# Blog App Backend

This repository contains the backend component of a full-stack blog application developed using the MERN (MongoDB, Express.js, React, Node.js) stack. The backend provides the necessary APIs and functionality to support the blog application's core features.

## Features

- **User Authentication**: Secure user registration and login.
- **User Profiles**: Users can customize their profiles with profile pictures.
- **Post Management**: Create, read, update, and delete blog posts.
- **Comment System**: Engage with posts through comments.
- **Categories**: Organize and categorize blog posts.
- **Backend API**: A robust backend API that powers it all.

## Getting Started

1. **Clone the Repository:** 
   Clone this repository to your local machine using the following command:

   ```shell
   git clone https://github.com/Hamza-Abd-El-Baset/Blog-App-API.git
   ```

2. **Install Dependencies:**
   Install project dependencies using npm:

   ```shell
   npm install
   ```

3. **Set Up Environment Variables:**
   Create a `.env` file in the project's root directory and define the necessary environment variables. Here is a list of the required variables:

   - `PORT`: The port on which the server will listen.
   - `MONGO_URI`: The URI for your MongoDB database.
   - `NODE_ENV`: The environment mode (e.g., 'development' or 'production').
   - `JWT_SECRET`: The secret key used for JSON Web Token (JWT) authentication.
   - `CLOUDINARY_CLOUD_NAME`: The name of your Cloudinary cloud.
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key.
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret.

   Use this format in your `.env` file:

   ```shell
   PORT=3000
   MONGO_URI=mongodb://localhost/mydatabase
   NODE_ENV=development
   JWT_SECRET=your-secret-key
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Start the Server:**
   Run the following command to start the server:

   ```shell
   npm start
   ```

   The API will be available at `http://localhost:3000`.

## Usage

Detailed instructions on how to use this backend API can be found in the [API Documentation](https://blog-app-api-ypu6.onrender.com/).

## Contact

If you have any questions or want to connect, you can reach me at [https://www.linkedin.com/in/hamza-abd-el-baset/](https://www.linkedin.com/in/hamza-abd-el-baset/)


