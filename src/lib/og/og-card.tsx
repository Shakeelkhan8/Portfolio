/**
 * Shared layout for link-preview images (1200x630), rendered with
 * next/og's ImageResponse. Satori supports a subset of CSS: every element
 * with more than one child needs `display: flex`, and there is no Tailwind,
 * so the site's palette is repeated here as literals. The built-in font has
 * a single regular weight, so hierarchy comes from size and colour.
 */
export const OG_SIZE = { width: 1200, height: 630 } as const;

/** Mirrors the site palette in globals.css (docs/DESIGN.md). */
const COLORS = {
  background: "#0b0a09",
  foreground: "#ece7df",
  muted: "#9c958c",
  border: "#23201c",
  signal: "#e6a957",
} as const;

type OgCardProps = {
  eyebrow: string;
  title: string;
  description?: string | null;
  metric?: { value: string; label: string } | null;
  footer: string;
};

function clamp(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}

export function OgCard({ eyebrow, title, description, metric, footer }: OgCardProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: `radial-gradient(ellipse 70% 55% at 50% 0%, rgba(230,169,87,0.10), transparent 70%), ${COLORS.background}`,
        color: COLORS.foreground,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 22,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: COLORS.muted,
            marginBottom: 28,
          }}
        >
          {clamp(eyebrow, 64)}
        </div>
        <div
          style={{
            fontSize: title.length > 40 ? 60 : 72,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            maxWidth: 1000,
          }}
        >
          {clamp(title, 80)}
        </div>
        {description ? (
          <div
            style={{
              marginTop: 28,
              fontSize: 28,
              lineHeight: 1.4,
              color: COLORS.muted,
              maxWidth: 980,
            }}
          >
            {clamp(description, 150)}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          borderTop: `1px solid ${COLORS.border}`,
          paddingTop: 28,
        }}
      >
        {metric ? (
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <div style={{ fontSize: 44, marginRight: 18, color: COLORS.signal }}>
              {clamp(metric.value, 24)}
            </div>
            <div style={{ fontSize: 24, color: COLORS.muted }}>
              {clamp(metric.label, 40)}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex" }} />
        )}
        <div style={{ fontSize: 24, color: COLORS.muted }}>{footer}</div>
      </div>
    </div>
  );
}
