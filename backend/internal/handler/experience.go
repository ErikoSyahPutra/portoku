package handler

import (
	"net/http"
	"strconv"

	"portfolio-backend-go/internal/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ExperienceHandler struct {
	db *gorm.DB
}

func NewExperienceHandler(db *gorm.DB) *ExperienceHandler {
	return &ExperienceHandler{db: db}
}

func (h *ExperienceHandler) FindAll(c *gin.Context) {
	var items []model.Experience
	if err := h.db.Order("\"order\" ASC, \"startDate\" DESC").Find(&items).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch experiences"})
		return
	}
	c.JSON(http.StatusOK, items)
}

func (h *ExperienceHandler) FindOne(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid ID"})
		return
	}

	var item model.Experience
	if err := h.db.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Experience not found"})
		return
	}
	c.JSON(http.StatusOK, item)
}

func (h *ExperienceHandler) Create(c *gin.Context) {
	var item model.Experience
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input"})
		return
	}

	if err := h.db.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create experience"})
		return
	}
	c.JSON(http.StatusCreated, item)
}

func (h *ExperienceHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid ID"})
		return
	}

	var item model.Experience
	if err := h.db.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Experience not found"})
		return
	}

	var data map[string]interface{}
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input"})
		return
	}

	delete(data, "id")
	if err := h.db.Model(&item).Updates(data).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update experience"})
		return
	}

	h.db.First(&item, id)
	c.JSON(http.StatusOK, item)
}

func (h *ExperienceHandler) Remove(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid ID"})
		return
	}

	if err := h.db.Delete(&model.Experience{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to delete experience"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true})
}
