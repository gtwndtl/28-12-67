package review

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"project-se67/config"
	"project-se67/entity"
	"time"
)

// addReview represents the structure of the review data in the request body
type addReview struct {
	Review_date          time.Time `json:"review_date"`
	Review_text          string    `json:"review_text"`
	Service_rating       float32   `json:"service_rating"`
	Price_rating         float32   `json:"price_rating"`
	Taste_rating         float32   `json:"taste_rating"`
	Pictures             []string  `gorm:"type:json;serializer:json" json:"pictures"` // ใช้ serializer
	ReviewTypeID         uint      `json:"review_type_id"`
	OrderID              uint      `json:"order_id"`
	FoodServicePaymentID uint      `json:"food_service_payment_id"`
	CustomerID           uint      `json:"customer_id"`
}

// AddReview handles the addition of a new review record
func AddReview(c *gin.Context) {
	var payload addReview

	// Bind JSON payload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// สร้าง Review ใหม่
	newReview := entity.Review{
		Review_date:          payload.Review_date,
		Review_text:          payload.Review_text,
		Service_rating:       payload.Service_rating,
		Price_rating:         payload.Price_rating,
		Taste_rating:         payload.Taste_rating,
		Pictures:             payload.Pictures, // ใช้ []string โดยตรง
		ReviewTypeID:         payload.ReviewTypeID,
		OrderID:              payload.OrderID,
		FoodServicePaymentID: payload.FoodServicePaymentID,
		CustomerID:           payload.CustomerID,
	}

	// บันทึกลงฐานข้อมูล
	if err := db.Create(&newReview).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"status":    201,
		"message":   "Review added successfully",
		"review_id": newReview.ID,
	})
}
