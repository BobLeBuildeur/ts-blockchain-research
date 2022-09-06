import { Socket } from "net";
import log from "../../log";
import RPC, { Opcode } from "./RPC";
import StateMachine, { Blackboard } from '../../FSM/StateMachine';

export interface PeerBlackboard extends Blackboard {
    opcode?: number,
    payload?: string
}

export default class Peer extends StateMachine<PeerBlackboard> {

    readonly ts = Date.now();
    
    private socket: Socket;
    protected connectionUrl = '';

    constructor(socket?: Socket) {
        super();

        if (socket == undefined) socket = new Socket();
        this.socket = socket;

        this.socket.on("data", (data: Buffer) => this.onData(data));
        this.socket.on("close", this.onClose);
        this.socket.on("error", this.onError);
    }

    async connect(path: string) {
        return new Promise<void>(resolve => {
            this.socket.connect(path, () => {
                resolve();
            })
        });
    }

    get address() {
        return this.connectionUrl;
    }

    setConnectionUrl(url: string) {
        this.connectionUrl = url;
    }

    send(rpc: RPC) {
        this.socket.write(rpc.serialized);
    }

    private onData(data: Buffer) {
        const { opcode, payload } = RPC.fromBuffer(data);

        if (opcode == Opcode.message) log.info(payload);

        this.tick({
            opcode,
            payload
        } as PeerBlackboard);
    }

    private onClose() {
        this.emit('closed');
    }

    private onError(error: Error) {
        log.error(error);
    }
}