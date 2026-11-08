# Daily Trail: what we measure and what we do about it

Daily Trail is a daily treasure hunt for people who love puzzles. Everyone gets the same three-stage hunt each day. The product succeeds if players come back and finish the hunt week after week.

**Current status: no real player data exists yet.** The game records every event below, but the records stay on each player's device. Nothing in this document is a result.

## How the targets are set

Each target comes from one of two places, and we do not use numbers from anywhere else.

1. **Published data, for retention.** Retention is the one area with credible public figures, so its targets come from the benchmarks below.
2. **Our own first two weeks, for everything else.** We found no reliable public figures for start rate, finish rate, hint use, streaks or sharing. Rather than guess, we measure a baseline and set targets from it.

**The baseline** is the first 14 days of real data, and it needs at least 200 players in the group being measured. Fourteen days shows each of the seven daily hunts twice.

**A change only counts if it is bigger than the margin of error.** With 200 players, that margin is about 7 percentage points either way. With 400 players, it is about 5. Throughout this document, "clearly" means by more than this margin.

### Retention benchmarks

| Retention | Typical puzzle game | Top quarter of all mobile games | Top 50 puzzle games |
|---|---|---|---|
| D1 | About 20% | About 27% | About 43% |
| D7 | About 4.5% | About 7.5% | About 25% |
| D30 | About 1.2% | About 2.8% | About 16% |

**Our target is the top quarter column.** Choosing that column is our decision: the game is built for people who already love puzzles, so it should beat a typical game. The top 50 are the most successful puzzle games, so we show them for reference and do not expect to match them.

These figures need care when applied to Daily Trail:

- They come from installed mobile apps. Daily Trail is a website with no install and no notifications. No daily web puzzle publishes its retention, and The New York Times does not release player numbers for its games.
- The first two columns use day 28 retention, the closest published figure to day 30. The top 50 figures use day 30.
- We reset the targets after the baseline if our real audience behaves differently.

## The main number

**Weekly active solvers:** the number of different players who finish at least one hunt in a week, Monday to Sunday.

We chose this over visits because a visit only shows that someone opened the page. A finished hunt shows that they got what they came for. It also tolerates a missed day, so it tracks a habit rather than a perfect streak.

## The metrics

### Do players come back?

| Metric | How it is calculated | Target |
|---|---|---|
| D1 retention | Share of new players who open the game exactly 1 day after their first visit | About 27% |
| D7 retention | The same, exactly 7 days later | About 7.5% |
| D30 retention | The same, exactly 30 days later | About 2.8% |
| Solves per active player | Finished hunts per week, divided by weekly active solvers | Set from baseline |

### Do they finish?

| Metric | How it is calculated | Target |
|---|---|---|
| Start rate | Players who press Start, out of players who open the game and have not finished today | Set from baseline |
| Finish rate | Players who finish, out of players who press Start that day | Set from baseline |
| Stage drop-off | Share of players who see a stage but do not solve it, for each stage | Compare the three stages |

### Are the puzzles right?

| Metric | How it is calculated | Target |
|---|---|---|
| Clean solve rate | Stage solves with no hint, by puzzle and stage | Compare puzzles of the same type |
| Answer shown rate | Stage solves where hint 3 showed the answer | Compare puzzles of the same type |
| Wrong answers per stage | Wrong answers divided by players who saw the stage | Compare puzzles of the same type |
| Median solve time | Middle value of seconds per stage and per hunt | Compare puzzles of the same type |

### Does the streak build a habit?

| Metric | How it is calculated | Target |
|---|---|---|
| Streak of 3 or more | Share of weekly active solvers holding a streak of at least 3 | Set from baseline |
| Freeze return rate | Players who finish a hunt within 2 days after a freeze covered a missed day | Compare with the next row |
| Return after a broken streak | Players who finish a hunt on the day their streak resets or the day after | Compare with the row above |

The closest published evidence comes from Duolingo, which found that letting learners hold two streak freezes instead of one raised daily active learners by a relative 0.38%. Freeze effects can be real but small, so a small sample will not show them.

### Do players spread it?

| Metric | How it is calculated | Target |
|---|---|---|
| Share rate | Players who use Share or Copy, out of players who finish that day | Set from baseline |

### Do they want more than one hunt a day?

| Metric | How it is calculated | Target |
|---|---|---|
| Practice rate | Players who open a practice hunt, out of players who finish that day | Set from baseline |
| Replay rate | Players who view the answers of a past hunt or play one again, out of players who open the game that day | Set from baseline |

Practice hunts are separate from the daily hunts, so they never spoil a future day. Practice plays and replays never count towards the streak, score or any metric above. Only the first practice hunt or replay opened from the daily game is recorded, so these rates show how many players want more, not how much they play.

## What we do when a number moves

