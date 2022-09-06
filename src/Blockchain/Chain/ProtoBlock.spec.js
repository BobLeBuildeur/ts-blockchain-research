"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const ProtoBlock_1 = __importDefault(require("./ProtoBlock"));
describe("ProtoBlock @unit", () => {
    it("always has index and timestamp 0", () => {
        const block = new ProtoBlock_1.default();
        assert_1.default.equal(block.index, 0);
        assert_1.default.equal(block.ts, 0);
    });
    it("deserializes", () => {
        const block = new ProtoBlock_1.default();
        const copy = ProtoBlock_1.default.fromString(block.toString());
        assert_1.default.equal(block.equals(copy), true);
        assert_1.default.equal(block.signature, copy.signature);
    });
});
