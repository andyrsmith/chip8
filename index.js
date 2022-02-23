const {CliGraphics } = require('./src/graphics')

const emulator = new CliGraphics()

emulator.drawPixel(43,8)
emulator.render()
