const socket = io();
import {
    gridcreator,
    gridInputHandler,
    uiResources,
    buy,
    buildingUpdate,
    resourceCycles,
    createDeal,
    dealUpdate, dealHistory, currentDeals, dealCycle, sideBarInterface, resourceFilter
} from './cleintWorld.js'
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
sideBarInterface()
createDeal(socket, false)
//get grid from server once connect
socket.on("guc", guc=>{
    socket.emit("refreshDeals", 0)
    buildings = guc[1];
    if (worldGrid === null && worldMatrix === null){
        [worldGrid, worldMatrix] = gridcreator(guc[0], socket)
        gridInputCheck()
    }
    resourceFilter(worldMatrix, worldGrid)
});
socket.on('time', time=>{
})
socket.on('gridUpdate', gridUpdate=>{
    console.log(gridUpdate)
    if (gridUpdate[2] === username){
        sessionStorage.setItem('userMoney','' + gridUpdate[4])
        document.getElementById('money').innerText = "money $"+ sessionStorage.getItem('userMoney');
    }
    gridInputHandler(gridUpdate, worldMatrix, worldGrid)
    buy(gridUpdate[0], gridUpdate[1], worldMatrix, worldGrid, socket, username, buildings)
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
socket.on("history", history =>{
    let display = document.getElementById('chatDisplay');
    let length = textbox.children.length;
    for (let i = 0; i < length; i++){
        textbox.children[0].remove();
    }
    for (let i = 0; i < history.length; i++){
        let p = document.createElement('p');
        p.innerHTML = history[i][1] + ": " + history[i][0];
        if (history[i][1] === username){
            p.style.color = '#00d9ff';
        }
        textbox.append(p)
    }
    if (document.getElementById('chatDisplay').offsetHeight / document.getElementById('chatBox').offsetHeight > 0.85){
        document.getElementById('chatDisplay').style.overflowY = 'scroll';
    }
    display.scrollTop = display.scrollHeight;
});
let submit = document.getElementById('txtSubmit');
let text = document.getElementById('txtInput');
window.addEventListener("keydown", (event)=>{
    if (text === document.activeElement && event.key === 'Enter'){
        sendTXT()
    }
})
function sendTXT(){
    if (document.getElementById('chatDisplay').offsetHeight / document.getElementById('chatBox').offsetHeight > 0.85){
        document.getElementById('chatDisplay').style.overflowY = 'scroll';
    }
    if (text.value !== ''){
        let msguid = [text.value, username]
        socket.emit('message', msguid)
        text.value = '';
    }
}
submit.addEventListener("click", sendTXT);
socket.on("text", msg =>{
    let display = document.getElementById('chatDisplay');
    let p = document.createElement('p');
    p.innerHTML = msg[1] + ": " + msg[0];
    if (msg[1] === username){
        p.style.color = '#00d9ff';
    }
    textbox.append(p)
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
socket.on("dealHistory", deals=>{dealHistory(deals, socket)})
socket.on("dealUpdate", deal=>{dealUpdate(deal, socket)})
socket.on("dealCurrent", deal=>{currentDeals(deal, socket)})
socket.on("dealCycle", dealResources=>{let resources = JSON.parse(sessionStorage.getItem('resources'));dealCycle(dealResources, username, resources, socket)})
document.getElementById('refreshDeals').addEventListener('click', ()=>{socket.emit("refreshDeals", 0)})