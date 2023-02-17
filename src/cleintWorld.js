let selected = null;
export function gridcreator(guc){
    console.log(guc)
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
            div.style.borderColor = "rgb(138,138,138)";
            div.style.backgroundImage = "url('images/gress.png')";
            if (worldMatrix[y][x].building !== null) {
                div.style.backgroundImage = "url('images/" + worldMatrix[y][x].building + ".png')";
            }
            if (worldMatrix[y][x].owner !== null){
                if (worldMatrix[y][x].owner === sessionStorage.getItem('username')) {
                    div.style.borderColor = "rgb(30,215,2)";
                }else {
                    div.style.borderColor = "rgb(215,2,41)";
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
                    row_array[row].style.borderColor = "rgb(30,215,2)";

                }else {
                    row_array[row].style.borderColor = "rgb(215,2,41)";
                }
            }
        }else {
            row_array[row].style.borderColor = "rgb(138,138,138)";
            y[row].owner = null;
        }
    }else {
        alert("could not buy")
    }
}
export function uiResources(){
    let resources = JSON.parse(sessionStorage.getItem('resources'));
    deleteChildren('resources')
    for (let r = 0; r < Object.keys(resources).length; r++){
        let p = document.createElement('p');
        p.innerText = Object.keys(resources)[r] + " = " + resources[Object.keys(resources)[r]];
        document.getElementById('resources').appendChild(p)
    }
}
function buyBuildings(buildings, resource, worldMatrix, col, row, username, socket, worldGrid){
    if (worldMatrix[col][row].building === null){
        for (let r = 0; r < Object.keys(buildings).length; r++){
            let p = document.createElement('p');
            if (buildings[Object.keys(buildings)[r]][2]){
                p.innerText = Object.keys(buildings)[r] + " produces " + parseInt(
                        buildings[Object.keys(buildings)[r]][3] * worldMatrix[col][row].resources[buildings[Object.keys(buildings)[r]][2]] / 175) + buildings[Object.keys(buildings)[r]][0] +
                    " - Cost to build: " + buildings[Object.keys(buildings)[r]][1];
                document.getElementById('buildings').appendChild(p)
            }else {
                p.innerText = Object.keys(buildings)[r] + " produces " + buildings[Object.keys(buildings)[r]][0] + " - Cost to build: " + buildings[Object.keys(buildings)[r]][1];
                document.getElementById('buildings').appendChild(p)
            }
            document.getElementById('buildings').children[r].addEventListener("click", ()=>{buildRequest(col, row, username, socket, buildings, r)})
        }
    }else {
        let p = document.createElement('p');
        p.innerText = "destroy " + worldMatrix[col][row].building;
        p.addEventListener("click", ()=>{buildRequest(col, row, username, socket, buildings, "destroy")})
        document.getElementById('buildings').appendChild(p)
        p = document.createElement('p');
        p.innerText = worldMatrix[col][row].building + " produces "
            + parseInt(buildings[worldMatrix[col][row].building][3] * worldMatrix[col][row].resources[buildings[worldMatrix[col][row].building][2]] / 175)
            + " " + buildings[worldMatrix[col][row].building][0];
        document.getElementById('buildings').appendChild(p)
    }
}
export function buy(col, row, worldMatrix, worldGrid, socket, username, buildings){
    let resources = [];
    if (selected === null){
        selected = [worldGrid[0].children[0], worldGrid[0].children[0].style.borderColor];
    }
    selected[0].style.borderColor = selected[1];
    selected = [worldGrid[col].children[row], worldGrid[col].children[row].style.borderColor]
    deleteChildren('gridInfo')
    deleteChildren('buildings')
    if (worldMatrix[col][row].owner === null){
        let text = document.createElement('p');
        text.classList.add('buy');
        text.innerText = "Buy for $" + worldMatrix[col][row].cost;
        document.getElementById('gridInfo').appendChild(text)
        text.onclick = function (){
            selectToServer(col, row, "buy", socket, username, worldGrid)
        }
    }else if(worldMatrix[col][row].owner === username) {
        buyBuildings(buildings, resources, worldMatrix, col, row, username, socket, worldGrid)
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
    selected[0].style.borderColor = "rgb(75,75,75)";
    for (let resourceI = 0; resourceI < Object.keys(worldMatrix[col][row].resources).length; resourceI++){
        let p = document.createElement('p');
        p.innerText = Object.keys(worldMatrix[col][row].resources)[resourceI] + " = " + worldMatrix[col][row].resources[Object.keys(worldMatrix[col][row].resources)[resourceI]] + "%";
        resources.push(Object.keys(worldMatrix[col][row].resources)[resourceI] + " = " + worldMatrix[col][row].resources[Object.keys(worldMatrix[col][row].resources)[resourceI]]);
        document.getElementById('gridInfo').appendChild(p)
    }
}
function selectToServer(col, row, action, socket, username, worldGrid){
    selected = [worldGrid[0].children[0], worldGrid[0].children[0].style.borderColor];
    deleteChildren('gridInfo')
    deleteChildren('buildings')
    socket.emit('gus', [col, row, username, action]);
}
function buildRequest(col, row, username, socket, buildings, r){
    deleteChildren('gridInfo')
    deleteChildren('buildings')
    let build;
    if (r === "destroy"){
        build = "destroy";
    }else {
        build = Object.keys(buildings)[r];
    }
    socket.emit('buildRequest', [col, row, username, build])
}
export function buildingUpdate(bupdate,  worldMatrix, worldGrid){
    console.log(bupdate);
    let [y, x, buildtype, money] = bupdate;
    worldMatrix[y][x].building = buildtype;
    if (buildtype === null){
        worldGrid[y].children[x].style.backgroundImage = "url('images/gress.png')";
    }else {
        worldGrid[y].children[x].style.backgroundImage = "url('images/" + worldMatrix[y][x].building + ".png')";
    }
}
function deleteChildren(victim){
    let e = document.getElementById(victim);
    let child = e.lastElementChild;
    while (child) {
        e.removeChild(child);
        child = e.lastElementChild;
    }
}
export function resourceCycles(rUpdate, username, resources){
    let [name, amount, type] = rUpdate;
    if (name === username){
        type = type.replace(/\s/g, '');
        resources[type] += amount;
        sessionStorage.setItem('resources','' + JSON.stringify(resources, null, 2))
        uiResources()

    }


}