"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Unique_1 = __importDefault(require("../../Unique"));
const crypto_1 = require("crypto");
class Auditor extends Unique_1.default {
    constructor(uuid = null) {
        super(uuid);
        const keypair = (0, crypto_1.generateKeyPairSync)('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
        });
        this.privateKey = keypair.privateKey;
        this.publicKey = keypair.publicKey;
    }
    static sign(document, privateKey) {
        const sign = (0, crypto_1.createSign)('SHA256');
        sign.update(document.payload).end();
        return sign.sign(privateKey).toString('base64');
    }
}
exports.default = Auditor;
