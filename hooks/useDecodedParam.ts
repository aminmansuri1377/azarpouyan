import { useParams } from "next/navigation";

export function useDecodedParams<T extends Record<string, string>>() {
  const params = useParams();
  const decoded: Record<string, string> = {};
  for (const key in params) {
    decoded[key] = decodeURIComponent(params[key] as string);
  }
  return decoded as T;
}
