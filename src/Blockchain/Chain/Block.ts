import ProtoBlock from "./ProtoBlock";
import Serializable from "../../Serializable";
import Transaction, { SerializedTransaction } from "../Pool/Transaction";
import type { hash, uuid } from "../../Unique";

export type SerializedBlock = {
    transactions: string[],
    signature: string
}

export default class Block extends ProtoBlock implements Serializable {

    constructor(
        readonly transactions: Transaction[],
        readonly previousHash: hash,
        readonly index: number,
        signature: hash | null = null,
        uuid: uuid | null = null,
        ts: number | null = null
    ) {
        super(signature, uuid, ts);
    }

    toString(): string {
        const payload = JSON.parse(this.payload);
        payload.transactions = this.transactions.map(t => JSON.parse(t.toString()));
        payload.signature = this.signature;

        return JSON.stringify(payload);
    }

    static fromString(text: string): Block {
        const { transactions, previousHash, index, signature, uuid, ts } = JSON.parse(text);

        return new Block(
            transactions.map((t: SerializedTransaction) => Transaction.fromString(JSON.stringify(t))),
            previousHash,
            index,
            signature,
            uuid,
            ts
        );
    }
}