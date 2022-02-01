package proxy

import (
	"io"
	"log"
	"net"

	"github.com/sean0x42/mineshark/packet"
)

type Proxy struct {
	id         uint64
	controller *Controller

	proxyAddr  *net.TCPAddr
	serverAddr *net.TCPAddr
	clientConn io.ReadWriteCloser
	serverConn io.ReadWriteCloser

	didError  bool
	errSignal chan bool

	isCompressed bool
}

func New(id uint64, controller *Controller, clientConn *net.TCPConn, proxyAddr, serverAddr *net.TCPAddr) *Proxy {
	return &Proxy{
		id:         id,
		controller: controller,

		clientConn: clientConn,
		proxyAddr:  proxyAddr,
		serverAddr: serverAddr,

		didError:  false,
		errSignal: make(chan bool),

		isCompressed: false,
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

	log.Printf("Opened proxy from %s to %s\n", proxy.proxyAddr.String(), proxy.serverAddr.String())

	// Wait for signal to fire
	<-proxy.errSignal
}

func (proxy *Proxy) err(s string, err error) {
	if proxy.didError {
		return
	}

	if err != io.EOF {
		log.Printf(s, err)
	}

	proxy.errSignal <- true
	proxy.didError = true
}

func (proxy *Proxy) pipe(source, destination io.ReadWriter) {
	for {
		pk := packet.New(proxy.proxyAddr.String(), proxy.serverAddr.String())
		err := pk.Read(source, 0)

		if err != nil {
			proxy.err("Read failed: %s\n", err)
			return
		}

		if pk.Id == packet.SetCompression {
			// TODO extract threshold
		}

		proxy.controller.Broadcast(&pk)
		pk.Write(destination, 0)
	}
}
