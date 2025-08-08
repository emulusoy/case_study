import React from 'react';

export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

const STORAGE_KEY = 'mf-cart';          
const HOST_ORIGIN = 'http://localhost:3000'; 

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
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

function readCart(): Product[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}
function writeCart(items: Product[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function groupByProduct(items: Product[]) {
  const map = new Map<number, { product: Product; qty: number }>();
  items.forEach((p) => {
    const prev = map.get(p.id);
    if (prev) prev.qty += 1;
    else map.set(p.id, { product: p, qty: 1 });
  });
  return Array.from(map.values());
}

const qtyBtn: React.CSSProperties = {
  width: 24,
  height: 24,
  lineHeight: '24px',
  textAlign: 'center',
  border: 'none',
  background: '#f0f0f0',
  borderRadius: 6,
  cursor: 'pointer',
  padding: 0,
};

const qtyWrap: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  background: '#fafafa',
  border: '1px solid #eee',
  borderRadius: 8,
  padding: '2px 8px',
};

const BasketListPage: React.FC = () => {
  const [items, setItems] = React.useState<Product[]>([]);

  const requestCartFromHost = React.useCallback(() => {
    try {
      window.parent.postMessage({ type: 'REQUEST_CART' }, HOST_ORIGIN);
    } catch {}
  }, []);

  const update = (next: Product[], notifyHost = true) => {
    setItems(next);
    writeCart(next);
    if (notifyHost) {
      try {
        window.parent.postMessage({ type: 'CART_UPDATED', items: next }, HOST_ORIGIN);
      } catch {}
    }
  };

  React.useEffect(() => {
    setItems(readCart());

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(readCart());
    };
    window.addEventListener('storage', onStorage);

    const onMessage = (e: MessageEvent) => {
      const { type, items: incoming } = e.data || {};
      if (type === 'CART_STATE' && Array.isArray(incoming)) {
        update(incoming, false);
      }
    };
    window.addEventListener('message', onMessage);

    requestCartFromHost();

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('message', onMessage);
    };
  }, [requestCartFromHost]);

  const lines = groupByProduct(items);
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);

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

  return (
    <div style={{ maxWidth: 720, margin: '2rem auto', padding: '1rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Shopping cart</h1>

      {lines.length === 0 ? (
        <>
          <p style={{ textAlign: 'center' }}>Sepetiniz boş.</p>
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={requestCartFromHost}
              style={{ border: '1px solid #eee', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }}
            >
              Host’tan sepeti getir
            </button>
          </div>
        </>
      ) : (
        <>
          {lines.map(({ product: p, qty }, i) => (
            <div key={`${p.id}-${i}`} style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    const tried = img.getAttribute('data-fallback') || '0';
                    if (tried === '0') {
                      img.setAttribute('data-fallback', '1');
                      img.src = toGithubRaw(p.image);
                    } else {
                      img.src = PLACEHOLDER;
                    }
                  }}
                  style={{
                    width: 96,
                    height: 96,
                    objectFit: 'contain',
                    border: '1px solid #eee',
                    borderRadius: 6,
                    backgroundColor: '#fafafa',
                    flexShrink: 0,
                  }}
                />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', lineHeight: 1.3 }}>{p.title}</h4>
                  <p style={{ margin: 0, fontSize: 13, color: '#555' }}>
                    Color: <strong>Yellow</strong> &nbsp;•&nbsp; Size: <strong>S</strong>
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, fontSize: 13 }}>
                    <span style={{ color: '#28a745' }}>✔ In stock</span>
                    <div style={qtyWrap}>
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => (qty > 1 ? decrease(p) : removeLine(p))}
                        style={qtyBtn}
                        title={qty > 1 ? 'Azalt' : 'Satırı kaldır'}
                      >
                        −
                      </button>
                      <span style={{ minWidth: 20, textAlign: 'center' }}>{qty}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => increase(p)}
                        style={qtyBtn}
                        title="Arttır"
                      >
                        +
                      </button>
                    </div>
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); removeLine(p); }}
                      style={{ marginLeft: 'auto', fontSize: 14, color: '#1677ff', textDecoration: 'none' }}
                    >
                      Remove
                    </a>
                  </div>
                </div>

                <div style={{ marginLeft: 'auto', textAlign: 'right', minWidth: 120 }}>
                  <div style={{ color: '#555', fontSize: 12 }}>
                    {fmt(p.price)} × {qty}
                  </div>
                  <strong style={{ fontSize: 16 }}>{fmt(p.price * qty)}</strong>
                </div>
              </div>

              {i < lines.length - 1 && (
                <hr style={{ border: 0, borderTop: '1px solid #eee', margin: '1rem 0' }} />
              )}
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1rem', marginTop: '2rem' }}>
            <span>Subtotal</span>
            <span>{fmt(subtotal)}</span>
          </div>

          <button
            style={{
              marginTop: '1rem',
              width: '100%',
              padding: '12px',
              backgroundColor: '#1677ff',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Checkout
          </button>

          <p style={{ fontSize: 12, color: '#555', marginTop: 8, textAlign: 'center' }}>
            Shipping, taxes, and discount codes calculated at checkout.
          </p>
        </>
      )}
    </div>
  );
};

export default BasketListPage;
