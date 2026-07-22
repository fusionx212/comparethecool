/** Shared ASIN sanity — reject seed placeholders that 404 on Amazon. */
export function looksLikeRealAsin(asin: string | null | undefined): boolean {
  if (!asin) return false;
  if (asin.length !== 10) return false;
  if (/XYZ|FALLBACK|COMFE|TROT|MEACO|PROB|LEVO|DYSON|DRAG|DIMP|DREAM|AM07|HONF|DELPAC|FRPAC|ITPAC|ESPAC|NLPAC|USPAC|AUPAC/i.test(asin)) {
    return false;
  }
  return /^[A-Z0-9]{10}$/i.test(asin);
}
