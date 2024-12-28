package promotion_status


import (

   "net/http"


   "project-se67/config"

   "project-se67/entity"

   "github.com/gin-gonic/gin"

)


func GetAll(c *gin.Context) {


   db := config.DB()


   var status []entity.Promotion_status

   db.Find(&status)


   c.JSON(http.StatusOK, &status)


}