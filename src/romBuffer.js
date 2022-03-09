//Loads content of the rom ready to be stored into memory in the CPU
class RomBuffer {
    data = []
    constructor(fileContents) {
        for(let i=0; i<fileContents.length; i +=2) {
            this.data.push((fileContents[i] << 8) | (fileContents[i+1] << 0))
        }

    }

    getData() {
        return this.data
    }
}

module.exports = { RomBuffer }
