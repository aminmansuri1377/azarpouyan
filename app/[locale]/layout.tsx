import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

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
      <Header locale={locale} messages={messages} />

      <main>{children}</main>

      <Footer messages={messages} />
    </>
  );
}
