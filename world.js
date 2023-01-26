
function updateGrid(Gselect, grid){
    console.log(Gselect)
    console.log(grid[Gselect[0]][Gselect[1]])
    if (grid[Gselect[0]][Gselect[1]] === 0){
        grid[Gselect[0]][Gselect[1]] = 1
    }else {
        grid[Gselect[0]][Gselect[1]] = 0
    }
    console.log(grid)
    return Gselect;
}
module.exports.updateGrid = updateGrid
