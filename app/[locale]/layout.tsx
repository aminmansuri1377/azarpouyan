import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { LocaleDirSync } from "@/components/ui/theme/locale-dir-sync";

import { getMessages } from "@/messages";

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = getMessages(locale);

  return (
    <>
      <LocaleDirSync locale={locale} />

      <Header locale={locale} messages={messages} />

      <main className="relative flex-1 min-h-screen bg-background [overflow-x:clip]">
        <div className="relative z-10">{children}</div>
      </main>

      <Footer messages={messages} locale={locale} />
    </>
  );
}
