export function Chest() {
  return (
    <svg className="chest" viewBox="0 -26 120 126" role="img" aria-label="An open treasure chest">
      <circle className="chest-glow" cx="60" cy="52" r="26" />
      <rect className="chest-inside" x="18" y="46" width="84" height="10" />
      <g className="chest-lid">
        <path className="chest-wood" d="M16 46 V34 Q16 16 34 16 H86 Q104 16 104 34 V46 Z" />
        <rect className="chest-band" x="54" y="16" width="12" height="30" />
      </g>
      <rect className="chest-wood" x="16" y="52" width="88" height="40" />
      <rect className="chest-band" x="54" y="52" width="12" height="40" />
      <rect className="chest-lock" x="53" y="50" width="14" height="14" />
    </svg>
  );
}
