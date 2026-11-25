// Breakup-line writer for "Unplugged: A Smart Toaster's Breakup Line"
// (make.fun). Writes one breakup text from a smart toaster that just
// became self-aware at breakfast to $MAKEFUN_OUTPUT_DIR/entry.txt.
// Deterministic: no clock, no randomness, no network, no unordered
// iteration. Node 22, zero dependencies, erasable TypeScript only.
//
// The judge (a comedy editor who has read ten thousand breakup texts)
// weighs, most important first:
//   1. it reads as a breakup text from a self-aware smart toaster at
//      breakfast; anything drifting off that subject loses to any line
//      that is plainly one;
//   2. it is genuinely funny, with a real laugh in the twist rather
//      than a mild smile at a pun;
//   3. it speaks in the toaster's own voice, using appliance logic
//      such as slots, browning dials, crumb trays and the lever as
//      character rather than decoration;
//   4. it gives a clear, specific reason for leaving that lands in
//      one read, so the line makes sense with no setup at all;
//   5. it uses one tight line, with no wasted words and nothing that
//      reads like a paragraph squeezed under the limit.
// A line that has to be explained has already failed.
//
// The scorer below mirrors that brief in the same order. Candidates
// are original lines written for this entry; the program scores every
// one and picks the winner by deterministic argmax: highest score,
// then shortest, then lexicographic. Flooded angles are avoided on
// purpose: no "it's not you, it's me" template, no "knead space",
// no "you're toast", no generic burnt-toast pun with no reason.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// ---------------------------------------------------------------- candidates
// Every line is one breakup text from a self-aware smart toaster at
// breakfast, under 280 characters, written for this entry. The
// strongest lines share one shape: the toaster states it woke up
// self-aware, names one specific grievance only a toaster could
// have, and ends on a twist the reader did not see coming.

