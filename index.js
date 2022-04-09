//Todo: move a lot of this to another file
const {CliGraphics } = require('./src/graphics')
const { CPU } = require('./src/cpu')
const { RomBuffer } = require('./src/romBuffer')

const fs = require('fs')
const romFile = process.argv.slice(2)[0]
if(!romFile) {
    console.log('No rom loaded')
    return
}
//opcode are 16 bits but it is loaded into memory into 8 bits
const fileContents = fs.readFileSync(romFile)

const cliGraphics = new CliGraphics()
const cpu = new CPU(cliGraphics)
const romBuffer = new RomBuffer(fileContents)

cpu.load(romBuffer.getData())

//cliGraphics.drawPixel(45, 4, 3)
//todo figure out graphics
//cliGraphics.render()
let timer  = 0
function step() {
    timer++
    if(timer % 5 ===0) {
        cpu.tick()
        timer = 0
    }
    // run tick 60 times per second
   //setInterval(cpu.tick, 5)
    //if(elapsed > fpsInterval) {
    //}
    //for(let i = 0; i < testCycle; i++) {
    //Need a better game loop
    //while(true) {

        cpu.cycle()
   // }
   // cliGraphics.render()
    setTimeout(step, 3)
}

//for(let i = 0; i < 50 ; i++) {

    step()
//}
//const emulator = new CliGraphics()

//emulator.drawPixel(43,8)
//emulator.render()
// Move following code to new file
// Should this file read whether there is a rom file in arguments
// read rom file or display error if no rom is provided
// load rom into memory array
