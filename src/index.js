const socket = io();
import {gridcreator, gridInputHandler, uiResources, buy, buildingUpdate, resourceCycles} from './cleintWorld.js'
let worldGrid = null;
let worldMatrix = null;
let username = sessionStorage.getItem('username');
let userID = sessionStorage.getItem('userID');
let buildings = null;
console.log(username)
console.log(userID)
document.getElementById('money').innerText = "money $"+ sessionStorage.getItem('userMoney');
socket.on("connect", ()=>{
    console.log("connected")

});
uiResources()
//get grid from server once connect
socket.on("guc", guc=>{
    buildings = guc[1];
    if (worldGrid === null && worldMatrix === null){
        [worldGrid, worldMatrix] = gridcreator(guc[0])
        gridInputCheck()
    }
});
socket.on('time', time=>{
})
socket.on('gridUpdate', gridUpdate=>{
    if (gridUpdate[2] === username){
        sessionStorage.setItem('userMoney','' + gridUpdate[4])
        document.getElementById('money').innerText = "money $"+ sessionStorage.getItem('userMoney');
    }
    gridInputHandler(gridUpdate, worldMatrix, worldGrid)
});
socket.on('bupdate', bUpdate=>{
    if (bUpdate[4] === username){
        sessionStorage.setItem('userMoney','' + bUpdate[3])
        document.getElementById('money').innerText = "money $"+ sessionStorage.getItem('userMoney');
    }
    buildingUpdate(bUpdate, worldMatrix, worldGrid)
})
socket.on('resourceCycles', rUpdate=>{
    let resources = JSON.parse(sessionStorage.getItem('resources'));
    resourceCycles(rUpdate, username, resources)

})
let textbox = document.getElementById('chatDisplay')
socket.on("connect",()=>{
    console.log(socket.id)
});
socket.on("history", history =>{
    let length = textbox.children.length;
    for (let i = 0; i < length; i++){
        textbox.children[0].remove();
    }
    for (let i = 0; i < history.length; i++){
        let p = document.createElement('p');
        p.innerHTML = history[i][1] + " - " + history[i][0];
        if (history[i][1] === username){
            p.style.color = 'blue';
        }
        textbox.append(p)
    }
});
let submit = document.getElementById('txtSubmit');
let text = document.getElementById('txtInput');
submit.addEventListener("click",()=>{
    let msguid = [text.value, username]
    socket.emit('message', msguid)
    text.value = '';
});
socket.on("text", msg =>{
    let display = document.getElementById('chatDisplay');
    console.log(display.scrollHeight)
    let p = document.createElement('p');
    p.innerHTML = msg[1] + " - " + msg[0];
    if (msg[1] === username){
        p.style.color = 'blue';
    }
    textbox.append(p)
    console.log(display.scrollTop + " " + display.scrollHeight)
    if (display.scrollTop > display.scrollHeight - 250){
        display.scrollTop = display.scrollHeight;
    }
});
function gridInputCheck(){
    if (worldGrid !== null){
        for (let col = 0; col < worldGrid.length; col++){
            let row_array = worldGrid[col].children;
            for (let row = 0; row < row_array.length; row++){
                row_array[row].addEventListener("click", function (){ buy(col, row, worldMatrix, worldGrid, socket, username, buildings);})
            }
        }
    }
}
