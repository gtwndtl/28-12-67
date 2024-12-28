package customer

import (
	"errors"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"net/http"
	"project-se67/config"
	"project-se67/entity"
	"project-se67/services"
	"time"
)

type (
	Authen struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	signUp struct {
		FirstName   string    `json:"first_name"`
		LastName    string    `json:"last_name"`
		Email       string    `json:"email"`
		Age         uint8     `json:"age"`
		Password    string    `json:"password"`
		BirthDay    time.Time `json:"birthday"`
		GenderID    uint      `json:"gender_id"`
		PhoneNumber string    `json:"phone_number"`
		Picture     string    `json:"picture" gorm:"type:longtext"`
	}
)

func SignUp(c *gin.Context) {
	var payload signUp

	// Bind JSON payload to the struct
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()
	var customerCheck entity.Customers

	// Check if the customer with the provided email already exists
	result := db.Where("email = ?", payload.Email).First(&customerCheck)
	if result.Error != nil && !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		// If there's a database error other than "record not found"
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	if customerCheck.ID != 0 {
		// If the customer with the provided email already exists
		c.JSON(http.StatusConflict, gin.H{"error": "Email is already registered"})
		return
	}

	// Hash the customer's password
	hashedPassword, _ := config.HashPassword(payload.Password)

	// Create a new customer
	customer := entity.Customers{
		FirstName:   payload.FirstName,
		LastName:    payload.LastName,
		Email:       payload.Email,
		Age:         payload.Age,
		Password:    hashedPassword,
		BirthDay:    payload.BirthDay,
		GenderID:    payload.GenderID,
		PhoneNumber: payload.PhoneNumber,
		Picture:     payload.Picture,
	}

	// Save the customer to the database
	if err := db.Create(&customer).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Sign-up successful"})
}

func SignIn(c *gin.Context) {
	var payload Authen
	var customer entity.Customers

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ค้นหา customer ด้วย customername ที่ผู้ใช้กรอกเข้ามา

	if err := config.DB().Raw("SELECT * FROM customers WHERE email = ?", payload.Email).Scan(&customer).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบรหัสผ่าน
	err := bcrypt.CompareHashAndPassword([]byte(customer.Password), []byte(payload.Password))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "password is incerrect"})
		return
	}

	jwtWrapper := services.JwtWrapper{
		SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
		Issuer:          "AuthService",
		ExpirationHours: 24,
	}

	signedToken, err := jwtWrapper.GenerateToken(customer.Email)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error signing token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token_type": "Bearer", "token": signedToken, "id": customer.ID})
}
