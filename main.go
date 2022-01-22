package main

import (
	"flag"
	"fmt"
	"log"
	"net"
	"net/http"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/sean0x42/mineshark/proxy"
)

var (
	connid = uint64(0)

	localAddr  *string = flag.String("l", "localhost:25566", "listen address")
	remoteAddr *string = flag.String("r", "localhost:25565", "server address")
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(req *http.Request) bool {
		return true
	},
}

func getPackets(ctx *gin.Context) {
	ws, err := upgrader.Upgrade(ctx.Writer, ctx.Request, nil)
	if err != nil {
		log.Println("Failed to upgrade to websocket connection")
		log.Fatal(err)
	}

	defer ws.Close()

	// TODO write packets as we receive them until web socket connection is forcably closed or close event is seen
}

func startHttpServer() {
	router := gin.Default()

	router.Use(static.Serve("/", static.LocalFile("./frontend/out", true)))

	api := router.Group("/api")
	{
		api.GET("/packets", getPackets)
	}

	fmt.Println("Started debug panel at http://localhost:5050")
	router.Run(":5050")
}

func main() {
	flag.Parse()

	fmt.Println("Welcome to Mineshark!")
	fmt.Printf("Proxying from %v to %v\n", *localAddr, *remoteAddr)

	go startHttpServer()

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
