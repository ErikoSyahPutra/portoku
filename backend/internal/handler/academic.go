package handler

import (
	"net/http"
	"strconv"

	"portfolio-backend-go/internal/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AcademicHandler struct {
	db *gorm.DB
}

func NewAcademicHandler(db *gorm.DB) *AcademicHandler {
	return &AcademicHandler{db: db}
}

func (h *AcademicHandler) FindAll(c *gin.Context) {
	var items []model.Academic
	if err := h.db.Order("\"order\" ASC, \"startYear\" DESC").Find(&items).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch academics"})
		return
	}
	c.JSON(http.StatusOK, items)
}

func (h *AcademicHandler) FindOne(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid ID"})
		return
	}

	var item model.Academic
	if err := h.db.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Academic not found"})
		return
	}
	c.JSON(http.StatusOK, item)
}

func (h *AcademicHandler) Create(c *gin.Context) {
	var item model.Academic
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input"})
		return
	}

	if err := h.db.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create academic"})
		return
	}
	c.JSON(http.StatusCreated, item)
}

func (h *AcademicHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid ID"})
		return
	}

	var item model.Academic
	if err := h.db.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Academic not found"})
		return
	}

	var data map[string]interface{}
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input"})
		return
	}

	delete(data, "id")
	if err := h.db.Model(&item).Updates(data).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update academic"})
		return
	}

	h.db.First(&item, id)
	c.JSON(http.StatusOK, item)
}

func (h *AcademicHandler) Remove(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid ID"})
		return
	}

	if err := h.db.Delete(&model.Academic{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to delete academic"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true})
}
