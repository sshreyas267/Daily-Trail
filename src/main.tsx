import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { createSession, parseOverrides, withoutReset } from './game/session';
import { defaultBackend } from './storage';
import './styles/tokens.css';
import './styles/app.css';

const { search, pathname, hash } = window.location;
const session = createSession(search, new Date(), defaultBackend());
if (parseOverrides(search).reset) {
  window.history.replaceState(null, '', `${pathname}${withoutReset(search)}${hash}`);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App session={session} />
  </StrictMode>,
);
