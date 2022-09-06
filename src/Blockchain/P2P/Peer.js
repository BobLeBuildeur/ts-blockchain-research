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
const net_1 = require("net");
const log_1 = __importDefault(require("../../log"));
const RPC_1 = __importStar(require("./RPC"));
const StateMachine_1 = __importDefault(require("../../FSM/StateMachine"));
class Peer extends StateMachine_1.default {
    constructor(socket) {
        super();
        this.ts = Date.now();
        this.connectionUrl = '';
        if (socket == undefined)
            socket = new net_1.Socket();
        this.socket = socket;
        this.socket.on("data", (data) => this.onData(data));
        this.socket.on("close", this.onClose);
        this.socket.on("error", this.onError);
    }
    connect(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                this.socket.connect(path, () => {
                    resolve();
                });
            });
        });
    }
    get address() {
        return this.connectionUrl;
    }
    setConnectionUrl(url) {
        this.connectionUrl = url;
    }
    send(rpc) {
        this.socket.write(rpc.serialized);
    }
    onData(data) {
        const { opcode, payload } = RPC_1.default.fromBuffer(data);
        if (opcode == RPC_1.Opcode.message)
            log_1.default.info(payload);
        this.tick({
            opcode,
            payload
        });
    }
    onClose() {
        this.emit('closed');
    }
    onError(error) {
        log_1.default.error(error);
    }
}
exports.default = Peer;
