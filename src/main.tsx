import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initAnalytics, track } from './analytics';
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

initAnalytics({
  store: session.store,
  hunt: session.dayNumber,
  puzzle: session.hunt.day,
  dev: session.mode !== 'live',
});
if (session.streakChange?.type === 'freeze_used') {
  const { streak, freezes_left } = session.streakChange;
  track('streak_freeze_used', { streak, freezes_left });
}
if (session.streakChange?.type === 'broken') {
  track('streak_broken', { previous_streak: session.streakChange.previous_streak });
}
track('hunt_viewed', {
  streak: session.streak?.count ?? 0,
  is_new_player: session.isNewPlayer,
  days_since_last: session.daysSinceLast,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App session={session} />
  </StrictMode>,
);
