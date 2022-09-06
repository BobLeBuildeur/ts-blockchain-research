"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Signable_1 = __importDefault(require("./Signable"));
class Timestamped extends Signable_1.default {
    constructor(signature = null, uuid = null, ts = null) {
        super(signature, uuid);
        this.ts = 0;
        this.ts = ts != null ? ts : Date.now();
    }
}
exports.default = Timestamped;
