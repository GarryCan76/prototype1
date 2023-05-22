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
            "cost": null,
            "building": null,
            "resources": {
                "WaterYield": parseInt(getRandomArbitrary(0, 100)),
                "IronOreYield": parseInt(getRandomArbitrary(0, 100)),
                "CopperOreYield": parseInt(getRandomArbitrary(0, 100)),
                "SiliconOreYield": parseInt(getRandomArbitrary(0, 100)),
                "GoldOreYield": parseInt(getRandomArbitrary(0, 100)),
                "CoalYield": parseInt(getRandomArbitrary(0, 100)),
            },
        })
        let totalresources = 0;
        for (let i = 0; i < Object.keys(ycord[x].resources).length; i++){
            totalresources += ycord[x].resources[Object.keys(ycord[x].resources)[i]]
        }
        console.log(totalresources)
        ycord[x].cost = totalresources;
    }
    console.log("_________")
    newworld.world.push(ycord)
}
worldJson = newworld;
saveJSON('world.json', worldJson)