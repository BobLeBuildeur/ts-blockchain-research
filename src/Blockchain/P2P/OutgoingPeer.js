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
exports.outgoingNewTransactionState = exports.outgoingUpdatesState = exports.outgoingPeerListState = exports.outgoingHandshakeState = void 0;
const log_1 = __importDefault(require("../../log"));
const RPC_1 = __importStar(require("./RPC"));
const state_1 = require("../../FSM/state");
const Peer_1 = __importDefault(require("./Peer"));
exports.outgoingHandshakeState = (0, state_1.createState)('handshake', {
    tick: ({ send, address, uuid }, { opcode }) => {
        if (opcode != RPC_1.Opcode.handshake)
            return 'handshake';
        send(new RPC_1.default(RPC_1.Opcode.handshake, address));
        log_1.default.debug(`${uuid}: Received and responded handshake request`);
        return 'peer-list';
    }
});
exports.outgoingPeerListState = (0, state_1.createState)('peer-list', {
    enter: ({ send }) => {
        send(new RPC_1.default(RPC_1.Opcode.peer_list));
    },
    tick: ({ emit }, { opcode, _payload }) => {
        if (opcode != RPC_1.Opcode.peer_list)
            return 'peer-list';
        emit("peer-list-received");
        return 'updates';
    }
});
exports.outgoingUpdatesState = (0, state_1.createState)('updates', {
    tick: (_peer, { opcode }) => {
        if (opcode == RPC_1.Opcode.new_transaction)
            return 'new-transaction';
        return 'updates';
    }
});
exports.outgoingNewTransactionState = (0, state_1.createState)('new-transaction', {
    enter: ({ emit }) => {
        emit('new-transaction-received');
    },
    tick: () => 'updates'
});
class OutgoingPeer extends Peer_1.default {
    constructor(connectionUrl, socket) {
        super(socket);
        this.connectionUrl = connectionUrl;
        this.addStates(exports.outgoingHandshakeState, exports.outgoingPeerListState, exports.outgoingUpdatesState);
    }
}
exports.default = OutgoingPeer;
