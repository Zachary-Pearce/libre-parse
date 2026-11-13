import Token, { emptyToken } from "./token.js";
import { logTime } from "../utils/debug.js";

export class Lexer {
    /**
     * A token lexer.
     * 
     * @param {Object.<number, RegExp>} grammarRules - A Dict of grammar rules, containing a matcher and an optional action
     */
    constructor(grammarRules) {
        this.grammarRules = grammarRules;
        this.cursor = 0;
    }

    /**
     * Jump the cursor to point to a new position in the text.
     * 
     * @param {Number} pos - The index position to jump to.
     */
    jump(pos) {
        this.cursor = pos;
    }

    /**
     * Get the next token from the source text.
     * 
     * @param {String} source - The source text.
     * @returns {Token} The generated token.
     */
    getNextToken(source) {
        if (this.cursor >= source.length) {
            //mark the end of the file
            return new Token("$", Token.EOF, this.cursor, this.cursor);
        }

        for (const type in this.grammarRules) {
            let regex = new RegExp(this.grammarRules[type].matcher.source, "yi");
            regex.lastIndex = this.cursor;

            let action = this.grammarRules[type].action;
            const match = regex.exec(source);
            if (match) {
                const tokenText = match[0];
                const start = this.cursor;
                const end = start + tokenText.length;

                this.cursor = end;
                return action == Lexer.SKIP ? emptyToken : new Token(
                    tokenText, Number(type), start, end
                );
            }
        }

        //if there is an error, recover from it
        return logTime("Error Recovered", () => this.recover(source.slice(this.cursor)));
    }

    /**
     * Recover from errors by skipping past unrecognised characters.
     * 
     * @param {String} snip - The portion of source text starting from the error position
     * @return {Token} The error token.
     */
    recover(snip) {
        let start = this.cursor;
        const matcherSource = Object.values(this.grammarRules).map((r) => r.matcher.source).join("|");
        const masterRegex = new RegExp(matcherSource, "gi");

        const match = masterRegex.exec(snip);
        const end = match ? match.index : snip.length;
        this.cursor += end;
        return new Token(snip.slice(0, end), Token.ERROR, start, this.cursor);
    }

    /**
     * Tokenise the entire source text.
     * 
     * @param {String} source - The source text.
     * @returns {Array<Token>} The generated tokens.
     */
    tokeniseAll(source) {
        let newToken = null, tokens = [];
        do {
            newToken = this.getNextToken(source);
            if (newToken.type != Token.EMPTY) {
                tokens.push(newToken);
            }
        } while (newToken.type != Token.EOF);

        return tokens;
    }
}

/**
 * @type {Number} Token Actions
 * 
 * These determine what should happens with a token once it is recognised.
 */

/**
 * Token should not be added to the token stream.
 */
Lexer.SKIP = 0;