import Signable from "./Signable";
import type { hash, uuid } from '../../Unique';

export default class Timestamped extends Signable {
    readonly ts: number = 0;

    constructor(
        signature: hash | null = null,
        uuid: uuid | null = null,
        ts: number | null = null
    ) {
        super(signature, uuid);

        this.ts = ts != null ? ts : Date.now();
    }
}