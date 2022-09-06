import { createServer, Server, Socket } from "net";
import log from "../../log";
import IncomingPeer from "./IncomingPeer";
import OutgoingPeer from "./OutgoingPeer";
import Emitter from "../../Emitter";
import PeerList from "./PeerList";

export default class P2P extends Emitter {

    private server: Server;
    private incomming: IncomingPeer[] = [];

    private peers: PeerList = new PeerList();

    constructor(readonly path: string) {
        super();

        this.server = createServer();
    }

    async startServer() {
        return new Promise<void>(resolve => {
            this.server.listen(this.path, () => {
                log.info(`P2P server started at ${this.path}`);

                this.setupServerListeners();

                resolve();
            });
        });
    }

    async stopServer() {
        return new Promise<void>(resolve => {
            this.server.close(() => {
                resolve();
            });
        });
    }

    private setupServerListeners() {
        this.server.on("connection", (socket: Socket) => this.connectFrom(socket));
        this.server.on("error", (err) => this.onError(err))
        this.server.on("close", () => this.onClose)
    }

    async connectTo(path: string) {
        const peer = new OutgoingPeer(path);

        await peer.connect(path);

        this.setupOutgoingPeerListeners(peer);
    }

    private setupOutgoingPeerListeners(peer: OutgoingPeer) {
        peer.on("teapot", () => log.info("I'm a teapot"));
        peer.on('new-transaction', (uuid: string) => this.emit('new-transaction', uuid));
    }
    
    connectFrom(socket: Socket) {
        const peer = new IncomingPeer(this.peers, socket);
        
        this.setupIncommingPeerListeners(peer);
    }

    private setupIncommingPeerListeners(peer: IncomingPeer) {
        peer.on("teapot", () => log.info("I'm a teapot"));
    }

    private onError(err: Error) {
        log.error(err);
    }

    private onClose() {
        log.debug("Connection closed");
    }
}