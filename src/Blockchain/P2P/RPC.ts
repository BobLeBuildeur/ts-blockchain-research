
export enum Opcode {
    "message" = 0x1,
    "handshake" = 0x2,
    "peer_list" = 0x3,
    "new_transaction" = 0x4,
}

export default class RPC {


    readonly serialized: Buffer = Buffer.alloc(0);

    constructor(
        readonly opcode: Opcode,
        readonly payload: string = "") {
        this.serialized = Buffer.concat([Buffer.alloc(1, opcode), Buffer.from(payload)]);
    }

    static fromBuffer(buffer: Buffer) {
        const opcode = buffer.readInt8();
        const payload = buffer.subarray(1).toString();

        return new RPC(opcode, payload);
    }
}