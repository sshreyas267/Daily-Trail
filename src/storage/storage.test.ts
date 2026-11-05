import { describe, expect, it } from 'vitest';
import { clearAll, createMemoryBackend, createStore } from './index';

describe('storage', () => {
  it('saves and loads values, kept apart by namespace', () => {
    const backend = createMemoryBackend();
    const live = createStore('live', backend);
    const test = createStore('test', backend);
    live.save('streak', { count: 3 });
    expect(live.load('streak')).toEqual({ count: 3 });
    expect(test.load('streak')).toBeNull();
  });

  it('returns null for damaged data instead of throwing', () => {
    const backend = createMemoryBackend();
    backend.setItem('daily-trail:live:game', '{not json');
    expect(createStore('live', backend).load('game')).toBeNull();
  });

  it('keeps working when saving fails', () => {
    const backend = createMemoryBackend();
    backend.setItem = () => {
      throw new Error('full');
    };
    expect(() => createStore('live', backend).save('game', 1)).not.toThrow();
  });

  it('clears only keys that belong to the game', () => {
    const backend = createMemoryBackend();
    backend.setItem('someone-else', 'keep');
    createStore('live', backend).save('a', 1);
    createStore('test', backend).save('b', 2);
    clearAll(backend);
    expect(backend.length).toBe(1);
    expect(backend.getItem('someone-else')).toBe('keep');
  });
});
