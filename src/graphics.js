const COLS = 64
const ROWS = 32
const SCALE = 1
const blessed = require('blessed')

class CliGraphics {
    displayBuffer = [] 

    constructor() {
        this.blessed = blessed
        this.screen = blessed.screen({
            smartCSR: true
        })

        this.createDisplayBuffer()

        this.screen.title = "Chip 8 Emulator"
    }

    drawPixel(x, y, n) {
        this.blessed.box({
            parent: this.screen,
            top: y,
            left: x,
            width: n * SCALE,
            height: n * SCALE,
            style: {
                fg: 'green',
                bg: 'green',
            },
        })
    }

    createDisplayBuffer() {
        for(let i = 0; i < COLS * ROWS; i++) {
            this.displayBuffer[i] = 0
        }
    }

    clearScreen() {
        this.screen.clearRegion(0, COLS, 0, ROWS)
    }

    render() {
        this.screen.render()
    }
}

module.exports = { CliGraphics }
