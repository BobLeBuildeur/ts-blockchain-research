"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Timestamped_1 = __importDefault(require("../Actor/Timestamped"));
class Transaction extends Timestamped_1.default {
    constructor(amount, senderKey, receiverKey, signature = null, uuid = null, ts = null) {
        super(signature, uuid, ts);
        this.amount = amount;
        this.senderKey = senderKey;
        this.receiverKey = receiverKey;
    }
    toString() {
        const payload = JSON.parse(this.payload);
        payload.signature = this.signature;
        return JSON.stringify(payload);
    }
    static fromString(text) {
        const { amount, senderKey, receiverKey, signature, uuid, ts } = JSON.parse(text);
        return new Transaction(amount, senderKey, receiverKey, signature, uuid, ts);
    }
}
exports.default = Transaction;
