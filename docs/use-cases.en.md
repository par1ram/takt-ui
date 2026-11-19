# Takt component use cases

## Inputs

### [Invite People](../components/motion/invite-people.tsx)

- In project settings, an admin enters a designer’s email. The app sends the invitation through onInvite and the form keeps the address if delivery fails.
- When setting up a team, the organizer checks the existing members before inviting the next colleague.

### [Wave Slider](../components/motion/wave-slider.tsx)

- In a player, a listener sets volume on a 0–100 scale. The app converts the percentage to an audio level.
- In an ambient sound editor, the app restores the saved level through value and updates the mix as the user moves the slider.

### [Flip Counter](../components/motion/flip-counter.tsx)

- When booking a table, a guest adds people up to the table’s seating capacity.
- In a print order, a customer changes the number of copies. The app recalculates the quote from the new count.

### [File Drop](../components/motion/file-drop.tsx)

- When opening a support ticket, a customer drops screenshots. The form receives File objects and attaches them when the ticket is submitted.
- In a gallery editor, an author selects images from disk. The app previews the chosen files before upload.

### [Spring Switch](../components/motion/spring-switch.tsx)

- In profile settings, a user enables notifications. The app saves the flag and restores it on the next visit.
- In a layout editor, a user temporarily enables a grid. The local switch tells the canvas when to show its guides.

### [Spring Dropdown](../components/motion/spring-dropdown.tsx)

- In an illustration editor, an author selects a file format from a short list before exporting.
- In an order list, a manager selects a sort order. The app receives the chosen option and reorders the list.

### [Letter Limit](../components/motion/letter-limit.tsx)

- On a profile page, an author trims their bio to the platform limit and sees how much space it uses.
- When writing a short caption, an editor pastes text containing emoji. The field enforces the limit without splitting combined characters.

### [Springy Input](../components/motion/springy-input.tsx)

- In a knowledge base, a teammate enters a question and submits it with Enter. The app opens the results page.
- In a swatch catalog, a designer types part of a name. The app uses onChange to filter swatches as they type.

### [OTP Code](../components/motion/otp-code.tsx)

- At sign-in, a user pastes a one-time code from a message. The app submits the complete code for verification, including leading zeros.
- When confirming a new email, a user enters four digits. The app sets the field length to match its verification code.

### [Star Rating](../components/motion/star-rating.tsx)

- After a class, a student rates the lesson. The app records the selected number of stars against that lesson.
- In a prototype gallery, a participant rates each design. The app collects the scores for comparison.

### [Tag Input](../components/motion/tag-input.tsx)

- Before publishing an article, an editor adds topics, removes an accidental tag and saves the resulting list.
- In a media library, a teammate opens an asset’s existing keywords and adds more so it is easier to find later.

### [Password Strength](../components/motion/password-strength.tsx)

- At signup, a user watches the local strength estimate change as they type a new password.
- In a password change form, a user improves the candidate before submitting. The app applies its own policy when saving.

### [Checkbox List](../components/motion/checkbox-list.tsx)

- When exporting a report, an analyst selects the sections to include. The app builds the file from those choices.
- In newsletter settings, a subscriber selects topics of interest and saves several preferences at once.

### [Jelly Slider](../components/motion/jelly-slider.tsx)

- In a sticker editor, a designer moves an opacity slider. The app applies the selected percentage to the sticker.
- In a motion demo, a visitor adjusts an effect’s intensity and sees the numeric value beside the slider.

### [Detent Dial](../components/motion/detent-dial.tsx)

- On a synthesizer panel, a musician turns a dial to select one of eleven effect levels.
- In a lamp prototype, a designer selects a brightness step. The app maps the 0–10 position to a light output level.

### [Exposure Slider](../components/motion/exposure-slider.tsx)

- A photographer adjusts portrait exposure and compares the preview with the original before saving.
- In a photography lesson, a learner tries negative and positive exposure adjustments on one frame, then resets to zero.

### [Wheel Picker](../components/motion/wheel-picker.tsx)

- When setting up a profile, a user scrolls through time zones and saves their selection.
- In a mobile timer, a user selects a duration from preset intervals. The app maps the selection to a timer value.

### [Scrubber](../components/motion/scrubber.tsx)

