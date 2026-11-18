import { createElement, lazy } from "react";
import type { Entry } from "@/lib/catalog";

export const demos = {
  "magnetic-button": lazy(() =>
    import("@/components/motion/magnetic-button").then((module) => ({
      default: module.MagneticButton,
    })),
  ),
  "flip-counter": lazy(() =>
    import("@/components/motion/flip-counter").then((module) => ({
      default: module.FlipCounter,
    })),
  ),
  "swipe-deck": lazy(() =>
    import("@/components/motion/swipe-deck").then((module) => ({
      default: module.SwipeDeck,
    })),
  ),
  "spring-dock": lazy(() =>
    import("@/components/motion/spring-dock").then((module) => ({
      default: module.SpringDock,
    })),
  ),
  "wave-slider": lazy(() =>
    import("@/components/motion/wave-slider").then((module) => ({
      default: module.WaveSlider,
    })),
  ),
  "hold-button": lazy(() =>
    import("@/components/motion/hold-button").then((module) => ({
      default: module.HoldButton,
    })),
  ),
  "rolling-text": lazy(() =>
    import("@/components/motion/rolling-text").then((module) => ({
      default: module.RollingText,
    })),
  ),
  "spring-switch": lazy(() =>
    import("@/components/motion/spring-switch").then((module) => ({
      default: module.SpringSwitch,
    })),
  ),
  "bloom-menu": lazy(() =>
    import("@/components/motion/bloom-menu").then((module) => ({
      default: module.BloomMenu,
    })),
  ),
  "invite-people": lazy(() =>
    import("@/components/motion/invite-people").then((module) => ({
      default: module.InvitePeople,
    })),
  ),
  "focus-mode": lazy(() =>
    import("@/components/motion/focus-mode").then((module) => ({
      default: module.FocusMode,
    })),
  ),
  "morph-tooltip": lazy(() =>
    import("@/components/motion/morph-tooltip").then((module) => ({
      default: module.MorphTooltip,
    })),
  ),
  "command-button": lazy(() =>
    import("@/components/motion/command-button").then((module) => ({
      default: module.CommandButton,
    })),
  ),
  "loading-success": lazy(() =>
    import("@/components/motion/loading-success").then((module) => ({
      default: module.LoadingSuccess,
    })),
  ),
  "copy-button": lazy(() =>
    import("@/components/motion/copy-button").then((module) => ({
      default: module.CopyButton,
    })),
  ),
  "like-burst": lazy(() =>
    import("@/components/motion/like-burst").then((module) => ({
      default: module.LikeBurst,
    })),
  ),
  "slide-to-confirm": lazy(() =>
    import("@/components/motion/slide-to-confirm").then((module) => ({
      default: module.SlideToConfirm,
    })),
  ),
  "cart-button": lazy(() =>
    import("@/components/motion/cart-button").then((module) => ({
      default: module.CartButton,
    })),
  ),
  "undo-button": lazy(() =>
    import("@/components/motion/undo-button").then((module) => ({
      default: module.UndoButton,
    })),
  ),
  "bell-button": lazy(() =>
    import("@/components/motion/bell-button").then((module) => ({
      default: module.BellButton,
    })),
  ),
  "unlock-face-id": lazy(() =>
    import("@/components/motion/unlock-face-id").then((module) => ({
      default: module.UnlockFaceId,
    })),
  ),
  "spring-dropdown": lazy(() =>
    import("@/components/motion/spring-dropdown").then((module) => ({
      default: module.SpringDropdown,
    })),
  ),
  "morph-island": lazy(() =>
    import("@/components/motion/morph-island").then((module) => ({
      default: module.MorphIsland,
    })),
  ),
  "tab-pill": lazy(() =>
    import("@/components/motion/tab-pill").then((module) => ({
      default: module.TabPill,
    })),
  ),
  "segmented-control": lazy(() =>
    import("@/components/motion/segmented-control").then((module) => ({
      default: module.SegmentedControl,
    })),
  ),
  "plan-switch": lazy(() =>
    import("@/components/motion/plan-switch").then((module) => ({
      default: module.PlanSwitch,
    })),
  ),
  "rubber-dock": lazy(() =>
    import("@/components/motion/rubber-dock").then((module) => ({
      default: module.RubberDock,
    })),
  ),
  "dynamic-menu": lazy(() =>
    import("@/components/motion/dynamic-menu").then((module) => ({
      default: module.DynamicMenu,
    })),
  ),
  "sidebar-collapse": lazy(() =>
    import("@/components/motion/sidebar-collapse").then((module) => ({
      default: module.SidebarCollapse,
    })),
  ),
  "pagination-dots": lazy(() =>
    import("@/components/motion/pagination-dots").then((module) => ({
      default: module.PaginationDots,
    })),
  ),
  "command-palette": lazy(() =>
    import("@/components/motion/command-palette").then((module) => ({
      default: module.CommandPalette,
    })),
  ),
  "step-progress": lazy(() =>
    import("@/components/motion/step-progress").then((module) => ({
      default: module.StepProgress,
    })),
  ),
  toolbar: lazy(() =>
    import("@/components/motion/toolbar").then((module) => ({
      default: module.Toolbar,
    })),
  ),
  "morph-popover": lazy(() =>
    import("@/components/motion/morph-popover").then((module) => ({
      default: module.MorphPopover,
    })),
  ),
  "letter-limit": lazy(() =>
    import("@/components/motion/letter-limit").then((module) => ({
      default: module.LetterLimit,
    })),
  ),
  "file-drop": lazy(() =>
    import("@/components/motion/file-drop").then((module) => ({
      default: module.FileDrop,
    })),
  ),
  "springy-input": lazy(() =>
    import("@/components/motion/springy-input").then((module) => ({
      default: module.SpringyInput,
    })),
  ),
  "otp-code": lazy(() =>
    import("@/components/motion/otp-code").then((module) => ({
      default: module.OtpCode,
    })),
  ),
  "star-rating": lazy(() =>
    import("@/components/motion/star-rating").then((module) => ({
      default: module.StarRating,
    })),
  ),
  "tag-input": lazy(() =>
    import("@/components/motion/tag-input").then((module) => ({
      default: module.TagInput,
    })),
  ),
  "password-strength": lazy(() =>
    import("@/components/motion/password-strength").then((module) => ({
      default: module.PasswordStrength,
    })),
  ),
  "checkbox-list": lazy(() =>
    import("@/components/motion/checkbox-list").then((module) => ({
      default: module.CheckboxList,
    })),
  ),
  "jelly-slider": lazy(() =>
    import("@/components/motion/jelly-slider").then((module) => ({
      default: module.JellySlider,
    })),
  ),
  "detent-dial": lazy(() =>
    import("@/components/motion/detent-dial").then((module) => ({
      default: module.DetentDial,
    })),
  ),
  "exposure-slider": lazy(() =>
    import("@/components/motion/exposure-slider").then((module) => ({
      default: module.ExposureSlider,
    })),
  ),
  "wheel-picker": lazy(() =>
    import("@/components/motion/wheel-picker").then((module) => ({
      default: module.WheelPicker,
    })),
  ),
  scrubber: lazy(() =>
    import("@/components/motion/scrubber").then((module) => ({
      default: module.Scrubber,
    })),
  ),
  "receipt-printer": lazy(() =>
    import("@/components/motion/receipt-printer").then((module) => ({
      default: module.ReceiptPrinter,
    })),
  ),
  "card-field": lazy(() =>
    import("@/components/motion/card-field").then((module) => ({
      default: module.CardField,
    })),
  ),
  "signature-pad": lazy(() =>
    import("@/components/motion/signature-pad").then((module) => ({
      default: module.SignaturePad,
    })),
  ),
  "parallax-ticket": lazy(() =>
    import("@/components/motion/parallax-ticket").then((module) => ({
      default: module.ParallaxTicket,
    })),
  ),
  "glass-lens": lazy(() =>
    import("@/components/motion/glass-lens").then((module) => ({
      default: module.GlassLens,
    })),
  ),
  "pull-refresh": lazy(() =>
    import("@/components/motion/pull-refresh").then((module) => ({
      default: module.PullRefresh,
    })),
  ),
  "expand-card": lazy(() =>
    import("@/components/motion/expand-card").then((module) => ({
      default: module.ExpandCard,
    })),
  ),
  "fan-cards": lazy(() =>
    import("@/components/motion/fan-cards").then((module) => ({
      default: module.FanCards,
    })),
  ),
  "stat-card": lazy(() =>
    import("@/components/motion/stat-card").then((module) => ({
      default: module.StatCard,
    })),
  ),
  "profile-card": lazy(() =>
    import("@/components/motion/profile-card").then((module) => ({
      default: module.ProfileCard,
    })),
  ),
  "boarding-pass": lazy(() =>
    import("@/components/motion/boarding-pass").then((module) => ({
      default: module.BoardingPass,
    })),
  ),
  "notification-stack": lazy(() =>
    import("@/components/motion/notification-stack").then((module) => ({
      default: module.NotificationStack,
    })),
  ),
  "page-flip": lazy(() =>
    import("@/components/motion/page-flip").then((module) => ({
      default: module.PageFlip,
    })),
  ),
  "stack-panel": lazy(() =>
    import("@/components/motion/stack-panel").then((module) => ({
      default: module.StackPanel,
    })),
  ),
  "glass-player": lazy(() =>
    import("@/components/motion/glass-player").then((module) => ({
      default: module.GlassPlayer,
    })),
  ),
  "weight-wave": lazy(() =>
    import("@/components/motion/weight-wave").then((module) => ({
      default: module.WeightWave,
    })),
  ),
  "goo-morph": lazy(() =>
    import("@/components/motion/goo-morph").then((module) => ({
      default: module.GooMorph,
    })),
  ),
  "scramble-text": lazy(() =>
    import("@/components/motion/scramble-text").then((module) => ({
      default: module.ScrambleText,
    })),
  ),
  "read-along": lazy(() =>
    import("@/components/motion/read-along").then((module) => ({
      default: module.ReadAlong,
    })),
  ),
  "roll-links": lazy(() =>
    import("@/components/motion/roll-links").then((module) => ({
      default: module.RollLinks,
    })),
  ),
  "marker-text": lazy(() =>
    import("@/components/motion/marker-text").then((module) => ({
      default: module.MarkerText,
    })),
  ),
  "dynamic-text": lazy(() =>
    import("@/components/motion/dynamic-text").then((module) => ({
      default: module.DynamicText,
    })),
  ),
  typewriter: lazy(() =>
    import("@/components/motion/typewriter").then((module) => ({
      default: module.Typewriter,
    })),
  ),
  "music-toggle": lazy(() =>
    import("@/components/motion/music-toggle").then((module) => ({
      default: module.MusicToggle,
    })),
  ),
  "prompt-box": lazy(() =>
    import("@/components/motion/prompt-box").then((module) => ({
      default: module.PromptBox,
    })),
  ),
  "streaming-reply": lazy(() =>
    import("@/components/motion/streaming-reply").then((module) => ({
      default: module.StreamingReply,
    })),
  ),
  "ghost-suggestion": lazy(() =>
    import("@/components/motion/ghost-suggestion").then((module) => ({
      default: module.GhostSuggestion,
    })),
  ),
  "goo-thinking": lazy(() =>
    import("@/components/motion/goo-thinking").then((module) => ({
      default: module.GooThinking,
    })),
  ),
  "siri-orb": lazy(() =>
    import("@/components/motion/siri-orb").then((module) => ({
      default: () => createElement(module.AssistantOrb, { showControls: true }),
    })),
  ),
  "agent-steps": lazy(() =>
    import("@/components/motion/agent-steps").then((module) => ({
      default: module.AgentSteps,
    })),
  ),
  "tool-approval": lazy(() =>
    import("@/components/motion/tool-approval").then((module) => ({
      default: module.ToolApproval,
    })),
  ),
  "thinking-text": lazy(() =>
    import("@/components/motion/thinking-text").then((module) => ({
      default: module.ThinkingText,
    })),
  ),
  "task-list": lazy(() =>
    import("@/components/motion/task-list").then((module) => ({
      default: module.TaskList,
    })),
  ),
  "voice-input": lazy(() =>
    import("@/components/motion/voice-input").then((module) => ({
      default: module.VoiceInput,
    })),
  ),
  "hold-to-publish": lazy(() =>
    import("@/components/motion/hold-to-publish").then((module) => ({
      default: module.HoldToPublish,
    })),
  ),
  "command-search": lazy(() =>
    import("@/components/motion/command-search").then((module) => ({
      default: module.CommandSearch,
    })),
  ),
  "swipe-tabs": lazy(() =>
    import("@/components/motion/swipe-tabs").then((module) => ({
      default: module.SwipeTabs,
    })),
  ),
  "lesson-outline": lazy(() =>
    import("@/components/motion/lesson-outline").then((module) => ({ default: module.LessonOutline })),
  ),
  "code-exercise": lazy(() =>
    import("@/components/motion/code-exercise").then((module) => ({ default: () => createElement(module.CodeExercise, {draftKey: "takt:exercise:regex:v1"}) })),
  ),
  "run-console": lazy(() =>
    import("@/components/motion/run-console").then((module) => ({ default: module.RunConsole })),
  ),
  "test-results": lazy(() =>
    import("@/components/motion/test-results").then((module) => ({ default: module.TestResults })),
  ),
  "ask-tutor": lazy(() =>
    import("@/components/motion/ask-tutor").then((module) => ({ default: module.AskTutor })),
  ),
  "lesson-citation": lazy(() =>
    import("@/components/motion/lesson-citation").then((module) => ({ default: module.LessonCitation })),
  ),
  "predict-output": lazy(() =>
    import("@/components/motion/predict-output").then((module) => ({ default: module.PredictOutput })),
  ),
  "execution-trace": lazy(() =>
    import("@/components/motion/execution-trace").then((module) => ({ default: module.ExecutionTrace })),
  ),
  "hint-ladder": lazy(() =>
    import("@/components/motion/hint-ladder").then((module) => ({ default: module.HintLadder })),
  ),
  "channel-list": lazy(() => import("@/components/motion/channel-list").then(module => ({ default: module.ChannelList }))),
  "chat-composer": lazy(() => import("@/components/motion/chat-composer").then(module => ({ default: module.ChatComposer }))),
  "message-reactions": lazy(() => import("@/components/motion/message-reactions").then(module => ({ default: module.MessageReactions }))),
  "message-thread": lazy(() => import("@/components/motion/message-thread").then(module => ({ default: module.MessageThread }))),
  "course-messenger": lazy(() => import("@/components/motion/course-messenger").then(module => ({ default: module.CourseMessenger }))),
  "latency-chart": lazy(() => import("@/components/motion/latency-chart").then(module => ({ default: module.LatencyChart }))),
  "conversion-funnel": lazy(() => import("@/components/motion/conversion-funnel").then(module => ({ default: module.ConversionFunnel }))),
  "cohort-retention": lazy(() => import("@/components/motion/cohort-retention").then(module => ({ default: module.CohortRetention }))),
} satisfies Record<Entry["slug"], React.ComponentType>;
