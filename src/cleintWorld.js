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
            if (worldMatrix[y][x] !== 0){
                if (worldMatrix[y][x] === sessionStorage.getItem('username')) {
                    div.style.backgroundColor = "rgb(2, 215, 208)";
                }else {
                    div.style.backgroundColor = "rgb(2,109,215)";
                }
            }
            cols[y].appendChild(div)
        }
    }
    return [document.getElementById('worldGrid').children, worldMatrix]
}

export function gridInputHandler(gridupdate, worldMatrix, worldGrid){
    let [col, row, user] = gridupdate
    let y = worldMatrix[col]
    var row_array = worldGrid[col].children;
    if (y[row] === 0){
        y[row] = user;
        if (user === sessionStorage.getItem('username')){
            row_array[row].style.backgroundColor = "rgb(2, 215, 208)";

        }else {
            row_array[row].style.backgroundColor = "rgb(2,109,215)";
        }
    }else {
        row_array[row].style.backgroundColor = "rgba(211, 20, 20, 0.21)";
        y[row] = 0;
    }
}