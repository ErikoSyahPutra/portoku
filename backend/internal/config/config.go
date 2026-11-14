package config

import (
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Port         string
	DatabaseURL  string
	JWTSecret    string
	FrontendURLs []string
	UploadDir    string
	SMTPHost     string
	SMTPPort     string
	SMTPUser     string
	SMTPPass     string
}

func Load() *Config {
	_ = godotenv.Load()

	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "erikosyah-portfolio-super-secret-key-12345"
	}

	uploadDir := os.Getenv("UPLOAD_DIR")
	if uploadDir == "" {
		uploadDir = "./uploads"
	}

	frontendURL := os.Getenv("FRONTEND_URL")
	origins := []string{
		"http://localhost:3000",
		"http://localhost:3001",
		"https://erikosyah.my.id",
		"https://www.erikosyah.my.id",
	}
	if frontendURL != "" {
		for _, u := range strings.Split(frontendURL, ",") {
			cleaned := strings.TrimRight(strings.TrimSpace(u), "/")
			if cleaned != "" {
				origins = append(origins, cleaned)
			}
		}
	}

	return &Config{
		Port:         port,
		DatabaseURL:  os.Getenv("DATABASE_URL"),
		JWTSecret:    jwtSecret,
		FrontendURLs: origins,
		UploadDir:    uploadDir,
		SMTPHost:     os.Getenv("SMTP_HOST"),
		SMTPPort:     os.Getenv("SMTP_PORT"),
		SMTPUser:     os.Getenv("SMTP_USER"),
		SMTPPass:     os.Getenv("SMTP_PASS"),
	}
}
