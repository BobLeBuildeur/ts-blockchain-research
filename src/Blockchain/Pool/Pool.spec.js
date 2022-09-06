"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Transaction_1 = __importDefault(require("./Transaction"));
const Pool_1 = __importDefault(require("./Pool"));
const assert_1 = __importDefault(require("assert"));
const sinon_1 = __importDefault(require("sinon"));
const Signable_1 = __importDefault(require("../Actor/Signable"));
const randKey = (len = 5) => {
    const opts = 'abcdefghijkmnopqrstuvwxyz1234567890'.split('');
    let out = "";
    for (let i = 0; i < len; i++) {
        out += opts[Math.round(Math.random() * opts.length)];
    }
    return out;
};
describe("Pool", () => {
    it("Cannot be created with unverified transactions @unit", () => {
        const uid = randKey();
        const transactionStub = sinon_1.default.createStubInstance(Transaction_1.default);
        transactionStub.senderKey = uid;
        transactionStub.verify.callsFake((_key) => false);
        assert_1.default.throws(() => {
            new Pool_1.default([transactionStub]);
        });
        assert_1.default.equal(transactionStub.verify.calledWith(uid), true);
    });
    it("Adds transactions to pool and get it by uuid", () => {
        const transactionStub = sinon_1.default.createStubInstance(Transaction_1.default);
        /* @ts-ignore */
        transactionStub.uuid = "1234";
        const pool = new Pool_1.default();
        /* @ts-ignore */
        pool.commitTransaction(transactionStub);
        /* @ts-ignore */
        assert_1.default.equal(pool.transactions.size, 1, "added transaction");
        assert_1.default.equal(pool.getTransaction("1234"), transactionStub, "gets it back using uuid");
    });
    describe("Adding new transactions @integration", () => {
        let pool;
        let transaction;
        let transaction2;
        let transaction3;
        let transactionVerifyStub;
        beforeEach(() => {
            transactionVerifyStub = sinon_1.default.stub(Signable_1.default.prototype, "verify").callsFake((_key) => true);
            transaction = new Transaction_1.default(10, randKey(), randKey());
            transaction2 = new Transaction_1.default(5, randKey(), randKey());
            transaction3 = new Transaction_1.default(15, randKey(), randKey());
            pool = new Pool_1.default([transaction, transaction2, transaction3]);
        });
        afterEach(() => {
            transactionVerifyStub.restore();
            sinon_1.default.reset();
        });
        it("has a known length", () => {
            assert_1.default.equal(pool.length, 3);
        });
        it("does not allow duplicate transactions", () => {
            assert_1.default.throws(() => {
                pool.push(transaction);
            }, Error);
        });
        it("does not allow unverified transactions", () => {
            transactionVerifyStub.restore();
            assert_1.default.throws(() => {
                pool.push(new Transaction_1.default(123, "123", "321"));
            });
        });
        it("deserializes", () => {
            const copy = Pool_1.default.fromString(pool.toString());
            assert_1.default.equal(copy.equals(pool), true);
            /* @ts-ignore */
            assert_1.default.equal(copy.transactions.size, pool.transactions.size);
            /* @ts-ignore */
            assert_1.default.equal(copy.transactions.get(transaction.uuid).equals(pool.transactions.get(transaction.uuid)), true);
        });
    });
});
