package proxy

import (
	"io"
	"log"
	"net"
	"sync"

	"github.com/sean0x42/mineshark/packet"
)

type Proxy struct {
	id         uint64
	controller *Controller

	proxyAddr  *net.TCPAddr
	serverAddr *net.TCPAddr
	clientConn io.ReadWriteCloser
	serverConn io.ReadWriteCloser

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
		proxyAddr:  proxyAddr,
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

	go proxy.pipeToServer(proxy.clientConn, proxy.serverConn)
	go proxy.pipeToClient(proxy.serverConn, proxy.clientConn)

	log.Printf("Opened proxy from %s to %s\n", proxy.proxyAddr.String(), proxy.serverAddr.String())

	for {
		select {
		case <-proxy.errSignal:
			return
		}
	}
}

func (proxy *Proxy) err(s string, err error) {
	if err != io.EOF {
		log.Printf(s, err)
	}

	proxy.errSignal <- true
}

func (proxy *Proxy) pipeToServer(client, server io.ReadWriter) {
	for {
		// TODO why are these values dissapearing?
		// TODO can we get client addr instead of proxy addr
		pk := packet.New(proxy.serverAddr.String(), proxy.proxyAddr.String())
		err := pk.ReadFrom(client, proxy.threshold)

		if err != nil {
			proxy.err("Read failed: %s\n", err)
			return
		}

		proxy.controller.Broadcast(&pk)
		pk.WriteTo(server, proxy.threshold)
	}
}

// TODO change to receive from server. Use channels to output to client
func (proxy *Proxy) pipeToClient(server, client io.ReadWriter) {
	for {
		pk := packet.New(proxy.proxyAddr.String(), proxy.serverAddr.String())
		err := pk.ReadFrom(client, proxy.threshold)

		if err != nil {
			proxy.err("Read failed: %s\n", err)
			return
		}

		if proxy.serverState == Handshaking && pk.Id == packet.Handshake {
			var (
				protocolVersion packet.VarInt
				address         packet.String
				port            packet.UnsignedShort
				nextState       packet.VarInt
			)

			// Scan packet to pull out next state
			// Update states
			err = pk.ExtractData(&protocolVersion, &address, &port, &nextState)
			if err != nil {
				proxy.err("Failed to scan handshake packet: %s\n", err)
			}

			proxy.setClientState <- State(nextState)
			proxy.setServerState <- State(nextState)
		}

		if proxy.serverState == Login && pk.Id == packet.LoginSetCompression {
			var threshold packet.VarInt
			err = pk.ExtractData(&threshold)

			if err != nil {
				proxy.err("Failed to scan set compression packet: %s\n", err)
			}

			proxy.setThreshold <- int(threshold)
		}

		proxy.controller.Broadcast(&pk)
		pk.WriteTo(server, proxy.threshold)
	}
}
