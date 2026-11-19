# Takt

[Use cases for every component](docs/use-cases.en.md)

105 motion components for React, Next.js App Router and Tailwind CSS. Install one component or the entire collection as editable source through shadcn. The catalog opens in English; the Russian edition is at `/ru`. [Русская документация](README.ru.md)

Try the [course messenger](https://takt-ui.vercel.app/messenger) or install `@takt/course-messenger` in a configured shadcn project. The demo keeps conversations and drafts in memory. For live conversations, pass `messages` from your data source, persist sends through `onSend(channelId, text, parentId?)`, and handle `onToggleReaction(channelId, postId, emoji)`. Channel List, Chat Composer, Message Reactions and Message Thread can also be installed separately.

The [metrics collection](https://takt-ui.vercel.app/metrics) includes three installable charts. Supply ordered percentile samples to Latency Chart, stage counts to Conversion Funnel, or cohort sizes and retained counts to Cohort Retention. Use `null` for missing measurements.

Issue Board, Issue Table and Cycle Planner share the `TrackerIssue` type from the installed `tracker-issues.tsx`. Pass the same `issues` array and `onIssuesChange` setter to all three for synchronized views. Use `defaultIssues` for a self-contained tracker. Each issue has a stable unique ID, title, status, priority, estimate in points and an optional cycle ID.

## Learning components

Open [Code Exercise](https://takt-ui.vercel.app/components/code-exercise) to try the connected lesson. The included runner compiles regular expressions in a disposable browser worker. To use your platform’s execution service, pass `onExecute(source, cases, signal, onRunning)` and return one boolean per case. Pass a lesson-specific `draftKey` to resume editing on the same device. Ask Tutor reuses Prompt Box and Lesson Citation. Connect `onAsk(question, context)` to your server and return `{ text, citation: { title, locator, excerpt, href } }`. The catalog uses a labeled local demo reply.

## Start with a Next.js app

Use the recommended create-next-app defaults. If your app already has Tailwind and shadcn, go straight to installation. [Next.js installation guide](https://nextjs.org/docs/app/getting-started/installation)

```sh
bun create next-app@latest my-app --yes
cd my-app
bunx shadcn@latest init
```

Open **Install** on the published Takt site to copy commands with its actual domain. In the examples below, run `export TAKT_ORIGIN=https://takt-ui.vercel.app`.

```sh
bunx shadcn@latest add "$TAKT_ORIGIN/r/receipt-printer.json"
```

```tsx
import { ReceiptPrinter } from "@/components/ui/receipt-printer";

export default function Page() {
  return <ReceiptPrinter />;
}
```

For the full library run `bunx shadcn@latest add "$TAKT_ORIGIN/r/takt.json"`. Import components individually from your UI directory. The CLI installs their dependencies and shared helpers, respects the aliases in `components.json` and generates the shadcn button in your chosen style. For Russian default copy, use the corresponding item under `/r/ru/`.

## Use a coding agent

Use **Install → For agents** for the full collection. Open **For agents** in any component's install dialog to copy a prompt with its registry URL and named export. Start at `/llms.txt`, find the task in `/agents/search.json` and open its `guide`. Each card includes a copyable TSX example with the default UI alias, typed prop variants, referenced data models and a registry URL. The `parts` field lists smaller components in the same install. Russian cards start at `/agents/ru/search.json`. Paths resolve against the catalog origin.

To keep Takt available across sessions, merge the namespace from **Install → Project registry** into your project's `components.json`. Add the published guide URL alongside the existing instructions in your app's `AGENTS.md`. The namespace also works with the [shadcn MCP server](https://ui.shadcn.com/docs/mcp).

```sh
bunx shadcn@latest search @takt -q draft --type ui
bunx shadcn@latest view @takt/chat-composer
bunx shadcn@latest add @takt/chat-composer
```

For a composer on an existing page, open the Chat Composer guide. Its controlled example posts to your app’s `/api/messages` endpoint, clears the draft on success and preserves it on failure. Install the example and its dependencies with `bunx shadcn@latest add @takt/chat-composer-demo`. In a configured shadcn MCP client, search for items in `@takt` using “draft”, then ask for the `chat-composer-demo` example. For a read-only message, install `@takt/chat-post`. Its CSS module travels with the TSX file. [Chat Composer guide](https://takt-ui.vercel.app/agents/components/chat-composer.json)

## Run and publish the catalog

```sh
bun install
bun run dev
```

The production catalog is at [takt-ui.vercel.app](https://takt-ui.vercel.app). GitHub Actions checks pull requests and pushes to `main` with a frozen Bun install, unit and component tests, ESLint, a production build, registry contracts and end-to-end browser tests. The Vercel project uses the Next.js preset and the build command in `vercel.json`. Vercel builds and publishes production from the `main` branch of the [public Takt repository](https://github.com/par1ram/takt-ui) on each push.

Component detail pages live at `/components/<slug>` and `/ru/components/<slug>`. The sitemap, canonical URLs and language alternates use the production domain. Set `NEXT_PUBLIC_TAKT_ORIGIN` at build time when moving to a custom domain. Run `node scripts/check-seo.mjs https://takt-ui.vercel.app` to check the published catalog.

Edit components in `components/motion/`, catalog metadata in `lib/catalog.ts` and English copy in `i18n/en.json`. Regenerate using `bun run registry:build`. Published English components contain their own copy and work with the consumer's shadcn tokens. Receipt Printer runs in demo mode by default; pass an order and an asynchronous `onPay` callback to print after your checkout confirms a payment.

Run `bun run test` for quick feedback. After installing the three Playwright browsers, run the full pyramid with `bun run test:all`. [Testing guide](TESTING.md)

With the production server running, use `PLAYWRIGHT_CHANNEL=chrome bun run motion:review` for browser checks. [Component review log](COMPONENT-REVIEW.md)

With the built catalog running, `bun run registry:check http://127.0.0.1:3000` initializes a temporary Next.js consumer with shadcn, installs through a custom UI alias and exercises draft retry in Chromium. It also type-checks the guides against the English and Russian bundles. Install the Playwright Chromium binary or set `PLAYWRIGHT_CHANNEL=chrome`.
