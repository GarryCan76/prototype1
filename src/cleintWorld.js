let selected = null;
export function gridcreator(guc){
    let worldMatrix = guc;
    for (let y = 0; y < guc.length; y++){
        let div_col = document.createElement('div');
        div_col.classList.add('col');
        let col = document.getElementById('worldGrid').appendChild(div_col);
    }
    let cols = document.getElementsByClassName('col')
    for (let y = 0; y < cols.length; y++){
        for (let x = 0; x < guc[0].length; x++){
            let div = document.createElement('div')
            div.style.backgroundColor = "rgb(138,138,138)";
            if (worldMatrix[y][x].owner !== null){
                if (worldMatrix[y][x].owner === sessionStorage.getItem('username')) {
                    div.style.backgroundColor = "rgb(30,215,2)";
                }else {
                    div.style.backgroundColor = "rgb(215,2,41)";
                }
            }
            cols[y].appendChild(div)
        }
    }
    return [document.getElementById('worldGrid').children, worldMatrix]
}
export function gridInputHandler(gridupdate, worldMatrix, worldGrid){
    if (gridupdate){
        let [col, row, user, buy] = gridupdate
        var row_array = worldGrid[col].children;
        let y = worldMatrix[col]
        if (buy === "buy"){
            if (y[row].owner === null){
                y[row].owner = user;
                if (user === sessionStorage.getItem('username')){
                    row_array[row].style.backgroundColor = "rgb(30,215,2)";

                }else {
                    row_array[row].style.backgroundColor = "rgb(215,2,41)";
                }
            }
        }else {
            row_array[row].style.backgroundColor = "rgb(138,138,138)";
            y[row].owner = null;
        }
    }else {
        alert("could not buy")
    }
}
export function uiResources(resources){
    var e = document.getElementById('resources');
    var child = e.lastElementChild;
    while (child) {
        e.removeChild(child);
        child = e.lastElementChild;
    }
    for (let r = 0; r < Object.keys(resources).length; r++){
        let p = document.createElement('p');
        p.innerText = Object.keys(resources)[r] + " = " + resources[Object.keys(resources)[r]];
        document.getElementById('resources').appendChild(p)
    }
}
function buyBuildings(buildings, resource, worldMatrix, col, row){
    for (let r = 0; r < Object.keys(buildings).length; r++){
        let p = document.createElement('p');
        if (buildings[Object.keys(buildings)[r]][2]){
            p.innerText = Object.keys(buildings)[r] + " produces " + parseInt(buildings[Object.keys(buildings)[r]][1] * worldMatrix[col][row][buildings[Object.keys(buildings)[r]][2]] / 175) + buildings[Object.keys(buildings)[r]][0];
            document.getElementById('buildings').appendChild(p)
        }else {
            p.innerText = Object.keys(buildings)[r] + " produces " + buildings[Object.keys(buildings)[r]][0];
            document.getElementById('buildings').appendChild(p)
        }
    }
}
export function buy(col, row, worldMatrix, worldGrid, socket, username, buildings){
    let resources = [];
    if (selected === null){
        selected = [worldGrid[0].children[0], worldGrid[0].children[0].style.backgroundColor];
    }
    selected[0].style.backgroundColor = selected[1];
    selected = [worldGrid[col].children[row], worldGrid[col].children[row].style.backgroundColor]
    var e = document.getElementById('gridInfo');
    var child = e.lastElementChild;
    while (child) {
        e.removeChild(child);
        child = e.lastElementChild;
    }
    e = document.getElementById('buildings');
    child = e.lastElementChild;
    while (child) {
        e.removeChild(child);
        child = e.lastElementChild;
    }
    if (worldMatrix[col][row].owner === null){
        let text = document.createElement('p');
        text.classList.add('buy');
        text.innerText = "Buy for $" + worldMatrix[col][row].cost;
        document.getElementById('gridInfo').appendChild(text)
        text.onclick = function (){
            selectToServer(col, row, "buy", socket, username, worldGrid)
        }
    }else if(worldMatrix[col][row].owner === username) {
        buyBuildings(buildings, resources, worldMatrix, col, row)
        let text = document.createElement('p');
        text.classList.add('buy');
        text.innerText = "Sell for $" + worldMatrix[col][row].cost;
        document.getElementById('gridInfo').appendChild(text)
        text.onclick = function (){
            selectToServer(col, row, "sell", socket, username, worldGrid)
        }
    }
    else {
        let text = document.createElement('p');
        text.innerText = "Sell for $" + worldMatrix[col][row].cost;
        text.innerText = "already owned by " + worldMatrix[col][row].owner;
        document.getElementById('gridInfo').appendChild(text)
    }
    selected[0].style.backgroundColor = "rgb(75,75,75)";
    for (let resourceI = 0; resourceI < 5; resourceI++){
        let p = document.createElement('p');
        p.innerText = Object.keys(worldMatrix[col][row])[resourceI + 2] + " = " + worldMatrix[col][row][Object.keys(worldMatrix[col][row])[resourceI + 2]] + "%";
        resources.push(Object.keys(worldMatrix[col][row])[resourceI + 2] + " = " + worldMatrix[col][row][Object.keys(worldMatrix[col][row])[resourceI + 2]]);
        document.getElementById('gridInfo').appendChild(p)
    }
}
function selectToServer(col, row, action, socket, username, worldGrid){
    selected = [worldGrid[0].children[0], worldGrid[0].children[0].style.backgroundColor];
    var e = document.getElementById('gridInfo');
    var child = e.lastElementChild;
    while (child) {
        e.removeChild(child);
        child = e.lastElementChild;
    }
    e = document.getElementById('buildings');
    child = e.lastElementChild;
    while (child) {
        e.removeChild(child);
        child = e.lastElementChild;
    }
    socket.emit('gus', [col, row, username, action]);
}