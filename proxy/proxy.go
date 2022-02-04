package proxy

import (
	"io"
	"log"
	"net"

	pk "github.com/sean0x42/mineshark/packet"
	"github.com/sean0x42/mineshark/packet/data"
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
}

func New(id uint64, controller *Controller, clientConn *net.TCPConn, proxyAddr, serverAddr *net.TCPAddr) *Proxy {
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
	}
}

func (proxy *Proxy) Start() {
	defer func() {
		proxy.clientConn.Close()
		proxy.controller.unregister <- proxy
		log.Println("Closed")
	}()

	proxy.controller.register <- proxy

	var err error
	proxy.serverConn, err = net.DialTCP("tcp", nil, proxy.serverAddr)
	if err != nil {
		log.Printf("Remote connection failed: %s\n", err)
		return
	}

	defer proxy.serverConn.Close()

	go proxy.pipe(proxy.clientConn, proxy.serverConn)
	go proxy.pipe(proxy.serverConn, proxy.clientConn)

	log.Printf("Opened proxy from %s to %s\n", proxy.clientAddr.String(), proxy.serverAddr.String())

	for {
		select {
		case threshold := <-proxy.setThreshold:
			log.Println("Setting threshold")
			proxy.threshold = threshold

		case state := <-proxy.setClientState:
			log.Printf("Setting client state to %v\n", state)
			proxy.clientState = state

		case state := <-proxy.setServerState:
			log.Printf("Setting server state to %v\n", state)
			proxy.serverState = state

		case <-proxy.errSignal:
			log.Println("Received error signal. Quiting")
			return
		}
	}
}

func (proxy *Proxy) err(s string, err error) {
	if proxy.errored {
		return
	}

	if err != io.EOF {
		log.Printf(s, err)
	}

	proxy.errSignal <- true
	proxy.errored = true
}

func (proxy *Proxy) onClientPacket(packet *pk.Packet) {
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
			proxy.err("Failed to scan handshake packet: %s\n", err)
			return
		}

		log.Printf("Ver: %d, Addr: %s:%d, Next: %d", protocolVersion, address, port, nextState)
		proxy.setClientState <- State(nextState)
		proxy.setServerState <- State(nextState)
	}

	// Broadcast packet to websockets
	proxy.controller.Broadcast(packet)
}

func (proxy *Proxy) onServerPacket(packet *pk.Packet) {
	var err error

	if proxy.serverState == Login && packet.Id == pk.SetCompression {
		var threshold data.VarInt

		err = packet.Extract(&threshold)
		if err != nil {
			proxy.err("Failed to scan set compression packet: %s\n", err)
			return
		}

		proxy.setThreshold <- int(threshold)
	}

	// Broadcast packet to websockets
	proxy.controller.Broadcast(packet)
}

func (proxy *Proxy) pipe(source, destination io.ReadWriter) {
	var err error
	isFromClient := proxy.clientConn == source

	for {
		var packet pk.Packet
		if isFromClient {
			packet = pk.New(proxy.clientAddr.String(), proxy.serverAddr.String())
		} else {
			packet = pk.New(proxy.serverAddr.String(), proxy.clientAddr.String())
		}

		// Read packet in
		err = packet.ReadFrom(source, proxy.threshold)
		if err != nil {
			proxy.err("Read failed: %s\n", err)
			return
		}

		if isFromClient {
			proxy.onClientPacket(&packet)
		} else {
			proxy.onServerPacket(&packet)
		}

		packet.WriteTo(source, proxy.threshold)
	}
}
