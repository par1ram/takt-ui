import { createElement, useState } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { TabPill } from "@/components/motion/tab-pill";
import { StepProgress } from "@/components/motion/step-progress";
import { PageFlip } from "@/components/motion/page-flip";
import { TaskList } from "@/components/motion/task-list";
import { NotificationStack } from "@/components/motion/notification-stack";
import { OtpCode } from "@/components/motion/otp-code";
import { LetterLimit } from "@/components/motion/letter-limit";
import { LoadingSuccess } from "@/components/motion/loading-success";
import { InvitePeople } from "@/components/motion/invite-people";
import { PromptBox } from "@/components/motion/prompt-box";
import { PullRefresh } from "@/components/motion/pull-refresh";
import { VoiceInput } from "@/components/motion/voice-input";

import { UnlockFaceId } from "@/components/motion/unlock-face-id";

import { Elements } from "@stripe/react-stripe-js";
import { CardField } from "@/components/motion/card-field";

function HostedCardField(props) {
  return (
    <Elements stripe={window.fixture.stripe}>
      <CardField mode="payment" {...props} />
    </Elements>
  );
}

import { MorphPopover } from "@/components/motion/morph-popover";

import { ReceiptPrinter } from "@/components/motion/receipt-printer";

import { LatencyChart } from "@/components/motion/latency-chart";
import { ConversionFunnel } from "@/components/motion/conversion-funnel";
import { CohortRetention } from "@/components/motion/cohort-retention";

import { IssueBoard } from "@/components/motion/issue-board";
import { IssueTable } from "@/components/motion/issue-table";
import { CyclePlanner } from "@/components/motion/cycle-planner";

function SharedTracker({ initial }) {
  const [issues,setIssues] = useState(initial);
  const props = {issues,onIssuesChange:setIssues};
  return <><IssueBoard {...props}/><IssueTable {...props}/><CyclePlanner {...props} capacity={3}/></>;
}

const components = {
  SharedTracker,
  LatencyChart, ConversionFunnel, CohortRetention,
  ReceiptPrinter,
  MorphPopover,
  CardField,
  HostedCardField,
  UnlockFaceId,
  TabPill,
  StepProgress,
  PageFlip,
  TaskList,
  NotificationStack,
  OtpCode,
  LetterLimit,
  LoadingSuccess,
  InvitePeople,
  PromptBox,
  PullRefresh,
  VoiceInput,
};
const root = createRoot(document.getElementById("fixture"));
window.fixture = {
  calls: [],
  render(name, props = {}, callback) {
    const callbacks = callback
      ? {
          [callback]: (...args) => {
            window.fixture.calls.push(args);
            return new Promise((resolve, reject) => {
              window.fixture.resolve = resolve;
              window.fixture.reject = reject;
            });
          },
        }
      : {};
    flushSync(() =>
      root.render(createElement(components[name], { ...props, ...callbacks })),
    );
  },
};
