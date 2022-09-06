"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Unique_1 = __importDefault(require("../../Unique"));
const crypto_1 = require("crypto");
class Signable extends Unique_1.default {
    constructor(signature = null, uuid = null) {
        super(uuid);
        this._signature = signature || '';
    }
    get payload() {
        const copy = Object.assign({}, this);
        delete copy._signature;
        return JSON.stringify(copy);
    }
    get signature() {
        return this._signature;
    }
    sign(newSignature) {
        this._signature = newSignature;
    }
    verify(publicKey) {
        if (!this.signature || this.signature.length == 0)
            throw (new Error("No signature"));
        const verify = (0, crypto_1.createVerify)("SHA256");
        verify.update(this.payload);
        return verify.verify(publicKey, Buffer.from(this.signature, 'base64'));
    }
}
exports.default = Signable;
