import Peer from "./Peer";


export default class PeerList {

    private peers: Peer[] = [];

    add(peer: Peer): void {
        this.peers.push(peer);
    }

    remove(peer: Peer): Peer | false {
        const idx = this.peers.findIndex((p) => p.equals(peer));

        if (idx !== -1) {
            return this.peers.splice(idx, 1)[0];
        }

        return false;
    }
}