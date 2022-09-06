import Auditor from "./Auditor";
import Serializable from "../../Serializable";
import Transaction from "../Pool/Transaction";
import type { uuid } from "../../Unique";

export default class Actor extends Auditor implements Serializable {

    constructor(uuid: uuid | null = null) {
        super(uuid);
    }

    createTransaction(amount: number, receiver: Actor): Transaction {
        const transaction = new Transaction(amount, this.publicKey, receiver.publicKey);

        const signature = Actor.sign(transaction, this.privateKey);

        transaction.sign(signature);

        return transaction;
    }

    toString(): string {
        return JSON.stringify(this);
    }
}