package database

import (
	"crypto/rand"
	"encoding/hex"
	"log"

	"portfolio-backend-go/internal/config"
	"portfolio-backend-go/internal/model"

	"github.com/glebarez/sqlite"
	"golang.org/x/crypto/scrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func InitDB(cfg *config.Config) *gorm.DB {
	var dialector gorm.Dialector

	if cfg.DatabaseURL != "" {
		log.Println("🔌 Connecting to PostgreSQL database (Supabase/PgBouncer mode)...")
		dialector = postgres.New(postgres.Config{
			DSN:                  cfg.DatabaseURL,
			PreferSimpleProtocol: true, // Required for PgBouncer / Supabase transaction pooler
		})
	} else {
		log.Println("🔌 Connecting to local SQLite database (database.sqlite)...")
		dialector = sqlite.Open("database.sqlite")
	}

	db, err := gorm.Open(dialector, &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		log.Fatalf("❌ Failed to connect database: %v", err)
	}

	// Auto-migrate tables (non-fatal if tables already exist in production Postgres)
	err = db.AutoMigrate(
		&model.User{},
		&model.Profile{},
		&model.Project{},
		&model.Academic{},
		&model.Experience{},
		&model.Blog{},
		&model.Award{},
		&model.Organization{},
		&model.Contact{},
	)
	if err != nil {
		log.Printf("⚠️ Auto-migrate notice (tables likely exist): %v", err)
	}

	seedDefaults(db)

	return db
}

func seedDefaults(db *gorm.DB) {
	// Seed Admin User if not exists
	var userCount int64
	db.Model(&model.User{}).Count(&userCount)
	if userCount == 0 {
		saltBytes := make([]byte, 16)
		_, _ = rand.Read(saltBytes)
		salt := hex.EncodeToString(saltBytes)

		// Node scryptSync default: N=16384, r=8, p=1, keyLen=64
		hashBytes, err := scrypt.Key([]byte("admin"), []byte(salt), 16384, 8, 1, 64)
		if err == nil {
			adminUser := model.User{
				Username:     "admin",
				PasswordHash: hex.EncodeToString(hashBytes),
				Salt:         salt,
			}
			db.Create(&adminUser)
			log.Println("🔑 Seeded default administrator user (username: admin, password: admin)")
		}
	}

	// Seed Default Profile if not exists
	var profileCount int64
	db.Model(&model.Profile{}).Count(&profileCount)
	if profileCount == 0 {
		defaultProfile := model.Profile{
			Name:              "Your Name",
			Title:             "Full Stack Developer",
			Bio:               "Passionate developer building modern web experiences.",
			AboutMe:           "I am a creative developer who loves building beautiful and functional web applications.",
			ShowProjects:      true,
			ShowExperiences:   true,
			ShowAcademics:     true,
			ShowBlog:          true,
			ShowAwards:        true,
			ShowOrganizations: true,
		}
		db.Create(&defaultProfile)
		log.Println("👤 Seeded default profile data")
	}
}
