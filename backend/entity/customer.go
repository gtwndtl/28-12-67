package entity

import (
	"gorm.io/gorm"
	"time"
)

type Customers struct {
	gorm.Model

	FirstName string `json:"first_name"`

	LastName string `json:"last_name"`

	Email string `json:"email"`

	Age uint8 `json:"age"`

	Password string `json:"-"`

	BirthDay time.Time

	GenderID uint

	Gender *Genders `gorm:"foreignKey: gender_id"`

	PhoneNumber string `json:"phone_number"`

	Picture string `json:"picture" gorm:"type:longtext"`
}
