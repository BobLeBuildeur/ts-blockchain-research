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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.incommingUpdatesState = exports.incomingPeerListState = exports.incommingHanshakeState = void 0;
const log_1 = __importDefault(require("../../log"));
const RPC_1 = __importStar(require("./RPC"));
const state_1 = require("../../FSM/state");
const Peer_1 = __importDefault(require("./Peer"));
exports.incommingHanshakeState = (0, state_1.createState)('handshake', {
    enter: ({ send, uuid }) => {
        log_1.default.debug(`${uuid}: Requesting handshake`);
        send(new RPC_1.default(RPC_1.Opcode.handshake));
    },
    tick: ({ emit, uuid }, { opcode, payload }) => {
        if (opcode !== RPC_1.Opcode.handshake) {
            return 'handshake';
        }
        log_1.default.debug(`${uuid}: Handshake responded with ${payload}`);
        emit('handshake-successful', payload || "");
        return 'peer-list';
    }
});
exports.incomingPeerListState = (0, state_1.createState)('peer-list', {
    tick: ({ send, peerList }, { opcode }) => {
        if (opcode != RPC_1.Opcode.peer_list)
            return 'peer-list';
        send(new RPC_1.default(RPC_1.Opcode.peer_list, JSON.stringify(peerList || [])));
        return "updates";
    }
});
exports.incommingUpdatesState = (0, state_1.createState)('updates');
class IncomingPeer extends Peer_1.default {
    constructor(peerList, socket) {
        super(socket);
        this.peerList = peerList;
        this.addStates(exports.incommingHanshakeState, exports.incomingPeerListState, exports.incommingUpdatesState);
    }
}
exports.default = IncomingPeer;
