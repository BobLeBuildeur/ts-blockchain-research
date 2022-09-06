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
const Node_1 = __importDefault(require("./Blockchain/Node"));
const log_1 = __importDefault(require("./log"));
const port = parseInt(process.argv[2]);
const node = new Node_1.default(port - 100, "127.0.0.1", port);
if (port != 1234) {
    const connect = () => __awaiter(void 0, void 0, void 0, function* () {
        const delay = (port - 1234) * 250;
        log_1.default.debug(`Not main node, waiting ${delay}ms to connect`);
        yield new Promise(resolve => setTimeout(resolve, delay));
        node.p2p.connectTo("127.0.0.1");
    });
    connect();
}
