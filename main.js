const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
app.use(express.static('src'))
const port = process.env.PORT||8080;
const io = require('socket.io')(http);
let mainF = require('./mainfunctions');
let map = mainF.loadJSON('storage/world.json')
io.on('connection', socket =>{
    socket.emit('guc', map.world)
    socket.on('gus', Gselect =>{
        let gridUpdate = mainF.updateGrid(Gselect, map.world);
        console.log(gridUpdate)
        socket.broadcast.emit('gridUpdate', gridUpdate)
        console.log(gridUpdate)
        socket.emit('gridUpdate', gridUpdate)
        mainF.saveJSON('storage/world.json', map)
    });
    setInterval(function() { mainF.worldClock(socket); }, 1000)
    socket.on('userSignup', userRequest =>{
        mainF.userSignup(userRequest, socket)
    })
    socket.on('loginRequest', loginRequest =>{
        mainF.loginRequest(loginRequest, socket)
    });

    io.on('disconnect',()=>{
        console.log("user disconnected")
    });
})
app.get('/',(req, res) =>{

});
http.listen(port, ()=>{
})
