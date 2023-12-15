var Jimp = require("jimp");
var delta = require("./color-distance.js");
var { printEncodedImage } = require("./encoder.js");
var { isEqualRGB, intToRGBA, mapImagePixelData } = require("./common.js");

const SEP = ",";

function countColors(image) {
    const unique = new Map();
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {

        var red = this.bitmap.data[idx + 0];
        var green = this.bitmap.data[idx + 1];
        var blue = this.bitmap.data[idx + 2];

        const color = [red, green, blue].join(SEP);
        if (!unique.has(color)) {
            unique.set(color, [[red, green, blue], 0]);
        }
        const [rgb, count] = unique.get(color);
        unique.set(color, [rgb, count + 1]);
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

    printEncodedImage(image);

    // image.resize(220, Jimp.AUTO, Jimp.RESIZE_NEAREST_NEIGHBOR);

    countColors(image);
    // image.write(process.argv[3]);
}

main()
    .catch((err) => console.log(err));

