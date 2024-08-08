# Office Chat App

The Office Chat App is a web-based platform for real-time workplace communication. Users can register, log in, and chat instantly. Built with Node.js, Express, MongoDB, and Socket.io, it features user authentication, message history, and file sharing, enhancing productivity and collaboration.

## Features

- **User Registration and Login**: Secure authentication using JWT tokens and password hashing with bcrypt.
- **Real-Time Messaging**: Seamless communication powered by Socket.io.
- **File Uploads**: Users can upload and share files in the chat.
- **Persisted Chat History**: Messages are stored in MongoDB for future retrieval.

## Technologies Used

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-Time Communication**: Socket.io
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer

## Prerequisites

Before running this application, ensure you have the following installed:

- Node.js (v14.x or higher)
- MongoDB (Community Edition)
- Git

## Usage

- **Register** as a new user or **log in** with your existing credentials.
- **Chat** in real-time with other users.
- **Upload files** to share with other participants.

## Project Structure

- **public/**: Contains static files like HTML, CSS, and JavaScript.
- **uploads/**: Stores uploaded files.
- **app.js**: Main application logic and server setup.
- **models/**: Mongoose models for users, messages, and files.

## API Endpoints

- **POST /register**: Register a new user.
- **POST /login**: Authenticate a user and return a JWT token.
- **POST /upload**: Upload a file (authenticated users only).
- **GET /files/:filename**: Retrieve uploaded files.
