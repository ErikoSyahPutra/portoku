package model

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"strings"
	"time"
)

// StringArray handles TypeORM simple-array compatibility (comma-delimited or JSON string in DB)
type StringArray []string

func (s StringArray) Value() (driver.Value, error) {
	if len(s) == 0 {
		return "", nil
	}
	return strings.Join(s, ","), nil
}

func (s *StringArray) Scan(value interface{}) error {
	if value == nil {
		*s = []string{}
		return nil
	}

	var str string
	switch v := value.(type) {
	case []byte:
		str = string(v)
	case string:
		str = v
	default:
		return fmt.Errorf("unsupported type for StringArray: %T", value)
	}

	str = strings.TrimSpace(str)
	if str == "" {
		*s = []string{}
		return nil
	}

	if strings.HasPrefix(str, "[") && strings.HasSuffix(str, "]") {
		var arr []string
		if err := json.Unmarshal([]byte(str), &arr); err == nil {
			*s = arr
			return nil
		}
	}

	parts := strings.Split(str, ",")
	res := make([]string, 0, len(parts))
	for _, p := range parts {
		trimmed := strings.TrimSpace(p)
		if trimmed != "" {
			res = append(res, trimmed)
		}
	}
	*s = res
	return nil
}

func (s StringArray) MarshalJSON() ([]byte, error) {
	if s == nil {
		return []byte("[]"), nil
	}
	return json.Marshal([]string(s))
}

func (s *StringArray) UnmarshalJSON(data []byte) error {
	var arr []string
	if err := json.Unmarshal(data, &arr); err != nil {
		var single string
		if err2 := json.Unmarshal(data, &single); err2 == nil {
			*s = []string{single}
			return nil
		}
		return err
	}
	*s = arr
	return nil
}

type User struct {
	ID           uint   `gorm:"column:id;primaryKey" json:"id"`
	Username     string `gorm:"column:username;uniqueIndex;not null" json:"username"`
	PasswordHash string `gorm:"column:passwordHash;not null" json:"-"`
	Salt         string `gorm:"column:salt;not null" json:"-"`
}

func (User) TableName() string {
	return "users"
}

type Profile struct {
	ID                uint      `gorm:"column:id;primaryKey" json:"id"`
	Name              string    `gorm:"column:name;not null" json:"name"`
	Title             string    `gorm:"column:title" json:"title"`
	Bio               string    `gorm:"column:bio;type:text" json:"bio"`
	AboutMe           string    `gorm:"column:aboutMe;type:text" json:"aboutMe"`
	AvatarUrl         string    `gorm:"column:avatarUrl" json:"avatarUrl"`
	Email             string    `gorm:"column:email" json:"email"`
	Phone             string    `gorm:"column:phone" json:"phone"`
	Location          string    `gorm:"column:location" json:"location"`
	GithubUrl         string    `gorm:"column:githubUrl" json:"githubUrl"`
	LinkedinUrl       string    `gorm:"column:linkedinUrl" json:"linkedinUrl"`
	TwitterUrl        string    `gorm:"column:twitterUrl" json:"twitterUrl"`
	WebsiteUrl        string    `gorm:"column:websiteUrl" json:"websiteUrl"`
	ResumeUrl         string    `gorm:"column:resumeUrl" json:"resumeUrl"`
	ShowProjects      bool      `gorm:"column:showProjects;default:true" json:"showProjects"`
	ShowExperiences   bool      `gorm:"column:showExperiences;default:true" json:"showExperiences"`
	ShowAcademics     bool      `gorm:"column:showAcademics;default:true" json:"showAcademics"`
	ShowBlog          bool      `gorm:"column:showBlog;default:true" json:"showBlog"`
	ShowAwards        bool      `gorm:"column:showAwards;default:true" json:"showAwards"`
	ShowOrganizations bool      `gorm:"column:showOrganizations;default:true" json:"showOrganizations"`
	UpdatedAt         time.Time `gorm:"column:updatedAt" json:"updatedAt"`
}

func (Profile) TableName() string {
	return "profile"
}

type Project struct {
	ID           uint        `gorm:"column:id;primaryKey" json:"id"`
	Title        string      `gorm:"column:title;not null" json:"title"`
	Description  string      `gorm:"column:description;type:text;not null" json:"description"`
	Content      string      `gorm:"column:content;type:text" json:"content"`
	ImageUrl     string      `gorm:"column:imageUrl" json:"imageUrl"`
	Category     string      `gorm:"column:category;default:'web'" json:"category"`
	FigmaUrl     string      `gorm:"column:figmaUrl" json:"figmaUrl"`
	BehanceUrl   string      `gorm:"column:behanceUrl" json:"behanceUrl"`
	LiveUrl      string      `gorm:"column:liveUrl" json:"liveUrl"`
	GithubUrl    string      `gorm:"column:githubUrl" json:"githubUrl"`
	Technologies StringArray `gorm:"column:technologies;type:text" json:"technologies"`
	Featured     bool        `gorm:"column:featured;default:false" json:"featured"`
	Order        int         `gorm:"column:order;default:0" json:"order"`
	CreatedAt    time.Time   `gorm:"column:createdAt" json:"createdAt"`
	UpdatedAt    time.Time   `gorm:"column:updatedAt" json:"updatedAt"`
}

func (Project) TableName() string {
	return "projects"
}

