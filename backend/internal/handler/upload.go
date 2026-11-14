package handler

import (
	"crypto/rand"
	"fmt"
	"io"
	"math/big"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"portfolio-backend-go/internal/config"

	"github.com/gin-gonic/gin"
)

type UploadHandler struct {
	cfg *config.Config
}

func NewUploadHandler(cfg *config.Config) *UploadHandler {
	return &UploadHandler{cfg: cfg}
}

var allowedExtensions = map[string]bool{
	".jpg":  true,
	".jpeg": true,
	".png":  true,
	".gif":  true,
	".webp": true,
}

func (h *UploadHandler) Upload(c *gin.Context) {
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "No file uploaded or invalid form-data key 'file'"})
		return
	}
	defer file.Close()

	if header.Size > 5*1024*1024 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "File size exceeds 5MB limit"})
		return
	}

	ext := strings.ToLower(filepath.Ext(header.Filename))
	if !allowedExtensions[ext] {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Only image files (JPG, PNG, GIF, WebP) are allowed"})
		return
	}

	if err := os.MkdirAll(h.cfg.UploadDir, os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create upload directory"})
		return
	}

	randNum, _ := rand.Int(rand.Reader, big.NewInt(1000000000))
	filename := fmt.Sprintf("%d-%d%s", time.Now().UnixMilli(), randNum, ext)
	dstPath := filepath.Join(h.cfg.UploadDir, filename)

	out, err := os.Create(dstPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to save file"})
		return
	}
	defer out.Close()

	if _, err := io.Copy(out, file); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to write file"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"url":      fmt.Sprintf("/uploads/%s", filename),
		"filename": filename,
		"size":     header.Size,
	})
}
