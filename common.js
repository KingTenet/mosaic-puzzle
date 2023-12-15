var Jimp = require("jimp");

function isEqualRGB([r, g, b], [r2, g2, b2]) {
    return r === r2 && g === g2 && b === b2;
}

function intToRGBA(option) {
    const { r, g, b, a } = Jimp.intToRGBA(Jimp.cssColorToHex(option));
    return [r, g, b, a];
}

function mapImagePixelData(image, f) {
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        newData = f(this.bitmap.data.slice(idx));
        this.bitmap.data[idx + 0] = newData[0];
        this.bitmap.data[idx + 1] = newData[1];
        this.bitmap.data[idx + 2] = newData[2];
    });
}

function forEachImagePixelData(image, f) {
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        newData = f(x, y, this.bitmap.data.slice(idx));
    });
}

module.exports = {
    isEqualRGB,
    intToRGBA,
    mapImagePixelData,
    forEachImagePixelData
}