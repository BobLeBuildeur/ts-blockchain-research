"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Unique_1 = __importDefault(require("../../Unique"));
const Transaction_1 = __importDefault(require("./Transaction"));
class Pool extends Unique_1.default {
    constructor(transactions = [], uuid = null) {
        super(uuid);
        this.transactions = new Map([]);
        transactions.forEach(transaction => {
            if (!transaction.verify(transaction.senderKey))
                throw new Error("Cannot create Pool with unverified transaction");
            this.commitTransaction(transaction);
        });
    }
    getTransaction(uuid) {
        return this.transactions.get(uuid);
    }
    push(transaction) {
        if (this.transactions.has(transaction.uuid))
            throw new Error("Transaction exists");
        if (!transaction.verify(transaction.senderKey))
            throw new Error("Transaction could not be verified");
        this.commitTransaction(transaction);
    }
    commitTransaction(transaction) {
        this.transactions.set(transaction.uuid, transaction);
    }
    get length() {
        return this.transactions.size;
    }
    toString() {
        const copy = {};
        copy.uuid = this.uuid;
        copy.transactions = Array.from(this.transactions.values()).map((t) => JSON.parse(t.toString()));
        return JSON.stringify(copy);
    }
    static fromString(text) {
        const { transactions, uuid } = JSON.parse(text);
        return new Pool(transactions.map((t) => Transaction_1.default.fromString(JSON.stringify(t))), uuid);
    }
}
exports.default = Pool;
