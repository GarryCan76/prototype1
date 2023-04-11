//generate new grid
const fs = require("fs");
let worldSize = 20;
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
for (let y = 0; y < worldSize; y++){
    let ycord = [];
    for (let x = 0; x < worldSize; x++){
        let cost = parseInt(getRandomArbitrary(100, 1000))
        ycord.push({
            "owner": null,
            "cost": cost,
            "building": null,
            "resources": {
                "WaterYield": parseInt(getRandomArbitrary(cost/20, cost/10)),
                "IronOreYield": parseInt(getRandomArbitrary(cost/20, cost/10)),
                "CopperOreYield": parseInt(getRandomArbitrary(cost/20, cost/10)),
                "SiliconOreYield": parseInt(getRandomArbitrary(cost/20, cost/10)),
                "GoldOreYield": parseInt(getRandomArbitrary(cost/20, cost/10)),
                "CoalYield": parseInt(getRandomArbitrary(cost/20, cost/10)),
            },
        })
    }
    newworld.world.push(ycord)
}
console.log(newworld.world)
worldJson = newworld;
saveJSON('world.json', worldJson)