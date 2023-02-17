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

