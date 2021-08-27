import { Socket } from "net";

import encodeToPem from "./pemEncode";
import { numericToState, State } from "./state";
import { readPacket, writePacket } from "./packets";
import { PacketKind, PacketSource } from "./packets/types";

export default function createProxyListener(
  serverHost: string,
  serverPort: number
) {
  return (clientSocket: Socket): void => {
    let clientState = State.Handshake;
    let serverState = State.Status;

    // let clientPublicKey: string | null = null;
    let serverPublicKey: string | null = null;

    const serverSocket = new Socket();
    serverSocket.connect(serverPort, serverHost);

    function onClientConnect() {
      const addr = `${clientSocket.remoteAddress}:${clientSocket.remotePort}`;
      console.log(`Established connection with ${addr}`);
    }

    function onClientData(buffer: Buffer) {
      const packet = readPacket(clientState, PacketSource.Client, buffer);
      packet !== null && console.debug(packet);

      if (packet && packet.kind === PacketKind.Handshake) {
        clientState = numericToState[packet.payload.nextState] ?? State.Status;
        serverState = clientState;
      }

      const finalBuffer = packet ? writePacket(packet) ?? buffer : buffer;
      const isFlushed = serverSocket.write(finalBuffer);
      if (!isFlushed) {
        console.log("Server socket not flushed. Pausing server socket.");
        clientSocket.pause();
      }
    }

    function onServerData(buffer: Buffer) {
      const packet = readPacket(serverState, PacketSource.Server, buffer);
      packet !== null && console.debug(packet);

      if (packet && packet.kind === PacketKind.EncryptionRequest) {
        serverPublicKey = encodeToPem(packet.payload.publicKey);
        console.debug({ serverPublicKey });
      }

      if (packet && packet.kind === PacketKind.LoginSuccess) {
        clientState = State.Play;
        serverState = State.Play;
      }

      const isFlushed = clientSocket.write(
        packet ? writePacket(packet) ?? buffer : buffer
      );
      if (!isFlushed) {
        console.log("Client socket not flushed. Pausing server socket.");
        serverSocket.pause();
      }
    }

    function onClientClose(didError: boolean) {
      console.log(
        !didError
          ? "Client closed connection"
          : "Client closed connection in response to an error"
      );
      serverSocket.end();
    }

    function onServerClose(didError: boolean) {
      console.log(
        !didError
          ? "Server closed connection"
          : "Server closed connection in response to an error"
      );
      clientSocket.end();
    }

    clientSocket.on("connect", onClientConnect);
    clientSocket.on("data", onClientData);
    serverSocket.on("data", onServerData);
    clientSocket.on("drain", () => serverSocket.resume());
    serverSocket.on("drain", () => clientSocket.resume());
    clientSocket.on("close", onClientClose);
    serverSocket.on("close", onServerClose);
  };
}
