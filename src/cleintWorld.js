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
            div.style.backgroundColor = "rgb(82,82,82)";
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
            row_array[row].style.backgroundColor = "rgb(82,82,82)";
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