- In an animation preview, a designer scrubs to an individual frame to inspect an object’s position.
- When reviewing an experiment recording, a researcher selects a sample number. The app displays the data for that position.

### [Card Field](../components/motion/card-field.tsx)

- In a checkout prototype, a tester selects the built-in test card and resets it for the next run.
- In a live checkout, a customer fills in Stripe Elements over HTTPS. The app uses onCompleteChange to decide when to offer payment confirmation.

### [Signature Pad](../components/motion/signature-pad.tsx)

- At equipment pickup, the recipient signs with a finger. The app attaches the resulting PNG to the pickup record.
- In a greeting card editor, an author adds a handwritten autograph, undoes a stray stroke and saves the drawing.

## Cards

### [Focus Mode](../components/motion/focus-mode.tsx)

- Before reviewing a mockup, a designer starts a 25-minute session. The notification stack collapses and the timer shows the time left.
- In a learning workspace, a student turns on focus for an exercise. The app uses onChange to pause its own notification popups.

### [Swipe Deck](../components/motion/swipe-deck.tsx)

- On a portfolio page, a visitor swipes through a poster series one piece at a time.
- When shortlisting covers, an editor swipes a candidate right to keep it. The app records the card and direction from onSwipe.

### [Glass Player](../components/motion/glass-player.tsx)

- On a lesson page, a student scrubs back to a phrase they missed in an audio explanation.
- In a music catalog, a buyer loops a track preview to compare its arrangement with another version.

### [Stat Card](../components/motion/stat-card.tsx)

- On an editorial dashboard, a team member switches page views from daily to weekly to see how readership changed.
- In a support report, a manager selects a chart point to read the ticket count for a specific period.

### [Plan Switch](../components/motion/plan-switch.tsx)

- On a pricing page, a buyer compares the monthly price with the annual total before subscribing.
- At renewal, a customer changes the billing period. The app uses the selected index to send the corresponding plan to checkout.

### [Cart Button](../components/motion/cart-button.tsx)

- In a print catalog, a shopper adds the first copy and adjusts the quantity directly on the product card.
- At a merchandise kiosk, a shopper removes an extra item. The app receives the new quantity and updates the order total.

### [Unlock Face ID](../components/motion/unlock-face-id.tsx)

- In an interactive prototype, a client tries a simulated scan and sees the unlocked file state.
- In a protected vault UI, a user starts verification. The app runs its authentication mechanism and passes the result through status.

### [Morph Island](../components/motion/morph-island.tsx)

- In an incoming-call prototype, a user accepts or declines a call. The app receives the decision through onCall.
- In a mobile UI presentation, a designer cycles through the built-in activities to show a timer and operation progress in one compact panel.

### [Receipt Printer](../components/motion/receipt-printer.tsx)

- After checkout, a shop shows a receipt with the order ID returned by its server. The buyer can print that confirmed receipt again.
- In a point-of-sale prototype, a designer runs a demo purchase and shows the receipt without connecting a payment service.

### [Parallax Ticket](../components/motion/parallax-ticket.tsx)

- On a concert page, a visitor explores the ticket artwork and flips it over to see the date.
- In an identity design portfolio, a designer presents a pass mockup with custom artwork, an event name and a date.

### [Glass Lens](../components/motion/glass-lens.tsx)

- On a fabric product page, a shopper moves the lens over a photo to inspect the weave.
- During a design review, a designer magnifies a screenshot detail and moves the lens with the arrow keys.

### [Pull Refresh](../components/motion/pull-refresh.tsx)

- In a mobile recent-files panel, a teammate pulls down to refresh. The app requests fresh data in onRefresh.
- After a connection drops, a user retries the sync with the button and reads its status to see whether the request completed.

### [Expand Card](../components/motion/expand-card.tsx)

- In a collection list, a shopper opens a card, reads the details and returns to the overview.
- In a workshop listing, an organizer puts the full session description behind a compact cover that visitors can expand.

### [Fan Cards](../components/motion/fan-cards.tsx)

- In an illustrator’s portfolio, a visitor fans out labeled cards to see which works belong to a series.
- In a card-game demo, a player fans out their hand and moves the pointer across it to lift an individual card.

### [Profile Card](../components/motion/profile-card.tsx)

- In a mentor directory, a student opens a conversation with a particular mentor. The app receives the name through onMessage.
- In a community, a reader follows an author from their profile card. The app persists the follow state.

