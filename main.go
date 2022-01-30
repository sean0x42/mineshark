package main

import (
	"flag"
	"fmt"
	"log"
	"net"

	"github.com/sean0x42/mineshark/api"
	"github.com/sean0x42/mineshark/api/websocket"
	"github.com/sean0x42/mineshark/proxy"
)

var connid = uint64(0)

var (
	localAddr  *string = flag.String("l", "localhost:25566", "listen address")
	remoteAddr *string = flag.String("r", "localhost:25565", "server address")

	disableWeb *bool = flag.Bool("no-web", false, "do not start the web interface")
)

func main() {
	flag.Parse()

	fmt.Println("Welcome to Mineshark!")
	fmt.Printf("Proxying from %v to %v\n\n", *localAddr, *remoteAddr)

	var socketController *websocket.Controller

	if !*disableWeb {
		fmt.Println("Enabling web interface...")
		socketController = websocket.NewController()
		go api.StartHttpApi(socketController)
	}

	fmt.Println("Establishing listen address...")
	proxyAddr, err := net.ResolveTCPAddr("tcp", *localAddr)
	if err != nil {
		log.Fatalf("Failed to resolve listen address: %s\n", err)
	}

	fmt.Println("Resolving Minecraft server...")
	serverAddr, err := net.ResolveTCPAddr("tcp", *remoteAddr)
	if err != nil {
		log.Fatalf("Failed to resolve server address: %s\n", err)
	}

	fmt.Println("Listening for TCP connections...")
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
		fmt.Printf("Established new connection (%d) with %s\n", connid, conn.RemoteAddr().String())

		prox := proxy.New(connid, proxyController, conn, proxyAddr, serverAddr)
		go prox.Start()
	}
}
