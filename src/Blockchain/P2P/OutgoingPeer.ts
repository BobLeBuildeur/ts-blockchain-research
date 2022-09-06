import { Socket } from "net";
import log from "../../log";
import RPC, { Opcode } from "./RPC";
import { createState } from "../../FSM/state";
import Peer from "./Peer";

export const outgoingHandshakeState = createState<OutgoingPeer>('handshake', {
    tick: ({ send, address, uuid }, { opcode }): string => {
        if (opcode != Opcode.handshake) return 'handshake';

        send(new RPC(Opcode.handshake, address))

        log.debug(`${uuid}: Received and responded handshake request`)

        return 'peer-list';
    }
});

export const outgoingPeerListState = createState<OutgoingPeer>('peer-list', {
    enter: ({ send }) => {
        send(new RPC(Opcode.peer_list));
    },
    tick: ({ emit }, { opcode, _payload }): string => {
        if (opcode != Opcode.peer_list) return 'peer-list';

        emit("peer-list-received")

        return 'updates';
    }
})

export const outgoingUpdatesState = createState<OutgoingPeer>('updates', {
    tick: (_peer, { opcode }): string => {
        if (opcode == Opcode.new_transaction) return 'new-transaction';


        return 'updates';

    }
})

export const outgoingNewTransactionState = createState<OutgoingPeer>('new-transaction', {
    enter: ({ emit }) => {
        emit('new-transaction-received');
    },
    tick: () => 'updates'
});

export default class OutgoingPeer extends Peer {
    constructor(connectionUrl: string, socket?: Socket) {
        super(socket);

        this.connectionUrl = connectionUrl;

        this.addStates(
            outgoingHandshakeState,
            outgoingPeerListState,
            outgoingUpdatesState
        );
    }
}