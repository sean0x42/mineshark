package websocket

import (
	ws "github.com/gorilla/websocket"
	"github.com/sean0x42/mineshark/packet"
)

type WebSocket struct {
	controller *Controller
	conn       ws.Conn
	packets    chan *packet.Packet
}

func New(controller *Controller, conn ws.Conn) {
	socket := &WebSocket{
		controller: controller,
		conn:       conn,
		packets:    make(chan *packet.Packet),
	}

	socket.controller.register <- socket

	go socket.awaitCloseFromClient()
	go socket.awaitPacketFromController()
}

func (socket *WebSocket) awaitCloseFromClient() {
	defer func() {
		socket.controller.unregister <- socket
		socket.conn.Close()
	}()

	for {
		_, _, err := socket.conn.ReadMessage()

		if err != nil {
			// TODO
			break
		}

		// TODO ignore all messages unless they close
	}
}

func (socket *WebSocket) awaitPacketFromController() {
	defer socket.conn.Close()

	for {
		packet, ok := <-socket.packets

		// Controller closed the channel
		if !ok {
			socket.conn.WriteMessage(ws.CloseMessage, []byte{})
			return
		}

		// TODO don't encode data as a string
		err := socket.conn.WriteJSON(*packet)

		if err != nil {
			return
		}
	}
}
