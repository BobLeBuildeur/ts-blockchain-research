"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const Transaction_1 = __importDefault(require("./Transaction"));
const Actor_1 = __importDefault(require("../Actor/Actor"));
describe("Transaction @unit", () => {
    it("Only auditor can validate signature", () => {
        const sender = new Actor_1.default();
        const receiver = new Actor_1.default();
        const transaction = new Transaction_1.default(10, sender.publicKey, receiver.publicKey);
        const signature = Actor_1.default.sign(transaction, sender.privateKey);
        transaction.sign(signature);
        assert_1.default.equal(transaction.verify(receiver.publicKey), false);
        assert_1.default.equal(transaction.verify(sender.publicKey), true);
    });
    it("throws trying to verify transaction with no signature", () => {
        const sender = new Actor_1.default();
        const receiver = new Actor_1.default();
        assert_1.default.throws(() => {
            (new Transaction_1.default(10, sender.publicKey, receiver.publicKey)).verify("1223");
        }, Error);
    });
    it("deserializes correctly", () => {
        const transaction = new Transaction_1.default(10, '1234', '4321');
        const transaction2 = Transaction_1.default.fromString(transaction.toString());
        assert_1.default.equal(transaction.equals(transaction2), true);
        assert_1.default.equal(transaction.ts, transaction2.ts);
        assert_1.default.equal(transaction.signature, transaction2.signature);
        assert_1.default.equal(transaction.amount, transaction2.amount);
        assert_1.default.equal(transaction.senderKey, transaction2.senderKey);
        assert_1.default.equal(transaction.receiverKey, transaction2.receiverKey);
    });
});
