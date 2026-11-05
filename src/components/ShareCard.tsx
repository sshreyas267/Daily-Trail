import { useEffect, useRef, useState } from 'react';
import { track } from '../analytics';

type Props = { text: string; score: number };
type Status = 'idle' | 'copied' | 'blocked';

export function ShareCard({ text, score }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const fallbackRef = useRef<HTMLTextAreaElement>(null);
  const canShare = typeof navigator.share === 'function';

  useEffect(() => {
    if (status === 'blocked') fallbackRef.current?.select();
  }, [status]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      track('share_copied', { score, method: 'copy' });
      setStatus('copied');
    } catch {
      setStatus('blocked');
    }
  };

  const share = async () => {
    try {
      await navigator.share({ text });
      track('share_copied', { score, method: 'share' });
    } catch (error) {
      // The player closing the share sheet is not a failure, and not a share.
      if ((error as Error).name !== 'AbortError') void copy();
    }
  };

  return (
    <section className="share-card" aria-labelledby="share-title">
      <h2 id="share-title" className="subheading">
        Share your result
      </h2>
      <pre className="share-preview">{text}</pre>
      <div className="share-actions">
        {canShare && (
          <button className="button" type="button" onClick={share}>
            Share
          </button>
        )}
        <button className={`button${canShare ? ' button-secondary' : ''}`} type="button" onClick={copy}>
          Copy
        </button>
      </div>
      <p className="muted" role="status">
        {status === 'copied' && 'Copied. Paste it anywhere.'}
      </p>
      {status === 'blocked' && (
        <div className="share-fallback">
          <label className="field-label" htmlFor="share-fallback">
            This browser blocked copying. Select this text and copy it yourself.
          </label>
          <textarea
            id="share-fallback"
            ref={fallbackRef}
            readOnly
            rows={5}
            value={text}
            onFocus={(event) => event.target.select()}
            onCopy={() => track('share_copied', { score, method: 'manual' })}
          />
        </div>
      )}
    </section>
  );
}
