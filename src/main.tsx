import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <h1 style={{ fontFamily: 'var(--font-display)', textAlign: 'center' }}>Daily Trail</h1>
  </StrictMode>,
);
