"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const COOKIE = "ctc_market";
const MARKETS = ["uk", "de", "fr", "it", "es", "nl", "us", "au", "eu"] as const;

/**
 * Fallback when Netlify edge geo isn't running (local / some previews).
 * Cookie → language hint → UK.
 */
export function HomeGeoRedirect() {
  const router = useRouter();

  useEffect(() => {
    const cookie = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${COOKIE}=`));
    if (cookie) {
      const code = decodeURIComponent(cookie.split("=")[1] || "");
      if ((MARKETS as readonly string[]).includes(code)) {
        router.replace(`/${code}`);
        return;
      }
    }

    const lang = (navigator.language || "en-GB").toLowerCase();
    let code = "uk";
    if (lang.startsWith("de")) code = "de";
    else if (lang.startsWith("fr")) code = "fr";
    else if (lang.startsWith("it")) code = "it";
    else if (lang.startsWith("es")) code = "es";
    else if (lang.startsWith("nl")) code = "nl";
    else if (lang.startsWith("en-us") || lang === "en") {
      // en alone is ambiguous — prefer UK for this brand; en-US → us
      code = lang.startsWith("en-us") ? "us" : lang.startsWith("en-au") ? "au" : "uk";
    } else if (lang.startsWith("en-au") || lang.startsWith("en-nz")) code = "au";
    else if (lang.startsWith("en-gb") || lang.startsWith("en-ie")) code = "uk";

    router.replace(`/${code}`);
  }, [router]);

  return (
    <p className="mx-auto max-w-6xl px-5 py-16 text-center text-sm text-foreground/50">
      Finding your local store…
    </p>
  );
}
