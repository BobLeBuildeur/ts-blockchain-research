import Timestamped from "../Actor/Timestamped";
import Serializable from "../../Serializable";
import Transaction from "../Pool/Transaction";
import type { hash, uuid } from "../../Unique";

export default class ProtoBlock extends Timestamped implements Serializable {

    readonly transactions: Transaction[] = [];
    readonly index: number = 0;

    constructor(
        signature: hash | null = null,
        uuid: uuid | null = null,
        ts: number | null = 0
    ) {
        super(signature, uuid, ts);
    }

    toString(): string {
        return JSON.stringify(this);
    }

    static fromString(text: string): ProtoBlock {
        const { signature, uuid } = JSON.parse(text);

        return new ProtoBlock(signature, uuid);
    }

}