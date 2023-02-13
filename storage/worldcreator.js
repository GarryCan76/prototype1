//generate new grid
const fs = require("fs");

function loadJSON(filename = ''){
    return JSON.parse(fs.existsSync(filename)
        ? fs.readFileSync(filename).toString()
        : 'null')
}
function saveJSON(filename = '' ,json = '""'){
    return fs.writeFileSync(filename, JSON.stringify(json, null, 2))
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
let worldJson = loadJSON('world.json')

let newworld = {"time": 0, "world": []};
for (let y = 0; y < 10; y++){
    let ycord = [];
    for (let x = 0; x < 10; x++){
        let cost = parseInt(getRandomArbitrary(100, 1000))
        ycord.push({
            "owner": null,
            "cost": cost,
            "WaterYield": parseInt(getRandomArbitrary(cost/20, cost/10)),
            "CropYield": parseInt(getRandomArbitrary(cost/20, cost/10)),
            "IronOreYield": parseInt(getRandomArbitrary(cost/20, cost/10)),
            "CopperOreYield": parseInt(getRandomArbitrary(cost/20, cost/10)),
            "CoalYield": parseInt(getRandomArbitrary(cost/20, cost/10))
        })
    }
    newworld.world.push(ycord)
}
console.log(newworld.world)
worldJson = newworld;
saveJSON('world.json', worldJson)