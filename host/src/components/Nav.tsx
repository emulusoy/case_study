// host/src/components/Nav.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  ConfigProvider,
  Drawer,
  Grid,
  Layout,
  Menu,
  Space,
  Badge,
} from 'antd';
import {
  SoundOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  MenuOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';

const { Header } = Layout;
const { useBreakpoint } = Grid;

const STORAGE_KEY = 'mf-cart'; // basket/products ile aynı olmalı

const items = [
  { key: 'products', label: 'Products' },
  { key: 'docs', label: 'Docs' },
  { key: 'about', label: 'About us' },
  { key: 'pricing', label: 'Pricing' },
];

type Props = {
  onSignIn?: () => void;
  onSignUp?: () => void;
};

function readCartCount(): number {
  try {
    const arr = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(arr) ? arr.length : 0;
  } catch {
    return 0;
  }
}

export default function Navbar({ onSignIn, onSignUp }: Props) {
  const router = useRouter();
  const [showBanner, setShowBanner] = useState(true);
  const [open, setOpen] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md; // md altı: mobil

  // Cart badge
  const [cartCount, setCartCount] = useState(0);
  useEffect(() => {
    setCartCount(readCartCount());

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setCartCount(readCartCount());
    };
    window.addEventListener('storage', onStorage);

    const onMessage = (e: MessageEvent) => {
      const { type, item, items } = (e.data || {}) as any;
      const isOnBasket =
        typeof window !== 'undefined' &&
        window.location.pathname.startsWith('/basket');

      if (type === 'ADD_TO_CART' && item) {
        if (!isOnBasket) {
          try {
            const cur = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            const next = Array.isArray(cur) ? [...cur, item] : [item];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            setCartCount(next.length);
          } catch {}
        }
      }
      if ((type === 'INIT_CART' || type === 'CART_STATE') && Array.isArray(items)) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
          setCartCount(items.length);
        } catch {}
      }
      if (type === 'CART_UPDATED' && Array.isArray(items)) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
          setCartCount(items.length);
        } catch {}
      }
    };
    window.addEventListener('message', onMessage);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('message', onMessage);
    };
  }, []);

  // Menü seçili anahtarları yol’a göre ayarla
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  useEffect(() => {
    const path = router.pathname;
    const key =
      path.startsWith('/products') ? 'products' :
      path.startsWith('/docs') ? 'docs' :
      path.startsWith('/about') ? 'about' :
      path.startsWith('/pricing') ? 'pricing' : '';
    setSelectedKeys(key ? [key] : []);
  }, [router.pathname]);

  // Menü tıklama → yönlendirme
  const handleMenuClick = (e: { key: string }) => {
    switch (e.key) {
      case 'products':
        router.push('/products');
        break;
      case 'docs':
        router.push('/docs');
        break;
      case 'about':
        router.push('/about');
        break;
      case 'pricing':
        router.push('/pricing');
        break;
      default:
        break;
    }
    setOpen(false);
  };

  const containerStyle: React.CSSProperties = useMemo(
    () => ({
      maxWidth: 1120,
      margin: '0 auto',
      padding: '0 16px',
      height: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
    }),
    []
  );

  const Logo = (
    <div
      onClick={() => router.push('/')}
      role="button"
      title="Home"
      style={{
        width: 28,
        height: 28,
        display: 'grid',
        placeItems: 'center',
        borderRadius: 8,
        background: '#1463e2',
        cursor: 'pointer',
      }}
    >
      <ShoppingOutlined style={{ fontSize: 16, color: '#fff' }} />
    </div>
  );

  const CartButton = (
    <Badge count={cartCount} showZero overflowCount={99} size="small">
      <Button
        type="text"
        aria-label="Go to basket"
        onClick={() => {
          setOpen(false);
          router.push('/basket');
        }}
        icon={<ShoppingCartOutlined style={{ fontSize: 20 }} />}
      />
    </Badge>
  );

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: '#1463e2', borderRadius: 8 },
      }}
    >
      <Layout style={{ background: 'transparent' }}>
        {showBanner && (
          <Alert
            banner
            closable
            onClose={() => setShowBanner(false)}
            showIcon={false}
            message={
              <Space>
                <SoundOutlined />
                New update! New features available, bug fixes + more!
              </Space>
            }
            style={{
              background: '#1463e2',
              color: '#fff',
              border: 'none',
            }}
            closeText={<span style={{ color: '#fff' }}>✕</span>}
          />
        )}

        <Header
          style={{
            background: '#fff',
            padding: 0,
            boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
          }}
        >
          <div style={containerStyle}>
            {/* Sol: logo (anasayfa) */}
            {Logo}

            {/* Sağ: Masaüstü */}
            {!isMobile ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <Menu
                  mode="horizontal"
                  items={items}
                  selectedKeys={selectedKeys}
                  onClick={handleMenuClick}
                  style={{ borderBottom: 'none' }}
                />
                {CartButton}
                <Space size="middle">
                  <Button type="text" onClick={onSignIn}>
                    Sign in
                  </Button>
                  <Button type="primary" shape="round" onClick={onSignUp}>
                    Sign up
                  </Button>
                </Space>
              </div>
            ) : (
              // Mobil: sepet + hamburger
              <Space size="small">
                {CartButton}
                <Button
                  type="text"
                  icon={<MenuOutlined />}
                  onClick={() => setOpen(true)}
                  aria-label="Open menu"
                  style={{ fontSize: 20 }}
                />
              </Space>
            )}
          </div>
        </Header>

        {/* Mobil Drawer */}
        <Drawer
          placement="top"
          open={open}
          closable={false}
          onClose={() => setOpen(false)}
          height="100vh"
          bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column' }}
        >
          {/* Drawer üst barı (logo + sepet + kapat) */}
          <div style={containerStyle}>
            {Logo}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              {CartButton}
              <Button
                type="text"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: '#f2f3f5',
                  display: 'grid',
                  placeItems: 'center',
                }}
                icon={<CloseOutlined />}
              />
            </div>
          </div>

          {/* Menü listesi (mobil) */}
          <div style={{ padding: '8px 8px 0' }}>
            <Menu
              mode="inline"
              items={items}
              selectedKeys={selectedKeys}
              onClick={handleMenuClick}
              style={{ borderRight: 'none', fontSize: 16 }}
            />
          </div>

          {/* CTA alt sabit alan */}
          <div
            style={{
              marginTop: 'auto',
              padding: 16,
              borderTop: '1px solid #f0f0f0',
              background: '#fff',
            }}
          >
            <Button
              type="primary"
              shape="round"
              size="large"
              block
              onClick={() => {
                setOpen(false);
                onSignUp?.();
              }}
            >
              Sign up
            </Button>
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <Button
                type="link"
                onClick={() => {
                  setOpen(false);
                  onSignIn?.();
                }}
              >
                Sign in
              </Button>
            </div>
          </div>
        </Drawer>
      </Layout>
    </ConfigProvider>
  );
}
