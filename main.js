const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
app.use(express.static('src'))
const port = process.env.PORT||8080;
const io = require('socket.io')(http);
let mainF = require('./mainfunctions');
let map = mainF.loadJSON('storage/world.json')
const buildings = mainF.loadJSON('storage/buildings.json')
    io.on('connection', socket =>{
    socket.emit('guc', [map.world, buildings])
    socket.on('gus', Gselect =>{
        let gridUpdate = mainF.updateGrid(Gselect, map.world);
        socket.broadcast.emit('gridUpdate', gridUpdate)
        socket.emit('gridUpdate', gridUpdate)
    });
    setInterval(function() { mainF.worldClock(socket); }, 1000)
    socket.on('userSignup', userRequest =>{
        mainF.userSignup(userRequest, socket)
    })
    socket.on('loginRequest', loginRequest =>{
        mainF.loginRequest(loginRequest, socket)
    });
    socket.on('buildRequest', buildRequest=>{
        mainF.buildHandler(buildRequest, map.world, socket)
    })
    io.on('disconnect',()=>{
        console.log("user disconnected")
    });
})
app.get('/',(req, res) =>{

});
http.listen(port, ()=>{
})
