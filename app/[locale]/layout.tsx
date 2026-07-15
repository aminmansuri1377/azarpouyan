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

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      <Footer messages={messages} />
    </>
  );
}
