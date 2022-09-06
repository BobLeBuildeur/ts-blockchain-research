"use strict";
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
const net_1 = require("net");
const log_1 = __importDefault(require("../../log"));
const IncomingPeer_1 = __importDefault(require("./IncomingPeer"));
const OutgoingPeer_1 = __importDefault(require("./OutgoingPeer"));
const Emitter_1 = __importDefault(require("../../Emitter"));
const PeerList_1 = __importDefault(require("./PeerList"));
class P2P extends Emitter_1.default {
    constructor(path) {
        super();
        this.path = path;
        this.incomming = [];
        this.peers = new PeerList_1.default();
        this.server = (0, net_1.createServer)();
    }
    startServer() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                this.server.listen(this.path, () => {
                    log_1.default.info(`P2P server started at ${this.path}`);
                    this.setupServerListeners();
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
    setupServerListeners() {
        this.server.on("connection", (socket) => this.connectFrom(socket));
        this.server.on("error", (err) => this.onError(err));
        this.server.on("close", () => this.onClose);
    }
    connectTo(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const peer = new OutgoingPeer_1.default(path);
            yield peer.connect(path);
            this.setupOutgoingPeerListeners(peer);
        });
    }
    setupOutgoingPeerListeners(peer) {
        peer.on("teapot", () => log_1.default.info("I'm a teapot"));
        peer.on('new-transaction', (uuid) => this.emit('new-transaction', uuid));
    }
    connectFrom(socket) {
        const peer = new IncomingPeer_1.default(this.peers, socket);
        this.setupIncommingPeerListeners(peer);
    }
    setupIncommingPeerListeners(peer) {
        peer.on("teapot", () => log_1.default.info("I'm a teapot"));
    }
    onError(err) {
        log_1.default.error(err);
    }
    onClose() {
        log_1.default.debug("Connection closed");
    }
}
exports.default = P2P;
