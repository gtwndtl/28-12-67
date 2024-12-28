package entity

import (
	"gorm.io/gorm"
	"time"
)

type Promotion struct {
	gorm.Model

	Name           string    `json:"name"`
	Details        string    `gorm:"type:TEXT" json:"details" valid:"required~Details is required"`
	Code           string    `json:"code" valid:"required~Code is required,matches(^[A-Za-z0-9]{1,10}$)~Code must be alphanumeric and 1-10 characters"`
	Start_date     time.Time `json:"start_date" valid:"required~Start_date is required"`
	End_date       time.Time `json:"end_date" valid:"required~End_date is required"`
	Discount       float32   `json:"discount" valid:"required~Discount is required"`
	Minimum_price  float32   `json:"minimum_price" valid:"required~Minimum_price is required,range(0|999999999)~Minimum_price must be a positive value"`
	Limit          uint      `json:"limit" valid:"required~Limit is required,range(1|1000)~Limit must be a positive integer"`
	Count_Limit    uint      `json:"count_limit" valid:"required~Count_Limit is required"`
	Limit_discount float32   `json:"limit_discount" valid:"required~Limit_discount is required,range(0|999999999)~Limit_discount must be a positive value"`

	DiscountID    uint           `json:"discount_id" valid:"required~DiscountID is required"`
	Discount_type *Discount_type `gorm:"foreignKey: discount_id" json:"discount_type"`

	TypeID uint            `json:"type_id" valid:"required~TypeID is required"`
	Type   *Promotion_type `gorm:"foreignKey: type_id" json:"type"`

	StatusID uint              `json:"status_id" valid:"required~StatusID is required"`
	Status   *Promotion_status `gorm:"foreignKey: status_id" json:"status"`
}
