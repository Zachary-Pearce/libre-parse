import Generator from "../src/generator/generator.js";
import Parser from '../src/parsing/parser.js';
import { Lexer } from '../src/parsing/lexer.js';
import { logTime } from '../src/utils/debug.js';
import * as fs from 'fs';
import * as assert from 'assert';

const parseTable = {
    1: {
        17: [2, 16, 1],
        0: [-1]
    },
    2: {
        17: [7, 33, 14]
    },
    3: {
        16: [16],
        17: [17],
        18: [18],
        19: [19],
        20: [20],
        21: [21],
        22: [22],
        23: [23],
        24: [24],
        25: [25],
        26: [26],
        27: [27],
        28: [28],
        29: [29],
        30: [30],
        31: [31],
        32: [32],
        33: [33],
        35: [35]
    },
    4: {
        16: [16],
        17: [17],
        18: [18],
        19: [19],
        20: [20],
        21: [21],
        22: [22],
        23: [23],
        24: [24],
        25: [25],
        26: [26],
        27: [27],
        28: [28],
        29: [29],
        30: [30],
        31: [31],
        32: [32],
        33: [33],
        34: [34]
    },
    5: {
        16: [3, 5],
        17: [3, 5],
        18: [3, 5],
        19: [3, 5],
        20: [3, 5],
        21: [3, 5],
        22: [3, 5],
        23: [3, 5],
        24: [3, 5],
        25: [3, 5],
        26: [3, 5],
        27: [3, 5],
        28: [3, 5],
        29: [3, 5],
        30: [3, 5],
        31: [3, 5],
        32: [3, 5],
        33: [3, 5],
        34: [-1],
        35: [3, 5]
    },
    6: {
        16: [4, 6],
        17: [4, 6],
        18: [4, 6],
        19: [4, 6],
        20: [4, 6],
        21: [4, 6],
        22: [4, 6],
        23: [4, 6],
        24: [4, 6],
        25: [4, 6],
        26: [4, 6],
        27: [4, 6],
        28: [4, 6],
        29: [4, 6],
        30: [4, 6],
        31: [4, 6],
        32: [4, 6],
        33: [4, 6],
        34: [4, 6],
        35: [-1]
    },
    7: {
        17: [17, 8]
    },
    8: {
        16: [-1],
        17: [17, 8],
        18: [18, 8],
        20: [20, 8],
        22: [-1],
        24: [-1],
        26: [-1],
        27: [-1],
        28: [-1],
        29: [-1],
        30: [-1],
        31: [-1],
        32: [-1],
        33: [-1]
    },
    9: {
        34: [34, 5, 34],
        35: [35, 6, 35]
    },
    10: {
        17: [7],
        21: [21, 14, 22],
        23: [23, 14, 24],
        25: [25, 14, 26],
        34: [9],
        35: [9]
    },
    11: {
        16: [-1],
        22: [-1],
        24: [-1],
        26: [-1],
        27: [27],
        28: [28],
        29: [29],
        30: [30, 10],
        31: [-1],
        32: [-1]
    },
    12: {
        17: [10, 11, 13],
        21: [10, 11, 13],
        23: [10, 11, 13],
        25: [10, 11, 13],
        34: [10, 11, 13],
        35: [10, 11, 13]
    },
    13: {
        16: [-1],
        22: [-1],
        24: [-1],
        26: [-1],
        31: [31, 12],
        32: [-1]
    },
    14: {
        17: [12, 15],
        21: [12, 15],
        23: [12, 15],
        25: [12, 15],
        34: [12, 15],
        35: [12, 15]
    },
    15: {
        16: [-1],
        22: [-1],
        24: [-1],
        26: [-1],
        32: [32, 14]
    }
};

const tokenRegex = {
    15: {matcher: /\s+/, action: Lexer.SKIP},
    16: {matcher: /[;.]/, action: null},
    17: {matcher: /[A-Za-z]/, action: null},
    18: {matcher: /[0-9]/, action: null},
    19: {matcher: /[<> \n\t\r\f\b]/, action: null},
    20: {matcher: /\_{1}/, action: null},
    21: {matcher: /\({1}/, action: null},
    22: {matcher: /\){1}/, action: null},
    23: {matcher: /\[{1}/, action: null},
    24: {matcher: /\]{1}/, action: null},
    25: {matcher: /\{{1}/, action: null},
    26: {matcher: /\}{1}/, action: null},
    27: {matcher: /\?{1}/, action: null},
    28: {matcher: /\*{1}/, action: null},
    29: {matcher: /\+{1}/, action: null},
    30: {matcher: /\-{1}/, action: null},
    31: {matcher: /\|{1}/, action: null},
    32: {matcher: /\,{1}/, action: null},
    33: {matcher: /\={1}/, action: null},
    34: {matcher: /\'{1}/, action: null},
    35: {matcher: /\"{1}/, action: null}
};

const expectedParseTable = {
    2: {
        1: [1],
        3: [3, 2, 4, 2, 5]
    },
    4: {
        6: [6],
        7: [7]
    }
};

const expectedTokenizer = {
    1: /(0|1|2|3|4|5|6|7|8|9)+/,
    3: /\(/,
    5: /\)/,
    6: /\+/,
    7: /\*/
};

const expectedStartSymbol = 2;

console.log("\x1b[44mINFO\x1b[0m Simple Parser - Mathematics, /examples/math.ebnf");

const source = fs.readFileSync('../examples/math.ebnf', 'utf8');
const lexer = new Lexer(tokenRegex);
const tokens = lexer.tokeniseAll(source);

const startSymbol = 1;
const parser = new Parser(tokens, parseTable, startSymbol);
logTime("Parsing Complete", () => parser.parse());

const parseTree = parser.getAST();
const gen = new Generator(parseTree, source);

const [ actualTokenizer, actualParseTable, actualStartSymbol ] = logTime("Compilation Complete", () => gen.compile());

try {
    assert.deepEqual(actualParseTable, expectedParseTable);
    console.log("\x1b[42mOK\x1b[0m Generated parse table matches expected");
} catch (e) {
    console.log("\x1b[41mBAD\x1b[0m Generated parse table does not match expected");
    console.log(actualParseTable);
}

try {
    assert.deepEqual(actualTokenizer, expectedTokenizer);
    console.log("\x1b[42mOK\x1b[0m Generated tokenizer matches expected");
} catch (e) {
    console.log("\x1b[41mBAD\x1b[0m Generated tokenizer does not match expected");
    console.log(actualTokenizer)
}

try {
    assert.equal(actualStartSymbol, expectedStartSymbol);
    console.log("\x1b[42mOK\x1b[0m Start symbol matches expected");
} catch (e) {
    console.log("\x1b[41mBAD\x1b[0m Start symbol does not match expected");
    console.log(actualStartSymbol);
}