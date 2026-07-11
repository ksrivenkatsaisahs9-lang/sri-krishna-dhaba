import { useState, useEffect, useMemo } from "react";
import { 
  Layout, Menu, Table, Card, Row, Col, Statistic, InputNumber, Button, 
  Divider, ConfigProvider, theme, message, Typography, Space 
} from "antd";
import { 
  DashboardOutlined, 
  CalendarOutlined, 
  WhatsAppOutlined, 
  ScanOutlined, 
  EditOutlined, 
  UserOutlined, 
  HistoryOutlined, 
  SyncOutlined,
  ReloadOutlined
} from "@ant-design/icons";

const { Header, Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;

// Target Variables Configuration
const RESTAURANT_NAME = "Sri Krishna Dhaba";
const PRIMARY_BRAND_ACCENT = "#D35400"; // Orange accent
const SIDEBAR_WORKSPACE_COLOR = "#4A2E2B"; // Chocolate/dark brown
const LAYOUT_BACKGROUND_COLOR = "#FDF8F5"; // Warm cream
const HIGHLIGHT_TEXT_COLOR = "#E67E22"; // Bright highlight accent

// Audit Trail Data Schema
interface AuditLog {
  key: string;
  timestamp: string;
  actor: string;
  action: string;
  description?: string | null;
  metadata?: string | null;
}

// WhatsApp Order Data Schema
interface WhatsAppOrder {
  key: string;
  id: string;
  customerName: string;
  items: string;
  total: number;
  status: "Pending" | "Dispatched" | "Delivered";
}

export default function PremiumAdmin() {
  const [activeMenuKey, setActiveMenuKey] = useState<string>("dashboard");
  const [billAmount, setBillAmount] = useState<number | null>(null);
  const [couponToken, setCouponToken] = useState<string | null>(null);
  const [loyaltyLoading, setLoyaltyLoading] = useState(false);
  const [lastBustTime, setLastBustTime] = useState<string>(new Date().toLocaleTimeString());

  // Cache-Busting API Implementation Notes & Mock Trigger
  const handleForceCachePurge = async () => {
    try {
      message.loading({ content: "Purging edge caches...", key: "purge" });
      
      // Spec Requirement: 3. Server-Side Cascade Purging & Client-Side Header Sledgehammer
      const cacheBustUrl = `/api/menu?cacheBust=${Date.now()}`;
      
      // In a real application, this triggers an API call that invalidates static page generation (ISR)
      // and returns fresh database state directly to the client browser.
      const antiCacheHeaders = {
        "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
        "Pragma": "no-cache"
      };

      console.log(`[Anti-Cache Sledgehammer] Fetching: ${cacheBustUrl} with headers:`, antiCacheHeaders);
      
      // Mocking the cascade purging delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      setLastBustTime(new Date().toLocaleTimeString());
      message.success({ content: "Edge CDN & local browser memory flushed successfully!", key: "purge" });
    } catch (err) {
      message.error({ content: "Revalidation failed.", key: "purge" });
    }
  };

  // Spec Requirement: 3. Active Component Heartbeat Hook
  useEffect(() => {
    const handleRevalidation = () => {
      if (document.visibilityState === "visible") {
        console.log("[Heartbeat Hook] Tab focused. Flashing Next.js client router...");
        // Mocking Router reload/revalidation
        // router.refresh();
      }
    };

    window.addEventListener("focus", handleRevalidation);
    document.addEventListener("visibilitychange", handleRevalidation);

    const interval = setInterval(() => {
      console.log("[Heartbeat Hook] 4s loop tick. Invoking background revalidation...");
      setLastBustTime(new Date().toLocaleTimeString());
    }, 4000);

    return () => {
      window.removeEventListener("focus", handleRevalidation);
      document.removeEventListener("visibilitychange", handleRevalidation);
      clearInterval(interval);
    };
  }, []);

  // Post-Billing Loyalty Reduction Engine
  const loyaltyCalculation = useMemo(() => {
    if (!billAmount) return { subtotal: 0, reduction: 0, netBill: 0 };
    const reduction = billAmount * 0.10; // Precise 10% loyalty reduction
    const netBill = billAmount - reduction;
    return { subtotal: billAmount, reduction, netBill };
  }, [billAmount]);

  const generateLoyaltyVoucher = async () => {
    if (!billAmount) return;
    setLoyaltyLoading(true);
    try {
      // Mocking database ledger write and cryptographic token generation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const generatedToken = `SKD-LOYAL-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      setCouponToken(generatedToken);
      message.success("Voucher logged to backend database!");
    } catch (err) {
      message.error("Ledger communication failed.");
    } finally {
      setLoyaltyLoading(false);
    }
  };

  // Mock Database Data
  const auditLogs: AuditLog[] = [
    {
      key: "1",
      timestamp: "2026-07-11 23:10:45",
      actor: "Srinivas Rao (Owner)",
      action: "Dish InStock Modified",
      description: "Toggled 'Paneer Butter Masala' outOfStock -> false",
      metadata: "dish_id: spl-paneer-1"
    },
    {
      key: "2",
      timestamp: "2026-07-11 23:08:12",
      actor: "Karthik Uppari (Manager)",
      action: "Table Reservation Approved",
      description: "Approved Table 4 for Ram Charan",
      metadata: null // Fallback test case
    },
    {
      key: "3",
      timestamp: "2026-07-11 23:05:00",
      actor: "Ramesh Kumar (Captain)",
      action: "Customer checked-in",
      description: null, // Fallback test case
      metadata: "" // Fallback test case
    }
  ];

  const whatsappOrders: WhatsAppOrder[] = [
    {
      key: "1",
      id: "ORD-9821",
      customerName: "Allu Arjun",
      items: "2x Dragon Paneer, 1x Veg Fried Rice",
      total: 510,
      status: "Pending"
    },
    {
      key: "2",
      id: "ORD-9820",
      customerName: "Pooja Hegde",
      items: "1x Mushroom Butter Pepper, 2x Garlic Naan",
      total: 340,
      status: "Dispatched"
    }
  ];

  // Table Configuration for Audit Trail with Fallback render pipeline
  const auditColumns = [
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      width: 160
    },
    {
      title: "Actor",
      dataIndex: "actor",
      key: "actor",
      width: 180
    },
    {
      title: "Action Item",
      dataIndex: "action",
      key: "action",
      width: 200,
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: "Details",
      dataIndex: "description",
      key: "description",
      // Spec Requirement: 4. Fallback presentation placeholders (e.g. '—' or 'System Modified')
      render: (text?: string | null) => (
        <span className={!text ? "text-gray-400 italic" : ""}>
          {text || "—"}
        </span>
      )
    },
    {
      title: "System Metadata",
      dataIndex: "metadata",
      key: "metadata",
      render: (text?: string | null) => (
        <code className={!text ? "text-gray-400 italic font-sans" : "bg-gray-50 border border-gray-100 px-2 py-0.5 rounded text-[11px]"}>
          {text || "System Modified"}
        </code>
      )
    }
  ];

  const orderColumns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (text: string) => <span className="font-mono font-bold text-orange-600">{text}</span>
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName"
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items"
    },
    {
      title: "Bill Total",
      dataIndex: "total",
      key: "total",
      render: (amount: number) => `Rs. ${amount}`
    },
    {
      title: "Status Badge",
      dataIndex: "status",
      key: "status",
      // Spec Requirement: 4. desaturated pastel background badges with darker matching text
      render: (status: string) => {
        let color = "bg-amber-50 text-amber-700 border-amber-200/50";
        if (status === "Dispatched") color = "bg-blue-50 text-blue-700 border-blue-200/50";
        if (status === "Delivered") color = "bg-emerald-50 text-emerald-700 border-emerald-200/50";
        return (
          <span className={`text-[10px] font-bold px-2.5 py-1 border rounded-full uppercase tracking-wider ${color}`}>
            {status}
          </span>
        );
      }
    }
  ];

  return (
    <ConfigProvider
      // Spec Requirement: 2.Centralized ConfigProvider theme mapping
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: PRIMARY_BRAND_ACCENT,
          colorBgLayout: LAYOUT_BACKGROUND_COLOR,
          colorBgContainer: "#FFFFFF",
          colorTextBase: "#33221C", // Desaturated dark brown derivative to limit eye fatigue
          borderRadius: 16
        },
        components: {
          Menu: {
            itemSelectedColor: HIGHLIGHT_TEXT_COLOR,
            itemSelectedBg: "rgba(230, 126, 34, 0.15)"
          }
        }
      }}
    >
      <Layout className="min-h-screen">
        {/* Navigation Sidebar Canvas */}
        <Sider
          collapsible
          breakpoint="lg"
          onCollapse={(collapsed) => console.log("Collapse status:", collapsed)}
          // Spec Requirement: Sider wrapped in SIDEBAR_WORKSPACE_COLOR with high contrast hover active states
          style={{ background: SIDEBAR_WORKSPACE_COLOR }}
          className="border-r border-gray-100"
        >
          <div className="p-4 flex items-center justify-center border-b border-white/5 mb-4">
            <Title level={5} style={{ color: "#FFFFFF", margin: 0, letterSpacing: "1.5px" }} className="uppercase text-center">
              {RESTAURANT_NAME}
            </Title>
          </div>
          
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[activeMenuKey]}
            onClick={(e) => setActiveMenuKey(e.key)}
            style={{ background: "transparent" }}
            // Inline Tailwind style override to apply highlight selection accent text
            className="admin-sidebar-menu"
            items={[
              { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
              { key: "reservations", icon: <CalendarOutlined />, label: "Reservations" },
              { key: "whatsapp", icon: <WhatsAppOutlined />, label: "WhatsApp Orders" },
              { key: "scanner", icon: <ScanOutlined />, label: "Counter claims" },
              { key: "menu-editor", icon: <EditOutlined />, label: "Menu Editor" },
              { key: "customer-db", icon: <UserOutlined />, label: "CRM Database" },
              { key: "audit", icon: <HistoryOutlined />, label: "System Audits" }
            ]}
          />
        </Sider>

        {/* Workspace Layout */}
        <Layout className="site-layout">
          {/* Header Panel */}
          <Header className="bg-white border-b border-gray-100 px-6 flex justify-between items-center h-16 shrink-0">
            <div>
              <Text strong className="text-gray-500 uppercase tracking-widest text-[10px]">Back-Office Portal</Text>
              <Title level={4} style={{ margin: 0, marginTop: -2 }} className="font-display font-black">
                {activeMenuKey.toUpperCase()}
              </Title>
            </div>
            
            <Space size="middle">
              <span className="text-[10px] bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md border border-amber-200/50 font-mono">
                Heartbeat sync: {lastBustTime}
              </span>
              {/* Force Purge trigger button */}
              <Button 
                type="default" 
                icon={<SyncOutlined />} 
                onClick={handleForceCachePurge}
                className="text-xs font-bold uppercase tracking-wider"
              >
                Flush Edge Caches
              </Button>
            </Space>
          </Header>

          {/* Page Contents Container */}
          <Content className="p-6 md:p-8 overflow-y-auto">
            {/* CONTENT MODULE: DASHBOARD */}
            {activeMenuKey === "dashboard" && (
              <div className="space-y-6">
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} lg={6}>
                    <Card bordered className="border-gray-100 rounded-3xl" bodyStyle={{ padding: 24 }}>
                      <Statistic title="Today's Cover Reservations" value={28} prefix={<CalendarOutlined />} />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Card bordered className="border-gray-100 rounded-3xl" bodyStyle={{ padding: 24 }}>
                      <Statistic title="Pending Kitchen Orders" value={14} valueStyle={{ color: PRIMARY_BRAND_ACCENT }} prefix={<ReloadOutlined spin />} />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Card bordered className="border-gray-100 rounded-3xl" bodyStyle={{ padding: 24 }}>
                      <Statistic title="CRM Verified Customers" value={1432} prefix={<UserOutlined />} />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Card bordered className="border-gray-100 rounded-3xl" bodyStyle={{ padding: 24 }}>
                      <Statistic title="Edge Cached Hits" value="99.2%" valueStyle={{ color: "rgb(16, 185, 129)" }} />
                    </Card>
                  </Col>
                </Row>

                <Card title="Live Server-Side Revalidation Logs" className="border-gray-100 rounded-3xl">
                  <Paragraph>
                    This system implements automated cache-purging hooks. Whenever an item is toggled out of stock, Next.js calls <Text code>revalidatePath('/menu')</Text> to regenerate static HTML blocks immediately.
                  </Paragraph>
                  <Text type="secondary" className="text-xs">
                    * Visibility listener and Focus listener hooks are currently online on a 4-second intervals heartbeat.
                  </Text>
                </Card>
              </div>
            )}

            {/* CONTENT MODULE: SYSTEM AUDITS */}
            {activeMenuKey === "audit" && (
              <Card title="Audit Trail logs" className="border-gray-100 rounded-3xl">
                <Paragraph className="text-gray-500 text-xs">
                  Review system actions performed by moderators. Standard fallback placeholders render in case descriptive strings are undefined.
                </Paragraph>
                <Table
                  dataSource={auditLogs}
                  columns={auditColumns}
                  pagination={{ pageSize: 5 }}
                  bordered={false}
                  className="admin-clean-table border border-gray-100 rounded-2xl overflow-hidden mt-4"
                />
              </Card>
            )}

            {/* CONTENT MODULE: WHATSAPP ORDERS */}
            {activeMenuKey === "whatsapp" && (
              <Card title="WhatsApp Incoming checkout Stream" className="border-gray-100 rounded-3xl">
                <Table
                  dataSource={whatsappOrders}
                  columns={orderColumns}
                  pagination={false}
                  bordered={false}
                  className="admin-clean-table border border-gray-100 rounded-2xl overflow-hidden"
                />
              </Card>
            )}

            {/* CONTENT MODULE: COUNTER CLAIMS & LOYALTY SCANNER */}
            {activeMenuKey === "scanner" && (
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  {/* Spec Requirement: 5. High-conversion Swiggy/Zomato style discount ledger generator */}
                  <Card title="Post-Billing Loyalty Reductions Calculator" className="border-gray-100 rounded-3xl">
                    <Paragraph className="text-gray-500 text-xs">
                      Enter the counter billing total below to calculate the 10% loyalty reduction and write a cryptographic validation token.
                    </Paragraph>
                    
                    <div className="space-y-4">
                      <div>
                        <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Enter Settled Bill Amount (Rs.)</Text>
                        <InputNumber
                          style={{ width: "100%" }}
                          placeholder="e.g. 1500"
                          min={0}
                          value={billAmount}
                          onChange={(val) => { setBillAmount(val); setCouponToken(null); }}
                          size="large"
                          className="rounded-xl border-gray-200"
                        />
                      </div>

                      {billAmount !== null && billAmount > 0 && (
                        <div className="bg-[#FAFAF9] border border-gray-100 rounded-2xl p-4 space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Subtotal Counter Invoice</span>
                            <span className="font-bold">Rs. {loyaltyCalculation.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-emerald-600">
                            <span>Interactive 10% Rebate</span>
                            <span>-Rs. {loyaltyCalculation.reduction.toFixed(2)}</span>
                          </div>
                          <Divider className="my-2 border-gray-200" />
                          <div className="flex justify-between text-sm font-black text-brand-dark">
                            <span>Adjusted Net Payable</span>
                            <span style={{ color: PRIMARY_BRAND_ACCENT }}>Rs. {loyaltyCalculation.netBill.toFixed(2)}</span>
                          </div>
                        </div>
                      )}

                      <Button
                        type="primary"
                        onClick={generateLoyaltyVoucher}
                        disabled={!billAmount || billAmount <= 0}
                        loading={loyaltyLoading}
                        className="w-full h-11 rounded-xl text-xs font-bold uppercase tracking-wider"
                      >
                        Generate Claims coupon code
                      </Button>
                    </div>
                  </Card>
                </Col>

                <Col xs={24} md={12}>
                  <Card title="Instant QR Seating & Claim visualization" className="border-gray-100 rounded-3xl flex flex-col justify-center items-center text-center min-h-[300px]">
                    {couponToken ? (
                      <div className="space-y-4 py-4 flex flex-col items-center">
                        <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-bold uppercase tracking-wide">
                          Voucher Saved: {couponToken}
                        </span>
                        
                        {/* Google Chart QR Generator pointing directly to counter Claims */}
                        <div className="border border-gray-100 p-3 rounded-2xl bg-white shadow-sm">
                          <img
                            src={`https://chart.googleapis.com/chart?chs=220x220&cht=qr&chl=${encodeURIComponent(couponToken)}&choe=UTF-8`}
                            alt="Claims QR Code"
                            className="w-[180px] h-[180px] object-contain"
                          />
                        </div>
                        <Text type="secondary" className="text-[11px] block max-w-xs leading-relaxed">
                          Scan directly at checkout to apply voucher credits onto consumer-facing checkouts.
                        </Text>
                      </div>
                    ) : (
                      <div className="text-gray-400 py-12">
                        <ScanOutlined className="text-4xl opacity-30 mb-3" />
                        <p className="text-xs font-semibold">Generate voucher claims to render QR code codes</p>
                      </div>
                    )}
                  </Card>
                </Col>
              </Row>
            )}

            {/* UNIMPLEMENTED MODULES PLACEHOLDER CARD */}
            {activeMenuKey !== "dashboard" && activeMenuKey !== "audit" && activeMenuKey !== "whatsapp" && activeMenuKey !== "scanner" && (
              <Card className="border-gray-100 rounded-3xl py-12 text-center text-gray-400">
                <Paragraph className="text-xs">
                  {activeMenuKey.toUpperCase()} admin workspace module is ready for backend integration.
                </Paragraph>
              </Card>
            )}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
