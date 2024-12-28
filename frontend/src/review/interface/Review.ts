export interface ReviewInterface {
  [x: string]: any;

  review_type_id: number;

  title: any;

  menuNames: any;
  
  order_id: any;

  ID?: number;

  review_text?: string;

  review_date?: Date;

  minimum_price?: number;

  service_rating?: number;

  price_rating?: number;

  taste_rating?: number;

  reviewTypeID?: number;

  FoodServicePaymentID?: number;

  CustomerID?: number;

  pictures?: string[]; // เปลี่ยนเป็น Array เพื่อรองรับหลายรูปภาพ

}