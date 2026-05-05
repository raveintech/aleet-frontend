const FALLBACK_SITE_URL = "https://www.aleet.app";

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!raw) {
    return FALLBACK_SITE_URL;
  }

  return raw.replace(/\/+$/, "");
}
