import { useState, useEffect, JSXElementConstructor, ReactElement, ReactNode, ReactPortal } from "react";
import {
  Space,
  Button,
  Row,
  Col,
  message,
  Modal,
  Input,
  Select,
  Drawer,
  ConfigProvider,
  Card,
  Table,
  Tag,
} from "antd";
import { PlusOutlined, DeleteOutlined, FilterOutlined, CheckCircleOutlined, MinusCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, CopyOutlined, EditOutlined, PercentageOutlined, DollarOutlined } from "@ant-design/icons";
import {
  GetPromotions,
  DeletePromotionById,
  GetPromotionType,
  GetPromotionStatus,
  GetDiscountType,
} from "../../service/htpps/PromotionAPI";
import { PromotionInterface } from "../../interface/Promotion";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import enUS from "antd/locale/en_US";
import Navbar from "../../../review/pages/navbar";

function Promotion() {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<PromotionInterface[]>([]);
  const [promotionTypes, setPromotionTypes] = useState<Record<number, string>>({});
  const [promotionStatuses, setPromotionStatuses] = useState<Record<number, string>>({});
  const [promotionDiscounts, setPromotionDiscounts] = useState<Record<number, string>>({});
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<PromotionInterface | null>(null);
  const [searchCode, setSearchCode] = useState<string>("");

  const [filters, setFilters] = useState({
    type_id: null,
    status_id: null,
    discount_id: null,
  });

  const formatNumber = (value: number | string) => {
    return new Intl.NumberFormat().format(Number(value));
  };

  const columns = [
    {
      title: "รหัส",
      dataIndex: "ID",
      key: "id",
      render: (text: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined) => (
        <span style={{ fontWeight: "bold", fontFamily: "Arial, sans-serif" }}>
          {text}
        </span>
      ),
    },
    {
      title: "รหัสโปรโมชั่น",
      dataIndex: "code",
      key: "code",
      render: (text: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined) => (
        <Space>
          <span style={{ fontFamily: "Arial, sans-serif" }}>{text}</span>
          <Button
            icon={<CopyOutlined />}
            size="small"
            onClick={() => {
              navigator.clipboard.writeText(String(text));
              message.success("คัดลอกสำเร็จ!");
            }}
            style={{
              borderRadius: "4px",
              color: "#003366",
              border: "1px solid #003366",
              backgroundColor: "white",
            }}
          />
        </Space>
      ),
    },
    {
      title: "ชื่อโปรโมชั่น",
      dataIndex: "name",
      key: "name",
      render: (text: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined) => (
        <span style={{ fontFamily: "Arial, sans-serif" }}>{text}</span>
      ),
    },
    {
      title: "รายละเอียด",
      dataIndex: "details",
      key: "details",
      render: (text: any) => (
        <span
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "inline-block",
            maxWidth: "200px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {text || "-"}
        </span>
      ),
    },
    {
      title: "ระยะเวลาโปรโมชั่น",
      key: "date_range",
      render: (record: { start_date: string | number | Date | dayjs.Dayjs | null | undefined; end_date: string | number | Date | dayjs.Dayjs | null | undefined; }) =>
        record.start_date && record.end_date
          ? `${dayjs(record.start_date).format("DD/MM/YYYY")} ถึง ${dayjs(
            record.end_date
          ).format("DD/MM/YYYY")}`
          : "-",
    },
    {
      title: "ประเภทส่วนลด",
      key: "discount_id",
      render: (record: { discount_id: string | number }) => {
        const discountMap: Record<number, { text: string; icon: React.ReactNode; color: string }> = {
          1: { text: "เปอร์เซ็นต์", icon: <PercentageOutlined />, color: "blue" },
          2: { text: "จำนวนเงิน", icon: <DollarOutlined />, color: "pink" },
        };
    
        const discount = discountMap[Number(record.discount_id)] || { text: "-", icon: null, color: "default" };
    
        return (
          <Tag
            icon={discount.icon}
            color={discount.color}
            style={{ fontSize: "14px", fontFamily: "Arial, sans-serif", display: "flex", alignItems: "center" }}
          >
            {discount.text}
          </Tag>
        );
      },
    },
    
    
    {
      title: "ส่วนลด",
      key: "discount",
      render: (record: { discount: string; discount_id: number; }) => {
        if (record.discount || record.discount === "0") {
          return record.discount_id === 1
            ? `${record.discount}%`
            : `${formatNumber(record.discount)}฿`;
        }
        return "-";
      },
    },
    {
      title: "ส่วนลดสูงสุด (฿)",
      dataIndex: "limit_discount",
      key: "limit_discount",
      render: (value: string | number) => (
        <span style={{ fontFamily: "Arial, sans-serif" }}>
          {formatNumber(value) || "-"}
        </span>
      ),
    },
    {
      title: "ราคาขั้นต่ำ (฿)",
      dataIndex: "minimum_price",
      key: "minimum_price",
      render: (value: string | number) => (
        <span style={{ fontFamily: "Arial, sans-serif" }}>
          {formatNumber(value) || "-"}
        </span>
      ),
    },
    {
      title: "จำนวนที่จำกัด",
      dataIndex: "limit",
      key: "limit",
      render: (value: string | number) => (
        <span style={{ fontFamily: "Arial, sans-serif" }}>
          {formatNumber(value) || "-"}
        </span>
      ),
    },
    {
      title: "ที่ใช้แล้ว (ครั้ง)",
      dataIndex: "count_limit",
      key: "count_limit",
      render: (value: string | number) => (
        <span style={{ fontFamily: "Arial, sans-serif" }}>
          {formatNumber(value) || "-"}
        </span>
      ),
    },
    {
      title: "สถานะ",
      dataIndex: "status_id",
      render: (status_id: string | number) => {
        const statusMap: Record<
          string | number,
          { text: string; color: string; icon?: React.ReactNode }
        > = {
          1: { text: "เปิดใช้งาน", color: "green", icon: <CheckCircleOutlined /> },
          2: { text: "เต็ม", color: "red", icon: <MinusCircleOutlined /> },
          3: { text: "หมดอายุ", color: "gray", icon: <CloseCircleOutlined /> },
          4: { text: "ยกเลิก", color: "orange", icon: <ExclamationCircleOutlined /> },
        };
        const status = statusMap[status_id] || { text: "-", color: "default" };

        return (
          <Tag
            icon={status.icon}
            color={status.color}
            style={{ fontSize: "14px", fontFamily: "Arial, sans-serif" }}
          >
            {status.text}
          </Tag>
        );
      },
    },
    {
      title: "ประเภท",
      key: "type_id",
      render: (record: { type_id: number; }) => (
        <span style={{ fontFamily: "Arial, sans-serif" }}>
          {promotionTypes[record.type_id] || "-"}
        </span>
      ),
    },
    {
      key: "action",
      render: (_: any, record: PromotionInterface) => (
        <Space size="small" style={{ justifyContent: "center" }}>
          <Button
            type="primary"
            onClick={() => navigate(`/promotion/edit/${record.ID}`)}
            icon={<EditOutlined />}
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "14px",
              borderRadius: "8px",
              backgroundColor: "#003366",
              color: "#fff",
              border: "none",
            }}
          >
            แก้ไข
          </Button>
          <Button
            type="default"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteModal(record)}
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "14px",
              borderRadius: "8px",
              color: "#d32029",
              border: "1px solid #d32029",
            }}
          >
            ลบ
          </Button>
        </Space>
      ),
    },
  ];



  const showDeleteModal = (record: PromotionInterface) => {
    setSelectedPromotion(record);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedPromotion) return;
    const res = await DeletePromotionById(selectedPromotion.ID!.toString());

    if (res.status === 200) {
      messageApi.open({ type: "success", content: res.data.message });
      await getPromotions();
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error || "ไม่สามารถลบโปรโมชั่นได้",
      });
    }
    setIsModalOpen(false);
    setSelectedPromotion(null);
  };

  const getPromotions = async () => {
    const res = await GetPromotions();
    if (res.status === 200) {
      setPromotions(res.data);
    } else {
      setPromotions([]);
      messageApi.open({
        type: "error",
        content: res.data.error || "ไม่สามารถโหลดโปรโมชั่นได้",
      });
    }
  };

  const getPromotionTypes = async () => {
    const res = await GetPromotionType();
    if (res.status === 200) {
      const typeMap = res.data.reduce(
        (acc: Record<number, string>, type: { ID: number; type: string }) => {
          acc[type.ID] = type.type;
          return acc;
        },
        {}
      );
      setPromotionTypes(typeMap);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error || "ไม่สามารถโหลดประเภทโปรโมชั่นได้",
      });
    }
  };

  const getPromotionStatuses = async () => {
    const res = await GetPromotionStatus();
    if (res.status === 200) {
      const statusMap = res.data.reduce(
        (acc: Record<number, string>, status: { ID: number; status: string }) => {
          acc[status.ID] = status.status;
          return acc;
        },
        {}
      );
      setPromotionStatuses(statusMap);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error || "ไม่สามารถโหลดสถานะโปรโมชั่นได้",
      });
    }
  };

  const getPromotionDiscounts = async () => {
    const res = await GetDiscountType();
    if (res.status === 200) {
      const discountMap = res.data.reduce(
        (acc: Record<number, string>, discount: { ID: number; discount_type: string }) => {
          acc[discount.ID] = discount.discount_type;
          return acc;
        },
        {}
      );
      setPromotionDiscounts(discountMap);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error || "ไม่สามารถโหลดประเภทส่วนลดได้",
      });
    }
  };

  const applyFilters = () => {
    setIsFilterDrawerOpen(false);
  };

  useEffect(() => {
    getPromotions();
    getPromotionTypes();
    getPromotionStatuses();
    getPromotionDiscounts();
  }, []);

  const totalPromotions = promotions.length;
  const type1Promotions = promotions.filter(promo => promo.type_id === 1).length;
  const type2Promotions = promotions.filter(promo => promo.type_id === 2).length;

  return (
    <ConfigProvider locale={enUS}>
      <Navbar />
      <div
        className="promotion-container"
        style={{
          fontFamily: "Arial, Helvetica, sans-serif",
          padding: "20px",
          width: "100%",
          minHeight: "100vh",
          paddingTop: 100,
        }}
      >
        {contextHolder}
        {/* แถวแรก: Card ครอบคลุมสถิติและปุ่มสร้างโปรโมชั่น */}
        <Row style={{ marginBottom: "20px" }}>
          <Col span={24}>
            <Card
              style={{
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "20px",
              }}
            >
              <Col span={24}>
                <h2
                  style={{
                    fontSize: "36px",
                    fontWeight: "bold",
                    margin: "0 auto",
                    textAlign: "center",
                  }}
                >
                  Promotion Management
                </h2>
              </Col>
              <Row gutter={16} align="middle">
                {/* Card สถิติ */}
                <Col span={8}>
                  <div>
                    <h1>โปรโมชั่นทั้งหมด: {totalPromotions}</h1>
                    <h2>โปรโมชั่นสำหรับทริปและห้องพัก: {type1Promotions}</h2>
                    <h2>โปรโมชั่นสำหรับอาหาร: {type2Promotions}</h2>
                  </div>
                </Col>

                {/* ปุ่มสร้างโปรโมชั่น + ช่องค้นหา */}
                <Col span={16} style={{ textAlign: "right" }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={() => navigate("/promotion/create")}
                    style={{
                      backgroundColor: "#003366",
                      color: "#fff",
                      marginBottom: "10px",
                    }}
                  >
                    สร้างโปรโมชั่น
                  </Button>
                  <Row justify="end" align="middle" gutter={8}>
                    <Col>
                      <Input.Search
                        placeholder="ค้นหารหัสโปรโมชั่น"
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
                        onSearch={() => { }}
                        style={{
                          borderRadius: "8px",
                          padding: "8px",
                          fontSize: "14px",
                          width: "300px",
                        }}
                      />
                    </Col>
                    <Col>
                      <Button
                        icon={<FilterOutlined />}
                        onClick={() => setIsFilterDrawerOpen(true)}
                        style={{
                          fontSize: "16px",
                          color: "#fff",
                          backgroundColor: "#003366",
                          borderRadius: "8px",
                        }}
                      >
                        กรอง
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* แถวที่สาม: Card ครอบคลุมตารางข้อมูล */}
        <Row>
          <Col span={24}>
            <Card
              style={{
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "20px",
              }}
            >
              <Table
                rowKey="ID"
                columns={columns}
                dataSource={promotions.filter((promotion) => {
                  const { type_id, status_id, discount_id } = filters;
                  return (
                    (!type_id || promotion.type_id === type_id) &&
                    (!status_id || promotion.status_id === status_id) &&
                    (!discount_id || promotion.discount_id === discount_id) &&
                    promotion.code.toLowerCase().includes(searchCode.toLowerCase())
                  );
                })}
                pagination={{ pageSize: 10 }}
                className="promotion-table"
              />
            </Card>
          </Col>
        </Row>

        {/* Drawer สำหรับกรอง */}
        <Drawer
          title="กรองโปรโมชั่น"
          placement="right"
          closable
          onClose={() => setIsFilterDrawerOpen(false)}
          open={isFilterDrawerOpen}
          width={300}
          className="promotion-filter-drawer"
          headerStyle={{
            fontSize: "18px",
            fontWeight: "bold",
            backgroundColor: "#f0f2f5",
            borderBottom: "1px solid #d9d9d9",
          }}
          bodyStyle={{
            padding: "16px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <div className="promotion-filter-section" style={{ marginBottom: "16px" }}>
            <h4 style={{ fontSize: "16px", marginBottom: "8px" }}>ประเภทโปรโมชั่น</h4>
            <Select
              placeholder="เลือกประเภทโปรโมชั่น"
              style={{
                width: "100%",
                borderRadius: "8px",
              }}
              value={filters.type_id}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, type_id: value }))
              }
              allowClear
            >
              {Object.entries(promotionTypes).map(([id, type]) => (
                <Select.Option key={id} value={parseInt(id)}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="promotion-filter-section" style={{ marginBottom: "16px" }}>
            <h4 style={{ fontSize: "16px", marginBottom: "8px" }}>สถานะ</h4>
            <Select
              placeholder="เลือกสถานะ"
              style={{
                width: "100%",
                borderRadius: "8px",
              }}
              value={filters.status_id}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, status_id: value }))
              }
              allowClear
            >
              {Object.entries(promotionStatuses).map(([id, status]) => (
                <Select.Option key={id} value={parseInt(id)}>
                  {status}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="promotion-filter-section" style={{ marginBottom: "16px" }}>
            <h4 style={{ fontSize: "16px", marginBottom: "8px" }}>ประเภทส่วนลด</h4>
            <Select
              placeholder="เลือกประเภทส่วนลด"
              style={{
                width: "100%",
                borderRadius: "8px",
              }}
              value={filters.discount_id}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, discount_id: value }))
              }
              allowClear
            >
              {Object.entries(promotionDiscounts).map(([id, discount]) => (
                <Select.Option key={id} value={parseInt(id)}>
                  {discount}
                </Select.Option>
              ))}
            </Select>
          </div>
          <Button
            type="primary"
            onClick={applyFilters}
            style={{
              width: "100%",
              marginTop: "16px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              backgroundColor: "#003366",
            }}
          >
            ใช้ตัวกรอง
          </Button>
        </Drawer>

        {/* Modal สำหรับยืนยันการลบ */}
        <Modal
          title="ยืนยันการลบโปรโมชั่น"
          open={isModalOpen}
          onOk={handleDelete}
          onCancel={() => setIsModalOpen(false)}
          okText="ยืนยัน"
          cancelText="ยกเลิก"
        >
          <p>คุณต้องการลบโปรโมชั่นนี้หรือไม่?</p>
        </Modal>
      </div>
    </ConfigProvider>

  );
}

export default Promotion;
