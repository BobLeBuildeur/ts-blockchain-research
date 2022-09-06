"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PeerList {
    constructor() {
        this.peers = [];
    }
    add(peer) {
        this.peers.push(peer);
    }
    remove(peer) {
        const idx = this.peers.findIndex((p) => p.equals(peer));
        if (idx !== -1) {
            return this.peers.splice(idx, 1)[0];
        }
        return false;
    }
}
exports.default = PeerList;
