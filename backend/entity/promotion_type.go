package entity

import "gorm.io/gorm"


type Promotion_type struct {

   gorm.Model

   Type string `json:"type"`

}