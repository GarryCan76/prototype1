const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const hostname = 'localhost'
app.use(express.static('src'))
const port = process.env.PORT||8080;
const io = require('socket.io')(http);
let mainF = require('./mainfunctions');
const {loadJSON, acceptDeal, scores} = require("./mainfunctions");
let map = mainF.loadJSON('storage/world.json')
let worldTick = true;
let texthistory = []
setInterval(()=>{worldTick = true}, 5000)
const buildings = mainF.loadJSON('storage/buildings.json')
    io.on('connection', socket =>{
        scores(socket)
        socket.broadcast.emit("history", texthistory);
        socket.emit("history", texthistory);
        socket.on("message", msguid =>{
            texthistory.push(msguid)
            socket.broadcast.emit("text", msguid);
            socket.emit("text", msguid);
        });
    socket.emit('guc', [map.world, buildings])
    socket.on('gus', Gselect =>{
        let gridUpdate = mainF.updateGrid(Gselect, map.world);
        socket.broadcast.emit('gridUpdate', gridUpdate)
        socket.emit('gridUpdate', gridUpdate)
    });
    setInterval(function() {
        if (worldTick){
            mainF.worldClock(socket);
            worldTick = false;}
        }, 1000);

    socket.on('userSignup', userRequest =>{
        mainF.userSignup(userRequest, socket)
    })
    socket.on('loginRequest', loginRequest =>{
        mainF.loginRequest(loginRequest, socket)
    });
    socket.on('buildRequest', buildRequest=>{
        mainF.buildHandler(buildRequest, map.world, socket)
    });
    socket.on('dealRequest', submitDeal=>{
        mainF.dealRequest(submitDeal, socket)
    });
    socket.on('refreshDeals', i=>{
        mainF.dealHistory(socket)
    });
    socket.on('dealAcceptie', dealAcceptie=>{mainF.dealAcceptie(dealAcceptie)
    });
    socket.on('quickSell', quickSellInfo=>{mainF.quickSellHandler(quickSellInfo, socket);
    });
});
app.get('/',(req, res) =>{

});
http.listen(port, hostname, ()=>{
    console.log(`Server running at http://${hostname}:${port}`)
})