import { Socket } from "net";

import encodeToPem from "./pemEncode";
import { numericToState, State } from "./state";
import { readPacket, writePacket } from "./packets";
import { PacketKind, PacketSource } from "./packets/types";
import { log } from "./logger";

export default function createProxyListener(
  serverHost: string,
  serverPort: number
) {
  return (clientSocket: Socket): void => {
    const clientAddr = `${clientSocket.remoteAddress}:${clientSocket.remotePort}`;
    const playerName = "unknown";
    let clientState = State.Handshake;
    let serverState = State.Status;

    // let clientPublicKey: string | null = null;
    let serverPublicKey: string | null = null;

    const serverSocket = new Socket();
    serverSocket.connect(serverPort, serverHost);

    function onClientConnect() {
      log.info(`Established connection with new client: ${clientAddr}`);
    }

    function writeToServer(buffer: Buffer) {
      const isFlushed = serverSocket.write(buffer);
      if (!isFlushed) {
        log.trace("Server socket not flushed. Pausing server socket.");
        clientSocket.pause();
      }
    }

    function writeToClient(buffer: Buffer) {
      const isFlushed = clientSocket.write(buffer);
      if (!isFlushed) {
        log.trace(
          { clientAddr, playerName },
          "Client socket not flushed. Pausing server socket."
        );
        serverSocket.pause();
      }
    }

    function onClientData(buffer: Buffer) {
      const packet = readPacket(clientState, PacketSource.Client, buffer);

      if (packet === null) {
        writeToServer(buffer);
        return;
      }

      log.info(packet);

      if (packet.kind === PacketKind.Handshake) {
        clientState = numericToState[packet.payload.nextState] ?? State.Status;
        serverState = clientState;
      }

      writeToServer(writePacket(packet) ?? buffer);
    }

    function onServerData(buffer: Buffer) {
      const packet = readPacket(serverState, PacketSource.Server, buffer);

      if (packet === null) {
        writeToClient(buffer);
        return;
      }

      log.info(packet);

      if (packet.kind === PacketKind.EncryptionRequest) {
        serverPublicKey = encodeToPem(packet.payload.publicKey);
        log.debug({ serverPublicKey }, "Server public key");
      }

      if (packet.kind === PacketKind.LoginSuccess) {
        clientState = State.Play;
        serverState = State.Play;
      }

      writeToClient(writePacket(packet) ?? buffer);
    }

    function onClientClose(didError: boolean) {
      if (didError) {
        log.error(
          { clientAddr, playerName },
          "Client closed connection in response to an error"
        );
      } else {
        log.info({ clientAddr, playerName }, "Client closed connection");
      }

      serverSocket.end();
    }

    function onServerClose(didError: boolean) {
      if (didError) {
        log.error("Server closed connection in response to an error");
      } else {
        log.info("Server closed connection");
      }

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
