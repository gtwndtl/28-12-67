package entity

import "gorm.io/gorm"


type Promotion_status struct {

   gorm.Model

   Status string `json:"status"`

}