package unit

import (
	"testing"

	"project-se67/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestPromotionUsed(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`PromotionID is required`, func(t *testing.T) {

		promotionUsed := entity.Promotion_Used{
			CustomerID:           1,
			FoodServicePaymentID: 1,
		}

		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(promotionUsed)

		// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
		g.Expect(ok).NotTo(BeTrue())
		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).NotTo(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal("PromotionID is required"))
	})

	t.Run(`CustomerID is required`, func(t *testing.T) {

		promotionUsed := entity.Promotion_Used{
			PromotionID:          1,
			FoodServicePaymentID: 1,
		}

		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(promotionUsed)

		// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
		g.Expect(ok).NotTo(BeTrue())
		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).NotTo(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal("CustomerID is required"))
	})

	t.Run(`FoodServicePaymentID is required`, func(t *testing.T) {

		promotionUsed := entity.Promotion_Used{
			PromotionID: 1,
			CustomerID:  1,
		}

		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(promotionUsed)

		// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
		g.Expect(ok).NotTo(BeTrue())
		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).NotTo(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal("FoodServicePaymentID is required"))
	})
}
func TestPromotionUsedValid(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`valid`, func(t *testing.T) {

		promotionUsed := entity.Promotion_Used{
			PromotionID: 1,
			CustomerID:  1,
			FoodServicePaymentID: 1,
		}

		ok, err := govalidator.ValidateStruct(promotionUsed)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}
