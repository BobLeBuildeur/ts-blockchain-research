import Pool from "./Pool";
import Chain from "./Chain";
import Stakeholders from "./Stakeholders";
import P2P from "./P2P";
import REST from "./REST";

export default class Node {
    readonly pool: Pool = new Pool();
    readonly chain: Chain = new Chain();
    readonly satekholders: Stakeholders = new Stakeholders();
    readonly p2p: P2P;
    readonly rest: REST;

    constructor(restPort: number, p2pHost: string, p2pPort: number) {
        this.p2p = new P2P(p2pPort, p2pHost);
        this.p2p.startServer();

        this.rest = new REST(this.chain, this.pool, restPort);
        this.rest.startServer();
    }
}
