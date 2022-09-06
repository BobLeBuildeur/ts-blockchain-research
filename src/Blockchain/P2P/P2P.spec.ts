import assert from "assert";
import sinon, { SinonStub } from "sinon";
import { Socket } from "net";
import P2P from "./P2P";
import Peer from "./Peer";
import IncomingPeer from "./IncomingPeer";
import OutgoingPeer from "./OutgoingPeer";


describe("P2P", () => {

    describe("Peers and Connections @integration", () => {

        afterEach(() => {
            sinon.reset();
        });

        describe("Incomming connections", () => {

            let p2p: P2P;

            beforeEach(() => {
                p2p = new P2P("127.0.0.1");
            })

            it("creates an incomming peer from a socket", () => {
                const socket = sinon.createStubInstance(Socket);

                /* @ts-ignore */
                const setupListenerStub = sinon.stub(p2p, "setupIncommingPeerListeners");

                p2p.connectFrom(socket);

                assert.equal(setupListenerStub.calledWithMatch(sinon.match.instanceOf(IncomingPeer)), true);
            });

            it("sets up all listeners", () => {
                const peerStub = sinon.createStubInstance(IncomingPeer);

                /* @ts-ignore */
                p2p.setupIncommingPeerListeners(peerStub);

                assert.equal(peerStub.on.called, true);
            });

        });

        describe("Outgoing connections", () => {
            let p2p: P2P;

            beforeEach(() => {
                p2p = new P2P("127.0.0.1");
            })

            it("connects to a server", async () => {
                const peerConnectStub = sinon.stub(Peer.prototype, "connect").resolves();

                /* @ts-ignore */
                const setupListenerStub = sinon.stub(p2p, "setupOutgoingPeerListeners");

                await p2p.connectTo("website");

                assert.equal(peerConnectStub.called, true, "tries connection");
                assert.equal(setupListenerStub.calledWithMatch(sinon.match.instanceOf(OutgoingPeer)), true, "creates peer");

                peerConnectStub.restore();
            });

            it("Sets up all listeners", () => {

                const peerStub = sinon.createStubInstance(OutgoingPeer);

                /* @ts-ignore */
                p2p.setupOutgoingPeerListeners(peerStub);

                assert.equal(peerStub.on.called, true);
            });

            describe("@current events", () => {
                let peer: Peer;
                let emitStub: SinonStub;

                beforeEach(() => {
                    p2p = new P2P("127.0.0.1");
                    peer = new Peer();

                    /* @ts-ignore */
                    p2p.setupOutgoingPeerListeners(peer);

                    emitStub = sinon.stub(p2p, "emit");
                });

                it("receives and re-emits new transaction", () => {
                    const data = JSON.stringify({ data: "data" });

                    peer.emit('new-transaction', data);

                    assert.equal(emitStub.called, true, "called emit")
                    assert.equal(emitStub.calledWith('new-transaction', data), true);
                });
            });

        });

    })
})