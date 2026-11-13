import Parser from "../parser.js";
import { ErrorNode } from "../tree.js";
import ErrorHandler from "./errorHandler.js";
import Token from "../token.js";

export default class DefaultErrorHandler extends ErrorHandler {
    /**
     * @param {Number} startSymbol - The starting non-terminal of the corresponding parser. 
     */
    constructor(startSymbol) {
        super();

        /**
         * @type {Number} The current non-terminal context of the parser.
         */
        this.context = startSymbol;
    }

    /**
     * Update the parser context to a new non-terminal symbol
     * 
     * @param {Number} symbol - The new non-terminal context.
     */
    updateContext(symbol) {
        this.context = symbol;
    }

    /**
     * Recover from an error thrown by a given parser instance by creating an error node.
     * 
     * @param {Token} error - The token that caused the error.
     * @param {Parser} parser - The linked parser instance.
     */
    recover(error, parser) {
        const recoverySet = this._getRecoverySet(
            parser.parseTable, this.context, parser.startSymbol
        );

        if (recoverySet.includes(error.type)) {
            return new ErrorNode(error.start, `Missing token at position ${error.start}`);
        } else {
            this._consumeUntil(parser, recoverySet);
            return new ErrorNode(error.start, `Mismatched token: '${error.text}' at position ${error.start}`);
        }
    }

    /**
     * Test token insertion and deletion, if neither result in satisfactory error recovery...
     * Fallback to panic mode error recovery.
     * 
     * @param {Token} error - The token that caused the error.
     * @param {Parser} parser - The linked parser instance.
     * @param {Number} symbol - The current non-terminal.
     * @returns {ErrorNode} Error node to add to AST.
     * @returns {Array<Number>} The new production rule.
     */
    sync(error, parser) {
        const parseTable = parser.parseTable;
        const recoverySet = this._getRecoverySet(
            parseTable, this.context, parser.startSymbol
        );

        if (recoverySet.includes(error.type)) {
            return [ new ErrorNode(
                error.start,
                `Missing token at position ${error.start}`
            ), null ];
        } else {
            const nextToken = parser.peek(1);
            let productionRule = parseTable[this.context][nextToken.type];
            if (productionRule !== undefined) {
                parser.consume();
                return [ new ErrorNode(
                    error.start,
                    `Unexpected token: '${error.text}' at position ${error.start}`
                ), productionRule ];
            }
        }

        let currentToken = this._consumeUntil(parser, recoverySet);
        return [ new ErrorNode(
            error.start,
            `Unrecognised Text from ${error.start}-${currentToken.end}`
        ), null ];
    }

    /**
     * Consume tokens until the current token is in the given set.
     * 
     * @param {Parser} parser
     * @param {Array<Number>} set - The token set.
     * @returns {Token} The final token pointed to.
     */
    _consumeUntil(parser, set) {
        let currentToken = parser.peek();
        while (!set.includes(currentToken.type)) {
            currentToken = parser.consume();
        }
        
        return currentToken;
    }

    /**
     * Find the recovery set for an error, by computing the follow set of the non-terminal.
     * 
     * @param {Object.<number, Object.<number, Array<Number>>>} parseTable
     * @param {Number} symbol - The non-terminal to compute the follow set of.
     * @param {Number} startSymbol - The starting non-terminal.
     * @returns {Array<Number>} The recovery set.
     */
    _getRecoverySet(parseTable, symbol, startSymbol) {
        const recovery = [];
        if (symbol === startSymbol) {
            recovery.push(Token.EOF);
        }

        for (const prod of Object.values(parseTable)) {
            //for the right hand side of each production rule
            for (const rhs of Object.values(prod)) {
                for (let i = 0; i < rhs.length; i++) {
                    if (rhs[i] === symbol) {
                        const productions = parseTable[rhs[i + 1]];
                        if (productions) {
                            //if the next symbol is a non-terminal
                            const first = this._getFirst(productions);
                            recovery.push(...first);
                        } else {
                            recovery.push(rhs[i + 1]);
                        }
                    }
                }
            }
        }

        return recovery;
    }

    /**
     * Compute the first of a given set of productions
     * 
     * @param {Object.<number, Array<Number>>} productions
     * @returns {Array<Number>} The first set.
     */
    _getFirst(productions) {
        const first = [];
        for (const rhs of Object.values(productions)) {
            const term = rhs[0];
            //exclude epsilon
            if (term !== Token.EMPTY) {
                first.push(rhs[0]);
            }
        }

        return first;
    }
}