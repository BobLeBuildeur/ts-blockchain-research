import Unique from "../../Unique";
import type { hash, uuid } from '../../Unique';
import type { PublicKey } from "./Auditor";
import { createVerify } from "crypto";

export default class Signable extends Unique {

    private _signature?: hash;

    constructor(signature: hash | null = null, uuid: uuid | null = null) {
        super(uuid);

        this._signature = signature || '';
    }

    get payload(): string {
        const copy = Object.assign({}, this);
        delete copy._signature;

        return JSON.stringify(copy);
    }

    get signature(): hash | undefined {
        return this._signature;
    }

    sign(newSignature: hash): void {
        this._signature = newSignature
    }

    verify(publicKey: PublicKey): boolean {
        if (!this.signature || this.signature.length == 0) throw (new Error("No signature"));

        const verify = createVerify("SHA256");

        verify.update(this.payload);

        return verify.verify(publicKey, Buffer.from(this.signature, 'base64'));
    }
}