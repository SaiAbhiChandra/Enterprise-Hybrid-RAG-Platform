type FusionMarkProps = {
  size?: number;
  animated?: boolean;
  className?: string;
};

/**
 * The product's signature mark: two arcs -- one for dense/semantic
 * retrieval, one for sparse/keyword retrieval -- converging into a
 * single point. It's a literal picture of what the backend does on
 * every query (RRF-fusing two ranked result sets into one), reused
 * as the logo and, animated, as the "retrieving" indicator.
 */
export default function FusionMark({
  size = 28,
  animated = false,
  className = "",
}: FusionMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 7 C 6 16, 11 16, 15.5 16"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        className={animated ? "fusion-arc-a" : ""}
      />
      <path
        d="M26 7 C 26 16, 21 16, 16.5 16"
        stroke="var(--color-accent-2)"
        strokeWidth="2.5"
        strokeLinecap="round"
        className={animated ? "fusion-arc-b" : ""}
      />
      <circle
        cx="16"
        cy="16"
        r="2.25"
        fill="var(--color-text)"
        className={animated ? "fusion-dot" : ""}
      />
    </svg>
  );
}
