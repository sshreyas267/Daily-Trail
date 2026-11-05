import type { LeaderboardRow } from '../engine';
import { formatTime } from '../game/selectors';

export function Leaderboard({ rows }: { rows: LeaderboardRow[] }) {
  return (
    <section className="leaderboard" aria-labelledby="leaderboard-title">
      <h2 id="leaderboard-title" className="subheading">
        Today's leaderboard
      </h2>
      <p className="muted">Sample data. Only your row is real. The other players are made up for this demo.</p>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Player</th>
            <th scope="col">Score</th>
            <th scope="col">Time</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className={row.isPlayer ? 'leaderboard-you' : undefined}>
              <td>{row.rank}</td>
              <td>{row.name}</td>
              <td>{row.score}</td>
              <td>{formatTime(row.secs)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
