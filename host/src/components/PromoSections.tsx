import React from 'react';
import { Typography, Button, Row, Col, Space, Avatar } from 'antd';

function PromoSections() {
  const container: React.CSSProperties = {
    maxWidth: 1120,
    margin: '0 auto',
    padding: 16,
  };

  return (
    <section style={container}>
      <div
        style={{
          background: '#303030',
          color: '#fff',
          borderRadius: 12,
          padding: '48px 24px',
          textAlign: 'center',
        }}
      >
        <Typography.Title level={2} style={{ color: '#fff', marginBottom: 8 }}>
          Get 25% off during our one-time sale
        </Typography.Title>
        <Typography.Paragraph style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 24 }}>
          Our latest cosmetic arrivals have just landed, and they’re sure to dazzle you.
          Check out the freshest makeup, skincare, beauty products and elevate your beauty routine.
        </Typography.Paragraph>
        <Button type="primary" size="large" shape="round" href="/products">
          Shop now
        </Button>
      </div>
      <div
        style={{
          background: '#fff',
          border: '1px solid #f0f0f0',
          borderTop: 'none',
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          padding: 24,
        }}
      >
        <Typography.Title level={3} style={{ marginTop: 8 }}>
          What are people saying?
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 24 }}>
          Discover a carefully curated selection of unique and stylish products. From trendy fashion pieces to timeless
          home decor, our collections offer a wide range of items that are handpicked to suit your taste and style.
        </Typography.Paragraph>

        <Row gutter={[16, 24]}>
          {/* 1 */}
          <Col xs={24} md={8}>
            <Space align="start">
              <Avatar size={40} src="https://i.pravatar.cc/80?img=5" />
              <div>
                <Typography.Text strong>Sophia Thompson</Typography.Text>
                <div><Typography.Text type="secondary" style={{ fontSize: 12 }}>23 February 2023</Typography.Text></div>
              </div>
            </Space>
            <Typography.Paragraph italic style={{ marginTop: 12 }}>
              Great selection of trendy clothes, friendly staff, and reasonable prices. Highly recommend!
            </Typography.Paragraph>
          </Col>

          {/* 2 */}
          <Col xs={24} md={8}>
            <Space align="start">
              <Avatar size={40} src="https://i.pravatar.cc/80?img=12" />
              <div>
                <Typography.Text strong>Ron Watson</Typography.Text>
                <div><Typography.Text type="secondary" style={{ fontSize: 12 }}>16 July 2023</Typography.Text></div>
              </div>
            </Space>
            <Typography.Paragraph italic style={{ marginTop: 12 }}>
              Impressed with the fashionable items and personalized assistance. Affordable prices and excellent quality.
            </Typography.Paragraph>
          </Col>

          {/* 3 */}
          <Col xs={24} md={8}>
            <Space align="start">
              <Avatar size={40} src="https://i.pravatar.cc/80?img=32" />
              <div>
                <Typography.Text strong>Olivia Martinez</Typography.Text>
                <div><Typography.Text type="secondary" style={{ fontSize: 12 }}>10 March 2023</Typography.Text></div>
              </div>
            </Space>
            <Typography.Paragraph italic style={{ marginTop: 12 }}>
              Unique and stylish clothes, welcoming atmosphere, and attentive staff. Will definitely recommend to others.
            </Typography.Paragraph>
          </Col>
        </Row>
      </div>
    </section>
  );
}
export default PromoSections;