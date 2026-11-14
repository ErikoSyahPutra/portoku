package handler

import (
	"net/http"
	"strconv"

	"portfolio-backend-go/internal/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ProjectHandler struct {
	db *gorm.DB
}

func NewProjectHandler(db *gorm.DB) *ProjectHandler {
	return &ProjectHandler{db: db}
}

func (h *ProjectHandler) FindAll(c *gin.Context) {
	var projects []model.Project
	if err := h.db.Order("\"order\" ASC, \"createdAt\" DESC").Find(&projects).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch projects"})
		return
	}
	c.JSON(http.StatusOK, projects)
}

func (h *ProjectHandler) FindFeatured(c *gin.Context) {
	var projects []model.Project
	if err := h.db.Where("featured = ?", true).Order("\"order\" ASC").Find(&projects).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch featured projects"})
		return
	}
	c.JSON(http.StatusOK, projects)
}

func (h *ProjectHandler) FindOne(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid ID"})
		return
	}

	var project model.Project
	if err := h.db.First(&project, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Project not found"})
		return
	}
	c.JSON(http.StatusOK, project)
}

func (h *ProjectHandler) Create(c *gin.Context) {
	var project model.Project
	if err := c.ShouldBindJSON(&project); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input"})
		return
	}

	if err := h.db.Create(&project).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create project"})
		return
	}
	c.JSON(http.StatusCreated, project)
}

func (h *ProjectHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid ID"})
		return
	}

	var project model.Project
	if err := h.db.First(&project, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Project not found"})
		return
	}

	var data map[string]interface{}
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input"})
		return
	}

	delete(data, "id")
	if err := h.db.Model(&project).Updates(data).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update project"})
		return
	}

	h.db.First(&project, id)
	c.JSON(http.StatusOK, project)
}

func (h *ProjectHandler) Remove(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid ID"})
		return
	}

	if err := h.db.Delete(&model.Project{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to delete project"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true})
}
