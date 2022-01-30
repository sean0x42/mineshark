package api

import (
	"fmt"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/sean0x42/mineshark/api/websocket"
)

func StartHttpApi(controller *websocket.Controller) {
	router := gin.Default()

	router.Use(static.ServeRoot("/", "./frontend/out"))

	api := router.Group("/api")
	{
		api.GET("/packets", func(ctx *gin.Context) {
			listenForPackets(ctx, controller)
		})
	}

	// TODO make this more sophisticated
	fmt.Println("Starting web interface at http://localhost:5050")
	router.Run(":5050")
}
