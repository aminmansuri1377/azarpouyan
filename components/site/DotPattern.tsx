// components/DotPattern.tsx
export default function DotPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`absolute inset-0 w-full h-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* تعریف انیمیشن به صورت داخلی و سبک */}
      <style>{`
        @keyframes dot-drift {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(32px, 32px);
          }
        }
        .animate-dot-drift {
          animation: dot-drift 2s linear infinite;
        }
      `}</style>

      <defs>
        <pattern
          id="dot-pattern"
          x="0"
          y="0"
          width="32"
          height="32"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1.5" fill="white" fillOpacity="0.08" />
        </pattern>
      </defs>

      {/* اعمال کلاس انیمیشن به rect */}
      <rect
        width="100%"
        height="100%"
        fill="url(#dot-pattern)"
        className="animate-dot-drift"
      />
    </svg>
  );
}
