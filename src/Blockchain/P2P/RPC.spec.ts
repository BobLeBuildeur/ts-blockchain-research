import assert from "assert";
import RPC, { Opcode } from './RPC';

describe("RPC @unit", () => {


    it ("constists of opcode and string", () => {
        const rpc = new RPC(
            Opcode.message,
            "This is a message, hello!"
        );

        assert.equal(rpc.serialized instanceof Buffer, true);

        const fromBuff = RPC.fromBuffer(rpc.serialized);

        assert.equal(fromBuff.opcode, Opcode.message);
        assert.equal(fromBuff.payload, "This is a message, hello!");
    });

    it ("can be created with no string", () => {
        const rpc = new RPC(Opcode.message);

        assert.equal(rpc.serialized instanceof Buffer, true);

        const fromBuff = RPC.fromBuffer(rpc.serialized);

        assert.equal(fromBuff.opcode, Opcode.message);
        assert.equal(fromBuff.payload, "");
    });

})