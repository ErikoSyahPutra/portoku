package middleware

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type JWTClaims struct {
	Sub      uint   `json:"sub"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func GenerateToken(secret string, userID uint, username string) (string, error) {
	claims := JWTClaims{
		Sub:      userID,
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(7 * 24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

func verifyCustomToken(token string, secret string) (map[string]interface{}, bool) {
	parts := strings.Split(token, ".")
	if len(parts) != 3 {
		return nil, false
	}
	header := parts[0]
	payload := parts[1]
	sig := parts[2]

	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(header + "." + payload))
	expectedSig := base64.RawURLEncoding.EncodeToString(mac.Sum(nil))

	if !hmac.Equal([]byte(expectedSig), []byte(sig)) {
		return nil, false
	}

	payloadBytes, err := base64.RawURLEncoding.DecodeString(payload)
	if err != nil {
		return nil, false
	}

	var data map[string]interface{}
	if err := json.Unmarshal(payloadBytes, &data); err != nil {
		return nil, false
	}

	return data, true
}

func AuthMiddleware(secret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		method := c.Request.Method
		path := c.Request.URL.Path

		// Public read endpoints
		if method == http.MethodGet {
			c.Next()
			return
		}

		// Public auth & contact submission endpoints
		if strings.HasSuffix(path, "/auth/login") || (method == http.MethodPost && strings.HasSuffix(path, "/contacts")) {
			c.Next()
			return
		}

		// Require Bearer token for mutating routes
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Missing or invalid Authorization header"})
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

		// Try parsing via golang-jwt first
		token, err := jwt.ParseWithClaims(tokenStr, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
			return []byte(secret), nil
		})

		if err == nil && token.Valid {
			if claims, ok := token.Claims.(*JWTClaims); ok {
				c.Set("user_id", claims.Sub)
				c.Set("username", claims.Username)
				c.Next()
				return
			}
		}

		// Fallback for custom NestJS token compatibility
		if claims, ok := verifyCustomToken(tokenStr, secret); ok {
			c.Set("user", claims)
			c.Next()
			return
		}

		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Session expired or invalid token"})
	}
}
