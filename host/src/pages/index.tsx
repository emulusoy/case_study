import React, { useMemo, useRef, useState } from 'react';
import { Row, Col, Avatar, Space } from 'antd';
import PromoSections from "../components/PromoSections"
import Nav from '../components/Nav';


import {
  Layout,
  Carousel,
  Typography,
  Card,
  Button,
  Image,
  Grid,
} from 'antd';
import {
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const sliderImages = [
  'https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600&auto=format&fit=crop',
];

type Product = {
  id: number;
  title: string;
  price: string;
  image: string;
};

const products: Product[] = [
  { id: 1, title: 'Minimalist Tee', price: '$24.90', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop' },
  { id: 2, title: 'Graphic Tee',   price: '$29.90', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop' },
  { id: 3, title: 'Classic Hoodie', price: '$49.90', image: 'https://images.unsplash.com/photo-1520975682031-ae2830b3db0e?q=80&w=1200&auto=format&fit=crop' },
  { id: 4, title: 'Denim Jacket',   price: '$79.90', image: 'https://images.unsplash.com/photo-1520975922061-1d92e1b84f5f?q=80&w=1200&auto=format&fit=crop' },
  { id: 5, title: 'Sneakers',       price: '$59.90', image: 'https://images.unsplash.com/photo-1526178612508-6c4bfae7c9d0?q=80&w=1200&auto=format&fit=crop' },
  { id: 6, title: 'Backpack',       price: '$39.90', image: 'https://images.unsplash.com/photo-1514477917009-389c76a6863a?q=80&w=1200&auto=format&fit=crop' },
];

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function HomePage() {
  const screens = useBreakpoint();
  const cols = screens.md ? 3 : screens.sm ? 2 : 1;

  const slides = useMemo(() => chunk(products, cols), [cols]);

  const container: React.CSSProperties = {
    maxWidth: 1120,
    margin: '0 auto',
    padding: '16px',
  };

  const productCarouselRef = useRef<any>(null);
  const [current, setCurrent] = useState(0);
  const atStart = current === 0;
  const atEnd = current === slides.length - 1;

  return (
    
    <Layout style={{ background: '#fff' }}>
      <Nav/>
      <Content>

        {/* HERO SLIDER */}
        <div style={{ ...container, paddingTop: 24 }}>
          <Carousel autoplay arrows prevArrow={<LeftOutlined />} nextArrow={<RightOutlined />} style={{ borderRadius: 12, overflow: 'hidden' }}>
            {sliderImages.map((src, i) => (
              <div key={i}>
                <Image
                  src={src}
                  alt={`slide-${i + 1}`}
                  preview={false}
                  width="100%"
                  height={screens.md ? 420 : 260}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </Carousel>
        </div>

        {/* PRODUCTS - butonlarla kayan */}
        <section style={container}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 12,
              gap: 12,
            }}
          >
            <Title level={3} style={{ margin: 0 }}>Products</Title>
          </div>

          <div style={{ position: 'relative' }}>
            {/* Sağ & sol butonlar */}
            <Button
              shape="circle"
              aria-label="Previous products"
              onClick={() => productCarouselRef.current?.prev()}
              icon={<LeftOutlined />}
              disabled={atStart}
              style={{
                position: 'absolute',
                left: -8,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            />
            <Button
              shape="circle"
              aria-label="Next products"
              onClick={() => productCarouselRef.current?.next()}
              icon={<RightOutlined />}
              disabled={atEnd}
              style={{
                position: 'absolute',
                right: -8,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            />

            <Carousel
              ref={productCarouselRef}
              dots={false}
              infinite={false}
              draggable={false}     // sürükleme yok, butonla kaydır
              swipe={false}
              afterChange={(i) => setCurrent(i)}
              style={{ padding: '0 24px' }} // butonların altına giren alan
            >
              {slides.map((group, i) => (
                <div key={i}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${group.length}, minmax(0, 1fr))`,
                      gap: 16,
                    }}
                  >
                    {group.map((p) => (
                      <Card
                        key={p.id}
                        hoverable
                        style={{ borderRadius: 12, height: '100%' }}
                        cover={
                          <Image
                            src={p.image}
                            alt={p.title}
                            preview={false}
                            width="100%"
                            height={220}
                            style={{ objectFit: 'cover' }}
                          />
                        }
                        actions={[
                          <Button key="add" type="primary" shape="round">
                            Add to cart
                          </Button>,
                        ]}
                      >
                        <Title level={5} style={{ marginBottom: 4 }}>
                          {p.title}
                        </Title>
                        <Text type="secondary">{p.price}</Text>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </section>

      </Content>
<PromoSections />

      {/* FOOTER (küçük) */}
      <Footer
        style={{
          padding: 16,
          borderTop: '1px solid #f0f0f0',
          background: '#fff',
        }}
      >
        <div style={container}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: 8,
            }}
          >
            <Text type="secondary">© {new Date().getFullYear()} Your Co.</Text>
            <div style={{ display: 'flex', gap: 16 }}>
              <Button type="link">Privacy</Button>
              <Button type="link">Terms</Button>
              <Button type="link">Contact</Button>
            </div>
          </div>
        </div>
      </Footer>
    </Layout>
  );
}
