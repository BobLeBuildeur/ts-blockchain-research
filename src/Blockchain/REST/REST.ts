import express, { Express } from 'express';
import bodyParser from 'body-parser';
import Emitter from '../../Emitter';
import { Server } from 'net';
import log from '../../log';
import Chain from '../Chain';
import Pool from "../Pool";
import { error, response } from './middleware/final';
import { urlValidator, bodyValidator } from './middleware/validator';
import * as chainRoute from "./routes/chain";
import * as transactionsRoute from "./routes/transactions";

export default class REST extends Emitter {

    private app: Express = express();
    private server: Server = new Server();

    constructor(private chain: Chain, private pool: Pool, readonly port: number) {
        super();

        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());

        this.setupEndpoints();

        this.app.use(response);
        this.app.use(error);
    }

    async startServer() {
        return new Promise<void>(resolve => {
            this.server = this.app.listen(this.port, () => {
                log.info(`REST server started at port ${this.port}`);

                resolve();
            })
        });
    }

    async stopServer() {
        return new Promise<void>(resolve => {
            this.server.close(() => {
                resolve();
            });
        })
    }

    private setupEndpoints() {

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
        this.app.get('/transactions/:uuid', urlValidator(transactionsRoute.getTransactionByUuidSchema), transactionsRoute.getTransactionByUuid(this.pool))
        
        /**
         * @api {post} /transactions Create a new transaction
         * @apiGroup Transaction
         * @apiBody {string} Signed, serialized transactions
         */
        this.app.post('/transactions', bodyValidator(transactionsRoute.postTransactionsSchema), transactionsRoute.postTransaction(this.pool));
    }
}