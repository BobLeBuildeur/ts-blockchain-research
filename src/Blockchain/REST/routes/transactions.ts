import { Response, Request, NextFunction } from "express";
import Joi from "joi";
import Transaction from "../../Pool/Transaction";
import type { SerializedTransaction } from "../../Pool/Transaction";
import Pool from "../../Pool";
import HttpException from "../HttpException";


export const getTransactionByUuidSchema = Joi.object({
    uuid: Joi.string().guid({ version: ['uuidv4'] }).required()
});

export const getTransactionByUuid = (pool: Pool) => {
    return (_req: Request, res: Response, next: NextFunction) => {
        const transaction = pool.getTransaction(res.locals.value.uuid);

        if (!transaction) throw new HttpException(404, "Transaction not found");
        
        res.locals.send = JSON.parse(transaction.toString());

        next();
    }
}

export const getTransactions = (pool: Pool) => {
    return (_req: Request, res: Response, next: NextFunction) => {
        res.locals.send = JSON.parse(pool.toString());

        next();
    }
}

export const postTransactionsSchema = Joi.object<SerializedTransaction>({
    amount: Joi.number().integer().min(0).required(),
    senderKey: Joi.string().required(),
    receiverKey: Joi.string().required(),
    uuid: Joi.string().guid({ version: ['uuidv4'] }).required(),
    ts: Joi.number().integer().min(0).required(),
    signature: Joi.string().required()
})

export const postTransaction = (pool: Pool) => {
    return (_req: Request, res: Response, next: NextFunction) => {
        try {
            const transaction = Transaction.fromString(JSON.stringify(res.locals.value));
            pool.push(transaction);

            res.locals.send = JSON.parse(transaction.toString());
        } catch (err) {
            next(new HttpException(400, (err as Error).message))
        }

        next();
    }
}