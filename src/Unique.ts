import { createHash, randomUUID } from 'crypto';

export type uuid = string
export type hash = string


export default class Unique {
    readonly uuid: uuid;

    constructor(uuid: uuid | null = null) {
        this.uuid = uuid || randomUUID();
    }

    get hash(): hash {
        const hash = createHash('SHA256');

        hash.update(JSON.stringify(this)).end();

        return hash.digest().toString('base64');
    }

    get shortUuid() {
        return this.uuid.slice(0, 5)
    }

    equals(another: Unique): boolean {
        return this.hash == another.hash;
    }

    static validateUuid(uuid: string) {
        return uuid.match(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/) != null
    }
}