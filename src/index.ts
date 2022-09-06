import Node from "./Blockchain/Node";
import log from "./log";

const port = parseInt(process.argv[2]);

const node = new Node(port - 100, "127.0.0.1", port);

if (port != 1234) {
    const connect = async () => {
        const delay = (port - 1234) * 250 

        log.debug(`Not main node, waiting ${delay}ms to connect`)

        await new Promise(resolve => setTimeout(resolve, delay));

        node.p2p.connectTo("127.0.0.1");
    }
    connect();
}