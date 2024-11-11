const express = require('express');
const cassandra = require('cassandra-driver');
const socketIO = require('socket.io');
const http = require('http');
const { BUNDLE_PATH, TOKEN, KEYSPACE, TABLEUSER, TABLECHAT, 
TABLEFRIENDS } = require('./constants/Credentials');
const { isEmail, isUsername } = require('./lib/validation');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Setup HTTP server and Socket.IO
const server = http.createServer(app);
const io = socketIO(server);

// In-memory storage for messages per room
let rooms = {};

// Configure Express
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.json());

// Initialize Cassandra client
const client = new cassandra.Client({
  cloud: { secureConnectBundle: BUNDLE_PATH },
  credentials: { username: 'token', password: TOKEN },
  keyspace: KEYSPACE,
});

// Define API Endpoints

// for testing
app.post('/api/data', async (req, res) => {
  try {
    const { id } = await req.body;
    const query = `SELECT * FROM ${TABLEUSER} WHERE userid = ${id}`;
    console.log(query);

    const result = await client.execute(query);

    // Check if any data is found
    if (result.rowLength === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // Send the retrieved data
    res.json(result.rows[0]);
  } catch (e) {
    return res.status(500).json({message:"Internal error!",error:e});
  }
});

// login endpoint
app.post('/api/login',async (req,res)=>{
  try{
    const {user, password}=await req.body;
    let found = true;
    if (isEmail(user)) {
      found = false;
    } else if (isUsername(user)) {
      found = true;
    }
    let query = '';
    if (found===false){
      query = `Select * from ${TABLEUSER} WHERE email='${user}' and password='${password}' ALLOW FILTERING`;
    }else{
      query = `Select * from ${TABLEUSER} WHERE username='${user}' and password='${password}' ALLOW FILTERING`;
    }
    const result = await client.execute(query);
    if (result.rowLength===0){
      return res.status(200).json({data:null, foundStatus:0});
    }else{
      res.json({data:result.rows[0], foundStatus:1})
      res.status(200);
    }
  }catch(e){
    return res.status(500).json({message:"Internal error!",error:e});
  }
})

// registration endpoint
app.post('/api/reg',async (req,res)=>{
    try{
      const { name, username, email, password } = await req.body;
      let query = `select COUNT(user_id) from ${TABLEUSER}`;
      let result = await client.execute(query);
      let count = result.rows[0]['system.count(user_id)'].toNumber();
      count+=1;
      query = `INSERT INTO ${TABLEUSER}(user_id, name, user_name, email, password) values(${count},'${name}','${username}','${email}','${password}')`;
      await client.execute(query);
      res.status(201).json({ message: "Record added successfully"});
    }catch(e){
      return res.status(500).json({message:"Internal error!",error:e});
    }
});

// chat apis
// chat api for sending messages
app.post('/api/chat/send',async (req, res)=>{
  try{
      const {from, to, message} = await req.body;
      let query = `SELECT COUNT(*) FROM ${TABLECHAT}`;
      let result = await client.execute(query);
      let count = result.rows[0]['count'].toNumber();
      count+=1;
      query = `INSERT INTO ${TABLECHAT}(chat_id,from_id, to_id, message, ts) values (${count},${from},${to},'${message}', toTimestamp(now()))`;
      await client.execute(query);
      res.status(201).json({ message: "Record added successfully"});
  }catch(e){
    return res.status(500).json({message:"Internal error!",error:e});
  }
});

// chat api for receiving messages
app.post('/api/chat/rec',async (req, res)=>{
  try{
    const {from, to} = await req.body;
    let query = `SELECT * FROM chat WHERE from_id=${from} and to_id=${to} ALLOW FILTERING`;
    let result = await client.execute(query);
    let query2 = `SELECT * FROM chat WHERE from_id=${to} and to_id=${from} ALLOW FILTERING`;
    let result2 = await client.execute(query2);
    res.status(200).json({send:result.rows,rec:result2.rows});
  }catch(e){
    return res.status(500).json({message:"Internal error!",error:e});
  }
});

// api for fetching the friends of specific user
app.post('/api/friends/get',async (req,res)=>{
  try{
    const userID = await req.body;
    res.status(200).json()
  }catch(e){
    return res.status(500).json({message:"Internal error!",error:e});
  }
})

// api for making friends
app.post('/api/friends/save',async (req, res)=>{
  try {
    const userID = await req.body;
    const query = ``;
    // const result = ;
  } catch (e) {
    return res.status(500).json({message:"Internal error!",error:e});
  }
})

// Route for rendering a simple interface
app.get('/interface', (req, res) => {
  res.render('interface', { title: 'Chat Interface' });
});

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
            from: socket.data.name,
            // to: socket.data.
            text: message,
            // ts:Date(),
            // readstatus:0,
        };

        // Save the message in memory for the room
        if (!rooms[socket.data.roomId]) {
            rooms[socket.data.roomId] = [];
        }
        rooms[socket.data.roomId].push(msg);

        // Broadcast the message to all users in the room
        io.to(socket.data.roomId).emit('message', msg);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      const query = `` // used to save the message every time one user disconnect from room 
      
      console.log(`User ${socket.data.name || socket.id} disconnected`);
      if (socket.data.roomId) {
          io.to(socket.data.roomId).emit('message', { sender: 'Server', text: `${socket.data.name || socket.id} has left the room.` });
      }
      delete socket.data.name;
      delete socket.data.roomId;
    });
});

// Start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));