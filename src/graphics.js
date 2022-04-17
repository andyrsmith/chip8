const COLS = 64
const ROWS = 32
const SCALE = 1
const blessed = require('blessed')

const KEYMAP = {
    1: 0x1,
    2: 0x2,
    3: 0x3,
    4: 0xc,
    q: 0x4,
    w: 0x5,
    e: 0x6,
    r: 0xd,
    a: 0x7,
    s: 0x8,
    d: 0x9,
    f: 0xe,
    z: 0xa,
    x: 0x0,
    c: 0xb,
    v: 0xF
}

class CliGraphics {
    displayBuffer = []
    keys = 0
    keyPressed = undefined

    constructor() {
        this.blessed = blessed
        this.screen = blessed.screen({
            smartCSR: true
        })
        this.createDisplayBuffer()

        this.screen.title = "Chip 8 Emulator"
        this.KEYMAP = KEYMAP
        this.screen.key(['escape', 'C-c'], function(ch, key) {
          process.exit(0);
        });
        this.color = blessed.helpers.attrToBinary({ fg: "GREEN"})
        this.screen.on('keypress', (key, keyObject) => {
            this.keys = this.keys | this.KEYMAP[key]
            this.keyPressed = key
        })

        setInterval(() => {
            this.resetKeys()
        }, 100)

    }

    drawPixel(x, y, value) {
        const collision = this.displayBuffer[(y*ROWS)+x] & value
        this.displayBuffer[(y*COLS)+x] ^= value

        if(this.displayBuffer[(y*COLS)+x]) {
           this.screen.fillRegion(this.color, '0', x, x+1, y, y+1)
        } else {
            this.screen.clearRegion(x, x+1, y, y+1)
        }

       this.render()

        return collision
    }

    createDisplayBuffer() {
        for(let i = 0; i < COLS * ROWS; i++) {
            this.displayBuffer[i] = 0
        }
    }

    clearScreen() {
        this.createDisplayBuffer()
        this.screen.clearRegion(0, COLS, 0, ROWS)
    }

    getKeyValue() {
        return this.keys
    }

    resetKeys() {
        this.keys = 0
        this.keyPressed = undefined
    }

    waitKey() {
        const keyPressed = this.keyPressed
        this.keyPressed = undefined

        return this.KEYMAP[keyPressed]
    }

    render() {
        this.screen.render()
    }
}

module.exports = { CliGraphics }
