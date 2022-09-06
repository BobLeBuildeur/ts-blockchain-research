import Unique from "../../Unique";
import Serializable from "../../Serializable";
import Transaction, { SerializedTransaction } from "./Transaction";

export type SerializedPool = {
    uuid: string
    transactions: SerializedTransaction[]
}

export default class Pool extends Unique implements Serializable {

    private transactions: Map<string, Transaction> = new Map<string, Transaction>([])

    constructor(
        transactions: Transaction[] = [],
        uuid: string | null = null
    ) {
        super(uuid);

        transactions.forEach(transaction => {
            if (!transaction.verify(transaction.senderKey)) throw new Error("Cannot create Pool with unverified transaction");
            this.commitTransaction(transaction);
        });
    }

    getTransaction(uuid: string): Transaction | undefined {
        return this.transactions.get(uuid);
    }

    push(transaction: Transaction): void {
        if (this.transactions.has(transaction.uuid)) throw new Error("Transaction exists");
        if (!transaction.verify(transaction.senderKey)) throw new Error("Transaction could not be verified");
    
        this.commitTransaction(transaction)
    }

    private commitTransaction(transaction: Transaction) {
        this.transactions.set(transaction.uuid, transaction);
    }

    get length(): number {
        return this.transactions.size;
    }

    toString(): string {
        const copy = {} as SerializedPool;

        copy.uuid = this.uuid;
        copy.transactions = Array.from(this.transactions.values()).map((t) => JSON.parse(t.toString()));

        return JSON.stringify(copy);
    }

    static fromString(text: string): Pool {
        const { transactions, uuid } = JSON.parse(text) as SerializedPool;

        return new Pool(
            transactions.map((t: SerializedTransaction) => Transaction.fromString(JSON.stringify(t))), 
            uuid
        );
    }
}