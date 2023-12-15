var Jimp = require("jimp");
var delta = require("./color-distance.js");
var rand = require("./prng.js");

const MAX_OUTPUT_SHADES = 4;
const NUM_POSSIBLE_SOURCE_SHADES = 256;
const SEP = ",";
const discretize = (c) => Math.floor(c / (NUM_POSSIBLE_SOURCE_SHADES / MAX_OUTPUT_SHADES));
const BACKGROUND_COLOR_0 = [120, 0, 0];
const BLACK = [0, 0, 0];
const WHITE = [255, 255, 255];
const BACKGROUND_COLOR_NAME = "MAROON";

const A_TO_Z = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "X", "Y", "Z"];

const COLUMNS_TO_ANSWERS = [
    [12, 13],
    [14, 15],
    [16, 17],
    [18, 19],
    [20, 21],
    [10, 11],
    [8, 9],
    [6, 7],
    [4, 5],
    [2, 3],
    [0, 1]
];

const ANSWERS = [
    "BLUE HERON", // Which colourful bird is associated with both yummy flavours & Hannah's Olympia life? (Blue Heron - she worked at the Blue Heron bakery) 8
    "MISS SAFFRON", // Which murderer is named after an expensive spice? You could cross paths with her daily. 8
    "GRADLON AND DAHUT", // What are the names of the father and daughter duo in one of the greatest novels of all time, "Legend's of Brittany"? 10
    "PROGRAMMING", // Feed me....? 10
    "TWO TWO SIX", // A tattoo that you need? 6
    "MANIX CONDOMS", // What did Felix buy from here? 11
    "BROOKLYN BRIDGE", // Which freezing cold place did Alexis make Hannah go to on Alexis' 30th birthday? (The Brooklyn Bridge) 13
    "LASER 2000", // What type of boat inspired this image? 7
    "SCONES", // What simple breakfast treat does Hannah make without a recipe that gives Alexis infinite joy? (Scones!) 6
    "HANNAH'S MAN", // What is Felix's other name, according to Alasdair? (That man or Hannah's man) 5
    "LYCHEN", // In which town did Felix do an amazing handstand front somersault dive off a tree?
];

const PALLETTE = [
    "#780000", // Background.. not needed for mosaic
    "#37485A",
    "#6C87A0",
    "#F9ACA3",
    "#FFFFFF",
    "#ECEAE8",
    "#F1D2D0",
    "#C31C40",
    "#6AC1D8",
    "#05519C",
    "#000000"
].map((hex) => {
    const rgba = intToRGBA(hex)
    console.log(hex, rgba);
    return rgba;
});

const PALLETTE_NAMES = [
    BACKGROUND_COLOR_NAME,
    "Dark Grey",
    "Light Grey",
    "Salmon",
    "White",
    "Beige",
    "Pink/Grey",
    "Red",
    "Light Blue",
    "Dark Blue",
    "Black"
];

// const PALLETTE_NAMES = [
//     BACKGROUND_COLOR_NAME,
//     "DG",
//     "LG",
//     "SS",
//     "WW",
//     "BO",
//     "PG",
//     "RR",
//     "LB",
//     "DB",
//     "BB"
// ];

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

function countColors(image) {
    const unique = new Map();
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {

        var red = this.bitmap.data[idx + 0];
        var green = this.bitmap.data[idx + 1];
        var blue = this.bitmap.data[idx + 2];

        const discretized = [red, green, blue].join(SEP);
        if (!unique.has(discretized)) {
            unique.set(discretized, [[red, green, blue], 0]);
        }
        const [color, count] = unique.get(discretized);
        unique.set(discretized, [color, count + 1]);
    });

    console.log("unique colors: " + unique.size);

    return unique.values();
}

async function main() {
    const file = process.argv[2];
    console.log(file);
    const image = await Jimp.read(file);
    // const uniqueColors = [...countColors(image)].map(([color, count]) => [PALLETTE_NAMES[PALLETTE.findIndex((rgb) => isEqualRGB(rgb, color))], count]);
    // const uniqueColors = [...countColors(image)];
    // const unique = new Map();
    // mapImagePixelData(image, ([r, g, b]) => {
    //     const discretized = [r, g, b].map(discretize).join(SEP);
    //     if (!unique.has(discretized)) {
    //         unique.set(discretized, [r, g, b]);
    //     }
    //     return unique.get(discretized);
    // });

    // mapImagePixelData(image, ([r, g, b]) =>
    //     PALLETTE
    //         .reduce(([br, bg, bb], [or, og, ob]) =>
    //             delta([r, g, b], [or, og, ob]) < delta([r, g, b], [br, bg, bb])
    //                 ? [or, og, ob]
    //                 : [br, bg, bb]
    //             , [0, 0, 0])
    // );

    // let first;
    // mapImagePixelData(image, ([r, g, b]) => {
    //     if (!first) {
    //         first = [r, g, b];
    //     }
    //     return r === first[0] && g === first[1] && b === first[2]
    //         ? intToRGBA("#F1D2D0")
    //         : [r, g, b]
    // });

    // console.log(uniqueColors);

    // let count = 0;
    // mapImagePixelData(image, ([r, g, b]) => {
    //     const row = Math.floor(count / 22);
    //     count++;
    //     return uniqueColors[Math.floor(row / 39 * uniqueColors.length)][0];
    // });



    encodeQuizQuestions(image);

    // image.resize(220, Jimp.AUTO, Jimp.RESIZE_NEAREST_NEIGHBOR);



    countColors(image);
    // image.write(process.argv[3]);
}

