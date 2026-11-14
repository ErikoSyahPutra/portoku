package handler

import (
	"net/http"
	"strconv"

	"portfolio-backend-go/internal/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type BlogHandler struct {
	db *gorm.DB
}

func NewBlogHandler(db *gorm.DB) *BlogHandler {
	return &BlogHandler{db: db}
}

func (h *BlogHandler) FindPublished(c *gin.Context) {
	var blogs []model.Blog
	if err := h.db.Where("published = ?", true).Order("\"createdAt\" DESC").Find(&blogs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch blogs"})
		return
	}
	c.JSON(http.StatusOK, blogs)
}

func (h *BlogHandler) FindAll(c *gin.Context) {
	var blogs []model.Blog
	if err := h.db.Order("\"createdAt\" DESC").Find(&blogs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch all blogs"})
		return
	}
	c.JSON(http.StatusOK, blogs)
}

func (h *BlogHandler) FindBySlug(c *gin.Context) {
	slug := c.Param("slug")
	var blog model.Blog
	if err := h.db.Where("slug = ?", slug).First(&blog).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Blog not found"})
		return
	}
	c.JSON(http.StatusOK, blog)
}

func (h *BlogHandler) FindOne(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid ID"})
		return
	}

	var blog model.Blog
	if err := h.db.First(&blog, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Blog not found"})
		return
	}
	c.JSON(http.StatusOK, blog)
}

func (h *BlogHandler) Create(c *gin.Context) {
	var blog model.Blog
	if err := c.ShouldBindJSON(&blog); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input"})
		return
	}

	if err := h.db.Create(&blog).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create blog"})
		return
	}
	c.JSON(http.StatusCreated, blog)
}

func (h *BlogHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid ID"})
		return
	}

	var blog model.Blog
	if err := h.db.First(&blog, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Blog not found"})
		return
	}

	var data map[string]interface{}
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input"})
		return
	}

	delete(data, "id")
	if err := h.db.Model(&blog).Updates(data).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update blog"})
		return
	}

	h.db.First(&blog, id)
	c.JSON(http.StatusOK, blog)
}

func (h *BlogHandler) Remove(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid ID"})
		return
	}

	if err := h.db.Delete(&model.Blog{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to delete blog"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true})
}
