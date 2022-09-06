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
const assert_1 = __importDefault(require("assert"));
const sinon_1 = __importDefault(require("sinon"));
const net_1 = require("net");
const P2P_1 = __importDefault(require("./P2P"));
const Peer_1 = __importDefault(require("./Peer"));
const IncomingPeer_1 = __importDefault(require("./IncomingPeer"));
const OutgoingPeer_1 = __importDefault(require("./OutgoingPeer"));
describe("P2P", () => {
    describe("Peers and Connections @integration", () => {
        afterEach(() => {
            sinon_1.default.reset();
        });
        describe("Incomming connections", () => {
            let p2p;
            beforeEach(() => {
                p2p = new P2P_1.default("127.0.0.1");
            });
            it("creates an incomming peer from a socket", () => {
                const socket = sinon_1.default.createStubInstance(net_1.Socket);
                /* @ts-ignore */
                const setupListenerStub = sinon_1.default.stub(p2p, "setupIncommingPeerListeners");
                p2p.connectFrom(socket);
                assert_1.default.equal(setupListenerStub.calledWithMatch(sinon_1.default.match.instanceOf(IncomingPeer_1.default)), true);
            });
            it("sets up all listeners", () => {
                const peerStub = sinon_1.default.createStubInstance(IncomingPeer_1.default);
                /* @ts-ignore */
                p2p.setupIncommingPeerListeners(peerStub);
                assert_1.default.equal(peerStub.on.called, true);
            });
        });
        describe("Outgoing connections", () => {
            let p2p;
            beforeEach(() => {
                p2p = new P2P_1.default("127.0.0.1");
            });
            it("connects to a server", () => __awaiter(void 0, void 0, void 0, function* () {
                const peerConnectStub = sinon_1.default.stub(Peer_1.default.prototype, "connect").resolves();
                /* @ts-ignore */
                const setupListenerStub = sinon_1.default.stub(p2p, "setupOutgoingPeerListeners");
                yield p2p.connectTo("website");
                assert_1.default.equal(peerConnectStub.called, true, "tries connection");
                assert_1.default.equal(setupListenerStub.calledWithMatch(sinon_1.default.match.instanceOf(OutgoingPeer_1.default)), true, "creates peer");
                peerConnectStub.restore();
            }));
            it("Sets up all listeners", () => {
                const peerStub = sinon_1.default.createStubInstance(OutgoingPeer_1.default);
                /* @ts-ignore */
                p2p.setupOutgoingPeerListeners(peerStub);
                assert_1.default.equal(peerStub.on.called, true);
            });
            describe("@current events", () => {
                let peer;
                let emitStub;
                beforeEach(() => {
                    p2p = new P2P_1.default("127.0.0.1");
                    peer = new Peer_1.default();
                    /* @ts-ignore */
                    p2p.setupOutgoingPeerListeners(peer);
                    emitStub = sinon_1.default.stub(p2p, "emit");
                });
                it("receives and re-emits new transaction", () => {
                    const data = JSON.stringify({ data: "data" });
                    peer.emit('new-transaction', data);
                    assert_1.default.equal(emitStub.called, true, "called emit");
                    assert_1.default.equal(emitStub.calledWith('new-transaction', data), true);
                });
            });
        });
    });
});
