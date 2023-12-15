var rand = require("./prng.js");
var { palette } = require("./palette.js");
var { forEachImagePixelData } = require("./common.js");
var answers = require("./answers.js");

const A_TO_Z = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "X", "Y", "Z"];
const ALLOWED_CHARS = /[a-zA-Z0-9]/;


function selectRandArrElement(arr) {
    const randomKey = Math.floor(rand() * arr.length);
    return arr[randomKey];
}

function shuffle(arr) {
    let a = [...arr];
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(rand() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a;
}

class Encoder {
    constructor(answerStr, colorsSet) {
        this.answerStr = answerStr;
        this.letters = shuffle([...new Set(answerStr.split("").filter((letter) => ALLOWED_CHARS.test(letter)))]);
        if (this.letters.length < colorsSet.size) {
            throw new Error(`${answerStr} has too few distinct letters for column with ${colorsSet.size} colors`);
        }

        this.colors = shuffle([...colorsSet].filter((color) => !color.isBackground()));
        this.colorsMap = this.colors.map((color, key) => [this.letters[key]]);
        this.letters.slice(this.colors.length).forEach((letter) => selectRandArrElement(this.colorsMap).push(letter));
    }

    matchesAnswer(answer) {
        return this.answerStr === answer;
    }

    getEncoding(color) {
        if (color.isBackground()) {
            return selectRandArrElement(A_TO_Z
                .filter((letter) => !this.letters.includes(letter) && letter != "O"));
        }
        const mapIndex = this.colors.findIndex((tcolor) => tcolor === color);
        return selectRandArrElement(this.colorsMap[mapIndex]);
    }

    getLetterMapping(letter) {
        if (!this.letters.includes(letter)) {
            return palette.getBackgroundColor();
        }
        const colorIndex = this.colorsMap.findIndex((letters) => letters.find((tletter) => tletter === letter) !== undefined);
        if (colorIndex === undefined) {
            throw new Error(`'${letter}' not included in answer: ${this.answerStr}`);
        }
        return this.colors[colorIndex];
    }
}

class Encoders {
    constructor(image) {
        this.image = image;
        this.encoders = this.getEncoders();
    }

    getEncoders() {
        const answerColors = new Map();
        forEachImagePixelData(this.image, (x, y, rgb) => {
            const answer = answers.getAnswerAtPixel(x, y);
            if (!answerColors.has(answer)) {
                answerColors.set(answer, new Set());
            }
            answerColors.get(answer).add(palette.getColor(rgb));
        });
        return [...answerColors].map(([answer, answerColors]) =>
            new Encoder(answer.getString(), answerColors)
        );
    }

    getEncoderForPixel(x, y) {
        const answerStr = answers.getAnswerAtPixel(x, y).getString();
        return this.encoders.find((encoder) => encoder.matchesAnswer(answerStr));
    }

    getEncoderForAnswer(answer) {
        return this.encoders.find((encoder) => encoder.matchesAnswer(answer));
    }
}

class EncodedPixel {
    constructor(x, y, color, encoders) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.encoder = encoders.getEncoderForPixel(x, y);
    }

    getEncoding() {
        if (!this.encoder) {
            debugger;
        }
        return this.encoder.getEncoding(this.color);
    }
}

function encodeQuizQuestions(image, encoders) {
    const rows = [];
    forEachImagePixelData(image,
        (x, y, rgba) => {
            if (!rows[y]) {
                rows[y] = [];
            }
            rows[y].push(new EncodedPixel(x, y, palette.getColor(rgba), encoders));
        }
    );

    return rows;
}

function getMappings(encoders) {
    const lettersToColorNames = answers.all()
        .map((answer) =>
            answer.getLetters()
                .map((letter) => encoders.getEncoderForAnswer(answer.getString()).getLetterMapping(letter))
        );

    return [
        answers.all().map((answer) => answer.getString()),
        lettersToColorNames,
        answers.all().map((answer) => answer.getColumns())
    ];
}

function getEncodings(image) {
    const encoders = new Encoders(image);
    const encodedMosaic = encodeQuizQuestions(image, encoders);
    const [answerStrings, letterMappings, columnMappings] = getMappings(encoders);
    return [encodedMosaic, answerStrings, letterMappings, columnMappings];
}

function printEncodedImage(image) {
    const [encodedMosaic, answerStrings, letterMappings] = getEncodings(image);
    console.log(
        encodedMosaic
            .map((row) => row
                .map((pixel) => pixel.getEncoding())
                .join(",")
            )
            .join("\n")
    );

    console.log(letterMappings
        .map((letterColors, key) =>
            [
                letterColors
                    .map((color) => color.name())
                    .join(","),
                answerStrings[key],
                []
            ])
        .flat()
        .join("\n")
    );

}

module.exports = {
    printEncodedImage,
    getEncodings,
};