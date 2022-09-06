import { Socket } from "net";
import log from "../../log";
import RPC, { Opcode } from "./RPC";
import { createState } from "../../FSM/state";
import Peer, { PeerBlackboard } from "./Peer";
import PeerList from "./PeerList";

export const incommingHanshakeState = createState<IncomingPeer>('handshake', {
    enter: ({ send, uuid }: IncomingPeer) => {
        log.debug(`${uuid}: Requesting handshake`)
        send(new RPC(Opcode.handshake))
    },
    tick: ({ emit, uuid }: IncomingPeer, {opcode, payload}: PeerBlackboard) => {
        if (opcode !== Opcode.handshake) {
            return 'handshake'
        }

        log.debug(`${uuid}: Handshake responded with ${payload}`);


        emit('handshake-successful', payload || "");
        return 'peer-list'
    }
});

export const incomingPeerListState = createState<IncomingPeer>('peer-list', {
    tick: ({ send, peerList }: IncomingPeer, { opcode }: PeerBlackboard): string => {
        if (opcode != Opcode.peer_list) return 'peer-list';

        send(new RPC(Opcode.peer_list, JSON.stringify(peerList || [])));

        return "updates"
    }
});

export const incommingUpdatesState = createState<IncomingPeer>('updates');

export default class IncomingPeer extends Peer {

    constructor(readonly peerList: PeerList, socket?: Socket) {
        super(socket);

        this.addStates(
            incommingHanshakeState,
            incomingPeerListState,
            incommingUpdatesState
        );
    }
}
