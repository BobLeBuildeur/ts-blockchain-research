"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Auditor_1 = __importDefault(require("./Auditor"));
const Transaction_1 = __importDefault(require("../Pool/Transaction"));
class Actor extends Auditor_1.default {
    constructor(uuid = null) {
        super(uuid);
    }
    createTransaction(amount, receiver) {
        const transaction = new Transaction_1.default(amount, this.publicKey, receiver.publicKey);
        const signature = Actor.sign(transaction, this.privateKey);
        transaction.sign(signature);
        return transaction;
    }
    toString() {
        return JSON.stringify(this);
    }
}
exports.default = Actor;
