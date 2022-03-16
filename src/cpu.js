const fonts = [
    0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
    0x20, 0x60, 0x20, 0x20, 0x70, // 1
    0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
    0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
    0x90, 0x90, 0xF0, 0x10, 0x10, // 4
    0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
    0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
    0xF0, 0x10, 0x20, 0x40, 0x40, // 7
    0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
    0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
    0xF0, 0x90, 0xF0, 0x90, 0x90, // A
    0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
    0xF0, 0x80, 0x80, 0x80, 0xF0, // C
    0xE0, 0x90, 0x90, 0x90, 0xE0, // D
    0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
    0xF0, 0x80, 0xF0, 0x80, 0x80  // F
]



class CPU {
    //memory that has up to 4KB of ram
    memory = new Int16Array(4096)
    //Stack for 16 bit addresses which is used to call subroutines/functions and return from them
    stack = []
    // program counter that points to an instruction in memory
    // 16-bit index register called I which is used to point at location in memory
    // 8 bit delay timer which is decremnted at a rate of 60Hz (60 times per second) until it reaches 9
    // 8 bit sound timer which functions like delay timer, and also gives off a beeping sound as long as it's not 0
    // 16 8-bit general-purpose variable registers numbered 0 through F hexadecimal 0 through 15 in decimal called V0 through VF
    registers = new Uint16Array(16)
    // VF is also used as a flag register; many instructions will set it to either 1 or 0 based on some rule, example using it as a carry flag

    constructor(graphics) {
        this.graphics = graphics

        this.I = 0
        this.pc = 0x200
        this.delayTimer = 0
        this.soundTimer = 0
    }

    cycle() {
        //for(let i = 0; i<25; i++) {
        //    this.graphics.drawPixel(10+i,12+i,0)
        //    this.graphics.render()
        //}
        this.fetch()
        this.decode()
        this.execute()
    }

    fetch() {
        //Retreive 2 bytes from memory and combine to make a 16 bit instruction
        //First is the most significant bytes so shift it to the left by 8 bits

        let firstOpcode = this.memory[this.pc] << 8
        let secondOpcode = this.memory[this.pc+1]
        //combine both bytes to make one instruction
        //OR operations will carry down the 1s from each instruction
        this.opcode = firstOpcode | secondOpcode
        this.x = (this.opcode & 0x0f00) >> 8
        this.y = (this.opcode & 0x00f0) >> 4
        this.nn = this.opcode & 0xff
        this.nnn = this.opcode & 0xfff

        //once 2 bytes are returned from memory then increment the pc counter by 2
        //this.pc += 2

    }

    nextInstruction() {
        this.pc += 2
    }

    decode() {
        switch(this.opcode & 0xf000) {
            case 0x0000:
                switch(this.opcode & 0x00ff) {
                    case 0x00e0:
                        //call to clear the display
                        //store what to run in a variable then when execute is call call it
                        this.instruction = 'CLS'
                        break
                    case 0x00ee:
                        //call to return from subroutines
                        break
                                        }
            case 0x1000:
                //jump to location
                this.instruction = 'JMP'
                break
            case 0x2000:
                console.log('Instruction 0x2000 not implemented')
                //call subroutines
                break
            case 0x3000:

                //do this one
                console.log('Instruction 0x3000 not implemented')
                //comparing values
                break

            case 0x4000:
                console.log('Instruction 0x4000 not implemented yet')
                break
            case 0x5000:
                console.log('Instruction 0x5000 not implemented yet')
                break
            case 0x6000:
                // do this one
                console.log('Instruction 0x6000 not implemented')
                // set register vx
                this.instruction = 'SVX'
                break
            case 0x7000:
                //add value to register vx
                this.instruction = 'AVX'
                break
            case 0x8000:
                console.log('Instruction 0x8000 not implemented yet')
                break
            case 0xA000:
                // set index register I
                this.instruction = 'INX'
                break
            case 0xB000:
                console.log('Instruction 0xB000 not implemented yet')
                break
            case 0xC000:
                console.log('Instruction 0xC000 not implemented yet')
                break
            case 0xE000:
                console.log('Instruction 0xE000 not implemented yet')
                break
            case 0xF000:
                console.log('Instruction 0xF000 not implemented yet')
                break
                
            case 0xD000:
                //Dracode & 0x000f) >> 12
                this.instruction = 'DRW'
                break
            default:
                console.log("Instruction not found")
                break
        }
        //Create variables of the following nibbles and bytes
        //These will be reused in different parts

        //X : The second nibble.  Used to look up one of the 16 register VX from V0 through Vf
        //Y : The third nibble.  User to look up one of the 16 registrer VY from V0 through Vf
        //N : the fourth nibble a 4-bit number
        //NN : the second byte (third and fourth nibbles) an 8-bit immediate number
        //NNN : the second, third and fourth nibbles. A 12 bit immediate memory address
        //
        //The create the switch statement decoding the different instructions

    }

    execute() {
        this.nextInstruction()
        switch(this.instruction) {
            case 'CLS':
                //clear display
                this.graphics.clearScreen()
                break
            case 'JMP':
                //0x1000 Jump
                this.pc = this.nnn
                //this.nextInstruction()
                break
            case 'SVX':
                //0x6XNN set register vx
                this.registers[this.x] = this.nn
                //next instruction
                break
            case 'AVX':
                //0x7XNN add value to register vx
                this.registers[this.x] += this.nn
                //next instruction
                break
            case 'INX':
                //0xANNN set register I
                this.I = this.nnn
                //next instruction
                break
            case 'DRW':
                //0xDXYN Draw to display
                // Draw an N pixel tallj sprite from the memory location I (index) at horizontal X coordinate in VX and Y coordinate in VY
                this.registers[0xf] = 0
                //this.graphics.drawPixel(32,12,0)
                // Grab the nth pixel to determine how many pixel tall it is
                const n = this.opcode & 0xf
                for(let i = 0; i < n; i++) {
                    // grab the sprite at position i and increment by i tall
                    let spriteData = this.memory[this.I + i]
                    for(let position = 0; position < 8; position++) {
                         let value = spriteData & (1 << (7 - position)) ? 1 : 0
                // If this causes any pixels to be erased, VF is set to 1
                        let x = (this.registers[this.x] + position) % 64 // wrap around width
                        let y = (this.registers[this.y] + i) % 32 // wrap around height
                        this.graphics.drawPixel(x, y, value)
                    }

                }
                break

        }
    }

    load(romData) {
        //Load font into memory anywhere in the first 512 bytes 000-1FF
        for(let f = 0; f < fonts.length; f++) {
            this.memory[f] = fonts[f]
        }

        let memoryCounter = 0x200
        //Rom is loaded into memory in 8 bit chunks
        for(let i = 0; i < romData.length; i++) {
            this.memory[memoryCounter] = romData[i] >> 8
            this.memory[memoryCounter + 1] = romData[i] & 0x00ff
            memoryCounter += 2
        }
    }
}

module.exports = { CPU }