### [Boarding Pass](../components/motion/boarding-pass.tsx)

- On a trip screen, a passenger expands the boarding pass to check their seat, gate and boarding time.
- In a connecting itinerary, the app shows a separate pass for each flight so the traveler can distinguish the legs of the trip.

### [Notification Stack](../components/motion/notification-stack.tsx)

- On a team dashboard, a teammate reviews stacked build notifications and dismisses the ones they have read.
- In an activity center, the app updates notifications with stable IDs while the user works through the remaining cards.

### [Page Flip](../components/motion/page-flip.tsx)

- In a digital booklet, a visitor flips through short chapter captions like pages in a printed edition.
- In a visual concept presentation, a designer shows one idea per spread and moves in either direction with the arrow keys.

## Buttons

### [Magnetic Button](../components/motion/magnetic-button.tsx)

- On a studio homepage, a visitor presses “View portfolio.” The app opens the collection through onClick.
- At the end of a presentation, a “Try the demo” button responds to the approaching pointer and opens the demo when pressed.

### [Hold to Confirm](../components/motion/hold-button.tsx)

- Before clearing a draft, the author holds the button to confirm. Releasing it early preserves the text.
- At a kiosk, an operator holds the session reset button. The app starts the reset after onConfirm.

### [Bloom Menu](../components/motion/bloom-menu.tsx)

- Beside a selected shape, a designer expands duplicate and delete actions and applies one to that shape.
- On a photo card, an editor opens a compact menu to download the original or copy its link through an app handler.

### [Command Button](../components/motion/command-button.tsx)

- In an invoice preview, an operator starts printing with one button. The app opens the print dialog in onExecute.
- In a command demo, a developer repeats an operation and sees how many times it was invoked.

### [Loading Success](../components/motion/loading-success.tsx)

- In integration settings, an admin tests a connection. The button waits for the server and offers another attempt if the check fails.
- In a report, an analyst starts a sync and sees confirmation once the request completes.

### [Copy Button](../components/motion/copy-button.tsx)

- In documentation, a developer copies the entire installation command and pastes it into a terminal.
- On an order page, a customer copies the ticket number for a support email and gets confirmation.

### [Like Burst](../components/motion/like-burst.tsx)

- In a community feed, a reader likes a post and immediately sees its count change.
- On an illustration page, a viewer presses again to remove their like. The app saves the new flag through onChange.

### [Slide To Confirm](../components/motion/slide-to-confirm.tsx)

- At a packing station, a worker slides to confirm after inspecting a parcel. The app marks it ready to ship.
- On a mobile terminal, an operator ends a shift with a deliberate slide so a stray tap cannot close the shift.

### [Undo Button](../components/motion/undo-button.tsx)

- In a draft list, an author removes an entry and restores it immediately after spotting a mistaken selection.
- In a reading collection, an editor temporarily excludes an article. The app updates its visibility and supports undo.

### [Bell Button](../components/motion/bell-button.tsx)

- On a project page, a member subscribes to updates and presses again to unsubscribe.
- On a livestream page, a viewer enables a reminder. The app uses the new flag to schedule a notification.

### [Morph Popover](../components/motion/morph-popover.tsx)

- A reader spots an error in the docs and sends feedback from a small form beside the article.
- During a mockup review, a designer leaves a short comment. If the service is unavailable, they retry from the same form.

### [Music Toggle](../components/motion/music-toggle.tsx)

- On an exhibition site, a visitor enables background music. The app starts the track when the toggle changes.
- In an interactive story, a reader turns off the soundtrack and continues reading in silence.

### [Hold to Publish](../components/motion/hold-to-publish.tsx)

- Before releasing an article, an editor holds the publish button. The app submits the piece to the CMS after the hold completes.
- In a teaching workspace, an author starts publishing a lesson, spots a mistake and releases the button before confirming.

### [Command Search](../components/motion/command-search.tsx)

- In a documentation hub, a developer presses Ctrl/⌘+K, enters a phrase and opens the results page through the app handler.
- In a compact project toolbar, a user expands a button into a field and searches for a file using free text.

## Navigation

### [Spring Dock](../components/motion/spring-dock.tsx)

