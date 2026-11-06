import { useCallback, useEffect, useState, type RefObject } from 'react';

// index.html sets data-theme on <html> before first paint (the stored choice,
// else the system preference); React starts from the same value so nothing
// flashes, and the toggle writes the choice back.
export function useTheme() {
  const [evening, setEvening] = useState(() => document.documentElement.dataset.theme === 'dark');

  const toggle = useCallback(() => {
    const next = document.documentElement.dataset.theme !== 'dark';
    const root = document.documentElement;
    // Suppress every transition for the swap so colours do not smear.
    root.classList.add('theme-swap');
    root.dataset.theme = next ? 'dark' : 'light';
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      // Blocked storage: the toggle still works for this visit.
    }
    void root.offsetHeight;
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-swap')));
    setEvening(next);
  }, []);

  return { evening, toggle };
}

/**
 * The reading light (戴光, "bearing light"): exactly one thing is lit at a
 * time. Keyboard focus wins, then the hovered entry, then the entry nearest
 * the middle of the screen. Before the reader reaches the entries, the hero's
 * "Now" block holds the light. The light never moves on its own; the page
 * scrolls through it.
 *
 * The nav reads the same middle line, so section and light change together:
 * the current section is the one holding the centre entry, else the last
 * section whose top has crossed the middle.
 */
export function useReading(ids: string[]) {
  const [current, setCurrent] = useState<string | null>(null);
  const key = ids.join(',');

  useEffect(() => {
    const list = Array.from(document.querySelectorAll<HTMLElement>('[data-entry]'));
    const rest = document.querySelector<HTMLElement>('[data-rest-light]');
    const sections = key
      .split(',')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    let lit: HTMLElement | null = null;
    let hovered: HTMLElement | null = null;
    let focused: HTMLElement | null = null;
    let frame = 0;

    const show = (el: HTMLElement | null) => {
      if (el === lit) return;
      lit?.classList.remove('is-lit');
      el?.classList.add('is-lit');
      lit = el;
    };

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const mid = vh / 2;

      // The entry at (or right beside) the middle line.
      let centre: HTMLElement | null = null;
      let bestGap = Infinity;
      for (const el of list) {
        const r = el.getBoundingClientRect();
        const gap = r.top > mid ? r.top - mid : r.bottom < mid ? mid - r.bottom : 0;
        if (gap < bestGap) {
          bestGap = gap;
          centre = el;
        }
      }
      if (bestGap > vh * 0.2) centre = null;

      // At rest, before any entry reaches the middle, "Now" holds the light.
      let resting: HTMLElement | null = null;
      if (!centre && rest && list.length && list[0].getBoundingClientRect().top > mid) {
        const r = rest.getBoundingClientRect();
        if (r.bottom > 0 && r.top < vh) resting = rest;
      }
      // One winner drives both the light and the nav underline, so they agree.
      const lit = focused ?? hovered ?? centre;
      show(lit ?? resting);

      let found: string | null = null;
      const holder = lit?.closest('section');
      if (holder && sections.includes(holder as HTMLElement)) {
        found = holder.id;
      } else {
        // With nothing lit, the section crossing the upper-third line wins, so a
        // short section with no entries (Honours) shows while its heading is near the top.
        const line = vh / 3;
        for (const s of sections) if (s.getBoundingClientRect().top <= line) found = s.id;
        // At the very bottom the last section counts even if its top never reached the line.
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
          found = sections[sections.length - 1]?.id ?? found;
        }
      }
      setCurrent(found);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const entryOf = (t: EventTarget | null) =>
      t instanceof Element ? (t.closest('[data-entry]') as HTMLElement | null) : null;

    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const el = entryOf(e.target);
      if (el !== hovered) {
        hovered = el;
        schedule();
      }
    };
    const onLeaveDoc = () => {
      hovered = null;
      schedule();
    };
    const onFocusIn = (e: FocusEvent) => {
      const t = e.target as Element | null;
      focused = t && t.matches(':focus-visible') ? entryOf(t) : null;
      schedule();
    };
    const onFocusOut = () => {
      focused = null;
      schedule();
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    document.addEventListener('pointerover', onOver);
    document.documentElement.addEventListener('pointerleave', onLeaveDoc);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    // Opening a disclosure changes entry heights.
    document.addEventListener('toggle', schedule, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('pointerleave', onLeaveDoc);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
      document.removeEventListener('toggle', schedule, true);
      lit?.classList.remove('is-lit');
    };
  }, [key]);

  return current;
}

/** True while the media query matches. */
export function useMedia(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatches(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return matches;
}

/** True once the element has scrolled up under the sticky header. */
export function usePassed(ref: RefObject<HTMLElement | null>) {
  const [passed, setPassed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      ([e]) => setPassed(!e.isIntersecting && e.boundingClientRect.top < 0),
      { rootMargin: '-96px 0px 0px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return passed;
}
