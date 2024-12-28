package routers

import (
	"net/http"
	"project-se67/controller/customer"
	"project-se67/controller/food_service"
	"project-se67/controller/genders"
	"project-se67/controller/payment"
	"project-se67/controller/promotion/discount_type"
	"project-se67/controller/promotion/promotion"
	"project-se67/controller/promotion/promotion_status"
	"project-se67/controller/promotion/promotion_type"
	"project-se67/controller/promotion/promotion_used"
	"project-se67/controller/review/review"
	"project-se67/controller/review/review_type"
	"project-se67/middlewares"

	"github.com/gin-gonic/gin"
)

const PORT = "8000"

// SetupRouter initializes the router
func SetupRouter() *gin.Engine {
	r := gin.Default()
	r.Use(middlewares.CORSMiddleware()) // ใช้งาน CORS middleware

	// Auth Route
	r.POST("/signup", customer.SignUp)
	r.POST("/signin", customer.SignIn)

	// เส้นทางสำหรับการสมัครและลงชื่อเข้าใช้
	router := r.Group("/")
	{
		router.Use(middlewares.Authorizes())

		// User Route
		router.PUT("/user/:id", customer.Update)
		router.GET("/users", customer.GetAll)
		router.GET("/user/:id", customer.Get)
		router.DELETE("/user/:id", customer.Delete)

		// เส้นทางการจัดการ payment
		router.GET("/food-service-payments", payment.GetAllFoodServicePayments)
		router.GET("/food-service-payment/:id", payment.GetFoodServicePayment)
		router.POST("/food-service-payment", payment.CreateFoodServicePayment)
		router.PUT("/food-service-payment/:id", payment.UpdateFoodServicePayment)
		router.DELETE("/food-service-payment/:id", payment.DeleteFoodServicePayment)

		router.GET("/trip-payments", payment.GetAllTripPayments)
		router.GET("/trip-payment/:id", payment.GetTripPayment)
		router.POST("/trip-payment", payment.CreateTripPayment)
		router.PUT("/trip-payment/:id", payment.UpdateTripPayment)
		router.DELETE("/trip-payment/:id", payment.DeleteTripPayment)

		// เส้นทางการจัดการ food_service
		router.GET("/food-categories", food_service.GetAllFoodCategories)
		router.GET("/food-category/:id", food_service.GetFoodCategory)
		router.POST("/food-category", food_service.CreateFoodCategory)
		router.PUT("/food-category/:id", food_service.UpdateFoodCategory)
		router.DELETE("/food-category/:id", food_service.DeleteFoodCategory)

		router.GET("/menus", food_service.GetAllMenus)
		router.GET("/menu/:id", food_service.GetMenu)
		router.POST("/menu", food_service.CreateMenu)
		router.PUT("/menu/:id", food_service.UpdateMenu)
		router.DELETE("/menu/:id", food_service.DeleteMenu)

		router.GET("/order-detail-menu-options", food_service.GetAllOrderDetailMenuOptions)
		router.GET("/order-detail-menu-options/:id", food_service.GetOrderDetailMenuOption)
		router.POST("/order-detail-menu-options", food_service.CreateOrderDetailMenuOption)
		router.PUT("/order-detail-menu-options/:id", food_service.UpdateOrderDetailMenuOption)
		router.DELETE("/order-detail-menu-options/:id", food_service.DeleteOrderDetailMenuOption)

		router.GET("/order-details", food_service.GetAllOrderDetails)
		router.GET("/order-detail/:id", food_service.GetOrderDetail)
		router.POST("/order-detail", food_service.CreateOrderDetail)
		router.PUT("/order-detail/:id", food_service.UpdateOrderDetail)
		router.DELETE("/order-detail/:id", food_service.DeleteOrderDetail)

		router.GET("/orders", food_service.GetAllOrders)
		router.GET("/order/:id", food_service.GetOrder)
		router.POST("/order", food_service.CreateOrder)
		router.PUT("/order/:id", food_service.UpdateOrder)
		router.DELETE("/order/:id", food_service.DeleteOrder)

		// เส้นทางการจัดการ MenuItemOption
		router.GET("/menu-item-options", food_service.GetAllMenuItemOptions)
		router.GET("/menu-item-option/:id", food_service.GetMenuItemOption)
		router.POST("/menu-item-option", food_service.CreateMenuItemOption)
		router.DELETE("/menu-item-option/:id", food_service.DeleteMenuItemOption)

		// เส้นทางการจัดการ MenuOption
		router.GET("/menu-options", food_service.GetAllMenuOptions)
		router.POST("/menu-options", food_service.CreateMenuOption)
		router.PUT("/menu-options/:id", food_service.UpdateMenuOption)

		//
		r.GET("/orders/pending/:customerID", food_service.GetPendingOrderByCustomerID)
		r.POST("/add-item-to-order", food_service.AddItemToOrder)

		//Promotion
		router.POST("/promotion", promotion.AddPromotion)
		router.PUT("/promotion/:id", promotion.Update)
		router.GET("/promotions", promotion.GetAll)
		router.GET("/promotion/:id", promotion.Get)
		router.DELETE("/promotion/:id", promotion.Delete)

		//PromotionUsed
		router.POST("/used", promotion_used.AddPromotionUsed)
		router.PUT("/used/:id", promotion_used.Update)
		router.GET("/useds", promotion_used.GetAll)
		router.GET("/used/:id", promotion_used.Get)
		router.DELETE("/used/:id", promotion_used.Delete)

		//PromotionType
		router.GET("/types", promotion_type.GetAll)
		router.GET("/type/:id", promotion_type.Get)

		//PromotionStatus
		router.GET("/status", promotion_status.GetAll)

		//DiscountType
		router.GET("/discount_type", discount_type.GetAll)
		router.GET("/discount_type/:id", discount_type.Get)

		//Review
		router.POST("/review", review.AddReview)
		router.PUT("/review/:id", review.Update)
		router.GET("/reviews", review.GetAll)
		router.GET("/review/:id", review.Get)
		router.DELETE("/review/:id", review.Delete)


		//ReviewType
		router.GET("/reviewtypes", review_type.GetAll)
		router.GET("/reviewtype/:id", review_type.Get)
	}

	r.GET("/genders", genders.GetAll)

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})

	return r
}

// func CORSMiddleware() gin.HandlerFunc {
// 	return func(c *gin.Context) {
// 		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
// 		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
// 		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
// 		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

// 		if c.Request.Method == "OPTIONS" {
// 			c.AbortWithStatus(204)
// 			return
// 		}

// 		c.Next()
// 	}
// }
