const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
app.use(express.static('src'))
const port = process.env.PORT||8080;
const io = require('socket.io')(http);
world = require('./world');

io.on('connection', socket  =>{
    socket.emit('guc', world.grid)
    console.log("user connected");
    socket.on('gus', Gselect =>{
        console.log(Gselect)
        gridUpdate = world.updateGrid(Gselect);
        socket.broadcast.emit('gridUpdate', gridUpdate)
        socket.emit('gridUpdate', gridUpdate)
    });
    io.on('disconnect',()=>{
        console.log("user disconnected")
    });
})

app.get('/',(req, res) =>{

});

http.listen(port, ()=>{
})
