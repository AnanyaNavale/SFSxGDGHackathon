export function scrollResultsIntoView(element: HTMLElement | null) {
  if (!element) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior = reduceMotion ? "auto" : "smooth";
  const scroller = element.closest("[data-results-scroller]");

  if (!(scroller instanceof HTMLElement)) {
    element.scrollIntoView({ behavior, block: "start" });
    return;
  }

  const top =
    scroller.scrollTop +
    element.getBoundingClientRect().top -
    scroller.getBoundingClientRect().top -
    8;

  scroller.scrollTo({ top: Math.max(0, top), behavior });
}
