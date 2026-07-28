import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { LocaleDirSync } from "@/components/ui/theme/locale-dir-sync";

import { getMessages } from "@/messages";

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}) {
  const { locale } = await params;

  const messages = getMessages(locale);

  return (
    <>
      <LocaleDirSync locale={locale} />

      <Header locale={locale} messages={messages} />

      <main className="flex-1 bg-linear-65 from-[#e9c98533] from-0% via-popover via-10%  to-[#c6a04d33] to-100%">
        {children}
      </main>

      <Footer messages={messages} />

      <main className="flex-1 ">{children}</main>

      <Footer messages={messages} />

      <main className="flex-1 ">{children}</main>

      <Footer messages={messages} />
    </>
  );
}
