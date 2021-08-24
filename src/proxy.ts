import crypto from "crypto";
import { createServer, Socket } from "net";
import { PacketKind, PacketSource } from "./packet";

import encodePem from "./encodePem";
import readPacket from "./reader";
import writePacket from "./writer";
import { numericToState, State } from "./state";

const listenPort = 25566;
const upstreamHost = "localhost";
const upstreamPort = 25565;

console.log("Generating new RSA key pair...");
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 1028,
});
console.log("Done");

function listener(clientSocket: Socket): void {
  let clientState = State.Handshaking;
  let serverState = State.Status;

  let clientPublicKey: crypto.KeyObject | null = null;
  let serverPublicKey: string | null = null;

  const serverSocket = new Socket();
  serverSocket.connect(upstreamPort, upstreamHost);

  clientSocket.on("connect", () => {
    console.log(
      `Established connection with ${clientSocket.remoteAddress}:${clientSocket.remotePort}`
    );
  });

  clientSocket.on("data", (buffer) => {
    const packet = readPacket(clientState, PacketSource.Client, buffer);
    packet !== null && console.debug(packet);

    if (packet && packet.kind === PacketKind.Handshake) {
      clientState =
        numericToState[packet.payload!.nextState as number] ?? State.Status;
      serverState = clientState;
    }

    const finalBuffer = packet ? writePacket(packet) ?? buffer : buffer
    const isFlushed = serverSocket.write(finalBuffer);
    if (!isFlushed) {
      console.log("Server socket not flushed. Pausing server socket.");
      clientSocket.pause();
    }
  });

  serverSocket.on("data", (buffer) => {
    const packet = readPacket(serverState, PacketSource.Server, buffer);
    packet !== null && console.debug(packet);

    if (packet && packet.kind === PacketKind.EncryptionRequest) {
      serverPublicKey = encodePem(packet.payload!.publicKey as Buffer);
      console.debug({ serverPublicKey });
    }

    if (packet && packet.kind === PacketKind.LoginSuccess) {
      clientState = State.Play;
      serverState = State.Play;
    }

    const isFlushed = clientSocket.write(packet ? writePacket(packet) ?? buffer : buffer);
    if (!isFlushed) {
      console.log("Client socket not flushed. Pausing server socket.");
      serverSocket.pause();
    }
  });

  clientSocket.on("drain", () => {
    console.log("Resuming server socket");
    serverSocket.resume();
  });

  serverSocket.on("drain", () => {
    console.log("Resuming client socket");
    clientSocket.resume();
  });

  clientSocket.on("close", (didError) => {
    console.log(
      !didError
        ? "Client closed connection"
        : "Client closed connection in response to an error"
    );
    serverSocket.end();
  });

  serverSocket.on("close", (didError) => {
    console.log(
      !didError
        ? "Server closed connection"
        : "Server closed connection in response to an error"
    );
    clientSocket.end();
  });
}

const server = createServer(listener);
server.listen(listenPort);

console.log();
console.log("MC Proxy running");
console.log(` Listen: 127.0.0.1:${listenPort}`);
console.log(`Forward: ${upstreamHost}:${upstreamPort}`);