- In a layout editor, a designer picks a tool by its icon. The app maps the button index to a canvas tool.
- In a creator workspace, a bottom dock opens the library, drafts and publications, highlighting the active section.

### [Morph Tooltip](../components/motion/morph-tooltip.tsx)

- In a reading list, a reader opens an article’s actions and bookmarks it for later.
- On a research board, a contributor pins an important reference. The app handles the pin action for that entry.

### [Tab Pill](../components/motion/tab-pill.tsx)

- In a setup guide, a developer switches between API and CLI tabs to read the relevant snippet.
- In a material description, a shopper opens care instructions beside the specifications without leaving the product page.

### [Segmented Control](../components/motion/segmented-control.tsx)

- In a performance report, an analyst switches between p50 and p95. The app supplies the series for the selected metric.
- In a file manager, a user chooses a grid or list. The app changes how it displays the same files.

### [Rubber Dock](../components/motion/rubber-dock.tsx)

- In a workspace shell, a user moves from Files to Calendar using the built-in four-section dock.
- In a mobile desktop prototype, a designer moves across the dock, previews its labels and selects Photos.

### [Dynamic Menu](../components/motion/dynamic-menu.tsx)

- In a diagram editor, an author opens the export submenu and selects SVG. The app starts the corresponding exporter.
- In a report builder, an analyst opens the format list, goes back a level and revisits the export choice.

### [Sidebar Collapse](../components/motion/sidebar-collapse.tsx)

- In a design workspace, a designer collapses navigation to make room for the canvas while retaining access to both sections.
- In a studio workspace, a teammate selects Projects or Collections. The app switches content using the section index.

### [Pagination Dots](../components/motion/pagination-dots.tsx)

- In a product gallery, a shopper jumps to a particular photo using the dots below the image.
- In an onboarding tour, a user jumps to the last screen with the keyboard. The app displays the slide at the selected index.

### [Command Palette](../components/motion/command-palette.tsx)

- In an editor, a user types part of a command name and runs the matching action with Enter.
- In an admin console, an operator finds the command for opening the ticket queue. The app maps the selected command to its route.

### [Step Progress](../components/motion/step-progress.tsx)

- In an application form, a customer moves through contact details, options and review. The app shows the fields for the selected step.
- In a setup wizard, an admin returns to a numbered step to correct settings before finishing.

### [Toolbar](../components/motion/toolbar.tsx)

- In a note editor, an author turns on bold and italic and immediately sees the combination in a text sample.
- In a template builder, a designer removes one style. The app receives the remaining styles for the selected label.

### [Stack Panel](../components/motion/stack-panel.tsx)

- In compact settings, a user moves from the root menu into notification preferences and then goes back one level.
- In product help, a reader picks a topic. The app displays the associated content in the same panel through renderPanel.

### [Swipe Tabs](../components/motion/swipe-tabs.tsx)

- On a mobile product page, a shopper swipes between the description, specifications and reviews.
- In a course workspace, a student opens a link to the practice tab. The app sets the active ID and updates the URL on subsequent changes.

## Text

### [Rolling Text](../components/motion/rolling-text.tsx)

- At an exhibition kiosk, a visitor taps the greeting to read it in the next language.
- In a brand type specimen, a designer cycles through short words with the arrow keys to compare letterforms.

### [Weight Wave](../components/motion/weight-wave.tsx)

- On a type studio’s page, a visitor moves across a word to see how the weight of nearby letters changes.
- In an interactive wordmark specimen, a designer moves the emphasis across letters with the keyboard to inspect each shape.

### [Goo Morph](../components/motion/goo-morph.tsx)

- In a brand presentation, a viewer taps a keyword to reveal the next principle in the series.
- In a motion showcase, a designer supplies their own words to compare transitions between short and long names.

### [Scramble Text](../components/motion/scramble-text.tsx)

- On a game promo page, a visitor triggers a decoding effect that reveals the mission name.
- In a release presentation, the presenter reveals the version’s codename as an animated label.

### [Read Along](../components/motion/read-along.tsx)

- In a language lesson, a learner starts word-by-word highlighting and pauses at a difficult phrase.
- When rehearsing a short speech, a speaker selects a word midway through the text and resumes at the chosen pace.

### [Roll Links](../components/motion/roll-links.tsx)

- In portfolio navigation, a visitor sees a hover response on a section name and follows its link.
- At the end of an article, a reader focuses the documentation link with the keyboard and opens it without a mouse.

