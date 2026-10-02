"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import CallMonitor from "@/components/CallMonitor";
import MessageChecker from "@/components/MessageChecker";
import PrivacyNote from "@/components/PrivacyNote";

type Tab = "call" | "message";

const tabClass = "min-h-14 rounded-2xl px-4 text-xl font-semibold";

export default function Home() {
  const [tab, setTab] = useState<Tab>("call");
  const callTabRef = useRef<HTMLButtonElement>(null);
  const messageTabRef = useRef<HTMLButtonElement>(null);

  function selectTab(next: Tab) {
    setTab(next);
    if (next === "call") callTabRef.current?.focus();
    else messageTabRef.current?.focus();
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    selectTab(tab === "call" ? "message" : "call");
  }

  return (
    <div className="min-h-full bg-stone-50 text-stone-900">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-5 py-8">
        <header>
          <h1 className="text-4xl font-bold tracking-tight">Scam Shield</h1>
          <p className="mt-3 text-xl leading-relaxed text-stone-800">
            A calm second look at a phone call or a message, so you can slow
            down before you act.
          </p>
        </header>

        <div role="tablist" aria-label="What to check" className="grid grid-cols-2 gap-3">
          <button
            ref={callTabRef}
            id="tab-call"
            type="button"
            role="tab"
            aria-selected={tab === "call"}
            aria-controls="panel-call"
            tabIndex={tab === "call" ? 0 : -1}
            onClick={() => selectTab("call")}
            onKeyDown={onTabKeyDown}
            className={`${tabClass} ${
              tab === "call"
                ? "bg-stone-900 text-white"
                : "border-2 border-stone-400 bg-white text-stone-900"
            }`}
          >
            Listen to a call
          </button>
          <button
            ref={messageTabRef}
            id="tab-message"
            type="button"
            role="tab"
            aria-selected={tab === "message"}
            aria-controls="panel-message"
            tabIndex={tab === "message" ? 0 : -1}
            onClick={() => selectTab("message")}
            onKeyDown={onTabKeyDown}
            className={`${tabClass} ${
              tab === "message"
                ? "bg-stone-900 text-white"
                : "border-2 border-stone-400 bg-white text-stone-900"
            }`}
          >
            Check a message
          </button>
        </div>

        {tab === "call" ? (
          <section id="panel-call" role="tabpanel" aria-labelledby="tab-call">
            <CallMonitor />
          </section>
        ) : (
          <section
            id="panel-message"
            role="tabpanel"
            aria-labelledby="tab-message"
          >
            <MessageChecker />
          </section>
        )}

        <footer className="border-t border-stone-300 pt-6">
          <PrivacyNote />
        </footer>
      </main>
    </div>
  );
}
