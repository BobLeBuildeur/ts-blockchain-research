"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const RPC_1 = __importStar(require("./RPC"));
describe("RPC @unit", () => {
    it("constists of opcode and string", () => {
        const rpc = new RPC_1.default(RPC_1.Opcode.message, "This is a message, hello!");
        assert_1.default.equal(rpc.serialized instanceof Buffer, true);
        const fromBuff = RPC_1.default.fromBuffer(rpc.serialized);
        assert_1.default.equal(fromBuff.opcode, RPC_1.Opcode.message);
        assert_1.default.equal(fromBuff.payload, "This is a message, hello!");
    });
    it("can be created with no string", () => {
        const rpc = new RPC_1.default(RPC_1.Opcode.message);
        assert_1.default.equal(rpc.serialized instanceof Buffer, true);
        const fromBuff = RPC_1.default.fromBuffer(rpc.serialized);
        assert_1.default.equal(fromBuff.opcode, RPC_1.Opcode.message);
        assert_1.default.equal(fromBuff.payload, "");
    });
});
