package main

import (
	"log"
	"net/http"

	"portfolio-backend-go/internal/config"
	"portfolio-backend-go/internal/database"
	"portfolio-backend-go/internal/handler"
	"portfolio-backend-go/internal/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()
	db := database.InitDB(cfg)

	r := gin.Default()

	// CORS Setup
	corsConfig := cors.Config{
		AllowOrigins:     cfg.FrontendURLs,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}
	r.Use(cors.New(corsConfig))

	// Static files for uploaded media
	r.Static("/uploads", cfg.UploadDir)

	// API Routes Group
	api := r.Group("/api")
	api.Use(middleware.AuthMiddleware(cfg.JWTSecret))

	// Health check
	api.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "engine": "golang-gin"})
	})

	// Handlers
	authH := handler.NewAuthHandler(db, cfg)
	profileH := handler.NewProfileHandler(db)
	projectH := handler.NewProjectHandler(db)
	academicH := handler.NewAcademicHandler(db)
	experienceH := handler.NewExperienceHandler(db)
	blogH := handler.NewBlogHandler(db)
	awardH := handler.NewAwardHandler(db)
	orgH := handler.NewOrganizationHandler(db)
	contactH := handler.NewContactHandler(db, cfg)
	uploadH := handler.NewUploadHandler(cfg)

	// Auth routes
	api.POST("/auth/login", authH.Login)
	api.GET("/auth/me", authH.Me)

	// Profile routes
	api.GET("/profile", profileH.Get)
	api.PUT("/profile", profileH.Update)

	// Project routes
	api.GET("/projects", projectH.FindAll)
	api.GET("/projects/featured", projectH.FindFeatured)
	api.GET("/projects/:id", projectH.FindOne)
	api.POST("/projects", projectH.Create)
	api.PUT("/projects/:id", projectH.Update)
	api.DELETE("/projects/:id", projectH.Remove)

	// Academic routes
	api.GET("/academics", academicH.FindAll)
	api.GET("/academics/:id", academicH.FindOne)
	api.POST("/academics", academicH.Create)
	api.PUT("/academics/:id", academicH.Update)
	api.DELETE("/academics/:id", academicH.Remove)

	// Experience routes
	api.GET("/experiences", experienceH.FindAll)
	api.GET("/experiences/:id", experienceH.FindOne)
	api.POST("/experiences", experienceH.Create)
	api.PUT("/experiences/:id", experienceH.Update)
	api.DELETE("/experiences/:id", experienceH.Remove)

	// Blog routes
	api.GET("/blogs", blogH.FindPublished)
	api.GET("/blogs/all", blogH.FindAll)
	api.GET("/blogs/slug/:slug", blogH.FindBySlug)
	api.GET("/blogs/:id", blogH.FindOne)
	api.POST("/blogs", blogH.Create)
	api.PUT("/blogs/:id", blogH.Update)
	api.DELETE("/blogs/:id", blogH.Remove)

	// Award routes
	api.GET("/awards", awardH.FindAll)
	api.GET("/awards/:id", awardH.FindOne)
	api.POST("/awards", awardH.Create)
	api.PUT("/awards/:id", awardH.Update)
	api.DELETE("/awards/:id", awardH.Remove)

	// Organization routes
	api.GET("/organizations", orgH.FindAll)
	api.GET("/organizations/:id", orgH.FindOne)
	api.POST("/organizations", orgH.Create)
	api.PUT("/organizations/:id", orgH.Update)
	api.DELETE("/organizations/:id", orgH.Remove)

	// Contact routes
	api.GET("/contacts", contactH.FindAll)
	api.POST("/contacts", contactH.Create)
	api.PUT("/contacts/:id/read", contactH.MarkAsRead)
	api.DELETE("/contacts/:id", contactH.Remove)

	// Upload routes
	api.POST("/upload", uploadH.Upload)

	log.Printf("🚀 Portfolio Go backend running on port :%s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
