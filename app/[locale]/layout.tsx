import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { LocaleDirSync } from "@/components/ui/theme/locale-dir-sync";

import { getMessages } from "@/messages";
import { BackgroundGlows } from "@/components/site/BackgroundGlows";

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

      <main className="relative flex-1 bg-white overflow-x-hidden min-h-screen">
        <BackgroundGlows />

        <div className="relative z-10">{children}</div>
      </main>
      <Footer messages={messages} locale={locale} />
    </>
  );
}
