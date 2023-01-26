export function gridcreator(guc){
    let worldMatrix = guc;
    console.log(worldMatrix)
    for (let y = 0; y < guc.length; y++){
        let div_col = document.createElement('div');
        div_col.classList.add('col');
        let col = document.getElementById('worldGrid').appendChild(div_col);
    }
    let cols = document.getElementsByClassName('col')
    for (let y = 0; y < cols.length; y++){
        for (let x = 0; x < guc[0].length; x++){
            let div = document.createElement('div')
            if (worldMatrix[y][x] === 1) {
                div.style.backgroundColor = "rgb(2, 215, 208)";
            }
            cols[y].appendChild(div)
        }
    }
    return [document.getElementById('worldGrid').children, worldMatrix]
}

export function gridInputHandler(col, row, worldMatrix, worldGrid){
    let y = worldMatrix[col]
    if (y[row] === 0){
        y[row] = 1;
    }else {
        y[row] = 0;
    }

    var row_array = worldGrid[col].children;
    if (row_array[row].style.backgroundColor === "rgb(2, 215, 208)"){
        row_array[row].style.backgroundColor = "rgba(211, 20, 20, 0.21)";
    }else {
        row_array[row].style.backgroundColor = "rgb(2, 215, 208)";
    }
}