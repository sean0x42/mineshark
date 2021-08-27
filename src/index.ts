import { generateKeyPairSync } from "crypto";
import { createServer } from "net";

import createProxyListener from "./proxy";

const listenPort = 25566;
const serverHost = "localhost";
const serverPort = 25565;

const server = createServer(createProxyListener(serverHost, serverPort));
server.listen(listenPort);

console.log("Generating new RSA key pair...");
/*const { publicKey, privateKey } = */ generateKeyPairSync("rsa", {
  modulusLength: 1028,
});
console.log("Done");

console.log();
console.log("Mineshark running");
console.log(` Listen: 127.0.0.1:${listenPort}`);
console.log(`Forward: ${serverHost}:${serverPort}`);
