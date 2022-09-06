"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const Chain_1 = __importDefault(require("./Chain"));
const Transaction_1 = __importDefault(require("../Pool/Transaction"));
describe("Chain @integration", () => {
    let chain;
    beforeEach(() => {
        chain = new Chain_1.default();
    });
    it("has a genesis block with no timestamp", () => {
        assert_1.default.equal(chain.length, 1);
        assert_1.default.equal(chain.lastBlock.ts, 0);
    });
    it("creates blocks with transactions", () => {
        const transaction = new Transaction_1.default(0, "1", "2");
        const block = chain.createBlock([transaction]);
        assert_1.default.equal(chain.length, 2);
        assert_1.default.equal(chain.lastBlock, block);
        assert_1.default.equal(chain.lastBlock.transactions[0], transaction);
    });
    it("deserializes", () => {
        const transaction = new Transaction_1.default(0, "1", "2");
        const block = chain.createBlock([transaction]);
        const copy = Chain_1.default.fromString(chain.toString());
        assert_1.default.equal(copy.length, 2);
        assert_1.default.equal(copy.lastBlock.equals(block), true);
    });
});
