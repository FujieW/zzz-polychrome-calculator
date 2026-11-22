#!/usr/bin/env node
import { pathToFileURL } from 'node:url';
/**
 * Zero-dependency CLI Polychrome & Markov Soft-Pity Calculator for Zenless Zone Zero.
 * Mirrors the client-side probability model at https://polychromecalculator.com/
 */

const MODELS = {
  agent: {
    label: 'Exclusive Channel (Agent)',
    hard: 90,
    base: 0.006,
    soft: 74,
    inc: 0.06,
    feat: 0.5,
  },
  engine: {
    label: 'W-Engine Channel',
    hard: 80,
    base: 0.01,
    soft: 65,
    inc: 0.07,
    feat: 0.75,
  },
};

export function singlePullSrate(model, pullNumber) {
  if (pullNumber >= model.hard) return 1;
  if (pullNumber < model.soft) return model.base;
  return Math.min(0.99, model.base + model.inc * (pullNumber - model.soft + 1));
}

export function simulateFeaturedOdds(model, pulls, startPity = 0, guaranteed = false) {
  const maxCopies = 2;
  let states = new Map([[`${startPity}|${guaranteed ? 1 : 0}|0`, 1]]);

  for (let i = 0; i < pulls; i++) {
    const next = new Map();
    for (const [key, prob] of states.entries()) {
      const [pity, guar, copies] = key.split('|').map(Number);
      if (copies >= maxCopies) {
        next.set(key, (next.get(key) || 0) + prob);
        continue;
      }
      const q = singlePullSrate(model, pity + 1);
      const missKey = `${pity + 1}|${guar}|${copies}`;
      next.set(missKey, (next.get(missKey) || 0) + prob * (1 - q));

      const winKey = `0|0|${copies + 1}`;
      if (guar === 1) {
        next.set(winKey, (next.get(winKey) || 0) + prob * q);
      } else {
        next.set(winKey, (next.get(winKey) || 0) + prob * q * model.feat);
        const loseKey = `0|1|${copies}`;
        next.set(loseKey, (next.get(loseKey) || 0) + prob * q * (1 - model.feat));
      }
    }
    states = next;
  }

  let atLeastOne = 0;
  let atLeastTwo = 0;
  for (const [key, prob] of states.entries()) {
    const copies = Number(key.split('|')[2]);
    if (copies >= 1) atLeastOne += prob;
    if (copies >= 2) atLeastTwo += prob;
  }
  return { atLeastOne, atLeastTwo };
}

export function expectedPullsToFeatured(model, startPity = 0, guaranteed = false) {
  const worst = guaranteed ? model.hard - startPity : 2 * model.hard - startPity;
  let expected = 0;
  let dist = new Map([[`${startPity}|${guaranteed ? 1 : 0}`, 1]]);

  for (let step = 1; step <= worst; step++) {
    const next = new Map();
    let hitProb = 0;
    for (const [key, prob] of dist.entries()) {
      const [pity, guar] = key.split('|').map(Number);
      const q = singlePullSrate(model, pity + 1);
      const missKey = `${pity + 1}|${guar}`;
      next.set(missKey, (next.get(missKey) || 0) + prob * (1 - q));
      if (guar === 1) {
        hitProb += prob * q;
      } else {
        hitProb += prob * q * model.feat;
        next.set('0|1', (next.get('0|1') || 0) + prob * q * (1 - model.feat));
      }
    }
    expected += step * hitProb;
    dist = next;
  }
  return expected;
}

function formatPct(p, isGuaranteed) {
  if (isGuaranteed) return '100%';
  if (p <= 0) return '0%';
  const v = p * 100;
  if (v < 0.1) return '<0.1%';
  if (v > 99.9) return '>99.9%';
  return (v < 10 || v > 99 ? v.toFixed(1) : v.toFixed(0)) + '%';
}

