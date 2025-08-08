
import React, { useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';

import {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery,
} from '../redux/services/products';
import type { Product } from '../types/Product';
import {
  Typography,
  Tabs,
  Row,
  Col,
  Card,
  Button,
  Skeleton,
  Empty,
  Modal,
} from 'antd';

const { Title, Paragraph, Text } = Typography;

const container: React.CSSProperties = {
  maxWidth: 1120,
  margin: '0 auto',
  padding: '16px',
};

const formatPrice = (n: number | string) =>
  typeof n === 'number' ? `$${n.toFixed(2)}` : `$${Number(n).toFixed(2)}`;

const labelize = (s: string) =>
  s
    .replace(/jewelery/i, 'Jewelry')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='220'>
       <rect width='100%' height='100%' fill='#f5f5f5'/>
       <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
             fill='#bfbfbf' font-family='Arial, sans-serif' font-size='14'>
         no image
       </text>
     </svg>`
  );

const toGithubRaw = (src: string) => {
  const file = (src || '').split('/').pop() || '';
  return `https://raw.githubusercontent.com/keikaavousi/fake-store-api/master/public/img/${file}`;
};

const HOST_ORIGIN = 'http://localhost:3000'; 

const ProductsList: React.FC = () => {
  const {
    data: categories = [],
    isLoading: catsLoading,
    error: catsErr,
  } = useGetCategoriesQuery();

  const [activeTab, setActiveTab] = useState<string>('all');

  const {
    data: allProducts,
    isLoading: allLoading,
    error: allErr,
  } = useGetProductsQuery(undefined, { skip: activeTab !== 'all' });

  const {
    data: catProducts,
    isLoading: catLoading,
    error: catErr,
  } = useGetProductsByCategoryQuery(activeTab, { skip: activeTab === 'all' });

  const loading = catsLoading || (activeTab === 'all' ? allLoading : catLoading);
  const error = catsErr || (activeTab === 'all' ? allErr : catErr);

  const list: Product[] = useMemo(
    () => (activeTab === 'all' ? (allProducts ?? []) : (catProducts ?? [])),
    [activeTab, allProducts, catProducts]
  );

  const [visibleCount, setVisibleCount] = useState(6);
  const shown = list.slice(0, visibleCount);

  const tabs = [
    { key: 'all', label: 'All' },
    ...categories.map((c) => ({ key: c, label: labelize(c) })),
  ];

  // sepete ekleme islemi icin
  const showAddedModal = (product: Product) => {
    Modal.success({
      title: 'Sepete eklendi',
      content: (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>{product.title}</div>
          <div>Ürün sepete eklendi.</div>
        </div>
      ),
      okText: 'Tamam',
      centered: true,
    });
  };
  //sepete ekleme fonksiyonu
  const handleAddToCart = (p: Product) => {
    try {
      window.parent.postMessage(
        { type: 'ADD_TO_CART', item: p }, 
        HOST_ORIGIN
      );
    } catch {}
    showAddedModal(p);
  };

  return (
    <div style={container}>
      <div style={{ marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>
          {activeTab === 'all' ? 'All Products' : labelize(activeTab)}
        </Title>
        <Paragraph type="secondary" style={{ maxWidth: 680, marginTop: 8 }}>
          Browse categories fetched live from FakeStore API. Pick a tab to filter the grid by category.
        </Paragraph>
      </div>
      <Tabs
        items={tabs}
        activeKey={activeTab}
        onChange={(k) => {
          setActiveTab(k);
          setVisibleCount(6);
        }}
        style={{ borderBottom: '1px solid #f0f0f0' }}
      />

      {loading ? (
        <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Col key={i} xs={24} sm={12} md={8}>
              <Card bordered>
                <Skeleton.Image active style={{ width: '100%', height: 220 }} />
                <Skeleton active paragraph={{ rows: 2 }} style={{ marginTop: 16 }} />
              </Card>
            </Col>
          ))}
        </Row>
      ) : error ? (
        <div style={{ marginTop: 16 }}>
          <Empty description="Ürünleri yüklerken hata oluştu." />
        </div>
      ) : (
        <>
          <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
            {shown.map((p) => (
              <Col key={p.id} xs={24} sm={12} md={8}>
                <Card
                  bordered
                  hoverable={false}
                  bodyStyle={{ padding: 16 }}
                  cover={
                    <div
                      style={{
                        background: '#f5f5f5',
                        height: 220,
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <img
                        src={String(p.image)}
                        alt={p.title}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          const tried = img.getAttribute('data-fallback') === '1';
                          if (!tried) {
                            img.setAttribute('data-fallback', '1');
                            img.src = toGithubRaw(String(p.image));
                          } else {
                            img.src = PLACEHOLDER;
                          }
                        }}
                        style={{
                          maxHeight: 180,
                          maxWidth: '100%',
                          objectFit: 'contain',
                          display: 'block',
                        }}
                      />
                    </div>
                  }
                  actions={[
                    <Button
                      key="add"
                      type="primary"
                      shape="round"
                      onClick={() => handleAddToCart(p)}
                    >
                      Add to cart
                    </Button>,
                  ]}
                >
                  <Title level={5} style={{ marginBottom: 4 }}>
                    {p.title}
                  </Title>
                  <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ marginBottom: 6 }}>
                    {p.description}
                  </Paragraph>
                  <Text type="secondary" style={{ display: 'block', marginBottom: 6 }}>
                    {labelize((p as any).category ?? '')}
                  </Text>
                  <Text strong>{formatPrice(p.price as any)}</Text>
                </Card>
              </Col>
            ))}
          </Row>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
            <Button
              onClick={() => setVisibleCount((c) => c + 6)}
              disabled={visibleCount >= list.length}
            >
              Load more products
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

const ProductsPage: React.FC = () => (
  <Provider store={store}>
    <ProductsList />
  </Provider>
);

export default ProductsPage;
