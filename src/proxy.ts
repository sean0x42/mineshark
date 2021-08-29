import { Socket } from "net";

import { numericToState, State } from "./state";
import { readPacket, writePacket } from "./packets";
import { Packet, PacketKind, PacketSource } from "./packets/types";
import { log } from "./logger";
import initialiseMiddleware from "./middleware";

export default function createProxyListener(
  serverHost: string,
  serverPort: number
) {
  return (clientSocket: Socket): void => {
    const middleware = initialiseMiddleware();
    const clientAddr = `${clientSocket.remoteAddress}:${clientSocket.remotePort}`;
    let playerName = "unknown";

    let clientState = State.Handshake;
    let serverState = State.Status;

    let compressionThreshold = -1;

    log.info(`Established connection with new client: ${clientAddr}`);

    const serverSocket = new Socket();
    serverSocket.connect(serverPort, serverHost);

    serverSocket.on("connect", () => {
      log.info("Connected to server");
    });

    function writeToServer(buffer: Buffer): void {
      const isFlushed = serverSocket.write(buffer);

      if (!isFlushed) {
        log.trace("Server socket not flushed. Pausing server socket.");
        clientSocket.pause();
      }
    }

    function writeToClient(buffer: Buffer): void {
      const isFlushed = clientSocket.write(buffer);

      if (!isFlushed) {
        log.trace(
          { clientAddr, playerName },
          "Client socket not flushed. Pausing server socket."
        );
        serverSocket.pause();
      }
    }

    clientSocket.on("data", (buffer: Buffer) => {
      const packet = readPacket(
        clientState,
        PacketSource.Client,
        buffer,
        compressionThreshold !== undefined && compressionThreshold > 0
      );

      // Unsupported packets should just be immediately proxied
      if (packet === null) {
        writeToServer(buffer);
        return;
      }

      if (packet.kind === PacketKind.Handshake) {
        clientState = numericToState[packet.payload.nextState] ?? State.Status;
        serverState = clientState;
      }

      if (packet.kind === PacketKind.Login) {
        playerName = packet.payload.username;
      }

      middleware.apply(packet);
    });

    serverSocket.on("data", (buffer: Buffer) => {
      const packet = readPacket(
        serverState,
        PacketSource.Server,
        buffer,
        compressionThreshold
      );

      // Unsupported packets should just be immediately proxied
      if (packet === null) {
        writeToClient(buffer);
        return;
      }

      if (packet.kind === PacketKind.EncryptionRequest) {
        log.warn(
          "Server must be set to offline mode. See https://github.com/sean0x42/mineshark#offline-mode"
        );
      }

      if (packet.kind === PacketKind.JoinGame) {
        clientState = State.Play;
        serverState = State.Play;
      }

      if (packet.kind === PacketKind.LoginSuccess) {
        playerName = packet.payload.username;
        log.trace(
          { playerName },
          "Logged in successfully. Transitioning to play state"
        );
        clientState = State.Play;
        serverState = State.Play;
      }

      if (packet.kind === PacketKind.SetCompression) {
        compressionThreshold = packet.payload.threshold;
        log.trace({ compressionThreshold }, "Enabling compression");
      }

      middleware.apply(packet);
    });

    middleware.on("packet", (packet: Packet) => {
      const buffer = writePacket(packet, compressionThreshold);

      if (buffer === null) {
        log.warn({ packet }, "Failed to write packet to a buffer.");
        return;
      }

      packet.source === PacketSource.Client
        ? writeToServer(buffer)
        : writeToClient(buffer);
    });

    clientSocket.on("close", (didError) => {
      if (didError) {
        log.error(
          { clientAddr, playerName },
          "Client closed connection in response to an error"
        );
      } else {
        log.info({ clientAddr, playerName }, "Client closed connection");
      }

      serverSocket.end();
    });

    serverSocket.on("close", (didError) => {
      if (didError) {
        log.error("Server closed connection in response to an error");
      } else {
        log.info("Server closed connection");
      }

      clientSocket.end();
    });

    clientSocket.on("drain", () => {
      log.trace({ clientAddr, playerName }, "Resuming server socket");
      serverSocket.resume();
    });

    serverSocket.on("drain", () => {
      log.trace({ clientAddr, playerName }, "Resuming client socket");
      clientSocket.resume();
    });
  };
}
