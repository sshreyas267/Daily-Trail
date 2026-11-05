import type { Stage } from '../data/hunts';

export function normalizeAnswer(input: string): string {
  const cleaned = input
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .trim()
    .replace(/\s+/g, ' ');
  return cleaned.replace(/^(a|an|the) (?=\S)/, '');
}

export function checkAnswer(stage: Pick<Stage, 'accept'>, input: string): boolean {
  const answer = normalizeAnswer(input);
  if (!answer) return false;
  return stage.accept.some((accepted) => normalizeAnswer(accepted) === answer);
}
