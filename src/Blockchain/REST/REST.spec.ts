import assert, { fail } from "assert";
import REST from "./REST";
import sinon from "sinon";
import Chain from "../Chain";
import axios, { AxiosError, AxiosResponse } from "axios";
import Pool from "../Pool";
import Auditor from "../Actor/Auditor";
import Transaction from "../Pool/Transaction";
import { randomUUID } from "crypto";

const port = 7575;
const base = `http://127.0.0.1:${port}`;

describe("REST", () => {
    describe("@slow @integration tests", () => {

        let restClient: REST;
        let chainStub: sinon.SinonStubbedInstance<Chain>;
        let pool: Pool;
        let poolToStringStub: sinon.SinonStub;
        let poolCommitTransactionStub: sinon.SinonStub;

        beforeEach(async () => {
            chainStub = sinon.createStubInstance<Chain>(Chain, {
                toString: JSON.stringify({ type: "chain" })
            });

            pool = new Pool();

            poolToStringStub = sinon.stub(pool, "toString").callsFake(() => JSON.stringify({ type: "pool" }));

            /* @ts-ignore */
            poolCommitTransactionStub = sinon.stub(pool, "commitTransaction").callsFake((_t: Transaction) => { });


            restClient = new REST(chainStub, pool, port);
            await restClient.startServer();
        });

        afterEach(async () => {
            await restClient.stopServer();
        })

        it("returns chain at GET /chain endpoint", async () => {
            const res = await axios.get(`${base}/chain`);

            assert.deepEqual(res.data, {
                ok: true,
                value: { type: "chain" }
            });
        });


        it("returns pool at GET /transaction endpoint", async () => {

            const res = await axios.get(`${base}/transactions`);

            assert.deepEqual(res.data, {
                ok: true,
                value: { type: "pool" }
            });
        });

        describe("GET/transactionst/:uuid", () => {

            let transactionStub: sinon.SinonStubbedInstance<Transaction>;
            let uuid: string;

            beforeEach(() => {
                transactionStub = sinon.createStubInstance(Transaction, {
                    toString: JSON.stringify({ correct: "result" })
                });

                uuid = randomUUID();

                /* @ts-ignore */
                transactionStub.uuid = uuid;

                /* @ts-ignore */
                pool.transactions.set(uuid, transactionStub);
            });

            afterEach(() => {
                /* @ts-ignore */
                pool.transactions = new Map<string, Transaction>();
            })


            it("gets transaction by ID", async () => {
                try {
                    const res = await axios.get(`${base}/transactions/${uuid}`);

                    assert.deepEqual(res.data, {
                        ok: true,
                        value: { correct: "result" }
                    }, "gets transaction");
                } catch (err) {
                    fail(err as Error);
                }
            });

            it("gets 400 when uuid invalid", async () => {
                try {
                    await axios.get(`${base}/transactions/does-not-exist`);

                    fail();
                } catch (err) {
                    const { response } = err as AxiosError<AxiosResponse>;

                    assert.equal(response!.status, 400);
                    assert.deepEqual(response!.data, {
                        ok: false,
                        error: "\"uuid\" must be a valid GUID"
                    });
                }
            });

            it("gets 404 when uuid doesn't exist", async () => {
                try {
                    await axios.get(`${base}/transactions/c76a1a89-dc2e-4df5-9de3-32f562f43120`);

                    fail();
                } catch (err) {
                    const { response } = err as AxiosError<AxiosResponse>;

                    assert.equal(response!.status, 404);
                    assert.deepEqual(response!.data, {
                        ok: false,
                        error: "Transaction not found"
                    });
                }
            });
        });


        describe("POST /transactions", () => {
            it("Does not allow invalid transactions", async () => {
                try {
                    await axios.post(`${base}/transactions`);

                    fail();
                } catch (err) {
                    const { response } = err as AxiosError<AxiosResponse>;


                    assert.equal(response!.status, 400);
                    assert.deepEqual(response!.data, {
                        ok: false,
                        error: '"amount" is required'
                    });
                }
            });

            it("Does not allow unverified transactions", async () => {
                try {
                    await axios.post(`${base}/transactions`, {
                        amount: 10,
                        senderKey: "6f8e4a1e-9cab-4cfa-8c7e-cd09f2b94f68",
                        receiverKey: "e920b2f4-fe3a-4e52-b19c-fbe15ecb0393",
                        uuid: "c094c737-1e84-4c1e-be9a-208e4940e8e7",
                        ts: Date.now(),
                        signature: "this is definitely wrong!"
                    });

                    fail();
                } catch (err) {
                    const { response } = err as AxiosError<AxiosResponse>;
                    assert.equal(response!.status, 400);
                }
            })

            it("Pushes new transaction if valid", async () => {
                try {
                    const auditor = new Auditor();
                    const transaction = new Transaction(10, auditor.publicKey, randomUUID());
                    transaction.sign(Auditor.sign(transaction, auditor.privateKey));

                    const serializedTransaction = JSON.parse(transaction.toString());

                    const res = await axios.post(`${base}/transactions`, serializedTransaction);

                    const response = {
                        ok: true,
                        value: serializedTransaction
                    }

                    assert.deepEqual(res.data, response);
                    assert.equal(poolCommitTransactionStub.called, true);
                } catch (err) {
                    fail(err as Error);
                }
            });


        });

    })
})