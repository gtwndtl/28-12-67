package entity

import (
	"gorm.io/gorm"
)

type Promotion_Used struct {
	gorm.Model

	PromotionID uint `json:"promotion_id" valid:"required~PromotionID is required"`
	Promotion   *Promotion `gorm:"foreignKey:promotion_id" json:"promotion"`

	CustomerID uint `json:"customer_id" valid:"required~CustomerID is required"`
	Customer   *Customers `gorm:"foreignKey:customer_id" json:"customer"` // Referencing 'Customers' struct from 'entity' package

	FoodServicePaymentID uint `json:"food_service_payment_id" valid:"required~FoodServicePaymentID is required"`
	FoodServicePayment   *FoodServicePayment `gorm:"foreignKey:food_service_payment_id" json:"food_service_payment"` // Referencing 'FoodServicePayment' struct from 'entity' package
}
