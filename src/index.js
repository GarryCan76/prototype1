const socket = io();
import {gridcreator, gridInputHandler} from './cleintWorld.js'

let worldGrid = null;
let worldMatrix = null;
let username = sessionStorage.getItem('username')
let userID = sessionStorage.getItem('userID')
console.log(username)
console.log(userID)
document.getElementById('money').innerText = "money $"+ sessionStorage.getItem('userMoney');
socket.on("connect", ()=>{
    console.log("connected")
});
//get grid from server once connect
socket.on("guc", guc=>{
    if (worldGrid === null && worldMatrix === null){
        [worldGrid, worldMatrix] = gridcreator(guc)
        gridInputCheck()
    }
});

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
    if (worldMatrix[col][row].owner === null){
        text.innerText = "Buy for $" + worldMatrix[col][row].cost;
        document.getElementById('gridInfo').appendChild(text)
        text.onclick = function (){
            selectToServer(col, row, "buy")
        }
    }else if(worldMatrix[col][row].owner === username) {
        text.innerText = "Sell for $" + worldMatrix[col][row].cost;
        document.getElementById('gridInfo').appendChild(text)
        text.onclick = function (){
            selectToServer(col, row, "sell")
        }
    }
    else {
        text.innerText = "already owned by " + worldMatrix[col][row].owner;
        document.getElementById('gridInfo').appendChild(text)
    }
}
function selectToServer(col, row, action){
    document.getElementById('buy').innerText = "";
    socket.emit('gus', [col, row, username, action]);
}
