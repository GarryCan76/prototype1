const socket = io();
import {gridcreator, gridInputHandler, uiResources} from './cleintWorld.js'

let worldGrid = null;
let worldMatrix = null;
let username = sessionStorage.getItem('username');
let userID = sessionStorage.getItem('userID');
let resources = JSON.parse(sessionStorage.getItem('resources'));
console.log(username)
console.log(userID)
document.getElementById('money').innerText = "money $"+ sessionStorage.getItem('userMoney');
socket.on("connect", ()=>{
    console.log("connected")
});
uiResources(resources)
//get grid from server once connect
socket.on("guc", guc=>{
    if (worldGrid === null && worldMatrix === null){
        [worldGrid, worldMatrix] = gridcreator(guc)
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
function gridInputCheck(){
    if (worldGrid !== null){
        for (let col = 0; col < worldGrid.length; col++){
            let row_array = worldGrid[col].children;
            for (let row = 0; row < row_array.length; row++){
                row_array[row].addEventListener("click", function (){ buy(col, row);})
            }
        }
    }
}
function buy(col, row){
    let text = document.getElementById('buy')
    var e = document.getElementById('gridInfo');
    var child = e.lastElementChild;
    while (child) {
        e.removeChild(child);
        child = e.lastElementChild;
    }
    if (worldMatrix[col][row].owner === null){
        let text = document.createElement('p');
        text.classList.add('buy');
        text.innerText = "Buy for $" + worldMatrix[col][row].cost;
        document.getElementById('gridInfo').appendChild(text)
        for (let resourceI = 0; resourceI < 5; resourceI++){
            let p = document.createElement('p');
            p.innerText = Object.keys(worldMatrix[col][row])[resourceI + 2] + " = " + worldMatrix[col][row][Object.keys(worldMatrix[col][row])[resourceI + 2]];
            document.getElementById('gridInfo').appendChild(p)
        }
        text.onclick = function (){
            selectToServer(col, row, "buy")
        }
    }else if(worldMatrix[col][row].owner === username) {
        let text = document.createElement('p');
        text.classList.add('buy');
        text.innerText = "Sell for $" + worldMatrix[col][row].cost;
        document.getElementById('gridInfo').appendChild(text)
        text.onclick = function (){
            selectToServer(col, row, "sell")
        }
    }
    else {
        let text = document.createElement('p');
        text.innerText = "Sell for $" + worldMatrix[col][row].cost;
        text.innerText = "already owned by " + worldMatrix[col][row].owner;
        document.getElementById('gridInfo').appendChild(text)
    }
}
function selectToServer(col, row, action){
    var e = document.getElementById('gridInfo');
    var child = e.lastElementChild;
    while (child) {
        e.removeChild(child);
        child = e.lastElementChild;
    }
    socket.emit('gus', [col, row, username, action]);
}
