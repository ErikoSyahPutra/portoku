package handler

import (
	"net/http"
	"strconv"

	"portfolio-backend-go/internal/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type OrganizationHandler struct {
	db *gorm.DB
}

func NewOrganizationHandler(db *gorm.DB) *OrganizationHandler {
	return &OrganizationHandler{db: db}
}

func (h *OrganizationHandler) FindAll(c *gin.Context) {
	var items []model.Organization
	if err := h.db.Order("\"order\" ASC, \"startDate\" DESC").Find(&items).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch organizations"})
		return
	}
	c.JSON(http.StatusOK, items)
}

func (h *OrganizationHandler) FindOne(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid ID"})
		return
	}

	var item model.Organization
	if err := h.db.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Organization not found"})
		return
	}
	c.JSON(http.StatusOK, item)
}

func (h *OrganizationHandler) Create(c *gin.Context) {
	var item model.Organization
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input"})
		return
	}

	if err := h.db.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create organization"})
		return
	}
	c.JSON(http.StatusCreated, item)
}

func (h *OrganizationHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid ID"})
		return
	}

	var item model.Organization
	if err := h.db.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Organization not found"})
		return
	}

	var data map[string]interface{}
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input"})
		return
	}

	delete(data, "id")
	if err := h.db.Model(&item).Updates(data).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update organization"})
		return
	}

	h.db.First(&item, id)
	c.JSON(http.StatusOK, item)
}

func (h *OrganizationHandler) Remove(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid ID"})
		return
	}

	if err := h.db.Delete(&model.Organization{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to delete organization"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true})
}
