package proxy

import (
	"fmt"
	"io"
	"net"

	pk "github.com/sean0x42/mineshark/packet"
	"github.com/sean0x42/mineshark/packet/data"
	log "github.com/sirupsen/logrus"
)

type Proxy struct {
	id         uint64
	controller *Controller

	clientAddr net.Addr
	serverAddr *net.TCPAddr
	clientConn io.ReadWriteCloser
	serverConn io.ReadWriteCloser

	errored   bool
	errSignal chan bool

	threshold    int
	setThreshold chan int

	clientState    State
	setClientState chan State
	serverState    State
	setServerState chan State

	log *log.Entry
}

func New(id uint64, controller *Controller, clientConn *net.TCPConn, proxyAddr, serverAddr *net.TCPAddr) *Proxy {
	log.SetLevel(log.DebugLevel)

	return &Proxy{
		id:         id,
		controller: controller,

		clientConn: clientConn,
		clientAddr: clientConn.RemoteAddr(),
		serverAddr: serverAddr,

		errSignal: make(chan bool),

		threshold:    -1,
		setThreshold: make(chan int),

		// TODO can we combine these two states into one?
		clientState:    Handshaking,
		setClientState: make(chan State),
		serverState:    Handshaking,
		setServerState: make(chan State),

		log: log.WithFields(log.Fields{
			"proxyId":    id,
			"clientAddr": clientConn.RemoteAddr(),
		}),
	}
}

func (proxy *Proxy) Start() {
	defer func() {
		proxy.clientConn.Close()
		proxy.controller.unregister <- proxy
		proxy.log.Info("Closed")
	}()

	proxy.controller.register <- proxy

	var err error
	proxy.serverConn, err = net.DialTCP("tcp", nil, proxy.serverAddr)
	if err != nil {
		proxy.log.Fatalf("Remote connection failed: %s", err)
		return
	}

	defer proxy.serverConn.Close()

	// Bi-directional proxy
	go proxy.pipe(proxy.clientConn, proxy.serverConn)
	go proxy.pipe(proxy.serverConn, proxy.clientConn)

	proxy.log.WithField("serverAddr", proxy.serverAddr.String()).Info("Opened proxy connection")

	for {
		select {
		case threshold := <-proxy.setThreshold:
			proxy.threshold = threshold

		case state := <-proxy.setClientState:
			proxy.clientState = state

		case state := <-proxy.setServerState:
			proxy.serverState = state

		case <-proxy.errSignal:
			return
		}
	}
}

func (proxy *Proxy) err(isClientBound bool, s string, err error) {
	var source string
	if isClientBound {
		source = "server"
	} else {
		source = "client"
	}

	proxy.log.Debugf("%s errored, closing", source)

	if err != io.EOF {
		proxy.log.Errorf(s, err)
	}

	proxy.errSignal <- true
	proxy.errored = true
}

func (proxy *Proxy) pipe(source, destination io.ReadWriter) {
	var err error
	isClientBound := proxy.serverConn == source

	for {
		var packet pk.Packet
		if isClientBound {
			packet = pk.New("server", "client")
		} else {
			packet = pk.New("client", "server")
		}

		// Read packet in
		err = packet.ReadFrom(source, &proxy.threshold)
		if err != nil {
			proxy.err(isClientBound, "Read failed: %s\n", err)
			return
		}

		packet.WriteTo(destination, proxy.threshold)

		if isClientBound {
			proxy.onClientBoundPacket(&packet)
		} else {
			proxy.onServerBoundPacket(&packet)
		}
	}
}

func (proxy *Proxy) onServerBoundPacket(packet *pk.Packet) {
	var err error

	// Handle handshake
	if proxy.clientState == Handshaking && packet.Id == pk.Handshake {
		var (
			protocolVersion data.VarInt
			address         data.String
			port            data.UnsignedShort
			nextState       data.VarInt
		)

		// Scan packet to pull out next state
		err = packet.Extract(&protocolVersion, &address, &port, &nextState)
		if err != nil {
			proxy.err(false, "Failed to scan handshake packet: %s\n", err)
			return
		}

		proxy.log.WithFields(log.Fields{
			"protocolVersion": protocolVersion,
			"address":         fmt.Sprintf("%s:%04d", address, port),
			"nextState":       nextState,
		}).Info("Received handshake packet")

		proxy.setClientState <- State(nextState)
		proxy.setServerState <- State(nextState)
	}

	// Broadcast packet to websockets
	proxy.controller.Broadcast(packet)
}

func (proxy *Proxy) onClientBoundPacket(packet *pk.Packet) {
	var err error

	if proxy.serverState == Login && packet.Id == pk.SetCompression {
		var threshold data.VarInt

		err = packet.Extract(&threshold)
		if err != nil {
			proxy.err(true, "Failed to scan set compression packet: %s\n", err)
			return
		}

		log.WithField("threshold", threshold).Debug("Setting compression")
		proxy.setThreshold <- int(threshold)
	}

	if proxy.serverState == Login && packet.Id == pk.LoginSuccess {
		var (
			uuid     data.UUID
			username data.String
		)

		err = packet.Extract(&uuid, &username)
		if err != nil {
			proxy.err(true, "Failed to scan set compression packet: %s\n", err)
			return
		}

		log.WithFields(log.Fields{
			"uuid":     uuid,
			"username": username,
		}).Info("Login success!")

		proxy.setClientState <- Play
		proxy.setServerState <- Play
	}

	// Broadcast packet to websockets
	proxy.controller.Broadcast(packet)
}
