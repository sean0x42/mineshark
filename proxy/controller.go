package proxy

import (
	"github.com/gorilla/websocket"
	"github.com/sean0x42/mineshark/user"
)

type ProxyId string
type UUID string

type ProxyController struct {
	proxies        map[ProxyId]Proxy
	sockets        []websocket.Conn
	users          []user.User
	usersByUuid    map[string]*user.User
	usersByProxyId map[ProxyId]*user.User
}

// TODO can we pass a callback to each proxy to run when a packet is encountered

func NewController() ProxyController {
	return ProxyController{
		proxies: make(map[ProxyId]Proxy),
	}
}
