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
    //Stack for 16 bit addresses which is used to call subroutines/functions and return from them
    stack = []
    // program counter that points to an instruction in memory
    // 16-bit index register called I which is used to point at location in memory
    // 8 bit delay timer which is decremnted at a rate of 60Hz (60 times per second) until it reaches 9
    // 8 bit sound timer which functions like delay timer, and also gives off a beeping sound as long as it's not 0
    // 16 8-bit general-purpose variable registers numbered 0 through F hexadecimal 0 through 15 in decimal called V0 through VF
    // VF is also used as a flag register; many instructions will set it to either 1 or 0 based on some rule, example using it as a carry flag

    constructor(graphics) {
        this.graphics = graphics

        this.memory = new Uint8Array(4096)
        this.registers = new Uint8Array(16)
        this.I = 0
        this.pc = 0x200
        this.SP = 0
        this.delayTimer = 0
        this.soundTimer = 0
        this.debug = false
    }

    cycle() {
        //run tick 60 times per second
        //for(let i = 0; i<25; i++) {
        //    this.graphics.drawPixel(10+i,12+i,0)
        //    this.graphics.render()
        //}
        this.fetch()
        this.decode()
        this.execute()
    }

    tick() {
        if(this.delayTimer > 0) {
            this.delayTimer--
        }
    }

    fetch() {
        //Retreive 2 bytes from memory and combine to make a 16 bit instruction
        //First is the most significant bytes so shift it to the left by 8 bits

        let firstOpcode = this.memory[this.pc] << 8
        let secondOpcode = this.memory[this.pc+1]
        //combine both bytes to make one instruction
        //OR operations will carry down the 1s from each instruction
        this.opcode = firstOpcode | secondOpcode
        //once 2 bytes are returned from memory then increment the pc counter by 2
        //this.pc += 2

    }

    nextInstruction() {
        this.pc += 2
    }

    skipInstruction() {
        this.pc += 4
    }

    decode() {
        this.x = (this.opcode & 0x0f00) >> 8
        this.y = (this.opcode & 0x00f0) >> 4
        this.nn = (this.opcode & 0xff)
        this.nnn = (this.opcode & 0xfff)
        if(this.debug) {
            console.log(this.opcode.toString(16).padStart(4, '0'))
        }
        switch(this.opcode & 0xf000) {
            case 0x0000:
                switch(this.opcode & 0x00ff) {
                    case 0x00e0:
                        //call to clear the display
                        //store what to run in a variable then when execute is call call it
                        this.instruction = 'CLS'
                        break
                    case 0x00ee:
                        //this.instruction = 'NOPE'
                        // Return from subroutine
                        this.instruction = 'RET'
                        //call to return from subroutines
                        break
                                        }
                break
            case 0x1000:
                //jump to location
                this.instruction = 'JMP'
                break
            case 0x2000:
                //this.instruction = 'NOPE'
                // Call Subroutine at nnn
                this.instruction = 'CALL_ADDR'
                break
            case 0x3000:
                        //this.instruction = 'NOPE'
                //Skip next instruction if vx equals KK
                this.instruction = 'SKP_VX_KK'
                break

            case 0x4000:
                        //this.instruction = 'NOPE'
                //skip to next instruction if vx is not equals to kk
                this.instruction = 'SKP_NOT_VX_KK'
                break
            case 0x5000:
                        //this.instruction = 'NOPE'
                // skip next instruction if Vx is equal to Vy
                this.instruction = 'SKP_VX_VY'
                break
            case 0x6000:
                // set register vx
                this.instruction = 'SVX'
                break
            case 0x7000:
                //add value to register vx
                this.instruction = 'AVX'
                break
            case 0x8000:
                switch(this.opcode & 0xf) {
                    case 0x0:
                        //this.instruction = 'NOPE'
                        // set vx register to y
                        this.instruction = 'SET_VX_VY'
                        break
                    case 0x1:
                        //this.instruction = 'NOPE'
                        // set Vx to Vx or Vy
                        this.instruction = 'SET_VX_OR_VY'
                        break
                    case 0x2:
                        //this.instruction = 'NOPE'
                        //Set Vx to Vx and Vy
                        this.instruction = 'SET_VX_AND_VY'
                        break
                    case 0x3:
                        //this.instruction = 'NOPE'
                        //Set VX ot Vx XOR Vy
                        this.instruction = 'SET_VX_XOR_VY'
                        break
                    case 0x4:
                        //this.instruction = 'NOPE'
                        //Set Vx = Vx + Vy, set VF = carry
                        this.instruction = 'ADD_VX_VY'
                        break
                    case 0x5:
                        //this.instruction = 'NOPE'
                        //Set Vx = Vx-Vy, set VF = Not burrow
                        this.instruction = 'SUB_VX_VY'
                        break
                    case 0x6:
                        //`this.instruction = 'NOPE'
                        // Set Vx = Vx Shr 1
                        this.instruction = 'SHR_VX'
                        break
                    case 0x7:
                        //this.instruction = 'NOPE'
                        // Set Vx = Vy - Vx set VF = Not burrow
                        this.instruction = 'SUB_VY_VX'
                        break
                    case 0xE:
                        //this.instruction = 'NOPE'
                        // Set Vx = Vx SHL 1
                        this.instruction = 'SHL_VX'
                        break
                }
                break
            case 0x9000:
                        //this.instruction = 'NOPE'
                // increments program by 2 if Vx is not equal to Vy
                this.instruction = 'SNE_VX_VY'
                break
            case 0xA000:
                // set index register I
                this.instruction = 'INX'
                break
            case 0xB000:
                //this.instruction = 'NOPE'
                this.instruction = 'JMP_OFFSET'
                break
            case 0xC000:
                //this.instruction = 'NOPE'
                this.instruction = 'RAN'
                break
            case 0xD000:
                //Dracode & 0x000f) >> 12
                this.instruction = 'DRW'
                break

            case 0xE000:
                switch(this.nn) {
                    case 0x9E:
                        //this.instruction = 'NOPE'
                        this.instruction = 'SKP_KEY_VX'
                        break
                    case 0xA1:
                        //this.instruction = 'NOPE'
                        this.instruction = 'SKP_NOT_KEY_VX'
                        break
                }
                //Instructions have to do with keypresses
                break
            case 0xF000:
                switch(this.nn) {
                    case 0x07:
                        //this.instruction = 'NOPE'
                        this.instruction = 'SET_VX_DEL'
                        break
                    case 0x0A:
                        //this.instruction = 'NOPE'
                        this.instruction = 'WAIT_KEY'
                        break
                    case 0x15:
                        //this.instruction = 'NOPE'
                        this.instruction = 'SET_DEL_VX'
                        break
                    case 0x18:
                        //this.instruction = 'NOPE'
                        this.instruction = 'SET_SOUND'
                        break
                    case 0x1E:
                        //this.instruction = 'NOPE'
                        this.instruction = 'SET_INX'
                        break
                    case 0x29:
                       // this.instruction = 'NOPE'
                        this.instruction = 'INX_SPR_VX'
                        break
                    case 0x33:
                        //this.instruction = 'NOPE'
                        this.instruction = 'BCD_VX'
                        break
                    case 0x55:
                        //this.instruction = 'NOPE'
                        this.instruction = 'STORE_REG'
                        break
                    case 0x65:
                        //this.instruction = 'NOPE'
                        this.instruction = 'LOAD_REG'
                        break
                }

                break
                
            default:
                //console.log("Instruction not found")
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
        // When should I increment and when should I not
        switch(this.instruction) {
            case 'CLS':
                //clear display
                this.graphics.clearScreen()
                this.nextInstruction()
                break
            case 'RET':
                this.pc = this.stack.pop()
                break
                //this.SP--
            case 'JMP':
                //0x1000 Jump
                this.pc = this.nnn
                break
            case 'CALL_ADDR':
                // 0x2nnn
                this.nextInstruction()
                this.stack.push(this.pc)
                this.pc = this.nnn
                break
            case 'SKP_VX_KK':
                // 3xkk skip to next instruction if Vx is equal to kk
                if(this.registers[this.x] === this.nn){
                    this.skipInstruction()
                } else {
                    this.nextInstruction()
                }
                break
            case 'SKP_NOT_VX_KK':
                // 4xkk skip instruction if Vx != kk
                if(this.registers[this.x] !== this.nn) {
                    this.skipInstruction()
                } else {
                    this.nextInstruction()
                }
                break;
            case 'SKP_VX_VY':
                // 4xy0 skip next instruction if Vx = Vy
                if(this.registers[this.x] === this.registers[this.y]) {
                    this.skipInstruction()
                } else {
                    this.nextInstruction()
                }
                break
            case 'SVX':
                //0x6XNN set register vx
                this.registers[this.x] = this.nn
                this.nextInstruction()
                //next instruction
                break
            case 'AVX':
                //0x7XNN add value to register vx
                this.registers[this.x] += this.nn
                this.nextInstruction()
                break
            case 'SET_VX_VY':
                //8xy0 Set Vx = Vy
                this.registers[this.x] = this.registers[this.y]
                this.nextInstruction()
                break
            case 'SET_VX_OR_VY':
                //8xy1 set Vx to Vx or Vy
                this.registers[this.x] |= this.registers[this.y]
                this.nextInstruction()
                break
            case 'SET_VX_AND_VY':
                //8xy2 Set Vx to Vx and Vy
                this.registers[this.x] &= this.registers[this.y]
                this.nextInstruction()
                break
            case 'SET_VX_XOR_VY':
                //8xy3 Set VX ot Vx XOR Vy
                this.registers[this.x] ^= this.registers[this.y]
                this.nextInstruction()
                break
            case 'ADD_VX_VY':
                //8xy4 Set Vx = Vx + Vy, set VF = carry
                let value = (this.registers[this.x] += this.registers[this.y])
                if(value > 0xff) {
                    this.registers[0xf] = 1
                    this.registers[this.x] = value
                } else {
                    this.registers[0xf] = 0
                    this.registers[this.x] = value
                }
                this.nextInstruction()
                break
            case 'SUB_VX_VY':
                //8xy5 Set Vx = Vx-Vy, set VF = Not burrow
                if(this.registers[this.x] > this.registers[this.y]) {
                    this.registers[0xf] = 1
                } else {
                    this.registers[0xf] = 0
                }

                this.registers[this.x] = this.registers[this.x] - this.registers[this.y]
                this.nextInstruction()
                break
            case 'SHR_VX':
                //8xy6 Set Vx = Vx Shr 1
                // Optional set VX to the value VY
                this.registers[0xF] = (this.registers[this.x] & 0x1)
                this.registers[this.x] = this.registers[this.x] >> 1
                this.nextInstruction()
                break
            case 'SUB_VY_VX':
                //8xy7 Set Vx = Vy - Vx set VF = Not burrow
                if(this.registers[this.y] > this.registers[this.x]) {
                    this.registers[0xf] = 1
                } else {
                    this.registers[0xf] = 0
                }

                this.registers[this.x] = this.registers[this.y] - this.registers[this.x]
                this.nextInstruction()
                break
            case 'SHL_VX':
                //8xyE Set Vx = Vx SHL 1
                this.registers[0xf] = (this.registers[this.x] & 0xf0) >> 7
                console.log(this.registers[0xf].toString(16))
                this.registers[this.x] <<= 1
                this.nextInstruction()

                break
            //9xy0
            case 'SNE_VX_VY':
                if(this.registers[this.x] !== this.registers[this.y]) {
                    this.skipInstruction()
                } else {
                    this.nextInstruction()
                }
                break
            case 'INX':
                //0xANNN set register I
                this.debug =false
                this.I = this.nnn
                this.nextInstruction()
                break 
            case 'JMP_OFFSET':
                //0xBNNN Jump to nnn + V0
                this.pc = this.nnn + this.registers[0]
                break
            case 'RAN':
                //0xCXKK Random number from 0 to 255 is generated the result is AND with KK and stored in Vx
                let random = Math.floor(Math.random() * 255)
                this.registers[this.x] = random & this.nn
                this.nextInstruction()
                break

            case 'DRW':
                //0xDXYN Draw to display
                // Draw an N pixel tallj sprite from the memory location I (index) at horizontal X coordinate in VX and Y coordinate in VY
                this.registers[0xf] = 0
                // Grab the nth pixel to determine how many pixel tall it is
                const n = this.opcode & 0xf
                for(let i = 0; i < n; i++) {
                    // grab the sprite at position i and increment by i tall
                    let spriteData = this.memory[this.I + i]
                    for(let position = 0; position < 8; position++) {
                         let value = spriteData & (1 << (7 - position)) ? 1 : 0
                // If this causes any pixels to be erased, VF is set to 1
                        //if(value === 1) {
                        //    this.registers[0xf] = 1
                        //}
                        let x = (this.registers[this.x] + position) % 64 // wrap around width
                        let y = (this.registers[this.y] + i) % 32 // wrap around height
                        this.graphics.drawPixel(x, y, value)
                    }

                }
                this.nextInstruction()
                break
            case 'SKP_KEY_VX':
                // EX9E Skip one instruction if key value in VX is pressed
                // implement when keyboard is implemented
                this.nextInstruction()
                break
            case 'SKP_NOT_KEY_VX':
                // EXA1 Skip instruction if key value VX is not pressed
                this.nextInstruction()
                break
 
            case 'SET_VX_DEL':
                //FX07 Set VX = delay timer
                this.registers[this.x] = this.delayTimer
                this.nextInstruction()
                break
            case 'WAIT_KEY':
                // FX0A Wait for key pressed, store the value of the key in VX
                this.nextInstruction()
                break
            case 'SET_DEL_VX':
                // FX15 Set delay timer = VX
                this.delayTimer = this.registers[this.x]
                this.nextInstruction()
                break
            case 'SET_SOUND':
                // FX18 Set sound timer = VX
                break
            case 'SET_INX':
                // FX1E Set I = I + VX
                this.I = this.I + this.registers[this.x]
                this.nextInstruction()
                break
            case 'INX_SPR_VX':
                // FX29 Set I = location of sprite for digit VX
                //this.I = this.memory[this.I] + this.registers[this.x]
                this.I = this.registers[this.x] * 5
                this.nextInstruction()
                break
            case 'BCD_VX':
                // FX33 Store BCD representation of VX in memory lcation I, I+1, and I+2
                this.memory[this.I] = parseInt(this.registers[this.x]/100)
                this.memory[this.I+1] =  parseInt((this.registers[this.x] % 100) / 10)
                this.memory[this.I+2] =  parseInt(this.registers[this.x] % 10)
                this.nextInstruction()
                break
            case 'STORE_REG':
                // FX55 Store registers V0 through Vx in memory starting at location I
                for(let i = 0; i <= this.x; i++) {
                    this.memory[this.I+i] = this.registers[i]
                }
                this.nextInstruction()
                break
            case 'LOAD_REG':
                // Read register V0 through vX from memory starting at location I
                for(let i = 0; i <= this.x; i++) {
                    this.registers[i] = this.memory[this.I+i]
                }
                this.nextInstruction()

                break
            case 'NOPE':
                this.nextInstruction()
                break
            default:
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
