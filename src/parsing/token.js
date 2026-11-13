export default class Token {
    /**
     * Create a new token, if no values are given
     * 
     * @param {String} text - The token text.
     * @param {Number} type - The token type.
     * @param {Number} start - The starting character position of the token text.
     * @param {Number} end - The end character position of the token text.
     */
    constructor(text, type, start, end) {
        this.text = text;
        this.type = type;
        this.start = start;

        if (end < start) { throw new RangeError("Token ends before start"); }
        this.end = end;
    }
}

/**
 * @type {Number} - Builtin Token types.
 */

/**
 * Marks the end of a file
 */
Token.EOF = 0;

/**
 * Indicates an empty/skipped token.
 */
Token.EMPTY = -1;
export const emptyToken = new Token(Token.EMPTY, Token.EMPTY, 0, 0, 0);

/**
 * Indicates a lexical error such as an unrecognised token.
 */
Token.ERROR = -2;