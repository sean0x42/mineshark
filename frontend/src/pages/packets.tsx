import Head from "next/head";
import React, { useState } from "react";

interface Packet {
  id: number;
}

const initialState: Packet[] = [];

const PacketSnifferPage: React.FunctionComponent = () => {
  const [packets, _dispatch] = useState(initialState);
  const [isRecording, setRecording] = useState(false);

  const [socket, setWebsocket] = useState<WebSocket | null>(null);
  const [isSocketReady, setSocketReady] = useState(false);
  const [didSocketError, setSocketError] = useState(false);

  function startRecording() {
    // Establish web socket connection
    setRecording(true);

    const socket = new WebSocket(`ws://${window.location.host}/api/packets`);

    socket.addEventListener("open", () => {
      setSocketReady(true);
    });

    socket.addEventListener("error", (event) => {
      console.error(event);
      setSocketError(true);
    });

    socket.addEventListener("close", () => {
      setRecording(false);
      setSocketReady(false);
      console.log("Socket closed.");
    });

    setWebsocket(socket);
  }

  function stopRecording() {
    setRecording(false);
    setSocketReady(false);

    if (socket !== null) {
      socket.close();
      setWebsocket(null);
    }
  }

  return (
    <div>
      <Head>
        <title>Packet sniffer</title>
      </Head>

      {!isRecording && (
        <button onClick={startRecording}>Start recording</button>
      )}
      {isRecording && <button onClick={stopRecording}>Stop recording</button>}
      {isRecording && !isSocketReady && (
        <p>Establishing socket connection...</p>
      )}
      {didSocketError && <p>Socket errored</p>}

      <ol>
        {packets.slice(0, 100).map((packet) => (
          <li key={packet.id}></li>
        ))}
      </ol>
    </div>
  );
};

export default PacketSnifferPage;
