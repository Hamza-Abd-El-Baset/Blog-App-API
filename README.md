# Blog App Backend

This is the backend component of a full-stack blog application developed using the MERN (MongoDB, Express.js, React, Node.js) stack. The backend provides the necessary APIs and functionality to support the blog application's core features.

## Features

- **User Authentication**: Secure user registration and login.
- **User Profiles**: Users can customize their profiles with profile pictures.
- **Post Management**: Create, read, update, and delete blog posts.
- **Comment System**: Engage with posts through comments.
- **Categories**: Organize and categorize blog posts.
- **Backend API**: A robust backend API that powers it all.


## Getting Started

To get started with this project, follow these steps:

1. Clone this repository to your local machine.

shell
git clone https://github.com/Hamza-Abd-El-Baset/Blog-App-API.git
```

2. Install project dependencies using npm.

```shell
npm install
```

3. Set up environment variables by creating a `.env` file in the project root and configuring it with the necessary credentials. 

Here is a list of the required environment variables:

- `PORT`: The port on which the server will listen.
- `MONGO_URI`: The URI for your MongoDB database.
- `NODE_ENV`: The environment mode (e.g., 'development' or 'production').
- `JWT_SECRET`: The secret key used for JSON Web Token (JWT) authentication.
- `CLOUDINARY_CLOUD_NAME`: The name of your Cloudinary cloud.
- `CLOUDINARY_API_KEY`: Your Cloudinary API key.
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret.

To set these environment variables, create a `.env` file and define them as follows:

```shell
PORT=3000
MONGO_URI=mongodb://localhost/mydatabase
NODE_ENV=development
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Make sure to replace the placeholders with your actual values.

4. Start the server.

```shell
npm start
```

The API will be available at `http://localhost:3000`.

## Usage

Detailed instructions on how to use this backend API can be found in the [API Documentation](https://blog-app-api-ypu6.onrender.com/).

## Contributing

If you'd like to contribute to this project, please follow the [Contributing Guidelines](CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

I'd like to express my gratitude to the developer community and all the resources that have helped me in building this project.

## Contact

If you have any questions or want to connect, you can reach me at [your email address].

## Additional Links

- [Frontend Repository](https://github.com/Hamza-Abd-El-Baset/Blog-App-Frontend)
```

Please replace `[your email address]` with your actual contact information. This README provides a comprehensive guide to understanding and using your backend API and encourages potential contributors to follow your guidelines.
