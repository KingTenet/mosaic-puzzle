
const ANSWER_STRINGS = [
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

class Answer {
    constructor(answerStr, columns) {
        this.answerStr = answerStr;
        this.columns = columns;
    }

    getString() {
        return this.answerStr;
    }

    getColumns() {
        return this.columns;
    }

    getLetters() {
        return this.getString().split("");
    }
}

class Answers {
    constructor(answerStrings, columnMapping) {
        this.answers = answerStrings.map((answerStr, key) => new Answer(answerStr, columnMapping[key]));
        this.columnMapping = columnMapping;
    }

    getAnswerIndexAtPixel(columnIndex, rowIndex) {
        return this.columnMapping.findIndex((columns) => columns.find((id) => id === columnIndex) !== undefined);
    }

    getAnswerAtPixel(columnIndex, rowIndex) {
        return this.answers[this.getAnswerIndexAtPixel(columnIndex, rowIndex)];
    }

    // getAnswer(answerIndex) {
    //     if (ANSWERS[answerIndex] === undefined) {
    //         throw new Error(`Couldn't find answer for answerIndex:${answerIndex}`);
    //     }
    //     return ANSWERS[answerIndex];
    // }

    all() {
        return this.answers;
    }
}

module.exports = new Answers(ANSWER_STRINGS, COLUMNS_TO_ANSWERS);