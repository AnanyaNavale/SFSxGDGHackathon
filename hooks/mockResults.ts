import type { AnalysisResult } from "@/lib/types";

export const MOCK_LOW: AnalysisResult = {
  risk_level: "low",
  red_flags: [],
  plain_explanation:
    "This looks like a routine reminder. It isn't asking for money or secrets.",
  recommended_action: "No action needed, but you can always double-check.",
};

export const MOCK_CAUTION: AnalysisResult = {
  risk_level: "caution",
  red_flags: ["Pressure to act quickly", "Asks you to confirm account details"],
  plain_explanation:
    "This message has a couple of warning signs. It's worth slowing down.",
  recommended_action:
    "Don't share any details yet. Ask for a number you already trust, then call back.",
};

export const MOCK_HIGH: AnalysisResult = {
  risk_level: "high",
  red_flags: [
    "Says your account will be frozen within the hour",
    "Asks you to buy gift cards",
    "Tells you not to tell anyone",
    "Asks for a code sent to your phone",
  ],
  plain_explanation:
    "This matches several common scam patterns. Real banks never ask for gift cards.",
  recommended_action:
    "Hang up. Call your bank using the number on the back of your card.",
};

export const SCAM_SAMPLE =
  "Grandma it's me, I'm in jail and need bail money. Please don't tell Mom. Send gift cards.";

export const NORMAL_SAMPLE =
  "Your pharmacy order is ready for pickup. Reply STOP to opt out.";
