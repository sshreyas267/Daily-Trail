# Daily Trail: what we measure and what we do about it

Daily Trail is a daily treasure hunt for people who love puzzles. Everyone gets the same three-stage hunt each day. The product succeeds if players come back and finish the hunt week after week.

**Current status: no real player data exists yet.** The game records every event below, but the records stay on each player's device. Every target here is our starting assumption, not a benchmark or a result. We reset the targets after two weeks of real data.

## The main number

**Weekly active solvers:** the number of different players who finish at least one hunt in a week, Monday to Sunday.

We chose this over visits because a visit only shows that someone opened the page. A finished hunt shows that they got what they came for. It also tolerates a missed day, so it tracks a habit rather than a perfect streak.

## The metrics

### Do players come back?

| Metric | How it is calculated | Starting target |
|---|---|---|
| D1 retention | Share of new players who open the game exactly 1 day after their first visit | 45% |
| D7 retention | The same, exactly 7 days later | 25% |
| D30 retention | The same, exactly 30 days later | 12% |
| Solves per active player | Finished hunts per week, divided by weekly active solvers | 3 or more |

### Do they finish?

| Metric | How it is calculated | Starting target |
|---|---|---|
| Start rate | Players who press Start, out of players who open the game and have not finished today | 80% |
| Finish rate | Players who finish, out of players who press Start that day | 75% |
| Stage drop-off | Share of players who see a stage but do not solve it, for each stage | Under 10% per stage |

### Are the puzzles right?

| Metric | How it is calculated | Starting target |
|---|---|---|
| Clean solve rate | Stage solves with no hint, by puzzle and stage | 40% to 70% |
| Answer shown rate | Stage solves where hint 3 showed the answer | Under 10% |
| Wrong answers per stage | Wrong answers divided by players who saw the stage | Under 2 |
| Median solve time | Middle value of seconds per stage and per hunt | Whole hunt in 2 to 6 minutes |

### Does the streak build a habit?

| Metric | How it is calculated | Starting target |
|---|---|---|
| Streak of 3 or more | Share of weekly active solvers holding a streak of at least 3 | 40% |
| Freeze return rate | Players who finish a hunt within 2 days after a freeze covered a missed day | 60% |
| Return after a broken streak | Players who finish a hunt on the day their streak resets or the day after | 40% |

### Do players spread it?

| Metric | How it is calculated | Starting target |
|---|---|---|
| Share rate | Players who use Share or Copy, out of players who finish that day | 15% |

### Do they want more than one hunt a day?

| Metric | How it is calculated | Starting target |
|---|---|---|
| Practice rate | Players who open a practice hunt from the result screen, out of players who finish that day | No target yet. We learn what is normal first |

Practice plays never count towards the streak, score or any metric above.

## What we do when a number moves

| If we see this | It probably means | We do this |
|---|---|---|
| D1 is under 30% | The first play gave no reason to return | Show tomorrow's hunt and the player's streak more clearly on the result screen, then test a reminder |
| D1 is healthy but D7 is under 15% | The novelty wears off, or the repeating hunts are noticed | Add new hunts first, then look at weekly goals |
| D7 is healthy but D30 is under 8% | Regular players run out of reasons to stay | Build longer-term goals, such as crews or a monthly story map |
| Start rate is under 60% | The intro does not make players want to begin | Shorten the intro and show the first puzzle sooner |
| Finish rate is under 60% and one stage causes most of the drop-off | That stage is the blocker | Fix that stage type before writing more content |
| The cipher stage has the highest drop-off | The cipher rules are too hard to follow | Simplify the "How this works" panel and strengthen the first hint |
| Clean solve rate is above 85% on a stage | The stage is too easy for this audience | Make that kind of puzzle harder |
| Answer shown rate is above 20% on a stage | The puzzle is too hard or unfair | Rewrite the puzzle or its hints, and retire it if that fails |
| Many wrong answers but few hints | Players may be giving correct answers we do not accept, or may not know hints exist | Review accepted answers and make the hint button easier to see |
| Players who get a freeze return much more often than players whose streak breaks | The freeze may be protecting the habit | Test a second freeze or a way to earn one |
| Freezes make no visible difference | The freeze is not worth the complexity | Simplify the streak rules |
| Share rate is under 5% | The result is not worth showing off | Test a new share card and a head-to-head challenge link |
| Share rate is healthy but new players stay flat | Shares do not bring people in | Track arrivals from shared links, then change the message or the link |
| Practice rate is above 30% | Many players want more than one hunt a day | Build a hunt archive or a bonus hunt, and check that it does not lower next-day returns |
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
