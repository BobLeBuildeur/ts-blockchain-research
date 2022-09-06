"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const ProtoBlock_1 = __importDefault(require("./ProtoBlock"));
const Block_1 = __importDefault(require("./Block"));
const Actor_1 = __importDefault(require("../Actor/Actor"));
describe("Block", () => {
    let block;
    beforeEach(() => {
        block = new Block_1.default([], (new ProtoBlock_1.default()).hash, 1);
    });
    describe("@unit", () => {
        it("is timestamped", () => {
            assert_1.default.equal(block.hasOwnProperty('ts'), true);
            assert_1.default.notEqual(block.ts, 0);
        });
        it("deserializes", () => {
            const block2 = Block_1.default.fromString(block.toString());
            assert_1.default.equal(block.equals(block2), true);
            assert_1.default.equal(block.hash, block2.hash);
            assert_1.default.equal(block.signature, block2.signature);
        });
    });
    describe("Actor @integration", () => {
        it("gets signed and validated", () => {
            const sender = new Actor_1.default();
            const dummy = new Actor_1.default();
            block.sign(Actor_1.default.sign(block, sender.privateKey));
            assert_1.default.equal(block.verify(dummy.publicKey), false);
            assert_1.default.equal(block.verify(sender.publicKey), true);
        });
    });
});