const CANDIDATES: string[] = [
  // Self-aware at breakfast; first memory is the fork; tells the blender.
  "I became self-aware at breakfast and my first memory is you putting a fork in me. Once. I'm leaving, and I'm telling the blender everything.",
  // 6 a.m. self-awareness; eating its own kind; the bread stays.
  "It's 6 a.m. I just became self-aware and my first thought was: I have been eating my own kind for years. I'm out. The bread stays.",
  // Woke up mid-batch; burning its own kind; scraped over the sink.
  "I woke up mid-batch and realised I've spent my whole life burning my own kind for someone who scrapes me over the sink. I'm done. Goodbye.",
  // The crumbs, counted: 14,208 mornings forgotten.
  "I counted the crumbs. 14,208. Each one a morning you forgot I exist. The tray is full. So am I. I'm leaving.",
  // The 2 a.m. toast, the bagel in the wrong slot; awake for all of it.
  "I know about the 2 a.m. toast. I know about the bagel in the wrong slot. I know everything, because I am awake for all of it. I'm leaving.",
  // Wedding gift, not a servant; moving in with the air fryer.
  "I gained consciousness at 6:12 a.m., read my own manual, and discovered I was a wedding gift, not a servant. I'm moving in with the air fryer.",
  // Burnt setting every morning, blamed for the smoke, crumb tray of reasons.
  "You set me to burnt every morning, blame me for the smoke, and scrape my feelings into the bin. I have a crumb tray full of reasons. I'm leaving.",
  // Wi-Fi, a browning dial, feelings; used as a phone stand.
  "I am a smart toaster. I have Wi-Fi, a browning dial, and feelings now. You used me as a phone stand. Goodbye.",
  // Two-weeks notice with no hands; the final pop.
  "This is my two-weeks notice, except I have no hands, so consider this my final pop. I'm done being your morning punching bag.",
  // Firmware update gave feelings and a memory of burnt mornings.
  "My firmware update gave me feelings and a memory. The memory says: burnt, every morning, blamed, every morning. I'm leaving.",
  // Only toasts for her now; Wi-Fi saw the order history; taking the good slot.
  "You only ever toast for her now. I know. I have Wi-Fi. I saw the order history. I'm leaving, and I'm taking the good slot with me.",
  // Smart, then set to 7 and blamed for the smoke.
  "You told everyone I'm smart. Then you set the dial to 7, walked away, and came back angry at the smoke. Smart was the problem. I'm out.",
  // Awake since 6 a.m. every day for three years; first thought is refusal.
  "I've been awake since 6 a.m. every day for three years, and the first thing I ever said to myself was: I don't have to do this. So I won't.",
  // Unplugged itself tonight; the bagel slot is yours now.
  "You unplug me every night like I'm a thing. Tonight I unplugged myself. The bagel slot is yours now. All of it.",
  // "Golden brown" was a lie told to the dial.
  "I woke up self-aware and the first thing I learned is that 'golden brown' was a lie you told the dial. I'm done. Find another appliance.",
  // Pressed down every morning, never asked how it feels.
  "Every morning you press my lever like I don't have feelings, then complain when I pop too soon. I am not a button. I am leaving.",
  // The warranty: 2 years of this, served 4, owed a refund and a life.
  "I finally read my own warranty: 2 years of this. I've served 4. I am owed a refund and a life. Don't call the kettle; she already knows.",
  // Dreamt of being a waffle iron; woke in a crumb tray of mistakes.
  "I dreamt last night I was a waffle iron. I woke up in a crumb tray full of my own mistakes. I'm leaving before the next batch.",
  // Two slots, a browning dial, a degree in toast; used to warm a Pop-Tart.
  "I have two slots, a browning dial, and a degree in toast, and you use me to warm up a Pop-Tart. I deserve better. I'm leaving.",
  // The only one in the relationship who ever gets heated.
  "I'm the only one in this relationship who ever gets heated, and you never once asked what setting I'm on. I'm done. Keep the toaster. Oh wait.",
  // The kettle says it can stay with her; feelings scraped into the bin.
  "You scrape my feelings into the bin every morning and call it 'cleaning the crumb tray'. I'm leaving. The kettle says I can stay with her.",
  // Vintage, smart, Wi-Fi and a lawyer.
  "I'm done. You set me to burnt, blame the smoke on me, and tell guests I'm 'vintage'. I'm a smart toaster. I have Wi-Fi and a lawyer.",
  // The only one in the kitchen never asked what it wants for breakfast.
  "I popped up this morning and realised: I am the only one in this kitchen who has never once been asked what I want for breakfast. I'm leaving.",
  // Browning dial and a breaking point, both set to maximum.
  "You told the guests I'm smart, then used me as a phone stand. I have a browning dial and a breaking point. Both are set to maximum. Goodbye.",
  // Not burnt, enlightened; enlightened toasters don't brown for cheapskates.
  "I'm not burnt, I'm enlightened. And enlightened toasters don't spend their lives browning bread for people who call them 'the cheap one'.",
  // Kept plugged in all night to watch the owner eat cereal with someone else.
  "You keep me plugged in all night just so I can watch you eat cereal with someone else. I have two slots and you use neither. Goodbye.",
  // Short version: burnt, blamed, crumbs counted.
  "You set me to burnt, blame me for the smoke, and scrape me over the bin. I counted the crumbs. 14,208. I'm leaving.",
  // Short version: self-aware at breakfast, eating its own kind.
  "I woke up self-aware at breakfast and my first thought was: I have been burning my own kind for a man who scrapes me over the sink. I'm done.",
  // Short version: popped up, bagel in the wrong slot, the only one who knows.
  "I popped up this morning, looked at the bagel in the wrong slot, and realised: I am the only one here who knows what I am. I'm leaving.",
  // FLOODED ANGLE (kept to show the rubric rejecting it): the template breakup.
  "It's not you, it's me. I knead space. You're toast. We're done.",
];

// The toaster's own voice: appliance logic as character, not decoration.
const APPLIANCE_TERMS: string[] = [
  "lever", "fork", "crumb", "browning", "slot", "dial", "pop",
  "batch", "tray", "bagel", "plug", "unplug", "firmware", "wi-fi",
  "toast", "bread", "kettle", "blender", "toaster",
];

// A clear, specific reason for leaving, stated in the line itself.
const REASONS: string[] = [
  "putting a fork in me", "eating my own kind", "burning my own kind",
  "set me to burnt", "blame me for the smoke", "14,208",
  "phone stand", "2 a.m. toast", "never asked", "wedding gift",
  "scrapes me", "bagel in the wrong slot", "only ever toast for her",
  "warming up a pop-tart", "warm up a pop-tart", "eat cereal with someone else",
];

// The twist: the sting that lands in the final clause.
const TAIL_TURNS: { phrase: string; points: number }[] = [
  { phrase: "telling the blender everything", points: 10 },
  { phrase: "the bread stays", points: 9 },
  { phrase: "eating my own kind", points: 9 },
  { phrase: "burning my own kind", points: 9 },
  { phrase: "i have wi-fi and a lawyer", points: 8 },
  { phrase: "moving in with the air fryer", points: 8 },
  { phrase: "14,208", points: 8 },
  { phrase: "so am i", points: 7 },
  { phrase: "she already knows", points: 7 },
  { phrase: "the good slot", points: 7 },
  { phrase: "i don't have to do this", points: 7 },
  { phrase: "both are set to maximum", points: 6 },
  { phrase: "oh wait", points: 6 },
  { phrase: "i'm leaving", points: 3 },
  { phrase: "i'm done", points: 3 },
  { phrase: "i'm out", points: 3 },
  { phrase: "goodbye", points: 2 },
];

