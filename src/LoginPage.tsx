import { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "./auth";

const { Title, Text } = Typography;

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.username, values.password);
    } catch (err: any) {
      message.error(err.message || "登录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #1a3976 0%, #152850 50%, #0d1f40 100%)",
      padding: 24,
    }}>
      <Card
        style={{
          width: 400,
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          borderRadius: 12,
        }}
        bodyStyle={{ padding: "40px 32px" }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img
            src="/icons.svg"
            alt="logo"
            style={{ width: 64, height: 64, marginBottom: 16 }}
          />
          <Title level={3} style={{ margin: 0, color: "#1a3976" }}>
            电力科技奖励管理系统
          </Title>
          <Text type="secondary">用户登录</Text>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#999" }} />}
              placeholder="用户名"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#999" }} />}
              placeholder="密码"
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登  录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
