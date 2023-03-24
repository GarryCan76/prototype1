let selected = null;
let storedDeals = {};
function createParagraph(destination, text){
    let p = document.createElement('p');
    p.innerText = text;
    document.getElementById(destination).appendChild(p)
}
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
            if (buildings[Object.keys(buildings)[r]][4] === "Mine"){
                p.style.backgroundColor = "rgb(187,142,184)";
                p.innerText = Object.keys(buildings)[r] + " produces " + parseInt(
                        buildings[Object.keys(buildings)[r]][3] * worldMatrix[col][row].resources[buildings[Object.keys(buildings)[r]][2][0]["resourceReqType"]] / 175) + " " + buildings[Object.keys(buildings)[r]][0] +
                    " - Cost to build: " + buildings[Object.keys(buildings)[r]][1];
                document.getElementById('buildings').appendChild(p)
            }else {
                p.innerText = Object.keys(buildings)[r] + " produces "+ buildings[Object.keys(buildings)[r]][3] + " " + buildings[Object.keys(buildings)[r]][0] + " - Cost to build: " + buildings[Object.keys(buildings)[r]][1];
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
            + parseInt(buildings[worldMatrix[col][row].building][3] * worldMatrix[col][row].resources[buildings[worldMatrix[col][row].building][2][0]["resourceReqType"]] / 175)
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
    selected[0].style.borderColor = "rgb(255,255,255)";
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
    let [name, update] = rUpdate;
    if (name === username){
        for (let r = 0; r < update.length; r++){
            resources[update[r][1]] = update[r][0];
        }
        sessionStorage.setItem('resources','' + JSON.stringify(resources, null, 2))
        uiResources()
    }

}
let dealInfo = {"dealUser":sessionStorage.getItem('username'), "takenBy":false , "dealType":null, "dealResource":null, "unitPriceDeal":1, "dealAmount":1, "dealCycles":1};
export function createDeal(socket){
    let send = document.getElementById('sendDeal');
    let submitDeal = {};
    send.innerText = "send";
    send.addEventListener("click", ()=>{
        let error = false;
        for (let r = 0; r < Object.keys(dealInfo).length; r++){
            if (dealInfo[Object.keys(dealInfo)[r]] === null){
                error = "not filled in everything";
            }
        }
        if (error === false){
            let dealId = (Math.floor(Math.random() * 99999) + 10000).toString()
            submitDeal[dealId] = dealInfo;
            socket.emit('dealRequest', submitDeal)
        }else {
            console.log(error)
        }
    })
    let buy = document.getElementById('buyDeal')
    buy.addEventListener("click", ()=>{dealInfo["dealType"] = "buy";})
    let sell = document.getElementById('sellDeal')
    sell.addEventListener("click", ()=>{dealInfo["dealType"] = "sell"})
    let unitPrice = document.getElementById('unitPriceDeal')
    unitPrice.addEventListener("input", ()=>{dealInfo["unitPriceDeal"] = unitPrice.value; totalPrice()})
    let amount = document.getElementById('amountDeal')
    amount.addEventListener("input", ()=>{dealInfo["dealAmount"] = amount.value; totalPrice()})
    let cycles = document.getElementById('cycleDeal')
    cycles.addEventListener("input", ()=>{dealInfo["dealCycles"] = cycles.value; totalPrice()})
    function totalPrice(){
        document.getElementById("cyclePriceDeal").innerText = "Price each cycle is " + unitPrice.value * amount.value;
        document.getElementById("totalPriceDeal").innerText = "Total price is " + unitPrice.value * amount.value * cycles.value;
    }
    let resources = JSON.parse(sessionStorage.getItem('resources'));
    deleteChildren('resourceType')
    for (let r = 0; r < Object.keys(resources).length; r++){
        let p = document.createElement('p');
        p.innerText = Object.keys(resources)[r];
        p.addEventListener('click', ()=>{
            {dealInfo["dealResource"] = Object.keys(resources)[r]}
        })
        document.getElementById('resourceType').appendChild(p)
    }
}
export function dealUpdate(UpdatedDeal, socket){
    deleteChildren('dealInfo')
    currentDeals(UpdatedDeal, socket)
    for (let r = 0; r < Object.keys(UpdatedDeal).length; r++){
        let deal = UpdatedDeal[Object.keys(UpdatedDeal)[r]];
        storedDeals[Object.keys(UpdatedDeal)[r]] = deal;
        if (deal["takenBy"] === false){
            let p = document.createElement('p');
            p.innerText = deal["dealType"] + ", " + deal["dealResource"] + " price: " + deal["unitPriceDeal"]+ ", duration: "+ deal["dealCycles"]+ " cycles, "+ deal["dealResource"] +" per cycle: " + deal["dealAmount"];
            p.addEventListener('click', ()=>{
                deleteChildren('dealInfo')
                createParagraph('dealInfo',deal["dealType"]+ "er " + (deal["dealUser"]))
                createParagraph('dealInfo', "resource/good " + (deal["dealResource"]))
                createParagraph('dealInfo', "price per unit " + (deal["unitPriceDeal"]))
                createParagraph('dealInfo', "units per cycle " + (deal["dealAmount"]))
                createParagraph('dealInfo', "number of cycles " + (deal["dealCycles"]))
                createParagraph('dealInfo', "price per cycle " + (deal["dealAmount"] * deal["unitPriceDeal"]))
                createParagraph('dealInfo', "total units of " + (deal["dealResource"]) + " is " + (deal["dealAmount"] * deal["dealCycles"]))
                createParagraph('dealInfo', "total price is " + (deal["dealAmount"] * deal["dealCycles"] * deal["unitPriceDeal"]))
                if (sessionStorage.getItem('username') !== deal["dealUser"]){
                    let p = document.createElement('p');
                    p.innerText = "Accept deal";
                    p.addEventListener('click', ()=>{deleteChildren('dealInfo');socket.emit("dealAcceptie", ["accept", sessionStorage.getItem('username'), Object.keys(UpdatedDeal)[r]]);socket.emit("refreshDeals", 0)})
                    document.getElementById('dealInfo').appendChild(p)
                }
            })
            document.getElementById('exchange').appendChild(p)
        }
    }
}
export function currentDeals(UpdatedDeal, socket){
    deleteChildren('currentDeals')
    for (let r = 0; r < Object.keys(UpdatedDeal).length; r++){
        let deal = UpdatedDeal[Object.keys(UpdatedDeal)[r]];
        if (deal["takenBy"] === sessionStorage.getItem('username') || deal["dealUser"] === sessionStorage.getItem('username')){
            let p = document.createElement('p');
            p.innerText = deal["dealType"] + ", " + deal["dealResource"] + " price: " + deal["unitPriceDeal"]+ ", duration: "+ deal["dealCycles"]+ " cycles, "+ deal["dealResource"] +" per cycle: " + deal["dealAmount"];
            p.addEventListener('click', ()=>{
                deleteChildren('dealInfo')
                createParagraph('dealInfo',deal["dealType"]+ "er " + (deal["dealUser"]))
                createParagraph('dealInfo', "resource/good " + (deal["dealResource"]))
                createParagraph('dealInfo', "price per unit " + (deal["unitPriceDeal"]))
                createParagraph('dealInfo', "units per cycle " + (deal["dealAmount"]))
                createParagraph('dealInfo', "number of cycles " + (deal["dealCycles"]))
                createParagraph('dealInfo', "price per cycle " + (deal["dealAmount"] * deal["unitPriceDeal"]))
                createParagraph('dealInfo', "total units of " + (deal["dealResource"]) + " is " + (deal["dealAmount"] * deal["dealCycles"]))
                createParagraph('dealInfo', "total price is " + (deal["dealAmount"] * deal["dealCycles"] * deal["unitPriceDeal"]))
                if (sessionStorage.getItem('username') === deal["takenBy"]){
                    let p = document.createElement('p');
                    p.innerText = "Cancel deal";
                    p.addEventListener('click', ()=>{deleteChildren('dealInfo');socket.emit("dealAcceptie", ["cancel", sessionStorage.getItem('username'), Object.keys(UpdatedDeal)[r]]);socket.emit("refreshDeals", 0)})
                    document.getElementById('dealInfo').appendChild(p)
                }
                if (sessionStorage.getItem('username') === deal["dealUser"]){
                    let p = document.createElement('p');
                    p.innerText = "Remove deal";
                    p.addEventListener('click', ()=>{deleteChildren('dealInfo');socket.emit("dealAcceptie", ["remove", sessionStorage.getItem('username'), Object.keys(UpdatedDeal)[r]]);socket.emit("refreshDeals", 0)})
                    document.getElementById('dealInfo').appendChild(p)
                }
            })
            document.getElementById('currentDeals').appendChild(p)
        }
    }
}
export function dealCycle(dealResources, username, resources){
    resourceCycles(dealResources[0], username, resources)
    resourceCycles(dealResources[1], username, resources)
    if (username === dealResources[0][0]){
        sessionStorage.setItem('userMoney','' + dealResources[2])
        document.getElementById('money').innerText = "money $"+ sessionStorage.getItem('userMoney');
    }else if (username === dealResources[1][0]){
        sessionStorage.setItem('userMoney','' + dealResources[3])
        document.getElementById('money').innerText = "money $"+ sessionStorage.getItem('userMoney');
    }
}
export function dealHistory(deals, socket){
    deleteChildren('exchange')
    dealUpdate(deals, socket)
}
