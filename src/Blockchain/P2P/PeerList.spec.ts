import assert from "assert";
import sinon from "sinon";
import Peer from "./Peer";
import PeerList from "./PeerList";

describe("Peer list @unit", () => {

    let peer: sinon.SinonStubbedInstance<Peer>

    beforeEach(() => {
        peer = sinon.createStubInstance(Peer);
        peer.equals.callsFake((p) => p == peer);
    });

    it("Adds a new peer", () => {
        const list = new PeerList();

        list.add(peer);

        /* @ts-ignore */
        assert.equal(list.peers[0], peer);
    })

    describe("Removing", () => {
        let list: PeerList;

        beforeEach(() => {
            list = new PeerList();
            list.add(peer);
        });

        it("Removes the peer", () => {
            const result = list.remove(peer);

            assert.equal(result, peer, "Found and returned peer");
            
            /* @ts-ignore */
            assert.equal(list.peers.length, 0);
        });

        it("Retuns false when no peer is found", () => {
            const p2 = sinon.createStubInstance(Peer);

            const result = list.remove(p2);

            assert.equal(result, false);

            /* @ts-ignore */
            assert.equal(list.peers.length, 1);
        })
    });

})