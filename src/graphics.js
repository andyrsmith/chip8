const COLS = 64
const ROWS = 32
const SCALE = 1
const blessed = require('blessed')

const KEYMAP = {
    1: 0x0,
    2: 0x1,
    3: 0x2,
    4: 0x3,
    q: 0x4,
    w: 0x5,
    e: 0x6,
    r: 0x7,
    a: 0x8,
    s: 0x9,
    d: 0xA,
    f: 0xB,
    z: 0xC,
    x: 0xD,
    c: 0xE,
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
        //if(this.displayBuffer[x*y] === undefined) {

        //console.log(value)
        //}
        //this.displayBuffer[x*y] = value
        //how to use fillRegion or should I use boxed
        if(this.displayBuffer[(y*COLS)+x]) {
           this.screen.fillRegion(this.color, '0', x, x+1, y, y+1)
        } else {
            this.screen.clearRegion(x, x+1, y, y+1)
        }


        //if(this.displayBuffer[x*y]) {
        //    this.blessed.box({
        //        parent: this.screen,
        //        top: y,
        //        left: x,
        //        width: 0.5,
        //       height: 0.5,
        //        style: {
        //            fg: 'green',
        //            bg: 'green',
        //        },
        //    })
        //}
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

        return keyPressed
    }

    render() {
        this.screen.render()
    }
}

module.exports = { CliGraphics }
