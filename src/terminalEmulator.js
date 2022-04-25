const {CliGraphics } = require('./graphics')
const { CPU } = require('./cpu')
const { RomBuffer } = require('./romBuffer')
const fs = require('fs')
const cliGraphics = new CliGraphics()
const cpu = new CPU(cliGraphics)
let timer  = 0

function start(gameFile) {
    if(!gameFile) {
    
        console.log('No rom loaded')
    return
}
    const fileContents = fs.readFileSync(gameFile)
    const romBuffer = new RomBuffer(fileContents)
    cpu.load(romBuffer.getData())
    step()
}

function step() {

    timer++
    //One tick 60 times per second
    if(timer % 5 ===0) {
        cpu.tick()
        timer = 0
    }
        cpu.cycle()
    setTimeout(step, 3)
}

module.exports = {start}