function parseArgs(argv) {
  const opts = {
    channel: 'agent',
    poly: 8000,
    tapes: 12,
    pity: 20,
    guaranteed: false,
    days: 30,
    daily: 60,
    member: 0,
    shiyu: 780,
    assault: 300,
    hollow: 0,
    extraPoly: 0,
    extraTapes: 0,
    table: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    const next = argv[i + 1];
    if (arg === '--guaranteed') opts.guaranteed = true;
    else if (arg === '--table') opts.table = true;
    else if (arg === '--pass') opts.member = 90;
    else if (arg === '--channel' && next) { opts.channel = next; i++; }
    else if (arg === '--poly' && next) { opts.poly = Number(next); i++; }
    else if (arg === '--tapes' && next) { opts.tapes = Number(next); i++; }
    else if (arg === '--pity' && next) { opts.pity = Number(next); i++; }
    else if (arg === '--days' && next) { opts.days = Number(next); i++; }
    else if (arg === '--shiyu' && next) { opts.shiyu = Number(next); i++; }
    else if (arg === '--assault' && next) { opts.assault = Number(next); i++; }
    else if (arg === '--hollow' && next) { opts.hollow = Number(next); i++; }
    else if (arg === '--extra-poly' && next) { opts.extraPoly = Number(next); i++; }
    else if (arg === '--extra-tapes' && next) { opts.extraTapes = Number(next); i++; }
  }
  return opts;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const opts = parseArgs(process.argv);
  const model = MODELS[opts.channel] || MODELS.agent;
  const clampedPity = Math.max(0, Math.min(model.hard - 1, Math.floor(opts.pity)));

  if (opts.table) {
    console.log(`=== ${model.label} · Featured S-Rank Odds from 0 Pity (No Guarantee) ===`);
    console.log('Pulls | >=1 Featured | >=2 Copies');
    console.log('------+--------------+-----------');
    const max = 2 * model.hard;
    for (let p = 10; p <= max; p += 10) {
      const res = simulateFeaturedOdds(model, p, 0, false);
      console.log(
        `${String(p).padStart(5)} | ${formatPct(res.atLeastOne, p >= max).padStart(12)} | ${formatPct(res.atLeastTwo, false).padStart(10)}`
      );
    }
    process.exit(0);
  }

  const income =
    opts.days * (opts.daily + opts.member) +
    Math.floor(opts.days / 14) * (opts.shiyu + opts.assault) +
    Math.floor(opts.days / 7) * opts.hollow +
    opts.extraPoly;

  const totalPoly = opts.poly + income;
  const pulls = Math.floor(totalPoly / 160) + opts.tapes + opts.extraTapes;
  const leftover = totalPoly % 160;
  const worst = opts.guaranteed ? model.hard - clampedPity : 2 * model.hard - clampedPity;
  const expected = Math.round(expectedPullsToFeatured(model, clampedPity, opts.guaranteed));
  const odds = simulateFeaturedOdds(model, Math.min(pulls, 400), clampedPity, opts.guaranteed);
  const shortPulls = Math.max(0, worst - pulls);
  const shortPoly = shortPulls > 0 ? Math.max(0, shortPulls * 160 - leftover) : 0;

  console.log(`=== ZZZ Polychrome & Pull Projection (${opts.days} days) ===`);
  console.log(`Channel            : ${model.label}`);
  console.log(`Starting Stash     : ${opts.poly.toLocaleString('en-US')} Polychromes + ${opts.tapes} Tapes (${clampedPity} pity${opts.guaranteed ? ', guaranteed' : ''})`);
  console.log(`Projected Income   : +${income.toLocaleString('en-US')} Polychromes`);
  console.log(`Total by Target    : ${pulls.toLocaleString('en-US')} Pulls (${leftover} / 160 Polychromes left over)`);
  console.log(`Featured Odds      : ${formatPct(odds.atLeastOne, pulls >= worst)} (>=1 copy) · ${formatPct(odds.atLeastTwo, pulls >= worst + 2 * model.hard)} (2 copies)`);
  console.log(`Guarantee / Expect : ${worst} worst-case pulls · ~${expected} expected pulls`);
  console.log(
    shortPulls === 0
      ? `Status             : Guaranteed! (${pulls - worst} pulls to spare)`
      : `Shortfall          : ${shortPulls} pulls (${shortPoly.toLocaleString('en-US')} Polychromes) short of worst-case guarantee`
  );
  console.log(`Interactive Web UI : https://polychromecalculator.com/`);
}
