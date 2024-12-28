package entity

import "gorm.io/gorm"


type Discount_type struct {

   gorm.Model

   Discount_type string `json:"discount_type"`

}