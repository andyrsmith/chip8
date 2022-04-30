#!/usr/bin/env node

const TerminalEmulator = require('./src/terminalEmulator')
const romFile = process.argv.slice(2)[0]

TerminalEmulator.start(romFile)

