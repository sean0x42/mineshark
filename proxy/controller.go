package proxy

import (
	"github.com/sean0x42/mineshark/api/websocket"
	"github.com/sean0x42/mineshark/packet"
	"github.com/sean0x42/mineshark/player"
)

type Controller struct {
	proxies    map[uint64]*Proxy
	register   chan *Proxy
	unregister chan *Proxy

	socketController *websocket.Controller

	Players player.State
}

func NewController(socketController *websocket.Controller) *Controller {
	controller := &Controller{
		proxies:    make(map[uint64]*Proxy),
		register:   make(chan *Proxy),
		unregister: make(chan *Proxy),

		socketController: socketController,
	}

	go controller.run()

	return controller
}

func (cont *Controller) run() {
	for {
		select {

		case proxy := <-cont.register:
			cont.proxies[proxy.id] = proxy

		case proxy := <-cont.unregister:
			delete(cont.proxies, proxy.id)
		}
	}
}

func (cont *Controller) Broadcast(packet packet.Packet) {
	cont.socketController.Packets <- packet
}
