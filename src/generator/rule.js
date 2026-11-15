export default class Rule {
    /**
     * @param {Number} lhs - The ID of the symbol that this rule applies to.
     * @param {Array<Number>} rhs - The number array that represents the right hand side of the rule.
     */
    constructor(lhs, rhs) {
        this._lhs = lhs;
        this._rhs = rhs;
    }

    /**
     * Add a symbol to the right hand side of the rule.
     * 
     * @param {Number} symbol - The symbol to add
     */
    addToRhs(symbol) {
        this._rhs.push(symbol);
    }

    /**
     * Returns the ID of the affected symbol
     * 
     * @returns {Number}
     */
    get lhs() {
        return this._lhs;
    }

    /**
     * Returns a copy of the right hand side of the rule
     * 
     * @returns {Array<Number>}
     */
    get rhs() {
        return Array.from(this._rhs);
    }

    /**
     * Returns the string representation of the production rule.
     * 
     * @returns {String} production rule
     */
    toString() {
        const rule = this._rhs.join(',');
        return `${this._lhs} -> ${rule}`;
    }
}