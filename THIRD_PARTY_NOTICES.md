# Third-party notices

Takt is released under the MIT License (see [LICENSE](LICENSE)). Many components in
`components/motion/` are ports of work published by other authors, collected through the
[DesignBookmark Motion](https://designbookmark.com/motion) catalog. This file records the
origin of every ported component and reproduces the license terms that apply to it.

Each upstream entry below was checked against the author's own repository or site. Where an
upstream grants an open-source license, its copyright line and full license text appear here.
Where it does not, the entry says so instead of assuming a license.

The mapping between a catalog id (first column) and the ported file is recorded in
[`references/motion/manifest.json`](references/motion/manifest.json); the file installed by
the shadcn registry is `components/motion/<slug>.tsx`.

Components with no upstream entry in this file — Receipt Printer, Lesson Outline, Code
Exercise, Run Console, Test Results, Ask Tutor, Lesson Citation, Predict Output, Execution
Trace, Hint Ladder, Channel List, Chat Composer, Message Reactions, Chat Post, Message
Thread, Course Messenger, Latency Chart, Conversion Funnel, Cohort Retention, Issue Board,
Issue Table and Cycle Planner — are original Takt work and are covered by the MIT License
above.

## Kokonut UI — MIT

25 components are ported from [Kokonut UI](https://kokonutui.com) by
[kokonut-labs](https://github.com/kokonut-labs/kokonutui). The repository is published under
the MIT License, and each ported source file carries an `@license: MIT` header.

Copyright (c) 2025 kokonutUI

- `agent-steps` (upstream `ai-loading`) — https://kokonutui.com/docs/ai/ai-loading
- `bell-button` — https://kokonutui.com/docs/buttons/bell-button
- `boarding-pass` — https://kokonutui.com/docs/cards/boarding-pass
- `card-field` — https://kokonutui.com/docs/inputs/card-field
- `cart-button` — https://kokonutui.com/docs/buttons/cart-button
- `command-button` — https://kokonutui.com/docs/buttons/command-button
- `detent-dial` — https://kokonutui.com/docs/inputs/detent-dial
- `dynamic-text` — https://kokonutui.com/docs/texts/dynamic-text
- `glass-player` (upstream `liquid-glass-card`) — https://kokonutui.com/docs/cards/liquid-glass-card
- `hold-button` — https://kokonutui.com/docs/buttons/hold-button
- `marker-text` — https://kokonutui.com/docs/texts/marker-text
- `morph-popover` — https://kokonutui.com/docs/buttons/morph-popover
- `notification-stack` — https://kokonutui.com/docs/cards/notification-stack
- `page-flip` — https://kokonutui.com/docs/cards/page-flip
- `signature-pad` — https://kokonutui.com/docs/inputs/signature-pad
- `slide-to-confirm` — https://kokonutui.com/docs/buttons/slide-to-confirm
- `stack-panel` — https://kokonutui.com/docs/navigation/stack-panel
- `swipe-tabs` (upstream `smooth-tab`) — https://kokonutui.com/docs/navigation/smooth-tab
- `thinking-text` (upstream `ai-text-loading`) — https://kokonutui.com/docs/ai/ai-text-loading
- `tool-approval` (upstream `ai-tool-approval`) — https://kokonutui.com/docs/ai/ai-tool-approval
- `toolbar` — https://kokonutui.com/docs/navigation/toolbar
- `typewriter` (upstream `type-writer`) — https://kokonutui.com/docs/texts/type-writer
- `undo-button` — https://kokonutui.com/docs/buttons/undo-button
- `voice-input` (upstream `ai-voice`) — https://kokonutui.com/docs/ai/ai-voice
- `wheel-picker` — https://kokonutui.com/docs/inputs/wheel-picker

```text
MIT License

Copyright (c) 2025 kokonutUI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## SmoothUI — MIT

6 components are ported from [SmoothUI](https://smoothui.dev) by
[Eduardo Calvo](https://github.com/educlopez/smoothui). The repository is published under the
MIT License, and each ported source file is distributed with an "MIT licence" note.

Copyright (c) 2024 Eduardo Calvo

- `exposure-slider` — https://smoothui.dev/docs/components/exposure-slider
- `music-toggle` — https://smoothui.dev/docs/components/music-toggle
- `scrubber` — https://smoothui.dev/docs/components/scrubber
- `siri-orb` — https://smoothui.dev/docs/components/siri-orb
- `task-list` (upstream `ai-task-list`) — https://smoothui.dev/docs/components/ai-task-list
- `unlock-face-id` — https://smoothui.dev/docs/components/unlock-face-id

```text
MIT License

Copyright (c) 2024 Eduardo Calvo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## DesignBookmark (`command-search`) — MIT

52 components are based on examples published by
[DesignBookmark Motion](https://designbookmark.com/motion). Copyright (c) 2026
DesignBookmark.

Exactly one of them, `command-search` (upstream `db-command-button`), states a license in the
source it was ported from: both header lines of that file end in "MIT", so it is used here
under the MIT License, reproduced below. It is the only DesignBookmark component whose terms
are explicit, and the MIT grant covers that file alone. The remaining 51 ports are covered by
the section after it.

```text
MIT License

Copyright (c) 2026 DesignBookmark

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- `command-search` (upstream `db-command-button`) — https://designbookmark.com/motion#db-command-button

## DesignBookmark (51 ports) — license status unresolved

**No license is asserted for the files listed below.** DesignBookmark publishes these
examples as page source with prompts for use in a project, but the site grants no license for
redistribution. Neither the Motion page, the terms of service nor the individual source files
include a license statement: the HTML bundles open with "by DesignBookmark" and no terms, the
site footer reads "© DesignBookmark 2026", and there is no public repository to check against.

Attribution is recorded here, but redistribution of these ports and of every component that
derives from them needs confirmation from DesignBookmark. See the pull request description for
the decision the repository owner has to make; until then, the copyright notice below applies
and no MIT grant is claimed.

- `bloom-menu` (upstream `db-goo-menu`) — https://designbookmark.com/motion#db-goo-menu
- `checkbox-list` (upstream `db-checkbox-list`) — https://designbookmark.com/motion#db-checkbox-list
- `command-palette` (upstream `db-command-palette`) — https://designbookmark.com/motion#db-command-palette
- `copy-button` (upstream `db-copy-button`) — https://designbookmark.com/motion#db-copy-button
- `dynamic-menu` (upstream `db-dynamic-menu`) — https://designbookmark.com/motion#db-dynamic-menu
- `expand-card` (upstream `db-expand-card`) — https://designbookmark.com/motion#db-expand-card
- `fan-cards` (upstream `db-fan-cards`) — https://designbookmark.com/motion#db-fan-cards
- `file-drop` (upstream `db-file-drop`) — https://designbookmark.com/motion#db-file-drop
- `flip-counter` (upstream `db-number-stepper`) — https://designbookmark.com/motion#db-number-stepper
- `focus-mode` (upstream `db-focus-mode`) — https://designbookmark.com/motion#db-focus-mode
- `ghost-suggestion` (upstream `db-ghost-suggestion`) — https://designbookmark.com/motion#db-ghost-suggestion
- `glass-lens` (upstream `db-glass-lens`) — https://designbookmark.com/motion#db-glass-lens
- `goo-morph` (upstream `db-goo-morph`) — https://designbookmark.com/motion#db-goo-morph
- `goo-thinking` (upstream `db-goo-thinking`) — https://designbookmark.com/motion#db-goo-thinking
- `hold-to-publish` (upstream `db-hold-button`) — https://designbookmark.com/motion#db-hold-button
- `invite-people` (upstream `db-invite-people`) — https://designbookmark.com/motion#db-invite-people
- `jelly-slider` (upstream `db-jelly-slider`) — https://designbookmark.com/motion#db-jelly-slider
- `letter-limit` (upstream `db-letter-limit`) — https://designbookmark.com/motion#db-letter-limit
- `like-burst` (upstream `db-like-burst`) — https://designbookmark.com/motion#db-like-burst
- `loading-success` (upstream `db-loading-success`) — https://designbookmark.com/motion#db-loading-success
- `magnetic-button` (upstream `db-magnetic-button`) — https://designbookmark.com/motion#db-magnetic-button
- `morph-island` (upstream `db-morph-island`) — https://designbookmark.com/motion#db-morph-island
- `morph-tooltip` (upstream `db-morph-tooltip`) — https://designbookmark.com/motion#db-morph-tooltip
- `otp-code` (upstream `db-otp-code`) — https://designbookmark.com/motion#db-otp-code
- `pagination-dots` (upstream `db-pagination-dots`) — https://designbookmark.com/motion#db-pagination-dots
- `parallax-ticket` (upstream `db-parallax-ticket`) — https://designbookmark.com/motion#db-parallax-ticket
- `password-strength` (upstream `db-password-strength`) — https://designbookmark.com/motion#db-password-strength
- `plan-switch` (upstream `db-plan-switch`) — https://designbookmark.com/motion#db-plan-switch
- `profile-card` (upstream `db-profile-card`) — https://designbookmark.com/motion#db-profile-card
- `prompt-box` (upstream `db-prompt-box`) — https://designbookmark.com/motion#db-prompt-box
- `pull-refresh` (upstream `db-pull-refresh`) — https://designbookmark.com/motion#db-pull-refresh
- `read-along` (upstream `db-read-along`) — https://designbookmark.com/motion#db-read-along
- `roll-links` (upstream `db-roll-links`) — https://designbookmark.com/motion#db-roll-links
- `rolling-text` (upstream `db-word-roll`) — https://designbookmark.com/motion#db-word-roll
- `rubber-dock` (upstream `db-rubber-dock`) — https://designbookmark.com/motion#db-rubber-dock
- `scramble-text` (upstream `db-scramble-text`) — https://designbookmark.com/motion#db-scramble-text
- `segmented-control` (upstream `db-segmented-control`) — https://designbookmark.com/motion#db-segmented-control
- `sidebar-collapse` (upstream `db-sidebar-collapse`) — https://designbookmark.com/motion#db-sidebar-collapse
- `spring-dock` (upstream `db-bottom-bar`) — https://designbookmark.com/motion#db-bottom-bar
- `spring-dropdown` (upstream `db-spring-dropdown`) — https://designbookmark.com/motion#db-spring-dropdown
- `spring-switch` (upstream `db-toggle-switch`) — https://designbookmark.com/motion#db-toggle-switch
- `springy-input` (upstream `db-springy-input`) — https://designbookmark.com/motion#db-springy-input
- `star-rating` (upstream `db-star-rating`) — https://designbookmark.com/motion#db-star-rating
- `stat-card` (upstream `db-stat-card`) — https://designbookmark.com/motion#db-stat-card
- `step-progress` (upstream `db-step-progress`) — https://designbookmark.com/motion#db-step-progress
- `streaming-reply` (upstream `db-streaming-reply`) — https://designbookmark.com/motion#db-streaming-reply
- `swipe-deck` (upstream `db-swipe-deck`) — https://designbookmark.com/motion#db-swipe-deck
- `tab-pill` (upstream `db-tab-pill`) — https://designbookmark.com/motion#db-tab-pill
- `tag-input` (upstream `db-tag-input`) — https://designbookmark.com/motion#db-tag-input
- `wave-slider` (upstream `db-range-slider`) — https://designbookmark.com/motion#db-range-slider
- `weight-wave` (upstream `db-weight-wave`) — https://designbookmark.com/motion#db-weight-wave
