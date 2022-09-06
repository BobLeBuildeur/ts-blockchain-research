import assert from "assert";
import Chain from "./Chain";
import Transaction from "../Pool/Transaction";


describe("Chain @integration", () => {
    let chain:Chain;

    beforeEach(() => {
        chain = new Chain();
    })
    
    it ("has a genesis block with no timestamp", () => {
        assert.equal(chain.length, 1);
        assert.equal(chain.lastBlock.ts, 0); 
    });

    it("creates blocks with transactions", () => {
        const transaction = new Transaction(0, "1", "2");
        const block = chain.createBlock([transaction]);
        
        assert.equal(chain.length, 2);
        assert.equal(chain.lastBlock, block);
        assert.equal(chain.lastBlock.transactions[0], transaction);
    });

    it("deserializes", () => {
        const transaction = new Transaction(0, "1", "2");
        const block = chain.createBlock([transaction]);

        const copy = Chain.fromString(chain.toString());

        assert.equal(copy.length, 2)
        assert.equal(copy.lastBlock.equals(block), true);
    });
});