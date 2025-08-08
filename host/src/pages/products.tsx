import React, { useEffect, useRef } from 'react';
import Nav from '../components/Nav';

export default function Products() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      console.log('Host received message:', e.data);
      if (e.data?.type === 'ADD_TO_CART') {
        const prev = JSON.parse(localStorage.getItem('mf-cart') || '[]');
        prev.push(e.data.item);
        localStorage.setItem('mf-cart', JSON.stringify(prev));
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
        src="http://localhost:3001"
        style={{ width: '100%', height: '80vh', border: 'none' }}
        title="Products Remote"
      />
    </div>
  );
}
