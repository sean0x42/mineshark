package main

import (
	"flag"
	"fmt"
	"log"
	"net"

	"github.com/sean0x42/mineshark/api"
	"github.com/sean0x42/mineshark/proxy"
)

var (
	connid = uint64(0)

	localAddr  *string = flag.String("l", "localhost:25566", "listen address")
	remoteAddr *string = flag.String("r", "localhost:25565", "server address")

	disableWeb *bool = flag.Bool("no-web", false, "do not start the web interface")
)

func main() {
	flag.Parse()

	fmt.Println("Welcome to Mineshark!")
	fmt.Printf("Proxying from %v to %v\n", *localAddr, *remoteAddr)

	if !*disableWeb {
		fmt.Println("Web interface enabled!")
		go api.StartApi()
	}

	laddr, err := net.ResolveTCPAddr("tcp", *localAddr)
	if err != nil {
		log.Fatalf("Failed to resolve listen address: %s\n", err)
	}

	raddr, err := net.ResolveTCPAddr("tcp", *remoteAddr)
	if err != nil {
		log.Fatalf("Failed to resolve server address: %s\n", err)
	}

	listener, err := net.ListenTCP("tcp", laddr)
	if err != nil {
		log.Fatalf("Failed to listen on port: %s\n", err)
	}

	controller := proxy.NewController()

	for {
		conn, err := listener.AcceptTCP()
		if err != nil {
			log.Printf("Failed to accept connection: %s\n", err)
			continue
		}

		connid++

		prox := proxy.New(conn, laddr, raddr)
		go prox.Start()
	}
}
