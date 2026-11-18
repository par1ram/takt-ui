import { registryOrigin } from "@/lib/registry-origin";

export function GET(request: Request) {
  const urlAtEdge = new URL(request.url);
  const host = request.headers.get("host");
  if (host) {
    urlAtEdge.port = "";
    urlAtEdge.host = host;
  }
  if (request.headers.get("x-forwarded-proto") === "https") urlAtEdge.protocol = "https:";
  const origin = registryOrigin(urlAtEdge.href);
  const url = (path: string) => origin + path;
  const cli = origin || '"$TAKT_ORIGIN"';
  return new Response(`# Takt

Installable React motion components for Next.js App Router, TypeScript and Tailwind CSS. Use the installed source as part of the consuming project.

## Start in the consuming project

1. Read its AGENTS.md and the Next.js guides shipped with its installed version.
2. For a new app, run \`bun create next-app@latest my-app --yes\`, then \`cd my-app\`. Keep the recommended App Router, TypeScript, Tailwind and Turbopack defaults.
3. If components.json is missing, run \`bunx shadcn@latest init\`. Preserve existing aliases and registries in an initialized app.
4. Fetch the [component index](${url("/agents/components.json")}). Match the user's intent to a name, description or category. Inspect the named export, prop combinations, JSX example, dependencies and registryItem. Resolve all paths in the index against this site's origin.
5. Read files[].content from the selected registry item. Install that URL with shadcn. For example:

\`\`\`sh
bunx shadcn@latest add ${cli}/r/receipt-printer.json
\`\`\`

For a project that wants the entire library, install [the complete collection](${url("/r/takt.json")}) with \`bunx shadcn@latest add ${cli}/r/takt.json\`. Both paths produce editable source. Keep imports scoped to the components the page uses.

## Connect an agent for future work

Merge this entry into the registries object in the app's components.json:

\`\`\`json
{ "@takt": "${origin || "<published Takt origin>"}/r/{name}.json" }
\`\`\`

Use \`bunx shadcn@latest search @takt -q "receipt"\`, \`bunx shadcn@latest view @takt/receipt-printer\`, then \`bunx shadcn@latest add @takt/receipt-printer\`. The same namespace is available to the shadcn MCP server. For the full library use @takt/takt. Keep this reference alongside the project's existing AGENTS.md instructions:

> For Takt UI requests, read ${url("/llms.txt")} on the published Takt site, inspect ${url("/agents/components.json")}, then install the requested component from @takt.

## Integrate

Import the recorded named export from the file under the project's UI alias. Keep pages server-rendered by default. Put browser state, callbacks and event handlers behind a client boundary. Use the project's theme tokens, content and data. Check both themes, keyboard interaction and reduced motion, then run the production build. English is the default; Russian packages are in /r/ru/.

- [Assistant Orb](${url("/r/siri-orb.json")}) takes an assistant state and normalized audio amplitude.
- [Receipt Printer](${url("/r/receipt-printer.json")}) runs a demo by default. For checkout, supply the order and an onPay callback that resolves after server-side confirmation. Reprinting reuses the existing receipt.
- [Registry index](${url("/r/registry.json")})
${origin ? "" : "\nFor a deployment, set TAKT_ORIGIN to the public site URL before running these example commands.\n"}`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
