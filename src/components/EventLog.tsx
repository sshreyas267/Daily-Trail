import { useRef, useState } from 'react';
import { getEvents, type AnalyticsEvent } from '../analytics';

function exportEvents(events: AnalyticsEvent[]) {
  const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'daily-trail-events.json';
  link.click();
  URL.revokeObjectURL(url);
}

export function EventLog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  const open = () => {
    setEvents(getEvents());
    dialogRef.current?.showModal();
  };

  return (
    <footer className="site-footer">
      <button className="link-button" type="button" onClick={open}>
        Event log
      </button>
      <dialog ref={dialogRef} className="event-log" aria-labelledby="event-log-title">
        <h2 id="event-log-title" className="subheading">
          Event log
        </h2>
        <p className="muted">
          {events.length} {events.length === 1 ? 'event' : 'events'}, newest first. They stay in this browser.
        </p>
        <div className="event-log-actions">
          <button className="button" type="button" onClick={() => exportEvents(getEvents())}>
            Export events (JSON)
          </button>
          <button className="button button-secondary" type="button" onClick={() => dialogRef.current?.close()}>
            Close
          </button>
        </div>
        <ol className="event-list">
          {[...events].reverse().map((event, index) => (
            <li key={events.length - index}>
              <strong>{event.name}</strong>
              <code>{JSON.stringify(event.props)}</code>
            </li>
          ))}
        </ol>
      </dialog>
    </footer>
  );
}
