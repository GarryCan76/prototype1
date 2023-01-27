const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
app.use(express.static('src'))
const port = process.env.PORT||8080;
const io = require('socket.io')(http);
const fs = require('fs');
world = require('./world');

function loadJSON(filename = ''){
    return JSON.parse(fs.existsSync(filename)
        ? fs.readFileSync(filename).toString()
        : 'null')
}
function saveJSON(filename = '' ,json = '""'){
    return fs.writeFileSync(filename, JSON.stringify(json, null, 2))
}
let map = loadJSON('storage/world.json')
io.on('connection', socket  =>{
    socket.emit('guc', map[0].world)
    socket.on('gus', Gselect =>{
        gridUpdate = world.updateGrid(Gselect, map[0].world);
        socket.broadcast.emit('gridUpdate', gridUpdate)
        socket.emit('gridUpdate', gridUpdate)
        saveJSON('storage/world.json', map)
    });
    socket.on('userRequest', userRequest =>{
        let usernameValid = false;
        console.log(userRequest)
        let usersJson = loadJSON('storage/user.json');
        usersJson.forEach(user =>{
            if (user.user.name === userRequest){
                usernameValid = true;
            }
        });
        if (usernameValid === false){
            console.log("new user created")
            usersJson.push({"user": {"name" : userRequest}})
            saveJSON('storage/user.json', usersJson)
        }else {
            console.log("username taken")
        }

    });


    io.on('disconnect',()=>{
        console.log("user disconnected")
    });


})
app.get('/',(req, res) =>{

});

http.listen(port, ()=>{
})
