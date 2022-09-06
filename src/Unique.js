"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
class Unique {
    constructor(uuid = null) {
        this.uuid = uuid || (0, crypto_1.randomUUID)();
    }
    get hash() {
        const hash = (0, crypto_1.createHash)('SHA256');
        hash.update(JSON.stringify(this)).end();
        return hash.digest().toString('base64');
    }
    get shortUuid() {
        return this.uuid.slice(0, 5);
    }
    equals(another) {
        return this.hash == another.hash;
    }
    static validateUuid(uuid) {
        return uuid.match(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/) != null;
    }
}
exports.default = Unique;
