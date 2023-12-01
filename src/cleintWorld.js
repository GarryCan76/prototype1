let selected = null;
let storedDeals = {};
let quickResources = [];
function createParagraph(destination, text){
    let p = document.createElement('p');
    p.innerText = text;
    document.getElementById(destination).appendChild(p)
}
export function gridcreator(guc, socket){
    document.getElementById('sortDeals').addEventListener('click', ()=>{sortDeals(socket)})
    document.getElementById('resourceSort').addEventListener('input', ()=>{sortDeals(socket)})
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
            // div.style.WebkitFilter = "invert(" + worldMatrix[y][x].resources.WaterYield / 100 + ")";
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
        p.addEventListener('click', ()=>{
            addQuickResource(Object.keys(resources)[r], resources)
        })
        for (let i = 0; i < quickResources.length; i++){
            if (quickResources[i] === Object.keys(resources)[r]){
                p.style.color = "rgb(99,255,161)";
            }
        }
        document.getElementById('resources').appendChild(p)
    }
}
function addQuickResource(resource, resources){
    let remove = false;
    for (let i = 0; i < quickResources.length; i++){
        if (resource === quickResources[i]){
            quickResources.splice(i, 1)
            remove = true;
        }}
    if (remove === false){
        quickResources.push(resource)
    }
    uiQuickResources(resources)
    uiResources()
}
function uiQuickResources(resources){
    deleteChildren('quickResources')
    for (let r = 0; r < quickResources.length; r++){
        let p = document.createElement('p');
        p.innerText = quickResources[r] + " = " + resources[quickResources[r]];
        document.getElementById('quickResources').appendChild(p)
    }
}
export function sideBarInterface(){
    let sidebar = document.getElementById('sideBar').children;
    for (let i = 0; i < sidebar.length; i++){
        console.log(sidebar[i])
        sidebar[i].addEventListener('click',()=>{
            let sidebar = document.getElementById('sideBar').children;
            for (let y = 0; y < sidebar.length; y++){
                document.getElementById(''+ sidebar[y].children[0].innerHTML).style.display = 'none';
            }
            document.getElementById('pageName').innerText = sidebar[i].children[0].innerHTML;
            document.getElementById('sideBarInterface').style.display = 'flex';
            document.getElementById(''+ sidebar[i].children[0].innerHTML).style.display = 'flex';
        })
    }
}
function buyBuildings(buildings, resource, worldMatrix, col, row, username, socket, worldGrid){
    if (worldMatrix[col][row].building === null){
        for (let r = 0; r < Object.keys(buildings).length; r++){
            let p = document.createElement('p');
            let buildingButton = document.createElement('div');
            let div = document.createElement('div');
            if (buildings[Object.keys(buildings)[r]][4] === "Mine"){
                p.style.backgroundColor = "rgb(187,142,184)";
                p.innerText = Object.keys(buildings)[r];
                div.appendChild(p)
                p = document.createElement('p');
                p.innerText = "Cost to build: " + buildings[Object.keys(buildings)[r]][1];
                div.appendChild(p)
                p = document.createElement('p');
                p.innerText = "produces "+ parseInt(
                    buildings[Object.keys(buildings)[r]][3] * worldMatrix[col][row].resources[buildings[Object.keys(buildings)[r]][2][0]["resourceReqType"]] / 175)+ " " + buildings[Object.keys(buildings)[r]][0];
                div.appendChild(p)
            }else {
                p.innerText = Object.keys(buildings)[r];
                div.appendChild(p)
                p = document.createElement('p');
                p.innerText = "Cost to build: " + buildings[Object.keys(buildings)[r]][1];
                div.appendChild(p)
                p = document.createElement('p');
                p.innerText = "produces "+ buildings[Object.keys(buildings)[r]][3] + " " + buildings[Object.keys(buildings)[r]][0];
                div.appendChild(p)
                for (let i = 0; i < buildings[Object.keys(buildings)[r]][2].length; i++){
                    p = document.createElement('p');
                    p.innerText = "requires " +  buildings[Object.keys(buildings)[r]][2][i]["resourceReqAmt"]+" "+  buildings[Object.keys(buildings)[r]][2][i]["resourceReqType"];
                    if (buildings[Object.keys(buildings)[r]][2][i]["resourceReqType"] === "Electricity"){
                        p.style.backgroundColor = "rgb(231,228,41)";
                    }
                    div.appendChild(p)
                }

            }
            let image = document.createElement('img');
            image.src = "images/"+ Object.keys(buildings)[r] +".png";
            div.appendChild(image)
            buildingButton.appendChild(image)
            buildingButton.appendChild(div)
            document.getElementById('buildings').appendChild(buildingButton)
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
        uiQuickResources(resources)
    }

}
let dealInfo = {"dealUser":sessionStorage.getItem('username'), "takenBy":false , "dealType":null, "dealResource":null, "unitPriceDeal":1, "dealAmount":1, "dealCycles":1};
export function createDeal(socket, selectedR, BuyOrSel){
    deleteChildren('confirm')
    let send = document.createElement('p');
    let submitDeal = {};
    send.innerText = "confirm";
    document.getElementById('confirm').appendChild(send)
    let buy = document.getElementById('buyDeal')
    buy.addEventListener("click", ()=>{createDeal(socket, selectedR, "buy");dealInfo["dealType"] = "buy";})
    let sell = document.getElementById('sellDeal')
    sell.addEventListener("click", ()=>{createDeal(socket, selectedR, "sell");dealInfo["dealType"] = "sell"})
    if (BuyOrSel === "buy"){
        buy.style.backgroundColor = "rgba(30,215,2,1)";
        sell.style.backgroundColor = "rgba(0,0,0,0)";
    }else if (BuyOrSel === "sell"){sell.style.backgroundColor = "rgba(30,215,2,1)";buy.style.backgroundColor = "rgba(0,0,0,0)";}
    send.addEventListener("click", ()=>{
        console.log("send")
        let error = false;
        for (let r = 0; r < Object.keys(dealInfo).length; r++){
            if (dealInfo[Object.keys(dealInfo)[r]] === null){
                error = "not filled in everything";
            }
        }
        if (error === false){
            let dealId = "ID"+ (Math.floor(Math.random() * 99999) + 10000).toString()
            submitDeal[dealId] = dealInfo;
            socket.emit('dealRequest', submitDeal)
        }else {
            alert(error)
        }
        createDeal(socket, selectedR, BuyOrSel)
    })
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
        if (r === selectedR){p.style.backgroundColor = "rgb(30,215,2)";}
        p.innerText = Object.keys(resources)[r];
        p.addEventListener('click', ()=>{
                {createDeal(socket, r, BuyOrSel);dealInfo["dealResource"] = Object.keys(resources)[r]}
        })
        document.getElementById('resourceType').appendChild(p)
    }

}
let selectedDeal = false;
export function dealUpdate(UpdatedDeal, socket){
    deleteChildren('dealInfo')
    let radios = document.getElementsByName('sortingType')
    let filterDealType = document.getElementsByName('dealType')
    let sortedList = [];
    let dealType = null;
    if (filterDealType[0].checked){
        dealType = filterDealType[0].value
        console.log('1')
    }else if (filterDealType[1].checked){
        dealType = filterDealType[1].value
        console.log('2')
    }
    for (let i = 0; i < Object.keys(UpdatedDeal).length; i++){
        let resourceSort = document.getElementById('resourceSort').value.toLowerCase()
        if (dealType === UpdatedDeal[Object.keys(UpdatedDeal)[i]]['dealType'] || dealType === null){
            if (UpdatedDeal[Object.keys(UpdatedDeal)[i]]['dealResource'].toLowerCase().includes(resourceSort)){
                sortedList.push(UpdatedDeal[Object.keys(UpdatedDeal)[i]])
                storedDeals[Object.keys(UpdatedDeal)[i]] = UpdatedDeal[Object.keys(UpdatedDeal)[i]];
            }
        }
    }
    if (radios[0].checked){
        sortedList.sort(function (a, b){
            return a.unitPriceDeal - b.unitPriceDeal;
        })
    }else if (radios[1].checked){
        sortedList.sort(function (a, b){
            return b.unitPriceDeal - a.unitPriceDeal;
        })
    }else if (radios[2].checked){
        sortedList.sort(function (a, b){
            return a.dealCycles - b.dealCycles;
        })
    }else if (radios[3].checked){
        sortedList.sort(function (a, b){
            return b.dealCycles - a.dealCycles;
        })
    }else if (radios[4].checked){
        sortedList.sort(function (a, b){
            return a.dealAmount - b.dealAmount;
        })
    }else if (radios[5].checked){
        sortedList.sort(function (a, b){
            return b.dealAmount - a.dealAmount;
        })
    }

    console.log(sortedList)
    for (let r = 0; r < sortedList.length; r++){
        let deal = sortedList[r];
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
                selectedDeal = r;
                for (let i = 0; i < document.getElementById('exchange').children.length; i++){
                    document.getElementById('exchange').children[i].style.backgroundColor = "rgba(0,0,0,0)";
                }
                if (r === selectedDeal){p.style.backgroundColor = "rgb(30,215,2)";}
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
    currentDeals(storedDeals, socket)
}
export function currentDeals(UpdatedDeal, socket){
    deleteChildren('currentDeals')
    deleteChildren('yourDeals')
    let sortedList = [];
    for (let i = 0; i < Object.keys(UpdatedDeal).length; i++){
        let resourceSort = document.getElementById('resourceSort').value
        if (UpdatedDeal[Object.keys(UpdatedDeal)[i]]['dealResource'].includes(resourceSort)){
            sortedList.push(storedDeals[Object.keys(storedDeals)[i]])
        }
    }

    // console.log("----------")
    for (let r = 0; r < sortedList.length; r++){
        let yourDeal = false;
        let deal = sortedList[r];
        sortedList.sort(function (a, b){
            return b.unitPriceDeal - a.unitPriceDeal;
        })
        // console.log(sortedList)
        if (deal["dealCycles"] !== 0){
            if (deal["takenBy"] === sessionStorage.getItem('username') || deal["dealUser"] === sessionStorage.getItem('username')){
                if (deal["dealUser"] === sessionStorage.getItem('username')){
                    yourDeal = true;
                }
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
                if (yourDeal === true){
                    if (deal["takenBy"]){p.style.backgroundColor = "rgb(30,215,2)";}else {p.style.backgroundColor = "rgb(100,100,100)";}
                    document.getElementById('yourDeals').appendChild(p)
                }else {document.getElementById('currentDeals').appendChild(p)}
            }
        }else {delete UpdatedDeal[Object.keys(UpdatedDeal)[r]]; delete storedDeals[Object.keys(storedDeals)[r]]; r -= 1;}
    }
}
export function dealCycle(dealResources, username, resources, socket){
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
function sortDeals(socket){
    deleteChildren('exchange')
    deleteChildren('yourDeals')
    dealUpdate(storedDeals, socket)
    currentDeals(storedDeals, socket)
}

export function resourceFilter(worldMatrix, worldGrid){
    deleteChildren('resourceFilter')
    let p = document.createElement('p');
    p.innerText = "None";
    p.style.backgroundColor = "#484848";
    p.addEventListener("click", ()=>{overrideStyle(worldGrid, worldMatrix, "None")})
    document.getElementById('resourceFilter').appendChild(p)
    for (let resourceI = 0; resourceI < Object.keys(worldMatrix[0][0].resources).length; resourceI++){
        let p = document.createElement('p');
        p.style.backgroundColor = "#484848";
        p.innerText = Object.keys(worldMatrix[0][0].resources)[resourceI];
        p.addEventListener("click", ()=>{overrideStyle(worldGrid, worldMatrix, Object.keys(worldMatrix[0][0].resources)[resourceI])})
        document.getElementById('resourceFilter').appendChild(p)
    }
}

export function quickSell(socket, selectedR){
    deleteChildren('quickSellButton')
    let resources = JSON.parse(sessionStorage.getItem('resources'));
    let range = document.getElementById('quickSellAmount');
    let p = document.createElement('p');
    p.innerText = "ok";
    deleteChildren('quickResourceSell')
    for (let r = 0; r < Object.keys(resources).length; r++){
        let p = document.createElement('p');
        if (r === selectedR){p.style.backgroundColor = "rgb(30,215,2)";}
        p.innerText = Object.keys(resources)[r];
        p.addEventListener('click', ()=>{
            quickSell(socket, r)
        })
        document.getElementById('quickResourceSell').appendChild(p)
    }
    if (selectedR !== false){
        p.addEventListener("click", ()=>{
            socket.emit('quickSell', [range.value, Object.keys(resources)[selectedR], sessionStorage.getItem('username')])
        })
    }
    document.getElementById('quickSellButton').appendChild(p);
    range.max = resources[Object.keys(resources)[selectedR]];
}
export function quickSellUpdate(quickSellInfo){
    let resources = JSON.parse(sessionStorage.getItem('resources'))
    let username = sessionStorage.getItem('username')
    resourceCycles(quickSellInfo[0], username, resources)
    if (username === quickSellInfo[0][0]){
        sessionStorage.setItem('userMoney','' + quickSellInfo[1])
        document.getElementById('money').innerText = "money $"+ sessionStorage.getItem('userMoney');
    }
}

function overrideStyle(worldGrid, worldMatrix, type){
    for (let col = 0; col < Object.keys(worldGrid).length; col++){
        for (let row = 0; row < worldGrid[col].children.length; row++){
            if (type === "None"){
                worldGrid[col].children[row].style["-webkit-filter"] = "blur(0px) hue-rotate(0deg)";
            }else {
                worldGrid[col].children[row].style["-webkit-filter"] = "blur("+ 0 +"px) hue-rotate("+ (20 + worldMatrix[col][row].resources[type] * 2) +"deg)";
            }
        }
    }
}
export function scoreHandler(scores){
    deleteChildren("scoreBoard")
    for (let i = 0; i < scores.length; i++){
        createParagraph("scoreBoard", (i+1) + " - " + scores[i].name + " - score = " + scores[i].score)
    }
}