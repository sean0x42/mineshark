package api

import (
	"fmt"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func StartApi() {
	router := gin.Default()

	router.Use(static.ServeRoot("/", "./frontend/out"))

	api := router.Group("/api")
	{
		api.GET("/packets", GetPackets)
	}

	fmt.Println("Starting web interface at http://localhost:5050")
	router.Run(":5050")
}