### [Marker Text](../components/motion/marker-text.tsx)

- In lecture notes, an instructor taps a short quotation to highlight it during an explanation.
- During a presentation, an editor highlights a key point and clears the mark before showing it again.

### [Dynamic Text](../components/motion/dynamic-text.tsx)

- In a product-family heading, the brand name stays fixed while a visitor taps through the product names.
- In a classroom example, a student changes the ending of a short phrase to explore combinations with a fixed opening.

### [Typewriter](../components/motion/typewriter.tsx)

- In a terminal demo, a reader starts the character-by-character reveal of a prepared command.
- On a game introduction screen, the author chooses a slow reveal so the player can read a line as dialogue.

## AI

### [Prompt Box](../components/motion/prompt-box.tsx)

- On an assistant’s empty screen, an analyst picks “Summarize the report,” refines the prompt and submits it.
- In a writing assistant, an author enters a custom request. The app returns its request promise so the form shows progress and allows a retry on failure.

### [Streaming Reply](../components/motion/streaming-reply.tsx)

- In a chatbot demo, a visitor starts the gradual reveal of a prepared reply and watches the words appear.
- In a worked example, a learner reads an explanation in stages. The app supplies the completed text for playback.

### [Ghost Suggestion](../components/motion/ghost-suggestion.tsx)

- In a travel form, a user starts typing a city and completes its name from a matching suggestion.
- In a command field, a developer enters the prefix of a known command. The app supplies the vocabulary used for inline completion.

### [Goo Thinking](../components/motion/goo-thinking.tsx)

- In an assistant prototype, a designer taps the processing indicator to reveal a short sample reply.
- In a search presentation, a presenter replays the transition from “Finding matches” to a prepared result.

### [Assistant Orb](../components/motion/siri-orb.tsx)

- In a voice assistant, the user sees when the app is listening, processing or speaking. The app passes the current state to AssistantOrb.
- On a recording screen, the app supplies normalized microphone amplitude so the orb reacts to voice volume.

### [Agent Steps](../components/motion/agent-steps.tsx)

- In a training demo, a user advances an agent from reading a file to preparing a result and sees how many steps are complete.
- During a presentation, the presenter advances each step with a button. The app uses onStep to display that step’s artifact alongside it.

### [Tool Approval](../components/motion/tool-approval.tsx)

- Before creating an event, an assistant shows the calendar and proposed action. The user approves or declines, and the app handles the decision.
- In a workspace, an agent proposes changing a specific file. The editor checks the resource name before approving the write.

### [Thinking Text](../components/motion/thinking-text.tsx)

- While an assistant gathers document context, the reader sees a short status beside the reply area.
- On a report page, the app displays “Processing rows” while a background calculation runs, then replaces it with the result.

### [Task List](../components/motion/task-list.tsx)

- Before a release, a teammate checks off completed reviews and sees how many items remain.
- In a lab workbook, a student checks off finished tasks. The app saves the completed task names through onChange.

### [Voice Input](../components/motion/voice-input.tsx)

- In a discussion, a user records a voice comment and stops recording. The app attaches the resulting audio file to the message.
- In a notes form, an author dictates an idea. The app sends the Blob from onRecord to its transcription service.

## Learning

### [Lesson Outline](../components/motion/lesson-outline.tsx)

- Returning to a course, a student sees the current lesson in the outline and resumes it with the continue button.
- Before a class, a participant reviews the topic sequence and follows the link to a particular lesson.

### [Code Exercise](../components/motion/code-exercise.tsx)

- In a regex lesson, a student edits a pattern, checks it against sample strings and inspects mismatches.
- In a lab, a student returns to an unfinished exercise. The app assigns each exercise its own draftKey so the right draft is restored.

### [Run Console](../components/motion/run-console.tsx)

- During an exercise run, a student sees the execution phase, output and duration reported by the runner.
- When a run stalls or fails, a student requests a stop or jumps to the offending line through the editor’s handler.

### [Test Results](../components/motion/test-results.tsx)

- After checking a solution, a student selects a failing case and compares its input, expected value and actual result.
- During review, a student asks about a particular mismatch. The app sends the selected case to a tutor through onAsk.

### [Ask Tutor](../components/motion/ask-tutor.tsx)

