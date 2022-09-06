"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Actor_1 = __importDefault(require("./Actor/Actor"));
const Pool_1 = __importDefault(require("./Pool/Pool"));
class Stakeholders {
    constructor() {
        this.balances = new Map();
    }
    createActor() {
        const actor = new Actor_1.default();
        this.balances.set(actor.publicKey, 0);
        return actor;
    }
    executeTransactions(pool) {
        const uncovered = new Pool_1.default([]);
        pool.transactions.forEach(transaction => {
            const { senderKey, receiverKey, amount } = transaction;
            if (this.isCovered(senderKey, amount)) {
                this.updateBalance(senderKey, -amount);
                this.updateBalance(receiverKey, amount);
            }
            else {
                uncovered.push(transaction);
            }
        });
        return uncovered;
    }
    isCovered(key, amount) {
        return this.getBalance(key) > amount;
    }
    getBalance(key) {
        if (!this.balances.has(key))
            throw (new Error('No actor'));
        return this.balances.get(key);
    }
    updateBalance(key, amount) {
        const balance = this.getBalance(key);
        this.balances.set(key, balance + amount);
    }
}
exports.default = Stakeholders;