type Academic struct {
	ID          uint      `gorm:"column:id;primaryKey" json:"id"`
	Institution string    `gorm:"column:institution;not null" json:"institution"`
	Degree      string    `gorm:"column:degree;not null" json:"degree"`
	Field       string    `gorm:"column:field;not null" json:"field"`
	StartYear   int       `gorm:"column:startYear;not null" json:"startYear"`
	EndYear     *int      `gorm:"column:endYear" json:"endYear"`
	GPA         string    `gorm:"column:gpa" json:"gpa"`
	Description string    `gorm:"column:description;type:text" json:"description"`
	LogoUrl     string    `gorm:"column:logoUrl" json:"logoUrl"`
	Order       int       `gorm:"column:order;default:0" json:"order"`
	CreatedAt   time.Time `gorm:"column:createdAt" json:"createdAt"`
	UpdatedAt   time.Time `gorm:"column:updatedAt" json:"updatedAt"`
}

func (Academic) TableName() string {
	return "academics"
}

type Experience struct {
	ID          uint        `gorm:"column:id;primaryKey" json:"id"`
	Company     string      `gorm:"column:company;not null" json:"company"`
	Position    string      `gorm:"column:position;not null" json:"position"`
	Location    string      `gorm:"column:location" json:"location"`
	StartDate   string      `gorm:"column:startDate;not null" json:"startDate"`
	EndDate     string      `gorm:"column:endDate" json:"endDate"`
	Current     bool        `gorm:"column:current;default:false" json:"current"`
	Description string      `gorm:"column:description;type:text" json:"description"`
	Skills      StringArray `gorm:"column:skills;type:text" json:"skills"`
	LogoUrl     string      `gorm:"column:logoUrl" json:"logoUrl"`
	Order       int         `gorm:"column:order;default:0" json:"order"`
	CreatedAt   time.Time   `gorm:"column:createdAt" json:"createdAt"`
	UpdatedAt   time.Time   `gorm:"column:updatedAt" json:"updatedAt"`
}

func (Experience) TableName() string {
	return "experiences"
}

type Blog struct {
	ID            uint        `gorm:"column:id;primaryKey" json:"id"`
	Title         string      `gorm:"column:title;not null" json:"title"`
	Slug          string      `gorm:"column:slug;uniqueIndex;not null" json:"slug"`
	Excerpt       string      `gorm:"column:excerpt;type:text;not null" json:"excerpt"`
	Content       string      `gorm:"column:content;type:text;not null" json:"content"`
	CoverImageUrl string      `gorm:"column:coverImageUrl" json:"coverImageUrl"`
	Tags          StringArray `gorm:"column:tags;type:text" json:"tags"`
	Published     bool        `gorm:"column:published;default:true" json:"published"`
	ReadTime      int         `gorm:"column:readTime;default:0" json:"readTime"`
	CreatedAt     time.Time   `gorm:"column:createdAt" json:"createdAt"`
	UpdatedAt     time.Time   `gorm:"column:updatedAt" json:"updatedAt"`
}

func (Blog) TableName() string {
	return "blogs"
}

type Award struct {
	ID            uint      `gorm:"column:id;primaryKey" json:"id"`
	Title         string    `gorm:"column:title;not null" json:"title"`
	Issuer        string    `gorm:"column:issuer;not null" json:"issuer"`
	Year          int       `gorm:"column:year;not null" json:"year"`
	Description   string    `gorm:"column:description;type:text" json:"description"`
	ImageUrl      string    `gorm:"column:imageUrl" json:"imageUrl"`
	CredentialUrl string    `gorm:"column:credentialUrl" json:"credentialUrl"`
	Order         int       `gorm:"column:order;default:0" json:"order"`
	CreatedAt     time.Time `gorm:"column:createdAt" json:"createdAt"`
	UpdatedAt     time.Time `gorm:"column:updatedAt" json:"updatedAt"`
}

func (Award) TableName() string {
	return "awards"
}

type Organization struct {
	ID           uint      `gorm:"column:id;primaryKey" json:"id"`
	Organization string    `gorm:"column:organization;not null" json:"organization"`
	Role         string    `gorm:"column:role;not null" json:"role"`
	Location     string    `gorm:"column:location" json:"location"`
	StartDate    string    `gorm:"column:startDate;not null" json:"startDate"`
	EndDate      string    `gorm:"column:endDate" json:"endDate"`
	Current      bool      `gorm:"column:current;default:false" json:"current"`
	Description  string    `gorm:"column:description;type:text" json:"description"`
	LogoUrl      string    `gorm:"column:logoUrl" json:"logoUrl"`
	Order        int       `gorm:"column:order;default:0" json:"order"`
	CreatedAt    time.Time `gorm:"column:createdAt" json:"createdAt"`
	UpdatedAt    time.Time `gorm:"column:updatedAt" json:"updatedAt"`
}

func (Organization) TableName() string {
	return "organizations"
}

type Contact struct {
	ID        uint      `gorm:"column:id;primaryKey" json:"id"`
	Name      string    `gorm:"column:name;not null" json:"name"`
	Email     string    `gorm:"column:email;not null" json:"email"`
	Subject   string    `gorm:"column:subject" json:"subject"`
	Message   string    `gorm:"column:message;type:text;not null" json:"message"`
	IsRead    bool      `gorm:"column:isRead;default:false" json:"isRead"`
	CreatedAt time.Time `gorm:"column:createdAt" json:"createdAt"`
}

func (Contact) TableName() string {
	return "contacts"
}
