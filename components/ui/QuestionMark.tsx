// components/QuestionMark.tsx
export default function QuestionMark({
  position = "left",
  className = "",
}: {
  position?: "left" | "right";
  className?: string;
}) {
  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 pointer-events-none select-none ${className}`}
      style={{
        [position === "left" ? "left" : "right"]: "-40px",
      }}
      aria-hidden="true"
    >
      <svg
        width="140"
        height="400"
        viewBox="0 0 140 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="380"
          fontFamily="serif"
          fontWeight="300"
          fill="none"
          stroke="#C9A84C"
          strokeWidth="1"
          opacity="0.25"
        >
          {position === "left" ? "؟" : "?"}
        </text>
      </svg>
    </div>
  );
}
