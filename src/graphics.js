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

        this.screen.key(['escape', 'q', 'C-c'], function(ch, key) {
          process.exit(0);
        });
    }

    drawPixel(x, y, value) {
        this.displayBuffer[x*y] = value
        //if(this.displayBuffer[x*y] === undefined) {

        //console.log(value)
        //}
        //this.displayBuffer[x*y] = value
        //how to use fillRegion or should I use boxed
        //if(this.displayBuffer[x*y]) {

         //   this.screen.fillRegion('#00ff00', 'x', x, x+1, y, y+1)
        //} else {
        //    this.screen.clearRegion(x, x+1, y, y+1)
        //}
        //const collision = this.displayBuffer[x*y] & value

        if(this.displayBuffer[x*y]) {
            this.blessed.box({
                parent: this.screen,
                top: y,
                left: x,
                width: 0.5,
               height: 0.5,
                style: {
                    fg: 'green',
                    bg: 'green',
                },
            })
        }
       this.render()
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

    render() {
        this.screen.render()
    }
}

module.exports = { CliGraphics }
