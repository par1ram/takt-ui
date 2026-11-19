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

1. Read the consuming app’s own AGENTS.md if it exists. Inspect its package manager, aliases and Next.js guides shipped with its installed version.
2. For a new app, run \`bun create next-app@latest my-app --yes\`, then \`cd my-app\`. Keep the recommended App Router, TypeScript, Tailwind and Turbopack defaults.
3. If components.json is missing, run \`bunx shadcn@latest init\`. Preserve existing aliases and registries in an initialized app.
4. Search the compact [task index](${url("/agents/search.json")}) or its [Russian edition](${url("/agents/ru/search.json")}). Match the request against task and useCases. Pick the smallest component that supports the scenario. Open its guide URL. It includes the complete import and example, data models, prop variants, related alternatives, installable parts and registryItem. Resolve paths against this site's origin. The original [full API index](${url("/agents/components.json")}) remains available.
5. Install the guide's registryItem with shadcn. Adapt its example to the app's UI alias, data source and theme. For example:

\`\`\`sh
bunx shadcn@latest add ${cli}/r/receipt-printer.json
\`\`\`

For a project that wants the entire library, install [the complete collection](${url("/r/takt.json")}) with \`bunx shadcn@latest add ${cli}/r/takt.json\`. Both paths produce editable source. Keep imports scoped to the components the page uses.

The registry JSON contains the installable source in \`files[].content\`. The public [Takt repository](https://github.com/par1ram/takt-ui) also contains the catalog and its history. The [maintainer instructions](https://raw.githubusercontent.com/par1ram/takt-ui/main/AGENTS.md) apply when working on Takt itself.

## Connect an agent for future work

Merge this entry into the registries object in the app's components.json:

\`\`\`json
{ "@takt": "${origin || "<published Takt origin>"}/r/{name}.json" }
\`\`\`

Use \`bunx shadcn@latest search @takt -q "receipt"\`, \`bunx shadcn@latest view @takt/receipt-printer\`, then \`bunx shadcn@latest add @takt/receipt-printer\`. The same namespace is available to the shadcn MCP server. For example, search @takt for "draft", then request the chat-composer-demo example with get_item_examples_from_registries. Install it with \`bunx shadcn@latest add @takt/chat-composer-demo\`. For the full library use @takt/takt. Keep this reference alongside the project's existing AGENTS.md instructions:

> For Takt UI requests, read ${url("/llms.txt")} on the published Takt site, search ${url("/agents/search.json")} and open the selected guide, then install the requested component from @takt.

## Integrate

Import the recorded named export from the file under the project's UI alias. Keep pages server-rendered by default. Put browser state, callbacks and event handlers behind a client boundary. Use the project's theme tokens, content and data. Check both themes, keyboard interaction and reduced motion, then run the production build. English is the default; Russian packages are in /r/ru/.

- [Metrics](${url("/metrics")}) includes Latency Chart (ordered p50/p95 samples), Conversion Funnel (ordered stage counts), and Cohort Retention (cohort sizes and counts per period). Pass null for an unobserved sample or period. Zero is a measured value.
- For a message input on an existing page, use [Chat Composer](${url("/agents/components/chat-composer.json")}). Its example sends to an application endpoint and retains the draft on failure. For one read-only message use [Chat Post](${url("/agents/components/chat-post.json")}).
- [Course Messenger](${url("/messenger")}) combines channel selection, message composition, reactions and threads. Install [the workspace](${url("/r/course-messenger.json")}) or find each part under Messenger in the component index.
- [Assistant Orb](${url("/r/siri-orb.json")}) takes an assistant state and normalized audio amplitude.
- [Receipt Printer](${url("/r/receipt-printer.json")}) runs a demo by default. For checkout, supply the order and an onPay callback that resolves after server-side confirmation. Reprinting reuses the existing receipt.
- [Registry index](${url("/r/registry.json")})
${origin ? "" : "\nFor a deployment, set TAKT_ORIGIN to the public site URL before running these example commands.\n"}`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
