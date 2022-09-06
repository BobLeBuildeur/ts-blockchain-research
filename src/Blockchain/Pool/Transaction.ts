import Timestamped from "../Actor/Timestamped";
import Serializable from "../../Serializable";
import { hash, uuid } from "../../Unique";
import { KeyLike } from "crypto";

export type SerializedTransaction = {
    amount: number
    senderKey: string
    receiverKey: string
    signature: string
    uuid: string
    ts: number
}

export default class Transaction extends Timestamped implements Serializable {

    constructor(
        public amount: number,
        public senderKey: KeyLike,
        public receiverKey: KeyLike,
        signature: hash | null = null,
        uuid: uuid | null = null,
        ts: number | null = null
    ) {
        super(signature, uuid, ts);
    }

    toString(): string {
        const payload = JSON.parse(this.payload);
        payload.signature = this.signature;

        return JSON.stringify(payload);
    }

    static fromString(text: string): Transaction {
        const { amount, senderKey, receiverKey, signature, uuid, ts } = JSON.parse(text) as SerializedTransaction;

        return new Transaction(amount, senderKey, receiverKey, signature, uuid, ts);
    }
}