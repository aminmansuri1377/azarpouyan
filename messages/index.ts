import fa from "./fa";
import en from "./en";

export function getMessages(locale: string) {
  switch (locale) {
    case "fa":
      return fa;

    case "en":
      return en;

    default:
      return fa;
  }
}
