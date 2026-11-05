# Event schema

Every event carries `player_id`, `session_id`, `hunt` (day number), `puzzle` (1 to 7) and `ts`. The table lists only the extra properties.

Events fired under `?day=N`, `?date=`, `?practice=N` and `?replay=N` are marked `dev: true` and left out of metrics, so practice and replays never count as real plays. Under `?practice=N`, `puzzle` is the practice number.

| Event | Fires when | Extra properties | Feeds |
|---|---|---|---|
| hunt_viewed | The app opens | streak, is_new_player, days_since_last | Visits, D1, D7, D30 |
| hunt_started | Start is pressed | none | Funnel |
| stage_viewed | A stage appears | stage, type | Funnel by stage |
| answer_wrong | A wrong answer is submitted | stage, tries | Puzzle difficulty |
| hint_used | A hint is taken | stage, hint, cost | Hint dependence |
| stage_completed | A stage is solved | stage, hints, wrong, points, secs | Completion, solve time |
| hunt_completed | Stage 3 is solved | score, secs, hints, wrong, streak | Weekly active solvers |
| hunt_abandoned | The page is hidden after Start and before the finish, at most once per session | last_stage, secs | Drop-off signal |
| share_copied | The share sheet or Copy is used | score, method | Share rate |
| practice_opened | A player opens a practice hunt, or plays a past hunt again | kind (practice or replay), target (practice number or day number) | Demand for more hunts |
| trail_answers_viewed | A player opens the answers of a past hunt | day | Interest in past hunts |
| streak_freeze_used | A missed day is covered | streak, freezes_left | Freeze effect |
| streak_broken | The streak resets to 0 | previous_streak | Streak risk |

## Definitions

- **Abandonment:** a player who has `hunt_started` but no `hunt_completed` for that day. Hiding the page also happens when someone switches apps and comes back, so `hunt_abandoned` is only a signal for where they stopped.
- **Retention:** a player's first `hunt_viewed` date is day 0. Dn retention is the share of players with a `hunt_viewed` exactly n days later. Only players who joined at least n days before the end of the data count towards Dn.
