"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProtoBlock_1 = __importDefault(require("./ProtoBlock"));
const Transaction_1 = __importDefault(require("../Pool/Transaction"));
class Block extends ProtoBlock_1.default {
    constructor(transactions, previousHash, index, signature = null, uuid = null, ts = null) {
        super(signature, uuid, ts);
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.index = index;
    }
    toString() {
        const payload = JSON.parse(this.payload);
        payload.transactions = this.transactions.map(t => JSON.parse(t.toString()));
        payload.signature = this.signature;
        return JSON.stringify(payload);
    }
    static fromString(text) {
        const { transactions, previousHash, index, signature, uuid, ts } = JSON.parse(text);
        return new Block(transactions.map((t) => Transaction_1.default.fromString(JSON.stringify(t))), previousHash, index, signature, uuid, ts);
    }
}
exports.default = Block;
