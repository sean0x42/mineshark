package websocket

import (
	"github.com/sean0x42/mineshark/packet"
)

type Controller struct {
	sockets    map[*WebSocket]bool
	register   chan *WebSocket
	unregister chan *WebSocket

	Packets chan *packet.Packet
}

func NewController() *Controller {
	controller := &Controller{
		sockets:    make(map[*WebSocket]bool),
		register:   make(chan *WebSocket),
		unregister: make(chan *WebSocket),

		Packets: make(chan *packet.Packet),
	}

	go controller.run()

	return controller
}

func (cont *Controller) run() {
	for {
		select {

		case socket := <-cont.register:
			cont.sockets[socket] = true

		case socket := <-cont.unregister:
			delete(cont.sockets, socket)
			close(socket.packets)

		case packet := <-cont.Packets:
			for socket := range cont.sockets {
				socket.packets <- packet
			}
		}
	}
}
