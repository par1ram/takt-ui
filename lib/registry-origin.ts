/** Use the domain the reader is visiting, including Vercel preview deployments. */
export function registryOrigin(requestUrl: string) {
  for (const candidate of [process.env.NEXT_PUBLIC_TAKT_ORIGIN, requestUrl]) {
    if (!candidate) continue;
    const url = new URL(candidate);
    if (/^https?:$/.test(url.protocol) && !/^(localhost|.*\.localhost|127\..*|\[::1\]|0\.0\.0\.0)$/.test(url.hostname))
      return url.origin;
  }
  return "";
}
