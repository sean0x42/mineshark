package proxy

import (
	"io"
	"log"
	"net"
)

type Proxy struct {
	sentBytes     uint64
	receivedBytes uint64
	laddr, raddr  *net.TCPAddr
	lconn, rconn  io.ReadWriteCloser
	didError      bool
	errSig        chan bool
}

func New(lconn *net.TCPConn, laddr *net.TCPAddr, raddr *net.TCPAddr) *Proxy {
	return &Proxy{
		lconn:    lconn,
		laddr:    laddr,
		raddr:    raddr,
		didError: false,
		errSig:   make(chan bool),
	}
}

func (prox *Proxy) Start() {
	defer prox.lconn.Close()

	var err error
	prox.rconn, err = net.DialTCP("tcp", nil, prox.raddr)

	if err != nil {
		log.Printf("Remote connection failed: %s\n", err)
		return
	}

	defer prox.rconn.Close()

	log.Printf("Opened proxy from %s to %s\n", prox.laddr.String(), prox.raddr.String())

	go prox.pipe(prox.lconn, prox.rconn)
	go prox.pipe(prox.rconn, prox.lconn)

	log.Printf("Closed (%d bytes sent, %d bytes received)\n", prox.sentBytes, prox.receivedBytes)
}

func (prox *Proxy) err(s string, err error) {
	if prox.didError {
		return
	}

	if err != io.EOF {
		log.Printf(s, err)
	}

	prox.errSig <- true
	prox.didError = true
}

func (prox *Proxy) pipe(source io.ReadWriter, destination io.ReadWriter) {
	islocal := source == prox.lconn

	// 64k buffer
	buff := make([]byte, 0xffff)

	for {
		len, err := source.Read(buff)
		if err != nil {
			prox.err("Read failed: %s\n", err)
			return
		}

		bytes := buff[:len]

		// write out result
		len, err = destination.Write(bytes)
		if err != nil {
			prox.err("Write failed: %s\n", err)
			return
		}

		if islocal {
			prox.sentBytes += uint64(len)
		} else {
			prox.receivedBytes += uint64(len)
		}
	}
}
