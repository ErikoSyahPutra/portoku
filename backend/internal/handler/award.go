package handler

import (
	"net/http"
	"strconv"

	"portfolio-backend-go/internal/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AwardHandler struct {
	db *gorm.DB
}

func NewAwardHandler(db *gorm.DB) *AwardHandler {
	return &AwardHandler{db: db}
}

func (h *AwardHandler) FindAll(c *gin.Context) {
	var items []model.Award
	if err := h.db.Order("\"order\" ASC, year DESC").Find(&items).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch awards"})
		return
	}
	c.JSON(http.StatusOK, items)
}

func (h *AwardHandler) FindOne(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid ID"})
		return
	}

	var item model.Award
	if err := h.db.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Award not found"})
		return
	}
	c.JSON(http.StatusOK, item)
}

func (h *AwardHandler) Create(c *gin.Context) {
	var item model.Award
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input"})
		return
	}

	if err := h.db.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create award"})
		return
	}
	c.JSON(http.StatusCreated, item)
}

func (h *AwardHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid ID"})
		return
	}

	var item model.Award
	if err := h.db.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Award not found"})
		return
	}

	var data map[string]interface{}
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input"})
		return
	}

	delete(data, "id")
	if err := h.db.Model(&item).Updates(data).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update award"})
		return
	}

	h.db.First(&item, id)
	c.JSON(http.StatusOK, item)
}

func (h *AwardHandler) Remove(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid ID"})
		return
	}

	if err := h.db.Delete(&model.Award{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to delete award"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true})
}
