export const publishedOrigin = new URL(process.env.NEXT_PUBLIC_TAKT_ORIGIN ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
  "https://takt-ui.vercel.app").origin;

/** Use the domain the reader is visiting, including Vercel preview deployments. */
export function registryOrigin(requestUrl: string) {
  for (const candidate of [requestUrl, process.env.NEXT_PUBLIC_TAKT_ORIGIN]) {
    if (!candidate) continue;
    const url = new URL(candidate);
    if (/^https?:$/.test(url.protocol) && !/^(localhost|.*\.localhost|127\..*|\[::1\]|0\.0\.0\.0)$/.test(url.hostname))
      return url.origin;
  }
  return "";
}
