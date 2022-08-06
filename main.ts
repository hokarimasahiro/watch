function コントローラ処理 () {
    radio.setGroup(無線グループ)
    if (input.buttonIsPressed(Button.A)) {
        Y = Math.constrain(input.rotation(Rotation.Pitch) * -10, -512, 512)
        X = Math.constrain(input.rotation(Rotation.Roll) * 10, -512, 512)
    } else {
        X = 0
        Y = 0
    }
    radio.sendString("$," + X + "," + Y)
    buttonNo = 0
    if (pins.digitalReadPin(DigitalPin.P8) == 0) {
        buttonNo += 1
    }
    if (pins.digitalReadPin(DigitalPin.P12) == 0) {
        buttonNo += 2
    }
    if (pins.digitalReadPin(DigitalPin.P13) == 0) {
        buttonNo += 4
    }
    if (input.isGesture(Gesture.Shake)) {
        buttonNo = 6
    }
    strip.showColor(color[buttonNo])
    strip.show()
    radio.sendNumber(buttonNo)
    radio.setGroup(0)
    basic.pause(50)
}
function 時計処理 () {
    basic.pause(100)
    ds3231.getClock()
    if (ds3231.getClockData(clockData.minute) == 0 && ds3231.getClockData(clockData.second) == 0) {
        pins.digitalWritePin(DigitalPin.P2, 1)
        basic.pause(200)
        pins.digitalWritePin(DigitalPin.P2, 0)
        basic.pause(800)
    }
    if (input.buttonIsPressed(Button.A)) {
        時刻表示(1)
    } else if (input.buttonIsPressed(Button.B)) {
        秒表示()
    } else if (input.isGesture(Gesture.Shake)) {
        時刻表示(0)
    } else {
        basic.clearScreen()
    }
    buttonNo = 0
    if (pins.digitalReadPin(DigitalPin.P8) == 0) {
        buttonNo += 1
    }
    if (pins.digitalReadPin(DigitalPin.P12) == 0) {
        buttonNo += 2
    }
    if (pins.digitalReadPin(DigitalPin.P13) == 0) {
        buttonNo += 4
    }
    if (input.isGesture(Gesture.Shake)) {
        buttonNo = 6
    }
    strip.showColor(color[buttonNo])
    strip.show()
}
function 時計初期化 () {
    strip = neopixel.create(DigitalPin.P1, 4, NeoPixelMode.RGB)
    strip.setBrightness(32)
    color = [
    neopixel.colors(NeoPixelColors.Black),
    neopixel.colors(NeoPixelColors.Red),
    neopixel.colors(NeoPixelColors.Green),
    neopixel.colors(NeoPixelColors.Blue),
    neopixel.colors(NeoPixelColors.Yellow),
    neopixel.colors(NeoPixelColors.Violet),
    neopixel.colors(NeoPixelColors.White),
    neopixel.colors(NeoPixelColors.Orange)
    ]
    pins.digitalWritePin(DigitalPin.P2, 0)
    pins.setPull(DigitalPin.P8, PinPullMode.PullUp)
    pins.setPull(DigitalPin.P12, PinPullMode.PullUp)
    pins.setPull(DigitalPin.P13, PinPullMode.PullUp)
    ds3231.getClock()
    時刻表示(0)
}
function 表示方向 () {
    if (input.rotation(Rotation.Pitch) <= -40) {
        watchfont.setRotatation(rotate.under)
    } else {
        watchfont.setRotatation(rotate.top)
    }
    if (input.rotation(Rotation.Roll) < -75) {
        watchfont.setRotatation(rotate.right)
    } else if (input.rotation(Rotation.Roll) > 75) {
        watchfont.setRotatation(rotate.left)
    }
}
radio.onReceivedString(function (receivedString) {
    serial.writeLine("" + radio.receivedPacket(RadioPacketProperty.SignalStrength) + ":" + receivedString)
    if (radio.receivedPacket(RadioPacketProperty.SignalStrength) >= -70) {
        受信文字 = receivedString.split(",")
        if (受信文字[0] == "CQ") {
            radio.sendString("" + 受信文字[1] + "," + control.deviceName() + "," + convertToText(無線グループ))
        }
    }
})
function 秒表示 () {
    表示方向()
    watchfont.showNumber2(ds3231.getClockData(clockData.second))
}
function コントローラ初期化 () {
    無線グループ = Math.abs(control.deviceSerialNumber()) % 98 + 1
    watchfont.showNumber2(無線グループ)
    radio.setTransmitPower(7)
    serial.redirectToUSB()
    strip = neopixel.create(DigitalPin.P1, 4, NeoPixelMode.RGB)
    strip.setBrightness(32)
    color = [
    neopixel.colors(NeoPixelColors.Black),
    neopixel.colors(NeoPixelColors.Red),
    neopixel.colors(NeoPixelColors.Green),
    neopixel.colors(NeoPixelColors.Blue),
    neopixel.colors(NeoPixelColors.Yellow),
    neopixel.colors(NeoPixelColors.Violet),
    neopixel.colors(NeoPixelColors.White),
    neopixel.colors(NeoPixelColors.Orange)
    ]
}
function 時刻表示 (タイプ: number) {
    if (タイプ == 0) {
        表示方向()
        watchfont.showNumber2(ds3231.getClockData(clockData.hour))
        basic.pause(1000)
        basic.clearScreen()
        basic.pause(200)
        watchfont.showNumber2(ds3231.getClockData(clockData.minute))
        basic.pause(1000)
        basic.clearScreen()
        basic.pause(500)
    } else if (タイプ == 1) {
        basic.showString("" + ds3231.getClockData(clockData.hour) + ":" + ds3231.getClockData(clockData.minute))
    }
}
let 受信文字: string[] = []
let color: number[] = []
let strip: neopixel.Strip = null
let buttonNo = 0
let X = 0
let Y = 0
let 無線グループ = 0
pins.digitalWritePin(DigitalPin.P2, 0)
pins.setPull(DigitalPin.P5, PinPullMode.PullUp)
pins.setPull(DigitalPin.P11, PinPullMode.PullUp)
pins.setPull(DigitalPin.P8, PinPullMode.PullUp)
pins.setPull(DigitalPin.P12, PinPullMode.PullUp)
pins.setPull(DigitalPin.P13, PinPullMode.PullUp)
let TYPE = pins.digitalReadPin(DigitalPin.P5)
if (TYPE == 0) {
    コントローラ初期化()
} else {
    時計初期化()
}
basic.forever(function () {
    if (TYPE == 0) {
        コントローラ処理()
    } else {
        時計処理()
    }
})