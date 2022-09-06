import Unique from "../../Unique";
import type { uuid, hash } from '../../Unique';
import Signable from "./Signable";
import { generateKeyPairSync, createSign } from "crypto";
import type { KeyLike } from "crypto";

export type PublicKey = KeyLike
export type PrivateKey = KeyLike

export default class Auditor extends Unique {
    readonly publicKey: PublicKey;
    readonly privateKey: PrivateKey;

    constructor(uuid: uuid | null = null) {
        super(uuid);

        const keypair = generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
        });

        this.privateKey = keypair.privateKey as PrivateKey;
        this.publicKey = keypair.publicKey as PublicKey;
    }

    static sign(document: Signable, privateKey: KeyLike): hash {
        const sign = createSign('SHA256');

        sign.update(document.payload).end();

        return sign.sign(privateKey).toString('base64');
    }
}