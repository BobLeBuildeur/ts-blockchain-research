"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importStar(require("assert"));
const REST_1 = __importDefault(require("./REST"));
const sinon_1 = __importDefault(require("sinon"));
const Chain_1 = __importDefault(require("../Chain"));
const axios_1 = __importDefault(require("axios"));
const Pool_1 = __importDefault(require("../Pool"));
const Auditor_1 = __importDefault(require("../Actor/Auditor"));
const Transaction_1 = __importDefault(require("../Pool/Transaction"));
const crypto_1 = require("crypto");
const port = 7575;
const base = `http://127.0.0.1:${port}`;
describe("REST", () => {
    describe("@slow @integration tests", () => {
        let restClient;
        let chainStub;
        let pool;
        let poolToStringStub;
        let poolCommitTransactionStub;
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            chainStub = sinon_1.default.createStubInstance(Chain_1.default, {
                toString: JSON.stringify({ type: "chain" })
            });
            pool = new Pool_1.default();
            poolToStringStub = sinon_1.default.stub(pool, "toString").callsFake(() => JSON.stringify({ type: "pool" }));
            /* @ts-ignore */
            poolCommitTransactionStub = sinon_1.default.stub(pool, "commitTransaction").callsFake((_t) => { });
            restClient = new REST_1.default(chainStub, pool, port);
            yield restClient.startServer();
        }));
        afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield restClient.stopServer();
        }));
        it("returns chain at GET /chain endpoint", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield axios_1.default.get(`${base}/chain`);
            assert_1.default.deepEqual(res.data, {
                ok: true,
                value: { type: "chain" }
            });
        }));
        it("returns pool at GET /transaction endpoint", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield axios_1.default.get(`${base}/transactions`);
            assert_1.default.deepEqual(res.data, {
                ok: true,
                value: { type: "pool" }
            });
        }));
        describe("GET/transactionst/:uuid", () => {
            let transactionStub;
            let uuid;
            beforeEach(() => {
                transactionStub = sinon_1.default.createStubInstance(Transaction_1.default, {
                    toString: JSON.stringify({ correct: "result" })
                });
                uuid = (0, crypto_1.randomUUID)();
                /* @ts-ignore */
                transactionStub.uuid = uuid;
                /* @ts-ignore */
                pool.transactions.set(uuid, transactionStub);
            });
            afterEach(() => {
                /* @ts-ignore */
                pool.transactions = new Map();
            });
            it("gets transaction by ID", () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const res = yield axios_1.default.get(`${base}/transactions/${uuid}`);
                    assert_1.default.deepEqual(res.data, {
                        ok: true,
                        value: { correct: "result" }
                    }, "gets transaction");
                }
                catch (err) {
                    (0, assert_1.fail)(err);
                }
            }));
            it("gets 400 when uuid invalid", () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield axios_1.default.get(`${base}/transactions/does-not-exist`);
                    (0, assert_1.fail)();
                }
                catch (err) {
                    const { response } = err;
                    assert_1.default.equal(response.status, 400);
                    assert_1.default.deepEqual(response.data, {
                        ok: false,
                        error: "\"uuid\" must be a valid GUID"
                    });
                }
            }));
            it("gets 404 when uuid doesn't exist", () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield axios_1.default.get(`${base}/transactions/c76a1a89-dc2e-4df5-9de3-32f562f43120`);
                    (0, assert_1.fail)();
                }
                catch (err) {
                    const { response } = err;
                    assert_1.default.equal(response.status, 404);
                    assert_1.default.deepEqual(response.data, {
                        ok: false,
                        error: "Transaction not found"
                    });
                }
            }));
        });
        describe("POST /transactions", () => {
            it("Does not allow invalid transactions", () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield axios_1.default.post(`${base}/transactions`);
                    (0, assert_1.fail)();
                }
                catch (err) {
                    const { response } = err;
                    assert_1.default.equal(response.status, 400);
                    assert_1.default.deepEqual(response.data, {
                        ok: false,
                        error: '"amount" is required'
                    });
                }
            }));
            it("Does not allow unverified transactions", () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield axios_1.default.post(`${base}/transactions`, {
                        amount: 10,
                        senderKey: "6f8e4a1e-9cab-4cfa-8c7e-cd09f2b94f68",
                        receiverKey: "e920b2f4-fe3a-4e52-b19c-fbe15ecb0393",
                        uuid: "c094c737-1e84-4c1e-be9a-208e4940e8e7",
                        ts: Date.now(),
                        signature: "this is definitely wrong!"
                    });
                    (0, assert_1.fail)();
                }
                catch (err) {
                    const { response } = err;
                    assert_1.default.equal(response.status, 400);
                }
            }));
            it("Pushes new transaction if valid", () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const auditor = new Auditor_1.default();
                    const transaction = new Transaction_1.default(10, auditor.publicKey, (0, crypto_1.randomUUID)());
                    transaction.sign(Auditor_1.default.sign(transaction, auditor.privateKey));
                    const serializedTransaction = JSON.parse(transaction.toString());
                    const res = yield axios_1.default.post(`${base}/transactions`, serializedTransaction);
                    const response = {
                        ok: true,
                        value: serializedTransaction
                    };
                    assert_1.default.deepEqual(res.data, response);
                    assert_1.default.equal(poolCommitTransactionStub.called, true);
                }
                catch (err) {
                    (0, assert_1.fail)(err);
                }
            }));
        });
    });
});
