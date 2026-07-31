/**
 * BEC Club Hub — Client-Side Keyword Recommender Engine
 * No external APIs. Pure TypeScript. Runs entirely in the browser.
 */

import { CLUBS_DATA, TRENDING_CLUBS, type ClubData } from '@/lib/clubs-data';

// Common English stop-words to ignore during tokenisation
const STOP_WORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've",
  "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his',
  'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself',
  'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this',
  'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the',
  'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for',
  'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after',
  'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over',
  'under', 'again', 'further', 'then', 'once', 'very', 'so', 'just', 'than', 'too',
  'also', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'own', 'same',
  'all', 'any', 'no', 'nor', 'not', 'only', 'really', 'like', 'love', 'enjoy', 'want',
  'would', 'could', 'should', 'can', 'may', 'might', 'shall', 'will', 'need', 'must',
  'when', 'where', 'why', 'how', 'much', 'many', 'get', 'got', 'let', 'lot',
]);

export interface ClubRecommendation {
  club: ClubData;
  matchPercent: number;
  matchedKeywords: string[];
  isTrending?: boolean;
}

/**
 * Tokenise free-form text into clean lowercase words.
 * Strips punctuation, removes stop-words, deduplicates.
 */
export function tokenize(input: string): string[] {
  const raw = input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')  // strip punctuation
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));

  // Also build bigrams (two-word phrases) so tags like "machine learning" match
  const bigrams: string[] = [];
  const words = input.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.push(`${words[i]} ${words[i + 1]}`);
  }

  return [...new Set([...raw, ...bigrams])];
}

/**
 * Score a single club against a list of user tokens.
 * Returns matched keywords and a 0-100 match percent.
 */
function scoreClub(
  tokens: string[],
  club: ClubData,
): { matchedKeywords: string[]; matchPercent: number } {
  const tagSet = new Set(club.tags as readonly string[]);
  const matchedKeywords: string[] = [];

  for (const token of tokens) {
    if (tagSet.has(token)) {
      matchedKeywords.push(token);
    }
  }

  // Match percent: ratio of matched tags to total tags, capped at 100 and scaled
  // to feel punchy. We use matched / total_tags * 100 then apply a sqrt curve so
  // even 1-2 matches already show a meaningful %, making the UI feel responsive.
  const raw = matchedKeywords.length / club.tags.length;
  const matchPercent = Math.min(100, Math.round(Math.sqrt(raw) * 140));

  return { matchedKeywords, matchPercent };
}

/**
 * Main entry point.
 * Returns top 3 clubs by score. If no club scores > 0, returns trending clubs instead.
 */
export function getTopRecommendations(input: string): ClubRecommendation[] {
  if (!input.trim()) return [];

  const tokens = tokenize(input);

  const scored = (CLUBS_DATA as unknown as ClubData[]).map((club) => {
    const { matchedKeywords, matchPercent } = scoreClub(tokens, club);
    return { club, matchPercent, matchedKeywords };
  });

  const top = scored
    .filter((r) => r.matchedKeywords.length > 0)
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, 3);

  if (top.length === 0) {
    // Fallback: return trending clubs with isTrending flag
    return (TRENDING_CLUBS as unknown as ClubData[]).map((club) => ({
      club,
      matchPercent: 0,
      matchedKeywords: [],
      isTrending: true,
    }));
  }

  return top;
}
