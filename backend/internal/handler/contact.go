package handler

import (
	"fmt"
	"net/http"
	"net/smtp"
	"strconv"

	"portfolio-backend-go/internal/config"
	"portfolio-backend-go/internal/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ContactHandler struct {
	db  *gorm.DB
	cfg *config.Config
}

func NewContactHandler(db *gorm.DB, cfg *config.Config) *ContactHandler {
	return &ContactHandler{db: db, cfg: cfg}
}

func (h *ContactHandler) FindAll(c *gin.Context) {
	var contacts []model.Contact
	if err := h.db.Order("\"createdAt\" DESC").Find(&contacts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch contacts"})
		return
	}
	c.JSON(http.StatusOK, contacts)
}

func (h *ContactHandler) Create(c *gin.Context) {
	var contact model.Contact
	if err := c.ShouldBindJSON(&contact); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input"})
		return
	}

	if err := h.db.Create(&contact).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to save message"})
		return
	}

	// Dispatch email asynchronously if SMTP is configured
	if h.cfg.SMTPHost != "" && h.cfg.SMTPUser != "" && h.cfg.SMTPPass != "" {
		go func(cnt model.Contact) {
			auth := smtp.PlainAuth("", h.cfg.SMTPUser, h.cfg.SMTPPass, h.cfg.SMTPHost)
			addr := fmt.Sprintf("%s:%s", h.cfg.SMTPHost, h.cfg.SMTPPort)
			to := []string{h.cfg.SMTPUser}
			msg := []byte(fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: [Portfolio Contact] %s\r\n\r\nNew message from: %s (%s)\n\n%s\r\n",
				h.cfg.SMTPUser, h.cfg.SMTPUser, cnt.Subject, cnt.Name, cnt.Email, cnt.Message))
			_ = smtp.SendMail(addr, auth, h.cfg.SMTPUser, to, msg)
		}(contact)
	}

	c.JSON(http.StatusCreated, contact)
}

func (h *ContactHandler) MarkAsRead(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid ID"})
		return
	}

	var contact model.Contact
	if err := h.db.First(&contact, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Contact message not found"})
		return
	}

	h.db.Model(&contact).Update("is_read", true)
	c.JSON(http.StatusOK, contact)
}

func (h *ContactHandler) Remove(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid ID"})
		return
	}

	if err := h.db.Delete(&model.Contact{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to delete contact message"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true})
}
