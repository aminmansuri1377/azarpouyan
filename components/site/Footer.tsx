import Link from "next/link";
import Logo from "../../public/images/colorlogo.png";
import Image from "next/image";
interface Props {
  messages: any;
  locale: string;
}

export function Footer({ messages, locale }: Props) {
  return (
    <footer className="border-t border-border bg-info-foreground text-center pt-5 pb-10">
      <Image src={Logo} alt="Logo" className="mx-auto" />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground">
          {messages.footer}
        </p>
      </div>
      <div className="md:flex md:justify-center gap-10 mt-4">
        {" "}
        <Link
          href={`/${locale}`}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground font-peyda-regular"
        >
          {messages.home}
        </Link>
        <Link
          href={`/${locale}/aboutUs`}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground font-peyda-regular"
        >
          {messages.aboutUs}
        </Link>
        <Link
          href={`/${locale}/contact`}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground font-peyda-regular"
        >
          {messages.contactus}
        </Link>
        <Link
          href={`/${locale}/blog`}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground font-peyda-regular"
        >
          {messages.blogs}
        </Link>
      </div>
    </footer>
  );
}
