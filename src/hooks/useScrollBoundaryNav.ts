import { useEffect, type RefObject } from "react";

const EDGE_PX = 2;

export const scrollBoundaryNavClassName =
  "scrollbar-hide overflow-y-auto overscroll-y-auto";

/** Scroll inside the list only — never scroll the page. */
export function scrollItemWithinNav(
  nav: HTMLElement,
  item: HTMLElement,
  behavior: ScrollBehavior = "smooth"
) {
  const rowTop = item.offsetTop;
  const rowBottom = rowTop + item.offsetHeight;
  const viewTop = nav.scrollTop;
  const viewBottom = viewTop + nav.clientHeight;

  if (rowTop >= viewTop && rowBottom <= viewBottom) return;

  const target = rowTop - (nav.clientHeight - item.offsetHeight) / 2;
  nav.scrollTo({ top: Math.max(0, target), behavior });
}

function handleWheel(event: WheelEvent) {
  const element = event.currentTarget as HTMLElement;
  const { scrollTop, scrollHeight, clientHeight } = element;

  if (scrollHeight <= clientHeight + EDGE_PX) return;

  const { deltaY } = event;
  const atTop = scrollTop <= EDGE_PX;
  const atBottom = scrollTop + clientHeight >= scrollHeight - EDGE_PX;

  if (deltaY > 0 && atBottom) return;
  if (deltaY < 0 && atTop) return;

  event.preventDefault();
  element.scrollTop += deltaY;
}

/** List scroll first; at top/bottom pass wheel to the page. */
export function useScrollBoundaryNav(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => element.removeEventListener("wheel", handleWheel);
  }, [ref]);
}
