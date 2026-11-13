import { Tree, Node } from "./tree.js";
import Token from "./token.js";
import ErrorHandler from "./error/errorHandler.js";
import DefaultErrorHandler from "./error/defaultErrorHandler.js";

export default class Parser {
    /**
     * @param {Array<Token>} tokenStream
     * @param {Object.<number, Object.<number, Array<Number>>>} parseTable
     * @param {Number} startSymbol - The starting non-terminal for parsing.
     * @param {ErrorHandler?} errorHandler - Optional error handler, otherwise use DefaultErrorHandler.
     */
    constructor(tokenStream, parseTable, startSymbol, errorHandler) {
        this.parseTable = parseTable;
        this.startSymbol = startSymbol;
        this.tokenStream = tokenStream;
        this.errorHandler = errorHandler || new DefaultErrorHandler(startSymbol);

        /**
         * @type {Number} A pointer to the current token.
         */
        this.pointer = 0;

        /**
         * @type {Tree} The abstract syntax tree.
         */
        this.ast = null;
    }

    /**
     * @returns {Tree} The asbstract syntax tree (AST).
     */
    getAST() {
        return this.ast;
    }

    /**
     * Create an Abstract Syntax Tree (AST) by parsing the entire token stream.
     */
    parse() {
        const rootNode = this._parseNode(this.startSymbol);
        this.ast = new Tree(rootNode);
    }

    /**
     * Parse a token and create the corresponding AST node.
     * 
     * @param {Number} symbol - An integer associated with the expected token type.
     * @returns {Node} The parsed AST node with all children.
     */
    _parseNode(symbol) {
        let currentToken = this.peek();

        //if the symbol is a terminal
        if (this.parseTable[symbol] === undefined) {
            if (symbol === currentToken.type) {
                return this._accept(currentToken);
            } else {
                return this.errorHandler.recover(
                    currentToken, this
                );
            }
        } else {
            let productionRule = this.parseTable[symbol][currentToken.type];
            const parentNode = new Node(symbol, currentToken.start);
            this.errorHandler.updateContext(symbol);
            if (productionRule === undefined) {
                const [ errorNode, newRule ] = this.errorHandler.sync(currentToken, this);
                parentNode.addChild(errorNode);
                if (newRule === null) {
                    return parentNode;
                }
                productionRule = newRule;
            }

            for (const ruleSymbol of productionRule) {
                if (ruleSymbol === Token.EMPTY) { continue; } //skip epsilon
                const childNode = this._parseNode(ruleSymbol);
                if (childNode !== null) {
                    parentNode.addChild(childNode);
                }
            }

            //if the parentNode does not have any children then don't add it to the tree
            return parentNode.children.length > 0 ? parentNode : null;
        }
    }

    /**
     * Consume the current token and return it.
     * 
     * @returns {Token} The consumed token.
     */
    consume() {
        const consumedToken = this.peek();
        this.pointer++;
        return consumedToken;
    }

    /**
     * Peek at the current token, do not advance the pointer.
     * 
     * @param {Number?} offset - Optional lookahead offset, defaults to 0.
     * @returns {Token} The current token.
     */
    peek(offset = 0) {
        return this.tokenStream[this.pointer + offset];
    }

    /**
     * Accepts a token from the input token stream.
     * 
     * @param {Token} token - The token to consume.
     * @returns {Node} The AST node generated.
     */
    _accept(token) {
        this.pointer++;
        return new Node(token.type, token.start);
    }
}