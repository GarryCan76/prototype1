const socket = io();
import {gridcreator, gridInputHandler} from './cleintWorld.js'

let worldGrid = null;
let worldMatrix = null;
socket.on("connect", ()=>{
    console.log(socket.id)
});
//get grid from server once connect
socket.on("guc", guc=>{
    [worldGrid, worldMatrix] = gridcreator(guc)
    gridInputCheck()
});
socket.on('gridUpdate', gridUpdate=>{
    gridInputHandler(gridUpdate[0], gridUpdate[1], worldMatrix, worldGrid)
});
function gridInputCheck(){
    if (worldGrid !== null){
        for (let col = 0; col < worldGrid.length; col++){
            let row_array = worldGrid[col].children;
            for (let row = 0; row < row_array.length; row++){
                row_array[row].addEventListener("click", function (){ selectToServer(col, row);})
            }
        }
    }
}
function selectToServer(col, row){socket.emit('gus', [col, row]);}