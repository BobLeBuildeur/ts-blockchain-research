import Actor from "./Actor/Actor";
import type { hash } from "../Unique";
import type { PublicKey } from "./Actor/Auditor";
import Pool from "./Pool/Pool";

export default class Stakeholders {

    private balances: Map<PublicKey, number> = new Map<hash, number>();

    createActor(): Actor {
        const actor = new Actor();

        this.balances.set(actor.publicKey, 0);

        return actor;
    }

    executeTransactions(pool: Pool): Pool {
        const uncovered = new Pool([]);

        pool.transactions.forEach(transaction => {
            const { senderKey, receiverKey, amount } = transaction;

            if (this.isCovered(senderKey, amount)) {
                this.updateBalance(senderKey, -amount);
                this.updateBalance(receiverKey, amount);
            } else {
                uncovered.push(transaction);
            }
        });

        return uncovered;
    }

    isCovered(key: PublicKey, amount: number): boolean {
        return this.getBalance(key) > amount;
    }

    getBalance(key: PublicKey): number {
        if (!this.balances.has(key)) throw (new Error('No actor'));

        return this.balances.get(key) as number;
    }

    updateBalance(key: PublicKey, amount: number): void {
        const balance = this.getBalance(key);

        this.balances.set(key, balance + amount);
    }
}