import assert from "assert";
import ProtoBlock from "./ProtoBlock";

describe("ProtoBlock @unit", () => {
    it("always has index and timestamp 0", () => {
        const block = new ProtoBlock();
        
        assert.equal(block.index, 0);
        assert.equal(block.ts, 0);
    });

    it("deserializes", () => {
        const block = new ProtoBlock();
        const copy = ProtoBlock.fromString(block.toString());

        assert.equal(block.equals(copy), true);
        assert.equal(block.signature, copy.signature);
    })
});