"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import CallMonitor from "@/components/CallMonitor";
import MessageChecker from "@/components/MessageChecker";

type Tab = "call" | "message";

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
    <div className="flex h-full min-h-0 flex-col bg-[#f3f0e8] text-[#1c2430]">
      <main className="mx-auto grid min-h-0 w-full max-w-6xl flex-1 gap-4 px-5 pt-4 lg:grid-cols-[320px_1fr]">
        <aside className="flex min-h-0 flex-col justify-between overflow-hidden rounded-[28px] bg-[#1c3f38] p-6 text-white">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d7efe4] text-[#1c3f38]" aria-hidden="true">
                <ShieldIcon />
              </span>
              <p className="text-2xl font-semibold">Scam Shield</p>
            </div>
            <p className="mt-10 text-sm font-semibold tracking-[0.16em] text-[#d7efe4]">
              A CALM SECOND LOOK
            </p>
            <h1 className="font-serif mt-3 text-4xl leading-tight font-medium">
              Pause. Check. Feel confident.
            </h1>
            <p className="mt-3 text-lg leading-snug text-white/90">
              We&apos;ll help you spot warning signs in a call, text, or email
              before you decide what to do next.
            </p>
          </div>
          <div className="mt-6 border-t border-white/20 pt-4">
            <div className="flex flex-col gap-3">
              <span className="mx-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#d7efe4] text-[#1c3f38]" aria-hidden="true">
                <LockIcon />
              </span>
              <div className="text-center">
                <p className="text-xl font-semibold">Your privacy comes first</p>
                <p className="mt-1 text-lg leading-relaxed text-white/85">
                  Audio is checked in short windows and never saved. Nothing you
                  say or paste is stored.
                </p>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex min-h-0 flex-col">
          <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold tracking-[0.14em] text-[#6d5e86]">
            CHOOSE WHAT YOU&apos;D LIKE TO CHECK
          </p>
          <h2 className="font-serif mt-2 text-4xl font-medium text-[#1c2430]">
            How can we help?
          </h2>

          <div
            role="tablist"
            aria-label="What to check"
            className="relative mt-4 grid grid-cols-2 rounded-full bg-[#efeaf6] p-1.5"
          >
            <span aria-hidden="true" className="pointer-events-none absolute inset-1.5">
              <span
                className={`block h-full w-1/2 rounded-full bg-white shadow-sm transition-transform duration-300 ease-out motion-reduce:transition-none ${
                  tab === "message" ? "translate-x-full" : "translate-x-0"
                }`}
              />
            </span>
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
              className={`relative z-10 flex min-h-14 items-center justify-center gap-2 rounded-full px-4 text-xl font-semibold ${
                tab === "call" ? "text-[#1c2430]" : "text-[#3d3550]"
              }`}
            >
              <PhoneIcon />
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
              className={`relative z-10 flex min-h-14 items-center justify-center gap-2 rounded-full px-4 text-xl font-semibold ${
                tab === "message" ? "text-[#1c2430]" : "text-[#3d3550]"
              }`}
            >
              <ChatIcon />
              Check a message
            </button>
          </div>

          <div
            data-results-scroller
            className="-ml-2 -mr-5 mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pl-2 pr-5"
          >
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
          </div>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex w-full max-w-6xl shrink-0 flex-col gap-1 px-6 py-3 text-base text-[#5c6570] sm:flex-row sm:justify-between">
        <p>Scam Shield gives guidance, not a guarantee.</p>
        <p>When in doubt, hang up and call someone you trust.</p>
      </footer>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 5 6v6c0 4.2 2.8 7.4 7 9 4.2-1.6 7-4.8 7-9V6l-7-3Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 4h2l1 4-2 1a12 12 0 0 0 6 6l1-2 4 1v2a2 2 0 0 1-2 2A16 16 0 0 1 4 8a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 16.5 4 20l4-1.5A9 9 0 1 0 6 16.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