| If we see this | It probably means | We do this |
|---|---|---|
| D1 is under 20%, the typical puzzle game | The first play gave no reason to return | Show tomorrow's hunt and the player's streak more clearly on the result screen, then test a reminder |
| D1 is 20% or more but D7 is under 4.5% | The novelty wears off, or the repeating hunts are noticed | Add new hunts first, then look at weekly goals |
| D7 is 4.5% or more but D30 is under 1.2% | Regular players run out of reasons to stay | Build longer-term goals, such as crews or a monthly story map |
| Start rate falls clearly below its baseline | The intro does not make players want to begin | Shorten the intro and show the first puzzle sooner |
| Finish rate falls clearly below its baseline and one stage loses clearly more players than the other two | That stage is the blocker | Fix that stage type before writing more content |
| The cipher stage loses clearly more players than the riddle and the pattern | The cipher rules are too hard to follow | Simplify the "How this works" panel and strengthen the first hint |
| A puzzle's clean solve rate is clearly above others of its type | That puzzle is too easy for this audience | Make that puzzle harder |
| A puzzle's answer shown rate is clearly above others of its type | That puzzle is too hard or unfair | Rewrite the puzzle or its hints, and retire it if that fails |
| A puzzle has clearly more wrong answers than others of its type, but no more hints | Players may be giving correct answers we do not accept, or may not know hints exist | Review accepted answers and make the hint button easier to see |
| Players who get a freeze return clearly more often than players whose streak breaks | The freeze may be protecting the habit | Test a second freeze or a way to earn one |
| The two groups return at about the same rate | The freeze may not be worth the complexity | Simplify the streak rules |
| Share rate falls clearly below its baseline | The result is not worth showing off | Test a new share card and a head-to-head challenge link |
| Share rate holds but new players stay flat | Shares do not bring people in | Track arrivals from shared links, then change the message or the link |
| Practice rate rises clearly above its baseline | More players want more than one hunt a day | Add more practice hunts or a weekly bonus hunt, and check that it does not lower next-day returns |
| Replay rate rises clearly above its baseline | Players value their record of past hunts | Make the past hunts list more prominent, for example with a monthly map of finished hunts |
| Finish rate rises while D7 falls | The hunts may have become too easy to feel rewarding | Roll back the easier content and check the difficulty mix |

## Reading the numbers safely

- **Check the group size first.** With 100 players, a measured 45% could really be anywhere from about 35% to 55%. Small differences between groups mean little until each group has several hundred players.
- **Streak numbers miss players who leave for good.** Streak changes are only recorded when a player opens the game. Someone who never returns records no broken streak, so read these numbers alongside retention.
- **Freeze comparisons do not prove cause.** Players who keep a streak long enough to use a freeze may already be more committed. An A/B test is needed before we credit the freeze.
- **Each puzzle always falls on the same weekday.** There are 7 hunts on a 7-day cycle, so a hard puzzle and a slow weekday look the same. Moving puzzles to other weekdays would separate the two.
- **Hunts repeat after 7 days.** From day 8, returning players may remember the answers. Compare puzzle difficulty using first plays only, and treat week 2 retention with care.
- **Use the median for time, not the average.** The timer keeps running if a player leaves and resumes, and on the screen between stages, so a few very long times would distort an average.
- **A player means a browser on a device.** A player on a new phone, or one who clears their browser data, counts as new. This inflates new players and lowers retention a little.
- **A share is an intent, not a delivery.** Copy shows that the text was copied, not that it was posted.
- **The leaderboard tells us nothing yet.** Its other 12 players are sample data, so it cannot be used to judge competition or motivation.

## What we cannot measure yet

| Gap | Why it matters | What fixes it |
|---|---|---|
| Events stay on each device | We cannot see any real numbers across players | Send events to an analytics service. This comes first, since nothing else in this document works without it |
| Shared links are not tagged | We cannot tell whether shares bring in new players | Add a tag to the link in the share text and record it on first visit |
| Wrong answers are not stored | We cannot tell typos and fair alternative answers from real mistakes | Record a privacy-safe form of wrong answers, then review the most common ones |
| Why a player stopped | `hunt_abandoned` also fires when someone briefly switches apps, so it only shows where they were | Use "started but did not finish that day" as the real measure, and add a one-question exit survey if needed |

## How we report

Each Monday, send management one short update:

1. Weekly active solvers, against last week.
2. D1 and D7 for the newest group of players with enough time to measure.
3. The hardest and the easiest puzzle of the week.
4. One thing we learned, one decision we made, and what we will check next week.

Event names and exact definitions are in [reference/events.md](../reference/events.md).

## Sources

Figures were checked in November 2026 and are rounded.

- **Typical puzzle game and top quarter of all mobile games:** [GameAnalytics, 2025 Mobile Gaming Benchmarks](https://www.gameanalytics.com/reports/2025-mobile-gaming-benchmarks). Data from 2024, covering 11,600 games on iOS and Android. Some top quarter figures are read from charts.
- **Top 50 puzzle games:** [Gamigion, Benchmarks from the Top 50 Mobile Puzzle Games](https://www.gamigion.com/benchmarks-from-the-top-50-mobile-puzzle-games/), using AppMagic data. Medians. The article does not state its year or how the games were selected.
- **Streak freeze:** [Duolingo, How the streak builds a habit](https://blog.duolingo.com/how-duolingo-streak-builds-habit/), January 2022. Reported by the company and not independently verified.
