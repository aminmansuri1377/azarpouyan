// components/QuestionMark.tsx
import Image from "next/image";

export default function QuestionMark({
  position = "left",
  className = "",
}: {
  position?: "left" | "right";
  className?: string;
}) {
  // تعیین مسیر فایل SVG بر اساس موقعیت
  const svgPath = position === "left" ? "/images/2-.svg" : "/images/1-.svg";

  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 pointer-events-none select-none ${className}`}
      style={{
        [position === "left" ? "left" : "right"]: "-100px",
      }}
      aria-hidden="true"
    >
      <Image
        src={svgPath}
        alt="" // خالی بودن alt برای المان‌های تزئینی الزامی است
        width={140}
        height={400}
        className="w-full h-full"
        unoptimized // این ویژگی باعث می‌شود Next.js فایل SVG را بدون تغییر و بهینه‌سازی اضافی رندر کند
      />
    </div>
  );
}
