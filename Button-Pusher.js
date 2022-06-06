// https://github.com/Artucuno/Button-Pusher
enum RadioMessage {
    message1 = 49434
}
radio.onReceivedNumber(function (receivedNumber) {
    for (let index = 0; index < 3; index++) {
        if (receivedNumber > clicks) {
            basic.showString("Lost - " + receivedNumber)
        } else if (receivedNumber == clicks) {
            basic.showString("Tie! - " + receivedNumber)
        } else {
            basic.showString("Winner! - " + receivedNumber)
        }
    }
    canRestart = 1
    basic.showArrow(ArrowNames.East)
})
input.onButtonPressed(Button.A, function () {
    if (canClick) {
        clicks += 1
    }
})
function timer () {
    canRestart = 0
    basic.showNumber(3)
    basic.pause(200)
    basic.showNumber(2)
    basic.pause(200)
    basic.showNumber(1)
    basic.pause(200)
    clicks = 0
    canClick = 1
    basic.showString("GO!")
    for (let index = 0; index < 6; index++) {
        basic.showIcon(IconNames.SmallDiamond)
        basic.pause(5000)
        basic.showIcon(IconNames.Diamond)
    }
    canClick = 0
    basic.pause(100)
    radio.sendNumber(clicks)
}
// Fix starting without other player.
radio.onReceivedString(function (receivedString) {
    canRestart = 0
    if (receivedString == "serverReady") {
        radio.sendString("clientReady")
        timer()
    } else if (receivedString == "clientReady") {
        timer()
    }
})
input.onButtonPressed(Button.B, function () {
    if (canRestart) {
        canRestart = 0
        if (isServer) {
            radio.sendString("serverReady")
        } else {
            radio.sendString("clientReady")
            timer()
        }
    }
    if (canClick) {
        clicks += 1
    }
})
radio.onReceivedValue(function (name, value) {
    if (!(isConnected)) {
        if (value == 69) {
            isConnected = 1
        }
        if (value == connectionNum) {
            isConnected = 1
            isServer = 1
            radio.sendValue("connectionCode", 69)
        }
    }
})
// createServer Function
// LED (True/False) - Enable LED light once connected
// group (int) - Set radio group
// min (int) - Set minimum random number
// max (int) - Set maximum random number
function createServer (LED: boolean, showNum: boolean, group: number, min: number, max: number) {
    radio.setGroup(group)
    radio.setTransmitPower(7)
    connectionNum = randint(min, max)
    // Turns on an LED light once connected. Can be used for anything.
    // (Set the write pin)
    if (showNum) {
        basic.showNumber(connectionNum)
        basic.pause(200)
    }
    // Guesses the other microbit connectionNum
    while (!(isConnected)) {
        radio.sendValue("connectionCode", randint(min, max))
        basic.pause(50)
    }
    // Turns on an LED light once connected. Can be used for anything.
    // (Set the write pin)
    if (LED) {
        pins.digitalWritePin(DigitalPin.P0, 1)
    }
    basic.showIcon(IconNames.Yes)
    if (isServer) {
        radio.sendString("serverReady")
    }
}
let connectionNum = 0
let isConnected = 0
let isServer = 0
let canClick = 0
let canRestart = 0
let clicks = 0
let _4digit = grove.createDisplay(DigitalPin.P2, DigitalPin.P16)
_4digit.set(7)
radio.setGroup(86)
radio.setTransmitPower(7)
radio.sendString("")
createServer(false, true, 87, 0, 10)
basic.forever(function () {
    _4digit.show(clicks)
})
