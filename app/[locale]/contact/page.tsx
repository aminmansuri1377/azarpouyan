import Image from "next/image";
import { ContactForm } from "@/components/contact/ContactForm";
import SectionTitle from "@/components/ui/SectionTitle";

export default function ContactPage() {
  return (
    <div className="min-h-screen mt-20 font-peyda-regular">
      {/* بخش بالایی - تصویر و معرفی */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-right space-y-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  تماس با ما
                </h2>
                <h3 className="text-2xl md:text-3xl font-bold  mb-4">
                  هر خانه، نقطه آغاز یک داستان است
                </h3>
                <h4 className="text-xl font-semibold ">
                  داستان آرامش، امنیت، رشد و آینده
                </h4>
              </div>

              <div className="text-gray-600 leading-relaxed space-y-3">
                <p>
                  لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و
                  طراح گرافیک است. طراح گرافیک از این متن برای نمایش فرم و
                  چیدمان محتوا استفاده می‌کند.
                </p>
                <p>
                  هدف از آن تمرکز بر ظاهر طراحی بدون وابستگی به محتوای واقعی
                  است. و چیدمان محتوا استفاده می‌کنند.
                </p>
                <p>
                  هدف از آن تمرکز بر ظاهر طراحی بدون وابستگی به محتوای واقعی
                  است. طراح گرافیک از این متن برای نمایش فرم و چیدمان محتوا
                  استفاده می‌کند.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 border-2 border-[#C8A24A]/30 rounded-2xl transform translate-x-4 translate-y-4" />
              <Image
                src="/images/project2.png"
                alt="تماس با ما"
                width={600}
                height={400}
                className="rounded-2xl shadow-xl relative z-10"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* فرم تماس با گرادیانت طلایی */}
      <ContactForm />

      {/* بخش CONTACT US */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionTitle className={""}>CONTACT US</SectionTitle>
          {/* باکس اطلاعات تماس */}
          <div className="border-2 border-gray-300 rounded-2xl p-8 md:p-12 bg-white">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-10">
              راه‌های ارتباطی با گروه فنی مهندسی آذر پویان
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* ایمیل 1 */}
              <div className="flex items-center justify-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <span className="text-gray-700 font-medium">@sample.com</span>
                <div className="w-10 h-10 rounded-full bg-[#F6DEA3] flex items-center justify-center"></div>
              </div>

              {/* وب‌سایت */}
              <div className="flex items-center justify-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <span className="text-gray-700 font-medium">@sample.com</span>
                <div className="w-10 h-10 rounded-full bg-[#F6DEA3] flex items-center justify-center"></div>
              </div>

              {/* تلفن 1 */}
              <div className="flex items-center justify-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <span className="text-gray-700 font-medium" dir="ltr">
                  0912-1234-123
                </span>
                <div className="w-10 h-10 rounded-full bg-[#F6DEA3] flex items-center justify-center"></div>
              </div>

              {/* ایمیل 2 */}
              <div className="flex items-center justify-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <span className="text-gray-700 font-medium">@sample.com</span>
                <div className="w-10 h-10 rounded-full bg-[#F6DEA3] flex items-center justify-center"></div>
              </div>

              {/* اینستاگرام */}
              <div className="flex items-center justify-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <span className="text-gray-700 font-medium">@sample.com</span>
                <div className="w-10 h-10 rounded-full bg-[#F6DEA3] flex items-center justify-center"></div>
              </div>

              {/* تلفن 2 */}
              <div className="flex items-center justify-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <span className="text-gray-700 font-medium" dir="ltr">
                  0912-1234-123
                </span>
                <div className="w-10 h-10 rounded-full bg-[#F6DEA3] flex items-center justify-center"></div>
              </div>
            </div>

            {/* آدرس */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-center gap-3">
                <p className="text-gray-600 text-center">
                  لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و
                  طراحی گرافیک است.
                </p>
                <div className="w-10 h-10 rounded-full bg-[#F6DEA3] flex items-center justify-center flex-shrink-0"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
