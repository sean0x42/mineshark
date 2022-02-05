package main

import (
	"flag"
	"net"

	"github.com/sean0x42/mineshark/api"
	"github.com/sean0x42/mineshark/api/websocket"
	"github.com/sean0x42/mineshark/proxy"
	log "github.com/sirupsen/logrus"
)

var connid = uint64(0)

var (
	listenAddr *string = flag.String("l", "localhost:25566", "listen address")
	serverAddr *string = flag.String("r", "localhost:25565", "server address")

	disableWeb *bool = flag.Bool("no-web", false, "do not start the web interface")
)

func main() {
	flag.Parse()

	log.WithFields(log.Fields{
		"listenAddr":          *listenAddr,
		"serverAddr":          *serverAddr,
		"webInterfaceEnabled": !*disableWeb,
	}).Info("Welcome to Mineshark!")

	var socketController *websocket.Controller

	if !*disableWeb {
		log.Info("Enabling web interface...")
		socketController = websocket.NewController()
		go api.StartHttpApi(socketController)
	}

	proxyAddr, err := net.ResolveTCPAddr("tcp", *listenAddr)
	if err != nil {
		log.Fatalf("Failed to resolve listen address: %s\n", err)
	}

	serverAddr, err := net.ResolveTCPAddr("tcp", *serverAddr)
	if err != nil {
		log.Fatalf("Failed to resolve server address: %s\n", err)
	}

	log.Info("Listening for TCP connections...")
	listener, err := net.ListenTCP("tcp", proxyAddr)
	if err != nil {
		log.Fatalf("Failed to listen on port: %s\n", err)
	}

	proxyController := proxy.NewController(socketController)

	for {
		conn, err := listener.AcceptTCP()
		if err != nil {
			log.Printf("Failed to accept connection: %s\n", err)
			continue
		}

		connid++
		log.WithFields(log.Fields{
			"id":             connid,
			"connectionAddr": conn.RemoteAddr().String(),
		}).Info("Established a new proxy connection!")

		prox := proxy.New(connid, proxyController, conn, proxyAddr, serverAddr)
		go prox.Start()
	}
}
