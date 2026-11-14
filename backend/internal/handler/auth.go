package handler

import (
	"encoding/hex"
	"net/http"

	"portfolio-backend-go/internal/config"
	"portfolio-backend-go/internal/middleware"
	"portfolio-backend-go/internal/model"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/scrypt"
	"gorm.io/gorm"
)

type AuthHandler struct {
	db  *gorm.DB
	cfg *config.Config
}

func NewAuthHandler(db *gorm.DB, cfg *config.Config) *AuthHandler {
	return &AuthHandler{db: db, cfg: cfg}
}

type LoginInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password"`
	Pass     string `json:"pass"`
}

func (h *AuthHandler) Login(c *gin.Context) {
	var input LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request body"})
		return
	}

	pass := input.Password
	if pass == "" {
		pass = input.Pass
	}

	var user model.User
	if err := h.db.Where("username = ?", input.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid credentials"})
		return
	}

	hashBytes, err := scrypt.Key([]byte(pass), []byte(user.Salt), 16384, 8, 1, 64)
	if err != nil || hex.EncodeToString(hashBytes) != user.PasswordHash {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid credentials"})
		return
	}

	token, err := middleware.GenerateToken(h.cfg.JWTSecret, user.ID, user.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create session token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token":    token,
		"username": user.Username,
	})
}

func (h *AuthHandler) Me(c *gin.Context) {
	username, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	var user model.User
	if err := h.db.Where("username = ?", username).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":       user.ID,
		"username": user.Username,
	})
}
