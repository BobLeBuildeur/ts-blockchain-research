"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const Transaction_1 = __importDefault(require("./Pool/Transaction"));
const Pool_1 = __importDefault(require("./Pool/Pool"));
const Stakeholders_1 = __importDefault(require("./Stakeholders"));
const Actor_1 = __importDefault(require("./Actor/Actor"));
const sinon_1 = __importDefault(require("sinon"));
const Signable_1 = __importDefault(require("./Actor/Signable"));
describe("Stakeholders", () => {
    let stakeholders;
    beforeEach(() => {
        stakeholders = new Stakeholders_1.default();
    });
    describe("Balance @integration", () => {
        let sender;
        let receiver;
        let verifyStub;
        beforeEach(() => {
            verifyStub = sinon_1.default.stub(Signable_1.default.prototype, "verify").callsFake((_key) => true);
            sender = stakeholders.createActor();
            receiver = stakeholders.createActor();
        });
        afterEach(() => {
            verifyStub.restore();
            sinon_1.default.reset();
        });
        it("creates users with 0 balance, and allows it to be updated", () => {
            assert_1.default.equal(stakeholders.getBalance(sender.publicKey), 0);
            stakeholders.updateBalance(sender.publicKey, 20);
            assert_1.default.equal(stakeholders.getBalance(sender.publicKey), 20);
            stakeholders.updateBalance(sender.publicKey, -5);
            assert_1.default.equal(stakeholders.getBalance(sender.publicKey), 15);
        });
        it("throws for unregistered and invalid actors", () => {
            const unregistered = new Actor_1.default();
            assert_1.default.throws(() => {
                stakeholders.getBalance(unregistered.publicKey);
            }, Error);
            assert_1.default.throws(() => {
                stakeholders.getBalance("1234");
            }, Error);
            assert_1.default.throws(() => {
                stakeholders.updateBalance(unregistered.publicKey, 1234);
            }, Error);
            assert_1.default.throws(() => {
                stakeholders.updateBalance("1234", 1234);
            }, Error);
        });
        it("does not allow uncovered transactions", () => {
            assert_1.default.equal(stakeholders.isCovered(sender.publicKey, 5000), false);
            stakeholders.updateBalance(sender.publicKey, 1000);
            assert_1.default.equal(stakeholders.isCovered(sender.publicKey, 5000), false);
            stakeholders.updateBalance(sender.publicKey, 10000);
            assert_1.default.equal(stakeholders.isCovered(sender.publicKey, 5000), true);
        });
        it("executes covered transactions, returning uncovered", () => {
            stakeholders.updateBalance(sender.publicKey, 20);
            assert_1.default.equal(stakeholders.getBalance(sender.publicKey), 20);
            const uncoveredTransaction = new Transaction_1.default(200, sender.publicKey, receiver.publicKey);
            const pool = new Pool_1.default([
                new Transaction_1.default(10, sender.publicKey, receiver.publicKey),
                new Transaction_1.default(2, sender.publicKey, receiver.publicKey),
                uncoveredTransaction
            ]);
            const uncovered = stakeholders.executeTransactions(pool);
            assert_1.default.equal(typeof uncovered, typeof pool);
            assert_1.default.equal(stakeholders.getBalance(sender.publicKey), 8);
            assert_1.default.equal(stakeholders.getBalance(receiver.publicKey), 12);
            assert_1.default.equal(uncovered.length, 1);
            /* @ts-ignore */
            const retrievedUncoveredTransaction = uncovered.transactions.get(uncoveredTransaction.uuid);
            assert_1.default.equal(retrievedUncoveredTransaction.amount, 200);
        });
    });
});
