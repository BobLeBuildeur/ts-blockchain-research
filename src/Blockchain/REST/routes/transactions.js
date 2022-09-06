"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postTransaction = exports.postTransactionsSchema = exports.getTransactions = exports.getTransactionByUuid = exports.getTransactionByUuidSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const Transaction_1 = __importDefault(require("../../Pool/Transaction"));
const HttpException_1 = __importDefault(require("../HttpException"));
exports.getTransactionByUuidSchema = joi_1.default.object({
    uuid: joi_1.default.string().guid({ version: ['uuidv4'] }).required()
});
const getTransactionByUuid = (pool) => {
    return (_req, res, next) => {
        const transaction = pool.getTransaction(res.locals.value.uuid);
        if (!transaction)
            throw new HttpException_1.default(404, "Transaction not found");
        res.locals.send = JSON.parse(transaction.toString());
        next();
    };
};
exports.getTransactionByUuid = getTransactionByUuid;
const getTransactions = (pool) => {
    return (_req, res, next) => {
        res.locals.send = JSON.parse(pool.toString());
        next();
    };
};
exports.getTransactions = getTransactions;
exports.postTransactionsSchema = joi_1.default.object({
    amount: joi_1.default.number().integer().min(0).required(),
    senderKey: joi_1.default.string().required(),
    receiverKey: joi_1.default.string().required(),
    uuid: joi_1.default.string().guid({ version: ['uuidv4'] }).required(),
    ts: joi_1.default.number().integer().min(0).required(),
    signature: joi_1.default.string().required()
});
const postTransaction = (pool) => {
    return (_req, res, next) => {
        try {
            const transaction = Transaction_1.default.fromString(JSON.stringify(res.locals.value));
            pool.push(transaction);
            res.locals.send = JSON.parse(transaction.toString());
        }
        catch (err) {
            next(new HttpException_1.default(400, err.message));
        }
        next();
    };
};
exports.postTransaction = postTransaction;
