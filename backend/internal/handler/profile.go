package handler

import (
	"net/http"

	"portfolio-backend-go/internal/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ProfileHandler struct {
	db *gorm.DB
}

func NewProfileHandler(db *gorm.DB) *ProfileHandler {
	return &ProfileHandler{db: db}
}

func (h *ProfileHandler) Get(c *gin.Context) {
	var profile model.Profile
	if err := h.db.First(&profile).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Profile not found"})
		return
	}
	c.JSON(http.StatusOK, profile)
}

func (h *ProfileHandler) Update(c *gin.Context) {
	var profile model.Profile
	if err := h.db.First(&profile).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Profile not found"})
		return
	}

	var data map[string]interface{}
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input"})
		return
	}

	delete(data, "id")
	if err := h.db.Model(&profile).Updates(data).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update profile"})
		return
	}

	h.db.First(&profile)
	c.JSON(http.StatusOK, profile)
}
