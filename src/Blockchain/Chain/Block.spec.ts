import assert from "assert";
import ProtoBlock from "./ProtoBlock";
import Block from "./Block";
import Actor from "../Actor/Actor";

describe("Block", () => {
    let block: Block;

    beforeEach(() => {
        block = new Block([], (new ProtoBlock()).hash, 1)
    })

    describe("@unit", () => {

        it ("is timestamped", () => {
            assert.equal(block.hasOwnProperty('ts'), true);
            assert.notEqual(block.ts, 0);
        });
    
        it("deserializes", () => {
            const block2 = Block.fromString(block.toString());
    
            assert.equal(block.equals(block2), true);
            assert.equal(block.hash, block2.hash);
            assert.equal(block.signature, block2.signature);
        });
    });

    describe("Actor @integration", () => {
        it("gets signed and validated", () => {
            const sender = new Actor();
            const dummy = new Actor();
    
            block.sign(Actor.sign(block, sender.privateKey));
    
            assert.equal(block.verify(dummy.publicKey), false);
            assert.equal(block.verify(sender.publicKey), true);
        });
    })
});