const express = require('express');
const cassandra = require('cassandra-driver');
const socketIO = require('socket.io');
const http = require('http');
const { BUNDLE_PATH, KEYSPACE, TABLEUSER, TABLECHAT, TOKEN ,
TABLEFRIENDS, TABLECHATID} = require('./constants/Credentials');
const { isEmail, isUsername } = require('./lib/validation');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Setup HTTP server and Socket.IO
const server = http.createServer(app);
const io = socketIO(server);

// In-memory storage for messages per room

let rooms = [];

// Configure Express
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.json());

if (!TOKEN || typeof TOKEN !== 'string') {
  throw new Error('TOKEN environment variable is missing or invalid. Check your .env file.');
}

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
      query = `Select * from ? WHERE email='${user}' and password='${password}' ALLOW FILTERING`;
    }else{
      query = `Select * from ${TABLEUSER} WHERE username='${user}' and password='${password}' ALLOW FILTERING`;
    }
    const result = await client.execute(query);
    if (result.rowLength===0){
      return res.status(200).json({data:null, foundStatus:0});
    }else{
      let a = {
        user_id: String(result.rows[0]['user_id']),
        user_name: result.rows[0]['user_name'],
        email: result.rows[0]['email'],
        avatar:result.rows[0]['avatar'],
        name: result.rows[0]['name'],
        password: result.rows[0]['password'],
        status: result.rows[0]['status']
      }
      res.json({data:a, foundStatus:1})
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

// chat api for receiving messages
app.post('/api/chat/rec',async (req, res)=>{
  try{
    const { fromid, toid } = await req.body;
    let query = `SELECT chat_id FROM ${TABLECHATID} WHERE fromid=${fromid} and toid=${toid} ALLOW FILTERING`;
    let result = await client.execute(query);
    let chatid = result.rows[0]['chat_id'].toString();
    query=`SELECT message FROM ${TABLECHAT} WHERE chat_id=${chatid}`;
    result = await client.execute(query);
    if(result.rows && result.rowLength!==0){
      let data = [];
      let arr = result.rows[0]['message'].filter(msg=>msg).map(msg=>data.push(JSON.parse(msg)));
      return res.status(200).json({data:data});
    }else{
      return res.status(200).json({data:null});
    }
  }catch(e){
    return res.status(500).json({message:"Internal error!",error:e});
  }
});

// api for fetching the friends of specific user
app.post('/api/friends/get',async (req,res)=>{
  try{
    const { username } = await req.body;
    let query1 = `select user_id,user_name from ${TABLEUSER} where user_name='${username}' ALLOW FILTERING`;
    console.log(query1);
    const result = await client.execute(query1);
    if (result.rows && result.rowLength!==0){
      return res.status(200).json({data:result.rows[0]});
    }else{
      return res.status(200).json({data:null})
    }
  }catch(e){
    return res.status(500).json({message:"Internal error!",error:e});
  }
});

// api for fetching all the friends of specific user
app.post('/api/friends/getall',async (req,res)=>{
  try{
    const { userid } = await req.body;
    let query1 = `select friendid,user_name from ${TABLEFRIENDS} where userid=${userid} ALLOW FILTERING`;
    console.log(query1);
    const result = await client.execute(query1);
    if (result.rows && result.rowLength!==0){
      return res.status(200).json({data:result.rows});
    }else{
      return res.status(200).json({data:null})
    }
  }catch(e){
    return res.status(500).json({message:"Internal error!",error:e});
  }
});

// api for making friends
app.post('/api/friends/save',async (req, res)=>{
  try {
    const { fromid, toid, username, user_name } = await req.body;
    let query2 = `INSERT INTO ${TABLEFRIENDS}(defid, userid, friendid, user_name) VALUES (UUID(), ${fromid}, ${toid}, '${user_name}')`;
    console.log(query2)
    await client.execute(query2);
    let query1 = `INSERT INTO ${TABLEFRIENDS}(defid, userid, friendid, user_name) VALUES (UUID(), ${toid}, ${fromid}, '${username}')`;
    console.log(query1)
    await client.execute(query1);
    let query3 = `INSERT INTO ${TABLECHATID}(chat_id, fromid, toid) VALUES(uuid(),${fromid},${toid})`;
    await client.execute(query3);
    return res.status(200).json({success:1});
  } catch (e) {
    return res.status(500).json({message:"Internal error!",error:e});
  }
});

// Route for rendering a simple interface
app.get('/interface', (req, res) => {
  res.render('interface', { title: 'Chat Interface' });
});

// Listen for new socket connections
io.on('connection', (socket) => {
    const totalConnectedUsers = io.sockets.sockets.size;
    console.log(`Total connected users: ${totalConnectedUsers}`);

    socket.data.roomId = null;

    // Set alias for the user
    socket.on('setName', (id) => {
      if (id) {
        socket.data.id = id;
        console.log(`Alias for ${socket.id} set to ${socket.data.id}`);
        socket.emit('message', { from: 'Server', text: `Your name has been set to ${socket.data.id}` });
      } else {
        console.log('Name was not provided or was empty');
        socket.emit('message', { from: 'Server', text: 'Name is required to proceed' });
      }
    });

    // Join a room
    socket.on('joinRoom', async (toid) => {
      let query1 = `SELECT chat_id FROM ${TABLECHATID} WHERE fromid=${socket.data.id} and toid=${toid} ALLOW FILTERING`;
      let result = await client.execute(query1);
      if (!result.rows[0]){
        query1 = `SELECT chat_id FROM ${TABLECHATID} WHERE fromid=${toid} and toid=${socket.data.id} ALLOW FILTERING`
        result = await client.execute(query1);
        socket.data.roomId = `${result.rows[0]['chat_id'].toString()}`
      }
      socket.data.roomId = `${result.rows[0]['chat_id'].toString()}`;
      socket.data.toid = toid;
      try{
        if (!socket.data.id) {
          return;
        }
 
        const room = io.sockets.adapter.rooms.get(socket.data.roomId);
        
        if (room && room.size === 2) {
          return;
        }
        let basicobj = {
          roomdetails:{
            allowed:[],
            active:[],
            message:[]
          }
        }
        let roomfound = 0;  
        rooms.map(o=>{
          if(o.roomId==socket.data.roomId){
            if(o.roomdetails.allowed.indexOf(socket.data.roomId)){
              o.roomdetails.active=[...o.roomdetails.active,socket.data.id];
            }
          }
        })
        if (roomfound===0){
          basicobj.roomdetails.allowed.push(socket.data.id);
          basicobj.roomdetails.allowed.push(toid);
          basicobj.roomdetails.active.push(socket.data.id);
          rooms[socket.data.roomId]=basicobj;
        }

        socket.join(socket.data.roomId);
        
        if (!rooms[socket.data.roomId]) rooms[socket.data.roomId] = [];

        rooms[socket.data.roomId].roomdetails.message.forEach(msg => socket.emit('message', JSON.parse(msg)));

        console.log(`${socket.data.id} has joined a conversation!`);
      } catch (e){
        console.log(e);
      }
    });

    // Handle sending messages        
    socket.on('sendMessage', (message) => {
      try{

        console.log(socket.data.roomId);
        console.log(rooms[socket.data.roomId]);
        if (!socket.data.roomId || !socket.data.id) {
          return;
        }
        console.log(rooms[socket.data.roomId].allowed);
        let found = rooms[socket.data.roomId].allowed.filter(e=>e==socket.data.toid);
        if (found.length!=0){
          const now = new Date();
          const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
          const msg = {
            from: socket.data.id,
            text: message,
            ts:formattedDate,
            readstatus:0,
          };
    
          // Save the message in memory for the room
          if (!rooms[socket.data.roomId]) {
            rooms[socket.data.roomId] = [];
          }
          rooms[socket.data.roomId].roomdetails.message.push(JSON.stringify(msg));
          // Broadcast the message to all users in the room
          io.to(socket.data.roomId).emit('message', msg);
        }
      }catch(e){
        console.log(e);
      }
    });

    // Handle user disconnection
    socket.on('disconnect', async () => {
      try{
        const totalConnectedUsers = io.sockets.sockets.size;
        console.log(`Total connected users: ${totalConnectedUsers}`);
        if (socket.data.roomId){
          const query1 = `SELECT message FROM chat WHERE chat_id=${socket.data.roomId} ALLOW FILTERING`;
          const result = await client.execute(query1);
          let str = "\'";
          result.rows[0].message
          .filter(msg => msg) // filter out empty strings
          .map(msg => str+=msg+"\',\'");
          rooms[socket.data.roomId].roomdetails.message.map(e=>str+=e+"\',\'");
          str+="\'";
          const query = `INSERT INTO ${TABLECHAT}(chat_id,message) VALUES(${socket.data.roomId}, [${str}]);` // used to save the message every time one user disconnect from room 
          await client.execute(query);
        }
  
        console.log(`User ${socket.data.id || socket.id} disconnected`);
        delete socket.data.id;
        delete socket.data.roomId;
      }catch(e){
        console.log(e);
      }
    });
});

// Start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));