// basket-remote/src/components/BasketListPage.tsx
import React from 'react';
import {
  List,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Divider,
  Empty,
  Grid,
} from 'antd';
import {
  MinusOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

const STORAGE_KEY = 'mf-cart'; 
const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
       <rect width='100%' height='100%' fill='#f5f5f5'/>
       <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
         fill='#bfbfbf' font-family='Arial, sans-serif' font-size='12'>no image</text>
     </svg>`
  );
const toGithubRaw = (src: string) => {
  const file = (src || '').split('/').pop() || '';
  return `https://raw.githubusercontent.com/keikaavousi/fake-store-api/master/public/img/${file}`;
};

const fmt = (n: number) => `$${(Number(n) || 0).toFixed(2)}`;

const readCart = (): Product[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};
const writeCart = (items: Product[]) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

/** ayni urunden olanlar */
function groupByProduct(items: Product[]) {
  const map = new Map<number, { product: Product; qty: number }>();
  items.forEach((p) => {
    const prev = map.get(p.id);
    if (prev) prev.qty += 1;
    else map.set(p.id, { product: p, qty: 1 });
  });
  return Array.from(map.values());
}

const BasketListPage: React.FC = () => {
  const screens = useBreakpoint();
  const [items, setItems] = React.useState<Product[]>([]);

  const update = React.useCallback((next: Product[], notifyHost = true) => {
    setItems(next);
    writeCart(next);
    if (notifyHost) {
      try {
        window.parent.postMessage({ type: 'CART_UPDATED', items: next }, '*');
      } catch {}
    }
  }, []);

  React.useEffect(() => {
    setItems(readCart());
  }, []);
  React.useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const { type, items: incoming, item } = e.data || {};
      if ((type === 'INIT_CART' || type === 'CART_STATE') && Array.isArray(incoming)) {
        update(incoming, false);
      }
      if (type === 'ADD_TO_CART' && item) {
        update([...readCart(), item]);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [update]);
  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(readCart());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const lines = React.useMemo(() => groupByProduct(items), [items]);
  const subtotal = React.useMemo(
    () => lines.reduce((sum, l) => sum + l.product.price * l.qty, 0),
    [lines]
  );

  const increase = (p: Product) => update([...items, p]);
  const decrease = (p: Product) => {
    const idx = items.findIndex((x) => x.id === p.id);
    if (idx > -1) {
      const next = items.slice();
      next.splice(idx, 1);
      update(next);
    }
  };
  const removeLine = (p: Product) => update(items.filter((x) => x.id !== p.id));
  const ProductImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
    const size = screens.xs ? 120 : 96;
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={(e) => {
          const img = e.currentTarget as HTMLImageElement;
          const tried = img.getAttribute('data-fallback') || '0';
          if (tried === '0') {
            img.setAttribute('data-fallback', '1');
            img.src = toGithubRaw(src);
          } else {
            img.src = PLACEHOLDER;
          }
        }}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          border: '1px solid #eee',
          borderRadius: 8,
          backgroundColor: '#fafafa',
          display: 'block',
        }}
      />
    );
  };

  return (
    <div style={{ maxWidth: 800, margin: '24px auto', padding: 16 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 16 }}>
        Shopping cart
      </Title>

      {lines.length === 0 ? (
        <Empty description="Sepetiniz boş." style={{ margin: '48px 0' }} />
      ) : (
        <>
          <List
            itemLayout="vertical"
            dataSource={lines}
            split
            renderItem={({ product: p, qty }) => (
              <List.Item>
                <Row gutter={[16, 8]} align="middle">
                  <Col xs={24} sm={6} md={5} style={{ display: 'flex', justifyContent: screens.xs ? 'center' : 'flex-start' }}>
                    <ProductImage src={p.image} alt={p.title} />
                  </Col>
                  <Col xs={24} sm={12} md={13}>
                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                      <Title level={5} style={{ margin: 0 }}>
                        {p.title}
                      </Title>
                      <Text type="secondary">Color: <strong>Yellow</strong> · Size: <strong>S</strong></Text>

                      <Space align="center" wrap>
                        <Text type="success">✔ In stock</Text>
                        <Space.Compact>
                          <Button
                            aria-label="Decrease quantity"
                            icon={<MinusOutlined />}
                            onClick={() => (qty > 1 ? decrease(p) : removeLine(p))}
                            size="small"
                          />
                          <Button disabled size="small" style={{ pointerEvents: 'none', width: 40 }}>
                            {qty}
                          </Button>
                          <Button
                            aria-label="Increase quantity"
                            icon={<PlusOutlined />}
                            onClick={() => increase(p)}
                            size="small"
                          />
                        </Space.Compact>
                        <Button
                          type="link"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeLine(p)}
                        >
                          Remove
                        </Button>
                      </Space>
                    </Space>
                  </Col>

                  <Col xs={24} sm={6} md={6} style={{ textAlign: screens.xs ? 'right' : 'right' }}>
                    <div>
                      <Text type="secondary">
                        {fmt(p.price)} × {qty}
                      </Text>
                    </div>
                    <Title level={4} style={{ margin: 0 }}>
                      {fmt(p.price * qty)}
                    </Title>
                  </Col>
                </Row>
              </List.Item>
            )}
          />

          <Divider style={{ margin: '16px 0' }} />

          <Row justify="space-between" align="middle" style={{ marginTop: 8 }}>
            <Col>
              <Text strong>Subtotal</Text>
            </Col>
            <Col>
              <Title level={4} style={{ margin: 0 }}>
                {fmt(subtotal)}
              </Title>
            </Col>
          </Row>

          <Button
            type="primary"
            size="large"
            block
            style={{ marginTop: 12, borderRadius: 8 }}
          >
            Checkout
          </Button>

          <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 8, fontSize: 12 }}>
            Shipping, taxes, and discount codes calculated at checkout.
          </Text>
        </>
      )}
    </div>
  );
};

export default BasketListPage;
