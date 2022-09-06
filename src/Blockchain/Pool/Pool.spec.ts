import Transaction from "./Transaction";
import Pool from "./Pool";
import assert from "assert";
import Auditor from "../Actor/Auditor";
import sinon from "sinon";
import { KeyLike } from "crypto";
import Signable from "../Actor/Signable";

const randKey = (len: number = 5): KeyLike => {
    const opts = 'abcdefghijkmnopqrstuvwxyz1234567890'.split('');
    let out = "";

    for (let i = 0; i < len; i++) {
        out += opts[Math.round(Math.random() * opts.length)];
    }

    return out;
}

describe("Pool", () => {


    it ("Cannot be created with unverified transactions @unit", () => {
        const uid = randKey();
        
        const transactionStub = sinon.createStubInstance<Transaction>(Transaction);
        transactionStub.senderKey = uid;
        transactionStub.verify.callsFake((_key: KeyLike) => false);

        assert.throws(() => {
            new Pool([transactionStub]);
        });

        assert.equal(transactionStub.verify.calledWith(uid), true)
    });

    it("Adds transactions to pool and get it by uuid", () => {
        const transactionStub = sinon.createStubInstance<Transaction>(Transaction);
        /* @ts-ignore */
        transactionStub.uuid = "1234";
        const pool = new Pool();

        /* @ts-ignore */
        pool.commitTransaction(transactionStub);

        /* @ts-ignore */
        assert.equal(pool.transactions.size, 1, "added transaction");

        assert.equal(pool.getTransaction("1234"), transactionStub, "gets it back using uuid");

    });

    describe("Adding new transactions @integration", () => {


        let pool: Pool;
        let transaction: Transaction;
        let transaction2: Transaction;
        let transaction3: Transaction;
        let transactionVerifyStub: sinon.SinonStub;

        beforeEach(() => {
            transactionVerifyStub = sinon.stub(Signable.prototype, "verify").callsFake((_key: KeyLike) => true)

            transaction = new Transaction(10, randKey(), randKey());
            transaction2 = new Transaction(5, randKey(), randKey());
            transaction3 = new Transaction(15, randKey(), randKey());

            pool = new Pool([transaction, transaction2, transaction3]);
        });

        afterEach(() => {
            transactionVerifyStub.restore();
            sinon.reset();
        });

        it("has a known length", () => {
            assert.equal(pool.length, 3);
        });

        it("does not allow duplicate transactions", () => {
            assert.throws(() => {
                pool.push(transaction);
            }, Error);
        });

        it("does not allow unverified transactions", () => {
            transactionVerifyStub.restore();

            assert.throws(() => {
                pool.push(new Transaction(123, "123", "321"))
            });
        });

        it("deserializes", () => {
            const copy = Pool.fromString(pool.toString());

            assert.equal(copy.equals(pool), true);
            
            /* @ts-ignore */
            assert.equal(copy.transactions.size, pool.transactions.size);
            
            /* @ts-ignore */
            assert.equal(copy.transactions.get(transaction.uuid)!.equals(pool.transactions.get(transaction.uuid)!), true);

        });
    });
});