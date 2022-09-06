import assert from "assert";
import Transaction from "./Pool/Transaction";
import Pool from "./Pool/Pool";
import Stakeholders from "./Stakeholders";
import Actor from "./Actor/Actor";
import sinon from "sinon";
import Signable from "./Actor/Signable";
import { KeyLike } from "crypto";


describe("Stakeholders", () => {

    let stakeholders: Stakeholders;

    beforeEach(() => {
        stakeholders = new Stakeholders();
    });

    describe("Balance @integration", () => {
        let sender: Actor;
        let receiver: Actor;
        let verifyStub: sinon.SinonStub;

        beforeEach(() => {
            verifyStub = sinon.stub(Signable.prototype, "verify").callsFake((_key: KeyLike) => true);

            sender = stakeholders.createActor();
            receiver = stakeholders.createActor();
        });

        afterEach(() => {
            verifyStub.restore();
            sinon.reset();
        });

        it("creates users with 0 balance, and allows it to be updated", () => {

            assert.equal(stakeholders.getBalance(sender.publicKey), 0);

            stakeholders.updateBalance(sender.publicKey, 20);

            assert.equal(stakeholders.getBalance(sender.publicKey), 20);

            stakeholders.updateBalance(sender.publicKey, -5);

            assert.equal(stakeholders.getBalance(sender.publicKey), 15);
        });

        it("throws for unregistered and invalid actors", () => {
            const unregistered = new Actor();

            assert.throws(() => {
                stakeholders.getBalance(unregistered.publicKey);
            }, Error);

            assert.throws(() => {
                stakeholders.getBalance("1234");
            }, Error);

            assert.throws(() => {
                stakeholders.updateBalance(unregistered.publicKey, 1234);
            }, Error);

            assert.throws(() => {
                stakeholders.updateBalance("1234", 1234);
            }, Error);
        });

        it ("does not allow uncovered transactions", () => {
            assert.equal(stakeholders.isCovered(sender.publicKey, 5000), false);

            stakeholders.updateBalance(sender.publicKey, 1000);

            assert.equal(stakeholders.isCovered(sender.publicKey, 5000), false);

            stakeholders.updateBalance(sender.publicKey, 10000);

            assert.equal(stakeholders.isCovered(sender.publicKey, 5000), true);
        })

        it("executes covered transactions, returning uncovered", () => {
            stakeholders.updateBalance(sender.publicKey, 20);
            assert.equal(stakeholders.getBalance(sender.publicKey), 20);
            

            const uncoveredTransaction = new Transaction(200, sender.publicKey, receiver.publicKey);

            const pool = new Pool([
                new Transaction(10, sender.publicKey, receiver.publicKey),
                new Transaction(2, sender.publicKey, receiver.publicKey),
                uncoveredTransaction
            ]);

            const uncovered = stakeholders.executeTransactions(pool);
        
            assert.equal(typeof uncovered, typeof pool);

            assert.equal(stakeholders.getBalance(sender.publicKey), 8);
            assert.equal(stakeholders.getBalance(receiver.publicKey), 12);

            assert.equal(uncovered.length, 1);
            
            /* @ts-ignore */
            const retrievedUncoveredTransaction = uncovered.transactions.get(uncoveredTransaction.uuid);

            assert.equal(retrievedUncoveredTransaction!.amount, 200);
        });

    });
});