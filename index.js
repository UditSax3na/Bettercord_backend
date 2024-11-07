// Import necessary modules
const express = require('express');
const cassandra = require('cassandra-driver');
const {BUNDLE_PATH,TOKEN,KEYSPACE,TABLEUSER,TABLECHAT} = require("./constants/Credentials");
const {isEmail,isUsername} = require("./lib/validation");
require('dotenv').config();

const app = express();
const PORT = 3000;

// Initialize Cassandra client
const client = new cassandra.Client({
  cloud: { secureConnectBundle:  BUNDLE_PATH},
  credentials: {
    username: 'token',
    password: TOKEN
  },
  keyspace: KEYSPACE
});

app.use(express.json());

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
      return res.status(404).json({message:'Data not found', foundStatus:0});
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));