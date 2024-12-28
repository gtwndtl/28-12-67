package setup

import (
	"fmt"
	"project-se67/entity"
	"time"

	"gorm.io/gorm"
)

func SetupReviewDatabase(db *gorm.DB) {

	db.AutoMigrate(

		&entity.Review{},

		&entity.Review_type{},
	)

	ReviewTripType := entity.Review_type{Review_Type: "Trip and Cabin"}

	ReviewFoodType := entity.Review_type{Review_Type: "Food"}

	db.FirstOrCreate(&ReviewTripType, &entity.Review_type{Review_Type: "Trip and Cabin"})

	db.FirstOrCreate(&ReviewFoodType, &entity.Review_type{Review_Type: "Food"})

	// Create sample Review
	firstReview := entity.Review{
		Review_date:          time.Now(),
		Review_text:          "อร่อยมากๆเลยจ้า",
		Service_rating:       0,
		Price_rating:         4.5,
		Taste_rating:         4,
		ReviewTypeID:         2,
		OrderID:              1,
		FoodServicePaymentID: 1,
		CustomerID:           1,
	}
	db.FirstOrCreate(&firstReview)

	fmt.Println("Review have been added to the database.")
}
