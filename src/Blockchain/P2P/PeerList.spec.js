"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const sinon_1 = __importDefault(require("sinon"));
const Peer_1 = __importDefault(require("./Peer"));
const PeerList_1 = __importDefault(require("./PeerList"));
describe("Peer list @unit", () => {
    let peer;
    beforeEach(() => {
        peer = sinon_1.default.createStubInstance(Peer_1.default);
        peer.equals.callsFake((p) => p == peer);
    });
    it("Adds a new peer", () => {
        const list = new PeerList_1.default();
        list.add(peer);
        /* @ts-ignore */
        assert_1.default.equal(list.peers[0], peer);
    });
    describe("Removing", () => {
        let list;
        beforeEach(() => {
            list = new PeerList_1.default();
            list.add(peer);
        });
        it("Removes the peer", () => {
            const result = list.remove(peer);
            assert_1.default.equal(result, peer, "Found and returned peer");
            /* @ts-ignore */
            assert_1.default.equal(list.peers.length, 0);
        });
        it("Retuns false when no peer is found", () => {
            const p2 = sinon_1.default.createStubInstance(Peer_1.default);
            const result = list.remove(p2);
            assert_1.default.equal(result, false);
            /* @ts-ignore */
            assert_1.default.equal(list.peers.length, 1);
        });
    });
});
