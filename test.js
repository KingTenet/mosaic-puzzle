var Jimp = require("jimp");
var answers = require("./answers.js");
var { getEncodings } = require("./encoder.js");
const { forEachImagePixelData, isEqualRGB } = require("./common.js");
const { palette } = require("./palette.js");

const allAnswers = answers.all();

function test(image) {
    const [encodedMosaic, answerStrings, letterMappings] = getEncodings(image);
    allAnswers.forEach((answer, key) => {
        if (answer.getString() !== answerStrings[key]) {
            throw new TestError("Expected answers do not match actual answers");
        }
    });

    const unencodedMosaic = encodedMosaic
        .map((row, y) => row.map((pixel, x) => {
            const encodedLetter = pixel.getEncoding();
            if (!encodedLetter) {
                throw new TestError("Pixel does not have encoded value");
            }

            const answerIndex = allAnswers.findIndex((answer) => answer.getColumns().includes(x));
            if (answerIndex === undefined || answerIndex < 0) {
                throw new TestError(`No answer associated to pixel x:${x} y:${y}`);
            }

            const lookup = allAnswers[answerIndex].getLetters().findIndex((letter) => encodedLetter === letter);
            return letterMappings[answerIndex][lookup] || palette.getBackgroundColor();
        }));

    forEachImagePixelData(image, (x, y, rgba) => {
        if (!isEqualRGB(rgba, unencodedMosaic[y][x].getRGBA())) {
            throw new Error("Pixel color has changed!");
        }
    });
}

async function main() {
    const file = process.argv[2];
    const image = await Jimp.read(file);
    test(image);
}

class TestError extends Error { }

main()
    .catch((err) => console.log(err));

