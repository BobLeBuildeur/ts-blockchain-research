import assert from "assert";
import Transaction from "./Transaction";
import Actor from "../Actor/Actor";

describe("Transaction @unit", () => {
    it("Only auditor can validate signature", () => {

        const sender = new Actor()
        const receiver = new Actor()

        const transaction = new Transaction(10, sender.publicKey, receiver.publicKey);

        const signature = Actor.sign(transaction, sender.privateKey);
        transaction.sign(signature);

        assert.equal(transaction.verify(receiver.publicKey), false);
        assert.equal(transaction.verify(sender.publicKey), true);
    })

    it("throws trying to verify transaction with no signature", () => {
        const sender = new Actor()
        const receiver = new Actor()

        assert.throws(() => {
            (new Transaction(10, sender.publicKey, receiver.publicKey)).verify("1223")
        }, Error)
    })

    it("deserializes correctly", () => {

        const transaction = new Transaction(10, '1234', '4321');
        const transaction2 = Transaction.fromString(transaction.toString());

        assert.equal(transaction.equals(transaction2), true);
        assert.equal(transaction.ts, transaction2.ts);
        assert.equal(transaction.signature, transaction2.signature);
        assert.equal(transaction.amount, transaction2.amount);
        assert.equal(transaction.senderKey, transaction2.senderKey);
        assert.equal(transaction.receiverKey, transaction2.receiverKey);

    })
})