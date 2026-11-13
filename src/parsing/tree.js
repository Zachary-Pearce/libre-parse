import { EventEmitter } from 'node:events';

export class Tree extends EventEmitter {
    /**
     * @param {Node} root - The root node of the tree.
     */
    constructor(root) {
        super();
        this.root = root;
    }

    /**
     * Traverse the tree in post order.
     * 
     * @param {Node?} start - The starting node.
     */
    traverse(start = this.root) {
        for (let x = 0; x < start.children.length; x++) {
            //leftmost child first (index 0)
            let currentNode = start.children[x];
            this.traverse(currentNode);
        }

        try {
            const node = start.visit();
            this.emit('nodeVisited', node);
        } catch (err) {
            this.emit('error', err);
        }
    }

    /**
     * Search for a nodes branch by its index
     * 
     * @param {number} pos - Index position of the target node.
     * @param {Node?} parent - The parent node, defaults to the root.
     */
    branchSearch(pos, parent = this.root) {
        const branches = parent.children;
        let high = branches.length - 1;
        let low = 0;
        while (high >= low) {
            //(low + high)/2 - binary shift right to divide by 2
            let mid = (low + high) >> 1;
            if (mid === branches.length - 1 || (branches[mid].pos <= pos && branches[mid + 1].pos > pos)) {
                return mid;
            }

            if (branches[mid].pos > pos) {
                //search left branches
                high = mid - 1;
            } else {
                //otherwise search right branches
                low = mid + 1;
            }
        }

        //if branch not found
        return -1;
    }

    /**
     * Search for a node by its index.
     * 
     * The tree should be ordered so indexes increase by line as we move from the left branch to the right branch.
     * So to find the branch the node exists under we use the index of the root, if it is more than that index it may be present in that branch.
     * 
     * @param {number} pos - Index position of the target node.
     * @param {number} val - The value of the target node.
     */
    nodeSearch(pos, val) {
        let currentNode = this.root;
        for (;;) {
            if (currentNode.pos === pos && currentNode.val === val) { return currentNode }
            let branch = this.branchSearch(pos, currentNode);
            if (branch > -1) {
                currentNode = currentNode.children[branch];
            } else {
                return null;
            }
        }
    }

    /**
     * Get a tree fragment from a given node position.
     * 
     * @param {Number} rootIndex - The index position of the root node.
     * @param {Number} val - The value of the root node.
     * @return {Tree} treeFragment
     */
    getTreeFragment(rootIndex, val) {
        const root = this.nodeSearch(rootIndex, val);
        if (root === null) { throw ReferenceError("Node could not be found!"); }
        return new Tree(root);
    }

    /**
     * Set the root node of the tree. This will result in the loss of any unsaved nodes.
     * 
     * @param {Node} node - The new root node.
     */
    setRoot(node) {
        this.root = node;
    }
}

export class Node {
    /**
     * @param {number} val - An integer value, set to the token type
     * @param {number} pos - The starting index of the corresponding token text
     */
    constructor(val, pos) {
        this.val = val;
        this.pos = pos;
        this.children = [];
    }

    /**
     * Add a child to the node.
     * 
     * @param {Node} child - The node to add as a child.
     */
    addChild(child) {
        this.children.push(child);
    }

    /**
     * Visit the node and print the value of the node.
     */
    visit() {
        return this;
    }
}

export class ErrorNode extends Node {
    /**
     * @param {Number} pos - The starting index of the corresponding token text.
     * @param {String} message - The error message.
     */
    constructor(pos, message) {
        super(-2, pos);

        this.message = message;
    }

    /**
     * Visit the error node and throw a syntax error.
     */
    visit() {
        throw new SyntaxError(this.message);
    }
}