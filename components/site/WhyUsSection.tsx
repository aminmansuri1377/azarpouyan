// components/WhyUsSection.tsx
import WhyUsCard from "./WhyUsCard";
import HexIcon from "../ui/HexIcon";
import QuestionMark from "../ui/QuestionMark";
import SectionBorderTitle from "./SectionBorderTitle";
import { Reveal } from "../ui/Reveal";

// آیکون‌های SVG برای هر کارت
const TrophyIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const DiamondIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z" />
  </svg>
);

const FlagIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" x2="4" y1="22" y2="15" />
  </svg>
);

const KeyIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="7.5" cy="15.5" r="5.5" />
    <path d="m21 2-9.6 9.6" />
    <path d="m15.5 7.5 3 3L22 7l-3-3" />
  </svg>
);

const cards = [
  {
    icon: <TrophyIcon />,
    title: "کیفیت ساخت و نظارت تخصصی",
    description:
      "انتخاب مصالح مناسب، اجرای دقیق و نظارت مستمر برای کیفیتی ماندگار.",
  },
  {
    icon: <DiamondIcon />,
    title: ". طراحی معماری متناسب با زندگی امروز",
    description:
      "فضاهایی کاربردی، زیبا و متناسب با نیازهای واقعی خانواده‌های امروز.",
  },
  {
    icon: <FlagIcon />,
    title: "امکانات رفاهی و خدمات یکپارچه",
    description:
      "مجموعه‌ای از امکانات و خدمات برای ساختن تجربه‌ای کامل‌تر از زندگی.",
  },
  {
    icon: <KeyIcon />,
    title: " شفافیت حقوقی و توجه به ارزش بلندمدت",
    description:
      "تعهد به حقوق مالک، شفافیت در فرآیندها و حفظ ارزش سرمایه در طول زمان.",
  },
];

export default function WhyUsSection() {
  return (
    <section className="relative py-20 px-6 md:px-12 lg:px-20 overflow-hidden font-peyda-medium">
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto ">
        {/* Header */}
        <div className="text-center mb-6">
          <Reveal>
            <div className="flex justify-center mb-6">
              <SectionBorderTitle className="text-gray-900">
                به من بگو چرا؟
              </SectionBorderTitle>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <p
              className="text-gray-600 text-sm max-w-3xl mx-auto leading-8"
              dir="rtl"
            >
              در پروژه‌های ساختمانی آذر پویان، طراحی، اجرا، نظارت، امکانات و
              ساختار حقوقی پروژه در کنار یکدیگر قرار می‌گیرند تا تجربه‌ای
              مطمئن‌تر و ارزشمندتر برای ساکنان و مالکان شکل بگیرد.{" "}
            </p>
          </Reveal>
        </div>

        {/* Cards with Question Marks */}
        <div className="relative mt-14">
          {/* Left Question Mark — شناور آرام */}
          <div className="animate-float">
            <QuestionMark position="left" className="hidden lg:block" />
          </div>

          {/* Right Question Mark — شناور آرام با تأخیر */}
          <div className="animate-float [animation-delay:1.8s]">
            <QuestionMark position="right" className="hidden lg:block" />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:mx-12">
            {cards.map((card, index) => (
              <Reveal key={index} delay={index * 130} className="h-full">
                <WhyUsCard
                  icon={<HexIcon>{card.icon}</HexIcon>}
                  title={card.title}
                  description={card.description}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