main()
    .catch((err) => console.log(err));


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
        this.letters = shuffle([...new Set(answerStr.split("").filter((letter) => /[a-zA-Z0-9]/.test(letter)))]);
        if (this.letters.length < colorsSet.size) {
            throw new Error(`${answerStr} has too few distinct letters for column with ${colorsSet.size} colors`);
        }

        this.colors = shuffle([...colorsSet].filter((color) => color !== BACKGROUND_COLOR_NAME));

        this.colorsMap = this.colors.map((color, key) => [this.letters[key]]);
        this.letters.slice(this.colors.length).forEach((letter) => selectRandArrElement(this.colorsMap).push(letter));
        if (answerStr === "HANNAH'S MAN") {
            debugger;
        }
    }

    getEncoding(color) {
        // return this.colors.length;
        if (color === BACKGROUND_COLOR_NAME) {
            return selectRandArrElement(A_TO_Z
                .filter((letter) => !this.letters.includes(letter) && letter != "O"));
        }
        const mapIndex = this.colors.findIndex((tcolor) => tcolor === color);
        const randomKey = Math.floor(rand() * this.colorsMap[mapIndex].length);
        return this.colorsMap[mapIndex][randomKey];
    }

    getLetterMapping(letter) {
        if (!this.letters.includes(letter)) {
            throw new Error(`'${letter}' not included in answer: ${this.answerStr}`);
        }
        const colorIndex = this.colorsMap.findIndex((letters) => letters.find((tletter) => tletter === letter) !== undefined);
        if (colorIndex === undefined) {
            throw new Error(`'${letter}' not included in answer: ${this.answerStr}`);
        }
        return this.colors[colorIndex];
    }
}

function getPaletteName(color) {
    return PALLETTE_NAMES[PALLETTE.findIndex((rgb) => isEqualRGB(rgb, color))];
}

function encodeQuizQuestions(image) {
    console.log(ANSWERS);

    const cells = [];
    mapImagePixelData(image, ([r, g, b]) => {
        cells.push([r, g, b]);
        return [r, g, b];
    });

    const rowStuff = [];
    const answerColors = [];

    for (key in cells) {
        const rowIndex = Math.floor(key / 22);
        const columnIndex = Math.floor(key % 22);
        const answerIndex = COLUMNS_TO_ANSWERS.findIndex((columns) => columns.find((id) => id === columnIndex) !== undefined);
        if (answerIndex === -1) {
            debugger;
        }

        if (!answerColors[answerIndex]) {
            answerColors[answerIndex] = [];
        }

        if (!rowStuff[rowIndex]) {
            rowStuff[rowIndex] = [];
        }

        const colorName = getPaletteName(cells[key]);

        answerColors[answerIndex] = new Set([colorName, ...answerColors[answerIndex]]);
        rowStuff[rowIndex].push(colorName);
    }

    const encoders = answerColors.map((answerColors, key) =>
        new Encoder(ANSWERS[key], answerColors)
    );

    for (let rowId in rowStuff) {
        const row = rowStuff[rowId];
        const newRow = row.map((colorName, columnId) => {
            const columnIndex = Math.floor(columnId % 22);
            const answerIndex = COLUMNS_TO_ANSWERS.findIndex((columns) => columns.find((id) => id === columnIndex) !== undefined);
            return encoders[answerIndex].getEncoding(colorName);
        });

        console.log(newRow.join(","));
    }

    const letterMappings = ANSWERS.map((answer, answerIndex) =>
        answer.split("")
            .map((letter) => /[A-Za-z0-9]/.test(letter)
                ? encoders[answerIndex].getLetterMapping(letter)
                : letter === ""
                    ? "SPACE"
                    : letter)
            .join()
    );

    console.log(letterMappings.reduce((all, answer, key) => [...all, answer, ANSWERS[key].split("").join(",")], []).join("\n"));
}

















