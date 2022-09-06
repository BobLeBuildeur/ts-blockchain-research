"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Pool_1 = __importDefault(require("./Pool"));
const Chain_1 = __importDefault(require("./Chain"));
const Stakeholders_1 = __importDefault(require("./Stakeholders"));
const P2P_1 = __importDefault(require("./P2P"));
const REST_1 = __importDefault(require("./REST"));
class Node {
    constructor(restPort, p2pHost, p2pPort) {
        this.pool = new Pool_1.default();
        this.chain = new Chain_1.default();
        this.satekholders = new Stakeholders_1.default();
        this.p2p = new P2P_1.default(p2pPort, p2pHost);
        this.p2p.startServer();
        this.rest = new REST_1.default(this.chain, this.pool, restPort);
        this.rest.startServer();
    }
}
exports.default = Node;
