"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProtoBlock_1 = __importDefault(require("./ProtoBlock"));
const Block_1 = __importDefault(require("./Block"));
class Chain {
    constructor(blocks = []) {
        this.chain = [];
        this.chain = [new ProtoBlock_1.default(), ...blocks];
    }
    get length() {
        return this.chain.length;
    }
    get lastBlock() {
        return this.chain[this.chain.length - 1];
    }
    createBlock(transactions) {
        const block = new Block_1.default(transactions, this.lastBlock.hash, this.lastBlock.index + 1);
        this.chain.push(block);
        return block;
    }
    toString() {
        const blocks = this.chain.map(b => JSON.parse(b.toString()));
        return JSON.stringify(blocks);
    }
    static fromString(text) {
        const blockData = JSON.parse(text).slice(1);
        const blocks = blockData.map((b) => Block_1.default.fromString(JSON.stringify(b)));
        return new Chain(blocks);
    }
}
exports.default = Chain;
