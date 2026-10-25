import { Logo } from "@/components/shared/logo";

/** A cluster of hexagon "rooms" forming a hive-shaped building. Pure SVG, themed via tokens. */
function HiveIllustration() {
  const hex = (cx: number, cy: number, r: number) => {
    const pts = Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
    });
    return pts.join(" ");
  };
  const r = 46;
  const w = Math.sqrt(3) * r;
  const cells: { x: number; y: number; fill: string; lit?: boolean }[] = [];
  const rows = [
    { y: 70, n: 3, off: 1 },
    { y: 70 + r * 1.5, n: 4, off: 0.5 },
    { y: 70 + r * 3, n: 3, off: 1 },
    { y: 70 + r * 4.5, n: 2, off: 1.5 },
  ];
  const fills = ["var(--primary)", "var(--secondary)", "var(--amber-soft)", "var(--teal-soft)"];
  let k = 0;
  rows.forEach((row) => {
    for (let i = 0; i < row.n; i++) {
      cells.push({ x: 60 + (row.off + i) * w, y: row.y, fill: fills[k % fills.length], lit: k % 3 === 0 });
      k++;
    }
  });
  return (
    <svg viewBox="0 0 420 420" role="img" aria-label="A hive of lit windows forming a building" className="mx-auto w-full max-w-sm">
      <defs>
        <radialGradient id="glow" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="210" cy="200" rx="200" ry="190" fill="url(#glow)" />
      {cells.map((c, i) => (
        <g key={i}>
          <polygon points={hex(c.x, c.y, r - 4)} fill={c.fill} stroke="var(--card)" strokeWidth="4" strokeLinejoin="round" />
          {c.lit && <rect x={c.x - 9} y={c.y - 9} width="18" height="18" rx="4" fill="var(--primary-foreground)" opacity="0.85" />}
        </g>
      ))}
    </svg>
  );
}

export function BrandPanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-amber-soft p-10 lg:flex xl:p-14">
      <div aria-hidden="true" className="hive-glow pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative">
        <Logo />
      </div>
      <div className="relative">
        <HiveIllustration />
        <h2 className="mx-auto mt-8 max-w-md text-center font-heading text-3xl font-extrabold">Find your room. Find your people.</h2>
        <p className="mx-auto mt-3 max-w-sm text-center text-muted-foreground">
          Verified rooms, roommates who match, and rent you can pay with bKash.
        </p>
      </div>
      <p className="relative text-sm text-muted-foreground">© 2026 NestHive · Dhaka, Bangladesh</p>
    </div>
  );
}
