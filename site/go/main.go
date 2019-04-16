package main

import (
	"github.com/OpenCircuits/OpenCircuits/site/go/auth"
	"github.com/OpenCircuits/OpenCircuits/site/go/handlers"
	"github.com/gin-gonic/contrib/sessions"
	"github.com/gin-gonic/gin"
	"log"
)

func main() {
	router := gin.Default()
	// Generate CSRF Token
	store := sessions.NewCookieStore([]byte(auth.RandToken(64)))
	store.Options(sessions.Options{
		Path: "/",
		MaxAge: 60*60*24*7,
	})

	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.LoadHTMLGlob("./templates/*")
	router.Use(sessions.Sessions("opencircuitssession", store))

	router.Static("/css", "./css")
	router.Static("/img", "./img")
	router.Static("/ts", "./ts")
	router.StaticFile("/Bundle.js", "./Bundle.js")

	router.GET("/", handlers.IndexHandler)
	router.GET("/auth", auth.RedirectHandler)
	router.GET("/login", auth.LoginHandler)
	router.GET("/circuit/:id", handlers.CircuitLoadHandler)
	router.POST("/circuit/:id", handlers.CircuitStoreHandler)

	for true {
		err := router.Run("127.0.0.1:9090")
		if err != nil {
			log.Printf("Web server crashed! \n %v", err)
		}
	}
}
