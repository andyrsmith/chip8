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
console.log(fileContents)

const cliGraphics = new CliGraphics()
const cpu = new CPU(cliGraphics)
const romBuffer = new RomBuffer(fileContents)

cpu.load(romBuffer.getData())

cpu.fetch()
//const emulator = new CliGraphics()

//emulator.drawPixel(43,8)
//emulator.render()
// Move following code to new file
// Should this file read whether there is a rom file in arguments
// read rom file or display error if no rom is provided
// load rom into memory array
