# ZZZ Polychrome Calculator & Soft-Pity Probability Model

[![Live Pull Planner](https://img.shields.io/badge/Live_Pull_Planner-polychromecalculator.com-d8fa00?style=flat-square&labelColor=0a0d12)](https://polychromecalculator.com/)
[![Pity & 50/50 Odds](https://img.shields.io/badge/Agent_%26_W--Engine_Odds-Pity_Calculator-22d3ee?style=flat-square&labelColor=0a0d12)](https://polychromecalculator.com/zzz-pity-calculator)
[![ZZZ Schedule](https://img.shields.io/badge/Schedule-Version_3.3_%26_3.4-ff7a2f?style=flat-square&labelColor=0a0d12)](https://polychromecalculator.com/zzz-upcoming-banners)
[![License: MIT](https://img.shields.io/badge/License-MIT-slate?style=flat-square)](./LICENSE)

Zero-dependency Node.js CLI calculator, exact Markov-chain soft-pity simulator, and open JSON dataset for **Zenless Zone Zero (ZZZ)** Signal Search pull planning.

Mirrors the client-side math running on **[Polychrome Calculator](https://polychromecalculator.com/)** — calculate projected **Polychromes**, **Encrypted Master Tapes**, worst-case guarantees, and featured S-Rank probabilities without sign-ups, UID tracking, or pull-history imports.

- **Interactive Browser Pull Planner:** [ZZZ Polychrome Calculator](https://polychromecalculator.com/)
- **Agent (50/50) & W-Engine (75/25) Odds Table:** [ZZZ Pity Calculator](https://polychromecalculator.com/zzz-pity-calculator)

---

## 1. Signal Search Pity & Soft-Pity Parameters

HoYoverse publishes the base rates, consolidated rates, hard pity, and featured win splits in-game. To match the published consolidated rates (`1.6%` for Exclusive Agents and `2.0%` for W-Engines), community models apply a linear soft-pity ramp in the final stretch before hard pity (see [`data/pity-models.json`](./data/pity-models.json)):

| Parameter | Exclusive Channel (Agents) | W-Engine Channel |
| :--- | :---: | :---: |
| **Polychromes per Pull** | `160` | `160` |
| **Published S-Rank Base Rate** | `0.6%` (pulls `1–73`) | `1.0%` (pulls `1–64`) |
| **Estimated Soft-Pity Ramp** | `+6.0%` / pull from pull `74` | `+7.0%` / pull from pull `65` (capped at `99%` on `78–79`) |
| **Hard Pity (100% S-Rank)** | `90` pulls | `80` pulls |
| **Featured Win Split** | `50 / 50` | `75 / 25` |
| **Worst-Case Guarantee (`0` Pity)** | **`180` pulls** (`28,800` Polychromes) | **`160` pulls** (`25,600` Polychromes) |
| **Published Consolidated Rate** | `1.6%` (~`62.5` pulls / S-Rank) | `2.0%` (~`50.2` pulls / S-Rank) |
| **Expected Pulls per Featured (`0` Pity)** | **`~93` pulls** | **`~63` pulls** |

> Need to check your current pity count in-game on PC, mobile, or PS5? See the step-by-step [ZZZ Pull History & Pity Guide](https://polychromecalculator.com/zzz-pull-history).

---

## 2. Pre-Computed Featured Odds Table (`0` Pity, Not Guaranteed)

Generated via exact state-transition Markov simulation (`node scripts/calc-pulls.mjs --table`):

| Pulls Spent | Exclusive Agent (`>=1` Copy) | Exclusive Agent (`M1` / `2+`) | Signature W-Engine (`>=1` Copy) | Signature W-Engine (`2+` Copies) |
| ---: | :---: | :---: | :---: | :---: |
| `20` | `6.0%` | `0.2%` | `14%` | `1.0%` |
| `40` | `12%` | `0.7%` | `26%` | `3.7%` |
| `60` | `18%` | `1.6%` | `37%` | `7.7%` |
| `70` | `21%` | `2.1%` | `73%` | `11%` |
| `80` | `51%` | `3.2%` | `82%` | `19%` |
| `90` | `59%` | `5.8%` | `85%` | `26%` |
| `120` | `70%` | `15%` | `91%` | `46%` |
| `150` | `80%` | `25%` | `>99.9%` | `76%` |
| `160` | `99%` | `38%` | **`100%`** | `80%` |
| `180` | **`100%`** | `49%` | **`100%`** | `95%` |

---

## 3. Confirmed Version 3.3 & 3.4 Banner Schedule

Snapshot synced on `2026-11-22` (full JSON in [`data/banners-3.3-3.4.json`](./data/banners-3.3-3.4.json); live countdowns at [ZZZ Upcoming Banners](https://polychromecalculator.com/zzz-upcoming-banners)):

| Version & Phase | Start Date | Closing Date | Featured S-Rank Agents | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **3.3 Phase 2** | `2026-11-11` | `2026-12-01` | **Severian** (Debut), **Norma** (Rerun) | Closes Dec 1 at `14:59` server time |
| **3.4 Phase 1** | `2026-12-02` | `2027-01-12` | **Sunbringer** (Debut), **Robin** (Crossover) | Robin also obtainable for free via 3.4 login event |
| **3.4 Phase 2** | `2027-01-01` | `2027-01-12` (Alice)<br>`2027-01-21` (Kafka) | **Kafka** (Crossover), **Alice** (Rerun) | Overlaps with Phase 1 until Jan 12 (`14:59` UTC+8) |

---

## 4. Recurring Polychrome Income Reference

Baseline recurring income intervals modeled in [`data/recurring-income.json`](./data/recurring-income.json):

| Source | Reward | Reset Interval | F2P |
| :--- | :--- | :---: | :---: |
| **Daily Activity** *(Errands & Scratch Card)* | `60` Polychromes | Every `1` day | Yes |
| **Inter-Knot Membership** *(Login Pass)* | `90` Polychromes | Every `1` day | Paid Pass |
| **Shiyu Defense** *(Critical Node Full Clear)* | `780` Polychromes | Every `14` days | Yes |
| **Deadly Assault** *(6-Star Clear)* | `300` Polychromes | Every `14` days | Yes |
| **Hollow Zero** *(Weekly Bounty Commissions)* | `160` Polychromes | Every `7` days | Yes |
| **Fading Signal Shop** *(Monthly Exchange)* | `5` Encrypted Master Tapes | Monthly (1st) | Yes |

---

## 5. Quick CLI & Module Usage (Node.js 18+, Zero Dependencies)

Run a 30-day pull projection directly in your terminal:

```bash
# Worked example: 8,000 Polychromes, 12 Tapes, 20 Pity over 30 days (Dailies + Shiyu only)
node scripts/calc-pulls.mjs --poly 8000 --tapes 12 --pity 20 --days 30 --assault 0

# Include Inter-Knot Membership (--pass), Deadly Assault, Hollow Zero, and a 50/50 guarantee
node scripts/calc-pulls.mjs --poly 4500 --tapes 5 --pity 35 --guaranteed --days 40 --pass --hollow 160

# Print the full 0-pity odds table for Exclusive Agents or W-Engines
node scripts/calc-pulls.mjs --table
node scripts/calc-pulls.mjs --channel engine --table
```

Sample output:

```text
=== ZZZ Polychrome & Pull Projection (30 days) ===
Channel            : Exclusive Channel (Agent)
Starting Stash     : 8,000 Polychromes + 12 Tapes (20 pity)
Projected Income   : +3,360 Polychromes
Total by Target    : 83 Pulls (0 / 160 Polychromes left over)
Featured Odds      : 60% (>=1 copy) · 6.1% (2 copies)
Guarantee / Expect : 160 worst-case pulls · ~80 expected pulls
Shortfall          : 77 pulls (12,320 Polychromes) short of worst-case guarantee
Interactive Web UI : https://polychromecalculator.com/
```

---

## 6. Web Tools & Trackers

| Tool / Guide | URL |
| :--- | :--- |
| **ZZZ Polychrome Calculator & Pull Planner** | [https://polychromecalculator.com/](https://polychromecalculator.com/) |
| **ZZZ Pity & 50/50 Odds Calculator (Agent & W-Engine)** | [https://polychromecalculator.com/zzz-pity-calculator](https://polychromecalculator.com/zzz-pity-calculator) |
| **ZZZ Upcoming Banners & Phase Countdowns** | [https://polychromecalculator.com/zzz-upcoming-banners](https://polychromecalculator.com/zzz-upcoming-banners) |
| **ZZZ Banner History & Rerun Tracker** | [https://polychromecalculator.com/zzz-banner-history](https://polychromecalculator.com/zzz-banner-history) |
| **ZZZ Pull History & How to Read Pity** | [https://polychromecalculator.com/zzz-pull-history](https://polychromecalculator.com/zzz-pull-history) |
| **ZZZ Event Calendar & Reward Deadlines** | [https://polychromecalculator.com/zzz-event-calendar](https://polychromecalculator.com/zzz-event-calendar) |
| **ZZZ Active Redemption Codes** | [https://polychromecalculator.com/zzz-codes](https://polychromecalculator.com/zzz-codes) |

---

## Disclaimer

Unofficial fan-made probability calculator and open reference dataset. Not affiliated with, endorsed by, or sponsored by **HoYoverse** / **COGNOSPHERE PTE. LTD.** *Zenless Zone Zero* and related names are trademarks of their respective owners.
