
function updateGrid(Gselect, grid){
    if (grid[Gselect[0]][Gselect[1]] === 0){
        grid[Gselect[0]][Gselect[1]] = Gselect[2]
    }else {
        grid[Gselect[0]][Gselect[1]] = 0
    }
    return Gselect;
}
module.exports.updateGrid = updateGrid
