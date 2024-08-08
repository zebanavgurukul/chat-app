const socket = io();
let username = ''; // Store the username globally

// Handle user registration
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const registerUsername = document.getElementById('registerUsername').value;
    const registerPassword = document.getElementById('registerPassword').value;

    const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: registerUsername, password: registerPassword })
    });

    if (response.ok) {
        alert('Registration successful');
        document.getElementById('registerForm').reset();
    } else {
        alert('Registration failed');
    }
});

// Handle user login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const loginUsername = document.getElementById('loginUsername').value;
    const loginPassword = document.getElementById('loginPassword').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        username = loginUsername;
        document.getElementById('auth').style.display = 'none'; // Hide auth forms
        document.getElementById('chat').style.display = 'block'; // Show chat interface
    } else {
        alert('Login failed');
    }
});

// Function to handle sending a message
function sendMessage(message) {
    if (message) {
        socket.emit('sendMessage', { sender: username, content: message });
    }
}

// Listen for incoming messages and display them
socket.on('receiveMessage', (msg) => {
    const messages = document.getElementById('messages');
    const newMessage = document.createElement('li');
    newMessage.textContent = `${msg.sender}: ${msg.content}`;
    messages.appendChild(newMessage);
});

// Add event listener to the send button
document.getElementById('sendButton').addEventListener('click', () => {
    const messageInput = document.getElementById('messageInput');
    const messageContent = messageInput.value.trim();
    if (messageContent) {
        sendMessage(messageContent);
        messageInput.value = ''; // Clear input field
    }
});

// Add event listener to send a message when Enter key is pressed
document.getElementById('messageInput').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default behavior
        const messageContent = event.target.value.trim();
        if (messageContent) {
            sendMessage(messageContent);
            event.target.value = ''; // Clear input field
        }
    }
});