- During an exercise, a student asks about a selected code fragment. The app sends the question and its context to the tutoring service.
- While investigating a mistake, a learner removes an irrelevant source before submitting and reads a reply citing the relevant lesson passage.

### [Lesson Citation](../components/motion/lesson-citation.tsx)

- Below a tutor’s reply, a student expands a citation and checks the explanation against the original lesson passage.
- In an exercise review, a reader opens the referenced textbook section. The app can take them back to the marked location through onReturn.

### [Predict Output](../components/motion/predict-output.tsx)

- Before running an example, a student predicts its output and reads the explanation.
- At a lesson checkpoint, an instructor supplies possible results for an expression. The app records the learner’s choice through onAnswer.

### [Execution Trace](../components/motion/execution-trace.tsx)

- When studying a loop, a student steps through the trace and follows the counter beside the highlighted line.
- When explaining a bug, an instructor goes back to the step where a variable first acquired the wrong value.

### [Hint Ladder](../components/motion/hint-ladder.tsx)

- When stuck on a problem, a student opens a general hint first and requests the next one only if needed.
- In a lab, an instructor arranges hints from a general idea to a concrete step. The app records how far each learner went.

## Messenger

### [Channel List](../components/motion/channel-list.tsx)

- In a course sidebar, a student selects their cohort’s channel. The app opens the conversation by its stable ID.
- In team chat, a colleague switches from a shared channel to a direct conversation. The list highlights the selection controlled by the app.

### [Chat Composer](../components/motion/chat-composer.tsx)

- On a ticket page, a customer submits a comment. If the network is unavailable, the typed text stays in the field for another attempt.
- When switching conversations, an operator can return to an unfinished reply. The app stores one draft per conversation and supplies it through value.

### [Message Reactions](../components/motion/message-reactions.tsx)

- Under a release announcement, a teammate adds a reaction and sees the count update beside the emoji.
- In a proposal thread, a member removes their reaction. The app updates that emoji’s count while preserving everyone else’s reactions.

### [Chat Post](../components/motion/chat-post.tsx)

- In a support log, a reader sees a single message with its author, time and code snippet, even on a page without a reply editor.
- In a course feed, an instructor shares a workbook link. The card shows the resource below the text, and the app adds reactions through children.

### [Message Thread](../components/motion/message-thread.tsx)

- In a design review, a designer opens a comment thread and replies with the original message visible above the discussion.
- In support, an operator switches between threads. The app keeps each thread’s draft separate from its posted replies.

### [Course Messenger](../components/motion/course-messenger.tsx)

- In a course workspace, a student discusses an assignment in the cohort channel and opens a thread for a specific question.
- In a team workspace, a colleague moves between direct and shared conversations. The app synchronizes messages and reactions with its server.

## Metrics

### [Latency Chart](../components/motion/latency-chart.tsx)

- After a release, an engineer compares median API latency with p95 to spot slowdowns affecting a subset of requests.
- During incident review, an on-call engineer steps through samples and distinguishes a missing measurement from a measured zero.

### [Conversion Funnel](../components/motion/conversion-funnel.tsx)

- In a store report, an analyst compares counts at the cart, checkout and purchase stages to find the biggest drop-off.
- A course team compares signups, first lessons and completions. The app supplies the participant count for each stage.

### [Cohort Retention](../components/motion/cohort-retention.tsx)

- In a subscription report, an analyst compares the share of users in different signup cohorts who returned a week later.
- In a course dashboard, a curriculum lead distinguishes a future cohort week from a completed week in which nobody returned.

## Trackers

### [Issue Board](../components/motion/issue-board.tsx)

- At stand-up, a developer moves a card from backlog to active so the team sees the task’s new status.
- During intake, a manager creates a task directly on the board. The app saves the updated list and refreshes its other views.

### [Issue Table](../components/motion/issue-table.tsx)

- During backlog triage, a manager sorts issues by priority and corrects a title inline.
- In a team meeting, a coordinator changes a task’s status in the table. The board receives the same updated array and shows the new status.

### [Cycle Planner](../components/motion/cycle-planner.tsx)

- Before a sprint, a team adds estimated issues to a cycle and sees how many points still fit.
- When capacity changes, a lead removes an issue from the cycle and checks whether the plan is back within budget.
