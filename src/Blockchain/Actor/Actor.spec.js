"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const Actor_1 = __importDefault(require("./Actor"));
describe("Actor", () => {
    describe("Transactions", () => {
        it("saves public keys", () => {
            const sender = new Actor_1.default();
            const receiver = new Actor_1.default();
            const transaction = sender.createTransaction(10, receiver);
            // @ts-ignore
            assert_1.default.notEqual(transaction.senderKey, sender.privateKey);
            // @ts-ignore
            assert_1.default.notEqual(transaction.receiverKey, receiver.privateKey);
        });
    });
});
