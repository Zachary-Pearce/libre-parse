import * as fs from 'fs';
import Token from '../parsing/token.js';

const parseTable = {
    10: {
        2: [11, Token.EOF],
        5: [11, Token.EOF]
    },
    11: {
        2: [2],
        5: [5, 11, 12, 11, 6]
    },
    12: {
        3: [3],
        4: [4]
    }
};

/**
 * Convert a given dictionary to JSON.
 * 
 * @param {Object.<string, any>} data - A dictionary containing the data to export.
 * @returns {String} The contents of the file.
 */
export function exportToJSON(data) {
    return JSON.stringify(data);
}

fs.readFile('test.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    
    const parseTable = JSON.parse(data);
    console.log(parseTable);
});

fs.writeFile('parseTable.json', exportToJSON(parseTable), (err) => {
    if (err) {
        console.error(err);
        return;
    }
});