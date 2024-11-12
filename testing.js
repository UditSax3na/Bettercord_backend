console.log(result);
const data = result.rows[0]['friends'];
let dat = data.map(e=> JSON.parse(e));
dat.forEach(e=>{
if (e['id']===parseInt(toid)){
    socket.data.roomId=e['chat_id'];
}
})
if (rooms.length===0 && rooms[e['chat_id']]){
a.allowed.push(socket.data.id);
a.allowed.push(toid);
console.log(a);
rooms[e['chat_id']]=a;
}
const room = io.sockets.adapter.rooms.get(e['chat_id']);
const result = rooms[e['chat_id']]['allowed'].find() || null;
console.log(result);
if (room && room.size === 2) {
// Room is full
socket.emit('message', { from: 'Server', text: 'Room is full.' });
return;
}
// if ()
socket.join(e['chat_id']);

// Retrieve previous messages for the room from in-memory storage
if (rooms[e['chat_id']]['message']) {
    // Send previous messages from memory to the new user
    rooms[e['chat_id']]['message'].forEach((msg) => {
        socket.emit('message', msg);
    });
}

const room = io.sockets.adapter.rooms.get(roomId);

//   if (room && room.size === 2) {
//       // Room is full
//       socket.emit('message', { from: 'Server', text: 'Room is full.' });
//       return;
//   }

//   // Join the room
//   socket.join(roomId);
//   socket.data.roomId = roomId;

//   // Retrieve previous messages for the room from in-memory storage
//   if (rooms[roomId]) {
//       // Send previous messages from memory to the new user
//       rooms[roomId]['message'].forEach((msg) => {
//           socket.emit('message', msg);
//       });
//   }

//   // Inform others that a new user has joined
//   socket.emit('message', { from: 'Server', text: `Joined room ${roomId}` });
//   io.to(roomId).emit('message', { from: 'Server', text: `${socket.data.id} has joined the room.` });
// }else{
//   socket.emit('message',{from:"Server",text:`${socket.data.id} and ${toid} are not friends`})
// }