import assert from "assert";
import Actor from "./Actor";

describe("Actor", () => {
    describe("Transactions", () => {
        it("saves public keys", () => {

            const sender = new Actor();
            const receiver = new Actor();

            const transaction = sender.createTransaction(10, receiver);

            // @ts-ignore
            assert.notEqual(transaction.senderKey, sender.privateKey);

            // @ts-ignore
            assert.notEqual(transaction.receiverKey, receiver.privateKey);
        });
    });
});