const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
// const cassandra = require('cassandra-driver');
// const { BUNDLE_PATH, TOKEN, KEYSPACE, TABLEUSER, TABLECHAT } = require('./constants/Credentials');

// Initialize Express, HTTP, and Socket.io
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Cassandra Client Setup (Unchanged)
// const client = new cassandra.Client({
//     cloud: { secureConnectBundle: BUNDLE_PATH },
//     credentials: { username: 'token', password: TOKEN },
//     keyspace: KEYSPACE,
// });

const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.json());

// In-memory storage for messages per room
let rooms = {};

// Listen for new socket connections
io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);
    console.log('rooms : ',rooms);

    socket.data.roomId = null;

    // Set alias for the user
    socket.on('setName', (name) => {
        if (name && name.trim()) {
            socket.data.name = name;
            console.log(`Alias for ${socket.id} set to ${socket.data.name}`);
            socket.emit('message', { sender: 'Server', text: `Your name has been set to ${socket.data.name}` });
        } else {
            console.log('Name was not provided or was empty');
            socket.emit('message', { sender: 'Server', text: 'Name is required to proceed' });
        }
    });

    // Join a room
    socket.on('joinRoom', (roomId) => {
        if (!socket.data.name) {
            socket.emit('message', { sender: 'Server', text: 'Please set your alias before joining the room.' });
            return;
        }

        const room = io.sockets.adapter.rooms.get(roomId);

        if (room && room.size === 2) {
            // Room is full
            socket.emit('message', { sender: 'Server', text: 'Room is full.' });
            return;
        }

        // Join the room
        socket.join(roomId);
        socket.data.roomId = roomId;

        // Retrieve previous messages for the room from in-memory storage
        if (rooms[roomId]) {
            // Send previous messages from memory to the new user
            rooms[roomId].forEach((msg) => {
                socket.emit('message', msg);
            });
        }

        // Inform others that a new user has joined
        socket.emit('message', { sender: 'Server', text: `Joined room ${roomId}` });
        io.to(roomId).emit('message', { sender: 'Server', text: `${socket.data.name} has joined the room.` });
    });

    // Handle sending messages
    socket.on('sendMessage', (message) => {
        if (!socket.data.roomId) {
            socket.emit('message', { sender: 'Server', text: 'You need to join a room before sending messages.' });
            return;
        }

        if (!socket.data.name) {
            socket.emit('message', { sender: 'Server', text: 'Please set your alias before sending messages.' });
            return;
        }

        const msg = {
            sender: socket.data.name,
            text: message,
        };

        // Save the message in memory for the room
        if (!rooms[socket.data.roomId]) {
            rooms[socket.data.roomId] = [];
        }
        rooms[1][socket.data.roomId].push(msg);

        // Broadcast the message to all users in the room
        io.to(socket.data.roomId).emit('message', msg);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log(`User ${socket.data.name || socket.id} disconnected`);
        if (socket.data.roomId) {
            io.to(socket.data.roomId).emit('message', { sender: 'Server', text: `${socket.data.name || socket.id} has left the room.` });
        }
        delete socket.data.name;
        delete socket.data.roomId;
    });
});

// Serve the chat interface
app.get('/interface', (req, res) => {
    res.render('interface', { title: 'Chat Interface' });
});

// Start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
