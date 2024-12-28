export interface PromotionInterface {
    code: any;
    discount_id: never;
    status_id: never;
    type_id: number;

    ID?: number;
  
    Name?: string;
  
    Details?: string;
  
    Code?: string;
  
    Start_date?: Date;
  
    End_date?: Date;
  
    Discount?: number;

    Minimum_price?: number;

    Limit?: number;

    Count_limit?: number;

    Limit_discount?: number;

    DiscountID?: number;

    TypeID?: number;

    StatusID?: number;
  
  }