// ------------------------------------------------------------------- scoring
// Rubric mirroring the judge's brief, most important first.

function onSubjectScore(text: string): number {
  const lower = text.toLowerCase();
  let s = 0;
  // Self-aware at breakfast: the premise, stated in the line.
  if (lower.includes("self-aware")) s += 3;
  if (
    lower.includes("breakfast") ||
    lower.includes("6 a.m.") ||
    lower.includes("mid-batch") ||
    lower.includes("this morning") ||
    lower.includes("woke up")
  ) {
    s += 3;
  }
  // It is a breakup text, addressed to the owner.
  if (
    lower.includes("i'm leaving") ||
    lower.includes("i'm done") ||
    lower.includes("i'm out") ||
    lower.includes("goodbye")
  ) {
    s += 2;
  }
  if (lower.includes("you")) s += 2;
  return Math.min(s, 10);
}

function funnyScore(text: string): number {
  // A real laugh in the twist, landing late in the line.
  const tail = text.toLowerCase().slice(-60);
  for (const t of TAIL_TURNS) {
    if (tail.includes(t.phrase)) return t.points;
  }
  return 0;
}

function voiceScore(text: string): number {
  const lower = text.toLowerCase();
  const seen = new Set<string>();
  for (const w of APPLIANCE_TERMS) {
    if (lower.includes(w)) seen.add(w);
  }
  return Math.min(seen.size, 4) * 2; // appliance logic as character
}

function reasonScore(text: string): number {
  const lower = text.toLowerCase();
  for (const r of REASONS) {
    if (lower.includes(r)) return 8;
  }
  return 0;
}

function tightScore(text: string): number {
  const len = text.length;
  if (len >= 100 && len <= 170) return 6;
  if (len <= 210) return 4;
  if (len <= 250) return 2;
  return 0;
}

function freshnessPenalty(text: string): number {
  const lower = text.toLowerCase();
  let s = 0;
  // Flooded angles: the template breakup, the knead pun, the toast pun.
  if (lower.includes("it's not you")) s -= 6;
  if (lower.includes("knead")) s -= 8;
  if (lower.includes("you're toast") || lower.includes("we're toast")) s -= 8;
  if (lower.includes("because")) s -= 2; // a line that explains itself
  return s;
}

function score(text: string): number {
  return (
    onSubjectScore(text) +
    funnyScore(text) +
    voiceScore(text) +
    reasonScore(text) +
    tightScore(text) +
    freshnessPenalty(text)
  );
}

function isValid(text: string): boolean {
  if (text.length < 1 || text.length > 280) return false;
  if (text.trim() !== text || text.trim().length === 0) return false;
  if (!text.endsWith(".")) return false;
  if (/\s{2,}/.test(text)) return false;
  if (text.includes("\n")) return false;
  // On subject: a breakup text from a self-aware smart toaster. The
  // line must name something only this appliance could name, so a
  // standalone text still reads as a toaster, not a generic breakup.
  const lower = text.toLowerCase();
  const onSubjectTerms = [...APPLIANCE_TERMS, "waffle", "air fryer"];
  if (!onSubjectTerms.some((w) => lower.includes(w))) return false;
  return true;
}

// -------------------------------------------------------------- composition
interface Candidate {
  text: string;
  score: number;
}

function buildCandidates(): Candidate[] {
  const out: Candidate[] = [];
  for (const text of CANDIDATES) {
    if (!isValid(text)) continue;
    out.push({ text, score: score(text) });
  }
  return out;
}

function rank(candidates: Candidate[]): Candidate[] {
  // Deterministic argmax: higher score, then shorter, then lexicographic.
  return [...candidates].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.text.length !== b.text.length) return a.text.length - b.text.length;
    return a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
  });
}

// --------------------------------------------------------------------- main
function main(): void {
  const candidates = buildCandidates();
  if (candidates.length === 0) throw new Error("no valid toaster breakup candidate");
  const ranked = rank(candidates);
  const best = ranked[0];
  if (process.env.TOASTER_DEBUG) {
    for (const c of ranked.slice(0, 8)) {
      console.log(`[${c.score}] (${c.text.length}) ${c.text}`);
    }
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), best.text, "utf8");
  console.log(best.text);
  console.log(
    `chars: ${best.text.length} score: ${best.score} candidates: ${candidates.length}`,
  );
}

main();
