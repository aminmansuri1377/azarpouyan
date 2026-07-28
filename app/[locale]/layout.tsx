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

      <main className="flex-1 ">{children}</main>

      <Footer messages={messages} />

      <main className="flex-1 ">{children}</main>

      <Footer messages={messages} />

      <main className="flex-1 ">{children}</main>

      <Footer messages={messages} />
    </>
  );
}
