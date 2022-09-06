import ProtoBlock from "./ProtoBlock";
import Block from "./Block";
import type { SerializedBlock } from "./Block";
import Serializable from "../../Serializable";
import Transaction from "../Pool/Transaction";


export default class Chain implements Serializable {

    private chain: ProtoBlock[] = [];

    constructor(blocks: Block[] = []) {
        this.chain = [new ProtoBlock(), ...blocks];
    }

    get length(): number {
        return this.chain.length;
    }

    get lastBlock(): ProtoBlock {
        return this.chain[this.chain.length - 1];
    }

    createBlock(transactions: Transaction[]): Block {
        const block = new Block(transactions, this.lastBlock.hash, this.lastBlock.index + 1);

        this.chain.push(block);

        return block;
    }

    toString(): string {
        const blocks = this.chain.map(b => JSON.parse(b.toString()));

        return JSON.stringify(blocks);
    }

    static fromString(text: string): Chain {
        const blockData = JSON.parse(text).slice(1);
        const blocks = blockData.map((b: SerializedBlock) => Block.fromString(JSON.stringify(b)))

        return new Chain(blocks);
    } 
}