const bcrypt = require('bcrypt');
const fs = require("fs");
let currentTime = loadJSON('storage/world.json');
let saveInterval = 0;
let checktime = 0;
function loadJSON(filename = ''){
    return JSON.parse(fs.existsSync(filename)
        ? fs.readFileSync(filename).toString()
        : 'null')
}
function saveJSON(filename = '' ,json = '""'){
    return fs.writeFileSync(filename, JSON.stringify(json, null, 2))
}
function worldClock(socket){
    checktime++
    saveInterval++
    currentTime.time++;
    resourceCycle(currentTime.world, socket)
    socket.emit('time', currentTime.time)
    if (saveInterval === 30){
        saveJSON('storage/world.json', currentTime)
        saveInterval = 0;
    }
}
function getUserInfo(username){
    let usersJson = loadJSON('storage/user.json');
    let userI = null;
    for (let userNum = 0; userNum < usersJson.length; userNum++){
        if (username === usersJson[userNum].user.name){
            userI = userNum;
        }
    }
    return [usersJson[userI], usersJson]
}
function updateGrid(Gselect, grid){
    let [userI, usersJson] = getUserInfo(Gselect[2])
    if (Gselect[3] === "buy"){
        if (Gselect[2] === userI.user.name){
            if (userI.user.money >= grid[Gselect[0]][Gselect[1]].cost){
                userI.user.money = userI.user.money - grid[Gselect[0]][Gselect[1]].cost;
                Gselect[4] = userI.user.money;
                saveJSON('storage/user.json', usersJson)
                if (grid[Gselect[0]][Gselect[1]].owner === null){
                    grid[Gselect[0]][Gselect[1]].owner = Gselect[2];
                    currentTime.world = grid;
                    saveJSON('storage/world.json', currentTime)
                }
            }else {
                Gselect = false;
            }
        }
    }else {
        if (grid[Gselect[0]][Gselect[1]].owner === Gselect[2]){
            grid[Gselect[0]][Gselect[1]].owner = null;
            userI.user.money = userI.user.money + grid[Gselect[0]][Gselect[1]].cost;
            Gselect[4] = userI.user.money;
            currentTime.world = grid;
            saveJSON('storage/world.json', currentTime)
            saveJSON('storage/user.json', usersJson)
        }
    }
    currentTime.world = grid;
    return Gselect;
}
async function userSignup(userRequest, socket){
    let usersJson = loadJSON('storage/user.json');
    let [userName, password, passwordRepeat] = userRequest;
    let errorList = [];
    let userID = Math.floor(Math.random() * 1000000) + 100000;
    let validChars = /^[A-Za-z0-9]+$/;
    if (userName.length > 10){
        errorList.push(" Too many characters")
    }
    if (!(userName.match(validChars))){
        errorList.push(" invalid characters")
    }
    usersJson.forEach(user =>{
        if (user.user.name === userName){
            errorList.push(" taken username")
        }
    });
    if (password !== passwordRepeat){
        errorList.push(" password does not match")
    }
    if (errorList.length === 0){
        let hash = await bcrypt.hash(password, 13)
        console.log("new user created")
        usersJson.push({"user": {"name" : userName, "password" : hash, "userID" : userID, "money": 5000,
                "resources":{"water":0, "Crops":0, "CopperOre":0, "Copper":0, "Coal":0}}})
        saveJSON('storage/user.json', usersJson)
    }else {
        console.log("username invalid")
    }
    socket.emit('userCreate', errorList)
}
async function loginRequest(loginRequest, socket){
    let [userName, password] = loginRequest
    let userExist = false;
    let errorList = [];
    userExist = null;
    let usersJson = loadJSON('storage/user.json');
    usersJson.forEach(user =>{
        if (user.user.name === userName){
            userExist = user
        }
    });
    if (userExist === null){
        errorList.push("User does not exist")
        socket.emit('userLogged', [userName, errorList])
        return null
    }
    let userID = userExist.user.userID;
    let isMatch = await bcrypt.compare(password, userExist.user.password)
    if (!(isMatch)){
        errorList.push("Wrong password")
        userID = null;
    }
    if (errorList.length === 0){
        console.log("user logged in")
        saveJSON('storage/user.json', usersJson)
    }else {
        console.log("login failed")
    }
    socket.emit('userLogged', [userName, errorList, userID, userExist.user.money, userExist.user.resources])
}
function buildHandler(buildRequest, grid, socket){
    [y, x, username, buildingType] = buildRequest;
    let buildJson = loadJSON('storage/buildings.json')
    let [userI, usersJson] = getUserInfo(username)
    if (buildingType !== "destroy"){
        if (userI.user.money >= buildJson[buildingType][1]){
            userI.user.money = userI.user.money - buildJson[buildingType][1];
            grid[y][x].building = buildingType;
            currentTime.world = grid;
            socket.emit('bupdate', [y, x, buildingType, userI.user.money, username])
            socket.broadcast.emit('bupdate', [y, x, buildingType, userI.user.money, username])
            saveJSON('storage/user.json', usersJson)
            saveJSON('storage/world.json', currentTime)
        }
    }else {
        userI.user.money = userI.user.money + buildJson[grid[y][x].building][1];
        grid[y][x].building = null;
        currentTime.world = grid;
        socket.emit('bupdate', [y, x, null, userI.user.money, username])
        socket.broadcast.emit('bupdate', [y, x, null, userI.user.money, username])
        saveJSON('storage/user.json', usersJson)
        saveJSON('storage/world.json', currentTime)
    }
}
function resourceCycle(world, socket){
    let buildings = loadJSON('storage/buildings.json');
    world.forEach(col=>{
        col.forEach(row=>{
            if (row.owner !== null && row.building !== null){
                let sendUser = []
                let [userI, usersJson] = getUserInfo(row.owner)
                for (let req = 0; req < buildings[row.building][2].length; req++){

                }
                if (buildings[row.building][4] === "Mine"){
                    userI.user.resources[buildings[row.building][0]] += parseInt(buildings[row.building][3] * row.resources[buildings[row.building][2][0]["resourceReqType"]]/ 175);
                    sendUser.push([userI.user.resources[buildings[row.building][0]], buildings[row.building][0]])
                    socket.emit('resourceCycles', [row.owner, sendUser])
                    socket.broadcast.emit('resourceCycles', [row.owner, sendUser])
                }else {
                    let adequateResources = true;
                    for (let req = 0; req < buildings[row.building][2].length; req++){
                        if (userI.user.resources[buildings[row.building][2][req]["resourceReqType"]] < buildings[row.building][2][req]["resourceReqAmt"]){
                            adequateResources = false;
                        }
                    }
                    if (adequateResources){
                        for (let req = 0; req < buildings[row.building][2].length; req++){
                            userI.user.resources[buildings[row.building][2][req]["resourceReqType"]] -= [buildings[row.building][2][req]["resourceReqAmt"]];
                            sendUser.push([userI.user.resources[buildings[row.building][2][req]["resourceReqType"]], buildings[row.building][2][req]["resourceReqType"]])
                        }
                        userI.user.resources[buildings[row.building][0]] += buildings[row.building][3];
                        sendUser.push([userI.user.resources[buildings[row.building][0]], buildings[row.building][0]])
                        socket.emit('resourceCycles', [row.owner, sendUser])
                        socket.broadcast.emit('resourceCycles', [row.owner, sendUser])
                    }
                }
                saveJSON('storage/user.json', usersJson)
            }
        })
    })
}

module.exports.worldClock = worldClock;
module.exports.loadJSON = loadJSON;
module.exports.saveJSON = saveJSON;
module.exports.updateGrid = updateGrid;
module.exports.userSignup = userSignup;
module.exports.loginRequest = loginRequest;
module.exports.buildHandler = buildHandler;

