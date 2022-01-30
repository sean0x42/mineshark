package api

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	ws "github.com/gorilla/websocket"
	"github.com/sean0x42/mineshark/api/websocket"
)

var upgrader = ws.Upgrader{
	CheckOrigin: func(req *http.Request) bool {
		return true
	},
}

func listenForPackets(ctx *gin.Context, controller *websocket.Controller) {
	conn, err := upgrader.Upgrade(ctx.Writer, ctx.Request, nil)

	if err != nil {
		log.Println("Failed to upgrade to websocket connection")
		log.Fatal(err)
	}

	websocket.New(controller, *conn)
}
