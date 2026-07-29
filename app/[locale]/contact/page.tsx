"use client";

import { ContactForm } from "@/components/contact/ContactForm";
import Image from "next/image";
import Contact from "../../../public/images/contact.jpg";
import { getMessages } from "@/messages";
import { useParams } from "next/navigation";

export default function ContactPage() {
  const params = useParams();

  const locale = params.locale as string;

  const t = getMessages(locale);

  return (
    <div className="relative isolate min-h-[85vh] w-full items-center justify-center overflow-hidden">
      <Image src={Contact} alt="c background" className="object-cover w-full" />
      <div className="absolute inset-0 text-center mt-30">
        <h1 className=" font-peyda-bold text-4xl text-white">{t.contactus}</h1>
        <p className=" font-peyda-regular text-white my-10 w-[40%] mx-auto">
          {t.likeConversation}
        </p>

        <ContactForm locale={locale} />
      </div>
    </div>
  );
}
