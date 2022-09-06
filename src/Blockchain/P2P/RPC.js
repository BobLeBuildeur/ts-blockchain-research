"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Opcode = void 0;
var Opcode;
(function (Opcode) {
    Opcode[Opcode["message"] = 1] = "message";
    Opcode[Opcode["handshake"] = 2] = "handshake";
    Opcode[Opcode["peer_list"] = 3] = "peer_list";
    Opcode[Opcode["new_transaction"] = 4] = "new_transaction";
})(Opcode = exports.Opcode || (exports.Opcode = {}));
class RPC {
    constructor(opcode, payload = "") {
        this.opcode = opcode;
        this.payload = payload;
        this.serialized = Buffer.alloc(0);
        this.serialized = Buffer.concat([Buffer.alloc(1, opcode), Buffer.from(payload)]);
    }
    static fromBuffer(buffer) {
        const opcode = buffer.readInt8();
        const payload = buffer.subarray(1).toString();
        return new RPC(opcode, payload);
    }
}
exports.default = RPC;
