import { generateKeyPairSync } from "crypto";
import { createServer } from "net";

import { log } from "./logger";
import createProxyListener from "./proxy";

const listenPort = 25566;
const serverHost = "localhost";
const serverPort = 25565;

log.debug("Generating new RSA key pair...");
/*const { publicKey, privateKey } = */ generateKeyPairSync("rsa", {
  modulusLength: 1028,
});
log.debug("Done");

const server = createServer(createProxyListener(serverHost, serverPort));
server.listen(listenPort);

log.info();
log.info(`Mineshark running on 127.0.0.1:${listenPort}`);
log.info(`Forwarding packets to ${serverHost}:${serverPort}`);
