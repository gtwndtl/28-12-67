import React, { useState, useEffect } from 'react';
import { Tabs, Button, Modal, Form, Input, Rate, Card, message, Upload } from 'antd';
import { GetUsersById } from '../../../services/https/index'; // แก้ให้ตรงกับ Service API ของคุณ
import { GetOrder } from '../../../food_service/service/https/OrderAPI';
import { GetOrderDetail } from '../../../food_service/service/https/OrderDetailAPI';
import { GetMenu } from '../../../food_service/service/https/MenuAPI';
import { GetFoodServicePayment } from '../../../payment/service/https/FoodServicePaymentAPI';
import { CreateReview, GetReviews, GetReviewTypes } from '../../service/ReviewAPI';
import { ReviewInterface } from '../../interface/Review';
import { MenuInterface } from '../../../food_service/interface/IMenu';
import { FoodServicePaymentInterface } from '../../../payment/interface/IFoodServicePayment';
import { UploadOutlined } from '@ant-design/icons';
import Navbar from '../navbar';

const customerID = Number(localStorage.getItem('id'));

const Review: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reviewed' | 'notReviewed'>('reviewed');
  const [reviewedFoodItems, setReviewedFoodItems] = useState<ReviewInterface[]>([]);
  const [notReviewedItems, setNotReviewedItems] = useState<ReviewInterface[]>([]);
  const [isReviewedLoaded, setIsReviewedLoaded] = useState(false);
  const [isNotReviewedLoaded, setIsNotReviewedLoaded] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [currentReview, setCurrentReview] = useState<ReviewInterface | null>(null);
  const [reviewTypes, setReviewTypes] = useState<Record<number, string>>({});
  const [base64Images, setBase64Images] = useState<string[]>([]);

  // Fetch Reviewed Items
  useEffect(() => {
    const fetchReviewedItems = async () => {
      if (!isReviewedLoaded) {
        try {
          const reviewResponse = await GetReviews();
          if (reviewResponse.status !== 200) throw new Error('Failed to fetch reviews.');
          const allReviews = reviewResponse.data;

          // กรองเฉพาะรีวิวของ Customer ID
          const customerReviews = allReviews.filter(
            (review: any) => review.customer_id === customerID && review.review_type_id === 2
          );

          // ดึงข้อมูล OrderDetail
          const orderDetailResponse = await GetOrderDetail();
          if (orderDetailResponse.status !== 200) throw new Error('Failed to fetch order details.');
          const allOrderDetails = orderDetailResponse.data;

          // ดึงข้อมูล Menu
          const menuResponse = await GetMenu();
          if (menuResponse.status !== 200) throw new Error('Failed to fetch menu.');
          const allMenus = menuResponse.data;

          // สร้าง Map ของ Menu ID กับชื่อเมนู
          const menuMap = allMenus.reduce((acc: Record<number, string>, menu: any) => {
            acc[menu.ID] = menu.MenuName;
            return acc;
          }, {});

          // เชื่อมโยงชื่อเมนูเข้ากับรีวิว
          const enrichedReviews = customerReviews.map((review: any) => {
            const orderDetails = allOrderDetails.filter(
              (detail: any) => detail.OrderID === review.order_id
            );
            return {
              ...review,
              menuNames: orderDetails.map((detail: any) => menuMap[detail.MenuID] || 'Unknown'),
            };
          });

          setReviewedFoodItems(enrichedReviews);
          setIsReviewedLoaded(true);
        } catch (error) {
          console.error('Error fetching reviewed items:', error);
        }
      }
    };


    if (activeTab === 'reviewed') {
      fetchReviewedItems();
    }
  }, [activeTab, isReviewedLoaded]);




  // Fetch Not Reviewed Items
  useEffect(() => {
    const fetchNotReviewedItems = async () => {
      if (!isNotReviewedLoaded) {
        try {
          const ordersResponse = await GetOrder();
          if (ordersResponse.status !== 200) throw new Error('Failed to fetch orders.');
          const allOrders = ordersResponse.data;

          // กรองเฉพาะ Orders ของ Customer ID ที่มีสถานะเป็น "paid"
          const customerOrders = allOrders.filter(
            (orders: any) => orders.customer_id = customerID && orders.Status === "Paid"
          );

          // ดึง ID ของ Order ที่มีการรีวิวแล้ว
          const reviewedOrderIds = reviewedFoodItems.map((review) => review.order_id);


          // กรองเฉพาะ Orders ที่ยังไม่มีการรีวิว
          const notReviewedOrders = customerOrders.filter(
            (order: any) => !reviewedOrderIds.includes(order.ID)
          );

          // ดึงรายละเอียดของ Order จาก API GetOrderDetail
          const ordersDetailsResponse = await GetOrderDetail();
          if (ordersDetailsResponse.status !== 200) throw new Error('Failed to fetch order details.');
          const allOrderDetails = ordersDetailsResponse.data;

          // ดึงรายละเอียดของ Menu ทั้งหมด
          const menuResponse = await GetMenu(); // สมมติว่าฟังก์ชันนี้ดึงเมนูทั้งหมดได้
          if (menuResponse.status !== 200) throw new Error('Failed to fetch menu details.');
          const allMenus = menuResponse.data;

          // ดึงรายละเอียดของ Food Service Paments ทั้งหมด
          const foodpaymentResponse = await GetFoodServicePayment(); // สมมติว่าฟังก์ชันนี้ดึงเมนูทั้งหมดได้
          if (foodpaymentResponse.status !== 200) throw new Error('Failed to fetch Food Service Payment.');
          const allFoodPayment = foodpaymentResponse.data;

          // สร้าง Map ระหว่าง MenuID และ MenuName
          const menuMap = allMenus.reduce((acc: Record<number, string>, menu: MenuInterface) => {
            acc[menu.ID] = menu.MenuName;

            return acc;
          }, {});

          // สร้าง Map ระหว่าง MenuID และ MenuPrice
          const menuPriceMap = allMenus.reduce((acc: Record<number, number>, menu: MenuInterface) => {
            acc[menu.ID] = menu.Price;
            return acc;
          }, {});

          // สร้าง Map ระหว่าง MenuID และ MenuImage
          const menuImage = allMenus.reduce((acc: Record<number, string>, menu: MenuInterface) => {
            acc[menu.ID] = menu.ImageMenu;
            return acc;
          }, {});

          // สร้าง enrichedOrders พร้อมข้อมูลทั้งหมด
          const enrichedOrders = notReviewedOrders.map((order: any) => {
            const relatedDetails = allOrderDetails.filter((detail: any) => detail.OrderID === order.ID);
            const payment = allFoodPayment.find((p: FoodServicePaymentInterface) => p.OrderID === order.ID);

            return {
              id: order.ID,
              review_type_id: 2,
              title: `Order #${order.ID}`,
              status: order.Status,
              menuDetails: relatedDetails.map((detail: any) => ({
                menuName: menuMap[detail.MenuID] || 'Unknown',
                quantity: detail.Quantity || 0,
                amount: detail.Amount || 0,
                menuPrice: menuPriceMap[detail.MenuID] || 'Unknown',
                menuImage: menuImage[detail.MenuID] || 'Unknown',
              })),
              totalPrice: payment ? payment.Price : 'Unknown',
              paymentDate: payment ? payment.PaymentDate : 'Unknown', // ดึง paymentDate จาก payment
              paymentID: payment ? payment.ID : 'Unknown', // ดึง paymentID จาก payment
              paymentMethod: payment ? payment.PaymentMethod : 'Unknown', // ดึง paymentID จาก payment
            };
          });

          setNotReviewedItems(enrichedOrders);
          setIsNotReviewedLoaded(true);
        } catch (error) {
          console.error('Error fetching not reviewed items:', error);
        }
      }
    };

    if (activeTab === 'notReviewed') {
      fetchNotReviewedItems();
    }
  }, [activeTab, isNotReviewedLoaded]);


  useEffect(() => {
    const fetchUserInfo = async () => {
      if (customerID) {
        try {
          const res = await GetUsersById(customerID);
          if (res.status === 200) {
            setUserInfo(res.data);
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
    };

    const getReviewTypes = async () => {
      const res = await GetReviewTypes();
      if (res.status === 200) {
        const reviewtypeMap = res.data.reduce(
          (acc: Record<number, string>, review_types: { ID: number; review_type: string }) => {
            acc[review_types.ID] = review_types.review_type;
            return acc;
          },
          {}
        );
        setReviewTypes(reviewtypeMap);
      } else {
        message.error({
          type: "error",
          content: res.data.error || "ไม่สามารถโหลดประเภทรีวิวได้",
        });
      }
    };
    fetchUserInfo();
    getReviewTypes();
  }, [customerID]);

  const handleAddReview = (order: ReviewInterface) => {
    setCurrentReview(order);
    form.setFieldsValue({
      reviewtype: order.review_type_id !== undefined ? reviewTypes[order.review_type_id] : '',
      title: order.title,
      description: '',
      rating: 0,
    });
    setIsModalOpen(true);
  };

  const onFinish = async (values: any) => {
    if (currentReview) {
      const newReview: ReviewInterface = {
        Review_date: new Date(),
        Review_text: values.review_text,
        Price_rating: values.price_rating,
        Taste_rating: values.taste_rating,
        review_type_id: 2,
        order_id: currentReview.id,
        food_service_payment_id: currentReview.paymentID,
        customer_id: Number(customerID),
        pictures: base64Images,
        title: undefined,
        menuNames: undefined
      };
      const res = await CreateReview(newReview);
      if (res.status === 201) {
        message.open({
          type: "success",
          content: "สร้างรีวิวสำเร็จ!",
        });
        setTimeout(() => {
          window.location.href = "/review";
        }, 2000);
      } else {
        message.open({
          type: "error",
          content: res.data.error || "ไม่สามารถสร้างรีวิวได้!",
        });
      }
      setNotReviewedItems(notReviewedItems.filter((item) => item.ID !== currentReview.ID));
      setIsModalOpen(false);
    }
  };

  const handleImageUpload = (file: any) => {
    const reader = new FileReader();
    reader.onload = () => {
      setBase64Images((prevImages) => [...prevImages, reader.result as string]);
    };
    reader.readAsDataURL(file);
    return false; // Prevent upload
  };

  return (
    <div style={{ width: '100%', minHeight: "100vh", background: '#FFFFFF', paddingTop: 80 }}>
      <Navbar />
      <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
        {/* Left Side - Customer Information */}
        <div style={{ flex: '0 0 250px', background: '#003366', borderRadius: '8px', padding: '20px', position: 'fixed', top: '100px', zIndex: 1000 }}>
          {userInfo && (
            <Card title="ประวัติส่วนตัว" bordered={false} style={{ boxShadow: '0 4px 8px rgba(235, 0, 0, 0.1)', textAlign: 'center' }}>
              {userInfo.picture && (
                <img
                  src={userInfo.picture}
                  alt="Profile"
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: '10px',
                  }}
                />
              )}
              <p><strong>ชื่อ:</strong> {userInfo.first_name}</p>
              <p><strong>นามสกุล:</strong> {userInfo.last_name}</p>
              <p><strong>อายุ:</strong> {userInfo.age}</p>
              <p><strong>อีเมล:</strong> {userInfo.email}</p>
              <p><strong>เบอร์โทร:</strong> {userInfo.phone_number}</p>
            </Card>
          )}
        </div>

        {/* Right Side - Review Section */}
        <div style={{ flex: 1, marginLeft: '270px' }}>
          <Card
            style={{
              background: '#f9f9f9',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key as 'reviewed' | 'notReviewed')}>
              <Tabs.TabPane tab="รีวิวของฉัน" key="reviewed">
                <Tabs defaultActiveKey="foodReview">
                  <Tabs.TabPane tab="Food" key="foodReview">
                    <Card title="My Food Reviews" style={{ marginBottom: '20px' }}>
                      {reviewedFoodItems.map((review) => (
                        <Card
                          key={review.ID}
                          type="inner"
                          title={`Review for Food Order #${review.order_id}`}
                          extra={
                            <span>
                              {new Date(review.review_date ?? '').toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}{' '}
                              {new Date(review.review_date ?? '').toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: false,
                              })}
                            </span>
                          }
                          style={{ marginBottom: '16px' }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ flex: 1 }}>
                              <p><strong>Menu Names:</strong> {review.menuNames.join(', ')}</p>
                              <p><strong>Review Type:</strong> {reviewTypes[review.review_type_id] || 'Unknown'}</p>
                              <p><strong>Review Text:</strong> {review.review_text}</p>
                            </div>
                            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                              {review.pictures && review.pictures.length > 0 && (
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                  {review.pictures.map((pic, idx) => (
                                    <img
                                      key={idx}
                                      src={pic}
                                      alt={`Review Pic ${idx + 1}`}
                                      style={{
                                        width: '80px',
                                        height: '80px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                      }}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                              <p>
                                <strong>Price Rating:</strong>
                                <Rate allowHalf defaultValue={review.price_rating} disabled />
                              </p>
                              <p>
                                <strong>Taste Rating:</strong>
                                <Rate allowHalf defaultValue={review.taste_rating} disabled />
                              </p>
                            </div>
                          </div>

                        </Card>
                      ))}
                    </Card>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Trip and Cabin" key="tripReview">
                    {/* Empty Tab for Trip and Cabin Review */}
                  </Tabs.TabPane>
                </Tabs>
              </Tabs.TabPane>

              {/* Tab ยังไม่ได้รีวิว */}
              <Tabs.TabPane tab="ยังไม่ได้รีวิว" key="notReviewed">
                <Tabs defaultActiveKey="foodReview">
                  <Tabs.TabPane tab="Food" key="foodReview">
                    <Card title="Food Review" style={{ marginBottom: '20px' }}>
                      {notReviewedItems.map((order) => (
                        <Card
                          key={order.id}
                          type="inner"
                          title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>{`Order #${order.id}`}</span>
                              <span>{`รหัสการชำระเงิน : ${order.paymentID},   ${new Date(order.paymentDate ?? '').toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}`}</span>
                              <Button onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>{expandedOrder === order.id ? 'Show Less' : 'Show More'}</Button>
                            </div>
                          }
                          style={{ marginBottom: '16px' }}
                        >
                          {expandedOrder === order.id ? (
                            <>
                              <p><strong>Status:</strong> {order.status}</p>
                              <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                              <div>
                                {(order.menuDetails ?? []).map((detail: { quantity: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; menuImage: string | undefined; menuName: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; menuPrice: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; amount: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
                                  <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                                    <span style={{ marginRight: '8px' }}>{detail.quantity}x</span>
                                    <img
                                      src={detail.menuImage}
                                      alt={`Menu Image ${Number(index) + 1}`}
                                      style={{
                                        width: '60px',
                                        height: '60px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        marginRight: '12px',
                                      }}
                                    />
                                    <div>
                                      <p><strong>Menu Name:</strong> {detail.menuName}</p>
                                      <p><strong>Price per unit:</strong> {detail.menuPrice}</p>
                                      <p><strong>Amount:</strong> {detail.amount}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <p><strong>Subtotal:</strong> {(order.menuDetails ?? []).reduce((acc: number, detail: any) => acc + detail.amount, 0)}</p>
                              <p><strong>VAT (7%):</strong> {((order.menuDetails ?? []).reduce((acc: number, detail: any) => acc + detail.amount, 0) * 0.07).toFixed(2)}</p>
                              <p><strong>Total:</strong> {((order.menuDetails ?? []).reduce((acc: number, detail: any) => acc + detail.amount, 0) * 1.07).toFixed(2)}</p>
                              <p><strong>Discount:</strong> {((order.menuDetails ?? []).reduce((acc: number, detail: any) => acc + detail.amount, 0) * 1.07 - (order.totalPrice ?? 0)).toFixed(2) === '0.00' ? '-' : ((order.menuDetails ?? []).reduce((acc: number, detail: any) => acc + detail.amount, 0) * 1.07 - (order.totalPrice ?? 0)).toFixed(2)}</p>
                              <p><strong>Grand Total:</strong> {(order.totalPrice ?? 0).toFixed(2)}</p>
                              <Button type="primary" onClick={() => handleAddReview(order)} style={{ float: 'right' }}>Add Review</Button>
                            </>
                          ) : (
                            <>
                              {(order.menuDetails ?? []).map((detail: { menuImage: string | undefined; menuName: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; menuPrice: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                                  <img
                                    src={detail.menuImage}
                                    alt={`Menu Image ${Number(index) + 1}`}
                                    style={{
                                      width: '60px',
                                      height: '60px',
                                      objectFit: 'cover',
                                      borderRadius: '8px',
                                      marginRight: '12px',
                                    }}
                                  />
                                  <div>
                                    <p><strong>Menu Name:</strong> {detail.menuName}</p>
                                    <p><strong>Price per unit:</strong> {detail.menuPrice}</p>
                                  </div>
                                </div>
                              ))}
                              <Button type="primary" onClick={() => handleAddReview(order)} style={{ float: 'right' }}>Add Review</Button>
                            </>
                          )}
                        </Card>
                      ))}
                    </Card>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Trip and Cabin" key="tripReview">
                    {/* Empty Tab for Trip and Cabin Review */}
                  </Tabs.TabPane>
                </Tabs>
              </Tabs.TabPane>
            </Tabs>

            <Modal
              title="Add Review"
              open={isModalOpen}
              onCancel={() => setIsModalOpen(false)}
              onOk={() => form.submit()}
            >
              <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item name="reviewtype" label="ReviewType">
                  <Input value={currentReview && currentReview.review_type_id !== undefined ? reviewTypes[currentReview.review_type_id] : ''} disabled />
                </Form.Item>
                <Form.Item name="title" label="Title">
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  name="review_text"
                  label="เขียนรีวิว"
                  rules={[{ required: true, message: 'Please enter a Review!' }]}
                >
                  <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item
                  name="price_rating"
                  label="Price Rating"
                  rules={[{ required: true, message: 'Please provide a Price Rating!' }]}
                >
                  <Rate allowHalf defaultValue={0} tooltips={['Very Bad', 'Bad', 'Average', 'Good', 'Excellent']} />
                </Form.Item>
                <Form.Item
                  name="taste_rating"
                  label="Taste Rating"
                  rules={[{ required: true, message: 'Please provide a Taste Rating!' }]}
                >
                  <Rate allowHalf defaultValue={0} tooltips={['Very Bad', 'Bad', 'Average', 'Good', 'Excellent']} />
                </Form.Item>
                <Form.Item
                  name="images"
                  label="Upload Images"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                >
                  <Upload
                    name="images"
                    listType="picture"
                    maxCount={3}
                    multiple
                    beforeUpload={handleImageUpload}
                  >
                    <Button icon={<UploadOutlined />}>Click to Upload (Max: 3)</Button>
                  </Upload>
                </Form.Item>
              </Form>
            </Modal>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Review;
