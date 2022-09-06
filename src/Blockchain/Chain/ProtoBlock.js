"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Timestamped_1 = __importDefault(require("../Actor/Timestamped"));
class ProtoBlock extends Timestamped_1.default {
    constructor(signature = null, uuid = null, ts = 0) {
        super(signature, uuid, ts);
        this.transactions = [];
        this.index = 0;
    }
    toString() {
        return JSON.stringify(this);
    }
    static fromString(text) {
        const { signature, uuid } = JSON.parse(text);
        return new ProtoBlock(signature, uuid);
    }
}
exports.default = ProtoBlock;
