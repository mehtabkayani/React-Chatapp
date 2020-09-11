 const express = require("express");
 const http = require("http");
 const app = express();
 const server = http.createServer(app);
 const socket = require("socket.io");
 const io = socket(server);

 const fbAuth = require('./fbAuth')
 const cors = require('cors');
 app.use(cors());
 app.use(express.json({limit:'1mb'}))
let emails = {};
let users= new Map();

  io.on("connection", socket => {
        
     socket.emit("your id", socket.id);
     socket.on("send message", body => {
         io.emit("message", body)
     })

     socket.on('userEmail', data =>{
         
         emails[socket.id] = data
        // console.log(data);
         
         io.sockets.emit('userEmail',data);
        
     })

     socket.on('typing',function(data){
        socket.broadcast.emit('typing',data);
    })

    socket.on('name',function(data){
        //socket.broadcast.emit('name',data);
        users.set(data,data);
        console.log(users)
        io.sockets.emit('name',Array.from(users.keys()));
    })

    socket.on('logout', function(data){
        users.delete(data);
        io.sockets.emit('name',Array.from(users.keys()));
    
    })

    socket.on('disconnect', () => {
        console.log("Someone left...")
      });
    

 })

 const {
    signup,
    login,
    logout,
    isAuth,
    userBasedFunc 
} = require('./api/authUser')

app.post('/signup', signup);
app.post('/login', login);
app.get('/logout', logout);
app.get('/isAuth', isAuth);
app.get('/userBasedFunc', fbAuth, userBasedFunc);

 server.listen(8000, () => console.log("server is running on port 8000"));


