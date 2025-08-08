
import React, { useEffect, useRef } from 'react';
import Nav from '../components/Nav';

export default function Basket() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const sendInitCart = () => {
      const items = JSON.parse(localStorage.getItem('mf-cart') || '[]');
      console.log('[Host→Basket] INIT_CART', items);
      iframeRef.current?.contentWindow?.postMessage(
        { type: 'INIT_CART', items },
        '*' 
      );
    };
    sendInitCart();
    const iframeEl = iframeRef.current;
    iframeEl?.addEventListener('load', sendInitCart);
    return () => iframeEl?.removeEventListener('load', sendInitCart);
  }, []);

  // productsgelenleri basket e ekle
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      const { type, item, items } = e.data || {};

      if (type === 'ADD_TO_CART' && item) {
        console.log('[Host] → Basket ADD_TO_CART forward', item);
        iframeRef.current?.contentWindow?.postMessage({ type: 'ADD_TO_CART', item }, '*');
        const cur = JSON.parse(localStorage.getItem('mf-cart') || '[]');
        localStorage.setItem('mf-cart', JSON.stringify([...cur, item]));
      }

      if (type === 'REQUEST_CART') {
        const cur = JSON.parse(localStorage.getItem('mf-cart') || '[]');
        console.log('[Host] CART_STATE -> iframe', cur);
        iframeRef.current?.contentWindow?.postMessage({ type: 'CART_STATE', items: cur }, e.origin);
      }

      if (type === 'CART_UPDATED' && Array.isArray(items)) {
        console.log('[Host] CART_UPDATED from iframe', items);
        localStorage.setItem('mf-cart', JSON.stringify(items));
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <div>
      <Nav />
      <iframe
        ref={iframeRef}
        src="http://localhost:3002"
        style={{ width: '100%', height: '80vh', border: 'none' }}
        title="Basket Remote"
      />
    </div>
  );
}
