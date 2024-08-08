const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.static('public')); // Serve static files

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chatapp');

// Define Schemas
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    passwordHash: String,
    createdAt: { type: Date, default: Date.now },
});

const messageSchema = new mongoose.Schema({
    sender: String,
    content: String,
    timestamp: { type: Date, default: Date.now },
});

const fileSchema = new mongoose.Schema({
    filename: String,
    path: String,
    uploader: String,
    uploadDate: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const Message = mongoose.model('Message', messageSchema);
const File = mongoose.model('File', fileSchema);

// WebSocket Connection
io.on('connection', (socket) => {
    console.log('New client connected');
    
    // Listen for messages
    socket.on('sendMessage', async (data) => {
        const message = new Message(data);
        await message.save();
        io.emit('receiveMessage', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, passwordHash: hashedPassword });
    try {
        await user.save();
        res.status(201).send('User registered');
    } catch (err) {
        res.status(400).send('Error registering user');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.passwordHash)) {
        const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).send('Invalid credentials');
    }
});

const authenticateJWT = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(403).send('Access denied.');

    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'your-secret-key', (err, user) => {
        if (err) return res.status(403).send('Invalid token.');
        req.user = user;
        next();
    });
};

app.post('/upload', authenticateJWT, multer({ dest: 'uploads/' }).single('file'), (req, res) => {
    const file = new File({
        filename: req.file.filename,
        path: req.file.path,
        uploader: req.user.userId,
    });
    file.save();
    res.send('File uploaded');
});

app.get('/files/:filename', (req, res) => {
    res.sendFile(path.join(__dirname, 'uploads', req.params.filename));
});

// Start the server
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
