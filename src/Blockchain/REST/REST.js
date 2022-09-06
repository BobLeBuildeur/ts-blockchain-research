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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const Emitter_1 = __importDefault(require("../../Emitter"));
const net_1 = require("net");
const log_1 = __importDefault(require("../../log"));
const final_1 = require("./middleware/final");
const validator_1 = require("./middleware/validator");
const chainRoute = __importStar(require("./routes/chain"));
const transactionsRoute = __importStar(require("./routes/transactions"));
class REST extends Emitter_1.default {
    constructor(chain, pool, port) {
        super();
        this.chain = chain;
        this.pool = pool;
        this.port = port;
        this.app = (0, express_1.default)();
        this.server = new net_1.Server();
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        this.app.use(body_parser_1.default.json());
        this.setupEndpoints();
        this.app.use(final_1.response);
        this.app.use(final_1.error);
    }
    startServer() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                this.server = this.app.listen(this.port, () => {
                    log_1.default.info(`REST server started at port ${this.port}`);
                    resolve();
                });
            });
        });
    }
    stopServer() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                this.server.close(() => {
                    resolve();
                });
            });
        });
    }
    setupEndpoints() {
        /**
         * @api {get} /chain Returns whole chain
         * @apiGroup Chain
         */
        this.app.get('/chain', chainRoute.getChain(this.chain));
        /**
         * @api {get} /transactions Lists all transactions in current pool
         * @apiGroup Transaction
         */
        this.app.get('/transactions', transactionsRoute.getTransactions(this.pool));
        /**
         * @api {get} /transactions/:uuid
         * @apiGroup Transaction
         *
         * @apiParam uuid
         */
        this.app.get('/transactions/:uuid', (0, validator_1.urlValidator)(transactionsRoute.getTransactionByUuidSchema), transactionsRoute.getTransactionByUuid(this.pool));
        /**
         * @api {post} /transactions Create a new transaction
         * @apiGroup Transaction
         * @apiBody {string} Signed, serialized transactions
         */
        this.app.post('/transactions', (0, validator_1.bodyValidator)(transactionsRoute.postTransactionsSchema), transactionsRoute.postTransaction(this.pool));
    }
}
exports.default = REST;
