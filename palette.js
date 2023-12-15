
var { isEqualRGB, intToRGBA } = require("./common.js");

const MAX_OUTPUT_SHADES = 4;
const NUM_POSSIBLE_SOURCE_SHADES = 256;
const BLACK = [0, 0, 0];
const WHITE = [255, 255, 255];

const PALLETTE_COLORS = [
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
].map(intToRGBA);

// const PALLETTE_NAMES = [
//     BACKGROUND_COLOR_NAME,
//     "Dark Grey",
//     "Light Grey",
//     "Salmon",
//     "White",
//     "Beige",
//     "Pink/Grey",
//     "Red",
//     "Light Blue",
//     "Dark Blue",
//     "Black"
// ];

const BACKGROUND_COLOR_NAME = "MAROON";

const PALLETTE_NAMES = [
    BACKGROUND_COLOR_NAME,
    "DG",
    "LG",
    "SS",
    "WW",
    "BO",
    "PG",
    "RR",
    "LB",
    "DB",
    "BB"
];

const BACKGROUND_COLOR = PALLETTE_COLORS[PALLETTE_NAMES.findIndex((name) => name === BACKGROUND_COLOR_NAME)]

class Color {
    constructor(rgba) {
        this.rgba = rgba;
    }

    getRGBA() {
        return this.rgba;
    }

    name() {
        return PALLETTE_NAMES[PALLETTE_COLORS.findIndex((rgb) => isEqualRGB(rgb, this.rgba))];
    }

    isBackground() {
        return this.rgba === BACKGROUND_COLOR;
    }
}

class Palette {
    constructor() {
        this.colors = new Map();
    }

    getColor(rgba) {
        const newColor = new Color(rgba);
        const name = newColor.name();
        if (!this.colors.has(name)) {
            this.colors.set(name, newColor);
        }
        return this.colors.get(name);
    }

    getBackgroundColor() {
        return this.getColor(BACKGROUND_COLOR);
    }
}


function discretize(color) {
    Math.floor(color / (NUM_POSSIBLE_SOURCE_SHADES / MAX_OUTPUT_SHADES));
}


module.exports = {
    palette: new Palette(),
};