package unit

import (
	"testing"
	"time"

	"project-se67/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestPromotionCode(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`Code is required`, func(t *testing.T) {

		// แปลง string เป็น time.Time
		startDate, _ := time.Parse("2006-01-02", "2024-01-01")
		endDate, _ := time.Parse("2006-01-02", "2024-01-31")

		promotion := entity.Promotion{
			Name:           "ลด 30 %",
			Details:        "ลด 30% ขั้นต่ำ 150 บาทสำหรับอาหารทุกรายการ",
			Code:           "", // ผิดตรงนี้
			Start_date:     startDate,
			End_date:       endDate,
			Discount:       30,
			Minimum_price:  150,
			Limit:          50,
			Count_Limit:    1,
			Limit_discount: 599,
			DiscountID:     1,
			TypeID:         1,
			StatusID:       1,
		}

		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(promotion)

		// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
		g.Expect(ok).NotTo(BeTrue())
		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).NotTo(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal("Code is required"))
	})
}
func TestPromotionStart_date(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`Start_date is required`, func(t *testing.T) {
		// แปลง string เป็น time.Time
		endDate, _ := time.Parse("2006-01-02", "2024-01-31")

		promotion := entity.Promotion{
			Name:           "ลด 30 %",
			Details:        "ลด 30% ขั้นต่ำ 150 บาทสำหรับอาหารทุกรายการ",
			Code:           "DS30",
			End_date:       endDate,
			Discount:       30,
			Minimum_price:  150,
			Limit:          50,
			Count_Limit:    1,
			Limit_discount: 599,
			DiscountID:     1,
			TypeID:         1,
			StatusID:       1,
		}

		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(promotion)

		// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
		g.Expect(ok).NotTo(BeTrue())
		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).NotTo(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal("Start_date is required"))
	})
}

func TestPromotionLimit(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`Limit is required`, func(t *testing.T) {
		// แปลง string เป็น time.Time
		startDate, _ := time.Parse("2006-01-02", "2024-01-01")
		endDate, _ := time.Parse("2006-01-02", "2024-01-31")

		promotion := entity.Promotion{
			Name:           "ลด 30 %",
			Details:        "ลด 30% ขั้นต่ำ 150 บาทสำหรับอาหารทุกรายการ",
			Code:           "DS30",
			Start_date:     startDate,
			End_date:       endDate,
			Discount:       30,
			Minimum_price:  150,
			Count_Limit:    1,
			Limit_discount: 599,
			DiscountID:     1,
			TypeID:         1,
			StatusID:       1,
		}

		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(promotion)

		// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
		g.Expect(ok).NotTo(BeTrue())
		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).NotTo(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal("Limit is required"))
	})
}

func TestPromotionValid(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`valid`, func(t *testing.T) {
		// แปลง string เป็น time.Time
		startDate, _ := time.Parse("2006-01-02", "2024-01-01")
		endDate, _ := time.Parse("2006-01-02", "2024-01-31")

		promotion := entity.Promotion{
			Name:           "ลด 30 %",
			Details:        "ลด 30% ขั้นต่ำ 150 บาทสำหรับอาหารทุกรายการ",
			Code:           "DS30",
			Start_date:     startDate,
			End_date:       endDate,
			Discount:       30,
			Minimum_price:  150,
			Limit:          50,
			Count_Limit:    1,
			Limit_discount: 599,
			DiscountID:     1,
			TypeID:         1,
			StatusID:       1,
		}
		
		ok, err := govalidator.ValidateStruct(promotion)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}
