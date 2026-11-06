import { useCallback, useEffect, useState, type RefObject } from 'react';
import { flushSync } from 'react-dom';
import { createLamp, pulseLamp, type Lamp } from './lamp';

const REDUCE = '(prefers-reduced-motion: reduce)';

// index.html sets data-theme on <html> before first paint (the stored choice,
// else the system preference); React starts from the same value so nothing
// flashes, and the toggle writes the choice back.
export function useTheme() {
  const [evening, setEvening] = useState(() => document.documentElement.dataset.theme === 'dark');

  const toggle = useCallback(() => {
    const root = document.documentElement;
    const next = root.dataset.theme !== 'dark';
    const apply = () => {
      root.dataset.theme = next ? 'dark' : 'light';
      try {
        localStorage.setItem('theme', next ? 'dark' : 'light');
      } catch {
        // Blocked storage: the toggle still works for this visit.
      }
      setEvening(next);
    };
    // Suppress every colour transition for the swap so nothing smears.
    root.classList.add('theme-swap');
    const done = () => root.classList.remove('theme-swap');

    if (!window.matchMedia(REDUCE).matches && document.startViewTransition) {
      // The switch as a moment: the page cross-fades as one, then (going to
      // evening) the lamp and 光 warm up a beat later.
      const vt = document.startViewTransition(() => flushSync(apply));
      vt.finished.then(done, done);
      if (next) {
        root.classList.remove('lamp-on');
        void root.offsetWidth;
        root.classList.add('lamp-on');
        window.setTimeout(() => root.classList.remove('lamp-on'), 1400);
        pulseLamp();
      }
      return;
    }
    apply();
    void root.offsetHeight;
    requestAnimationFrame(() => requestAnimationFrame(done));
  }, []);

  return { evening, toggle };
}

/**
 * Asks the reading light to rest on an element (or on nothing) until the
 * reader scrolls on: a nav jump's first entry, a linked project, a copied
 * address. Pass `settle` when a scroll is about to carry the page there.
 */
export function holdLight(el: HTMLElement | null, settle = false) {
  document.dispatchEvent(new CustomEvent('light:hold', { detail: { el, settle } }));
}

const TAP_SLOP = 10; // px a finger may move and still count as a tap
const FLING_MS = 120; // a touch this soon after a scroll only stops a fling
const HOVER_MS = 90; // the pointer must rest this long on an entry to take the light
const LET_GO = 48; // px of scrolling after which a held light returns to the reading line

/**
 * The reading light (戴光, "bearing light"): exactly one thing is lit at a
 * time. Keyboard focus wins, then the entry the mouse rests on, then a held
 * entry (a tap, a nav jump, a linked project), then the entry nearest the
 * middle of the screen. Before the reader reaches the entries, the hero's
 * "Now" block holds the light. The light never moves on its own; the page
 * scrolls through it, and the lamp (lamp.ts) glides between neighbours.
 *
 * A scroll swipe never takes the light: only a tap (a touch that lifts
 * without moving) does.
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
    let hoverNext: HTMLElement | null = null;
    let hoverTimer = 0;
    let hoverLocked = false; // until the mouse really moves again
    let focused: HTMLElement | null = null;
    let held: HTMLElement | null = null;
    let heldAt: number | null = null; // scroll position once the page has come to rest
    let settleTimer = 0;
    let down: { id: number; x: number; y: number; el: HTMLElement | null } | null = null;
    let scrolledAt = -Infinity;
    let fadeNext = false;
    let frame = 0;

    // The lamp needs motion; under reduced motion .is-lit paints the entry itself.
    const main = document.getElementById('main');
    const lampEl = document.querySelector<HTMLElement>('.lamp');
    const glowEl = lampEl?.querySelector<HTMLElement>('.lamp-glow');
    const reduce = window.matchMedia(REDUCE);
    let lamp: Lamp | null = null;
    const syncLamp = () => {
      lamp?.destroy();
      lamp = null;
      if (!reduce.matches && main && lampEl && glowEl) {
        lamp = createLamp(main, lampEl, glowEl);
        lamp.place(lit, 'fade');
      }
    };

    const show = (el: HTMLElement | null) => {
      if (el !== lit) {
        lit?.classList.remove('is-lit');
        el?.classList.add('is-lit');
        lit = el;
      }
      lamp?.place(el, fadeNext ? 'fade' : 'auto');
      fadeNext = false;
    };

    const update = () => {
      cancelAnimationFrame(frame);
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
      const lit = focused ?? hovered ?? held ?? centre;
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

    const hold = (el: HTMLElement | null, settle: boolean) => {
      held = el;
      fadeNext = true;
      dropHover();
      window.clearTimeout(settleTimer);
      if (settle) {
        // Wait for the jump's scroll to come to rest before counting the reader's own.
        heldAt = null;
        settleTimer = window.setTimeout(() => (heldAt = window.scrollY), 200);
      } else {
        heldAt = window.scrollY;
      }
      update();
    };
    const onHold = (e: Event) => {
      const { el, settle } = (e as CustomEvent<{ el: HTMLElement | null; settle: boolean }>).detail;
      hold(el, settle);
    };

    const onScroll = () => {
      scrolledAt = performance.now();
      // Scrolling hands the light back to the reading line; the mouse takes
      // it again only when it moves.
      dropHover();
      if (held || heldAt === null) {
        if (heldAt === null) {
          window.clearTimeout(settleTimer);
          settleTimer = window.setTimeout(() => (heldAt = window.scrollY), 200);
        } else if (Math.abs(window.scrollY - heldAt) > LET_GO) {
          held = null;
        }
      }
      schedule();
    };

    const entryOf = (t: EventTarget | null) =>
      t instanceof Element ? (t.closest('[data-entry]') as HTMLElement | null) : null;

    // The mouse takes the light only where it rests, so a quick pass across
    // the page does not drag the light along with it. Only real movement
    // counts: an entry scrolling under a still pointer does not take it.
    const setHover = (el: HTMLElement | null) => {
      if (el === hoverNext) return;
      hoverNext = el;
      window.clearTimeout(hoverTimer);
      hoverTimer = window.setTimeout(() => {
        hovered = hoverNext;
        schedule();
      }, HOVER_MS);
    };
    function dropHover() {
      window.clearTimeout(hoverTimer);
      hoverNext = null;
      hoverLocked = true;
      if (hovered) {
        hovered = null;
        schedule();
      }
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (hoverLocked) {
        if (!e.movementX && !e.movementY) return;
        hoverLocked = false;
      }
      setHover(entryOf(e.target));
    };
    const onLeaveDoc = () => setHover(null);

    // Touch: a tap is a touch that lifts where it landed. A scroll swipe ends
    // in pointercancel (or moves), so it never moves the light or blooms.
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' || !e.isPrimary) return;
      // A touch on a still-moving page stops the fling; it is not a tap.
      if (performance.now() - scrolledAt < FLING_MS) return;
      down = { id: e.pointerId, x: e.clientX, y: e.clientY, el: entryOf(e.target) };
    };
    const onUp = (e: PointerEvent) => {
      const d = down;
      down = null;
      if (!d || d.id !== e.pointerId) return;
      if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > TAP_SLOP) return;
      hold(d.el, false);
      if (d.el) lamp?.bloom(e.clientX, e.clientY);
    };
    const onCancel = (e: PointerEvent) => {
      if (down?.id === e.pointerId) down = null;
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

    // A nav jump lands the light on the section's first entry.
    const onClick = (e: MouseEvent) => {
      const a = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>('.nav a[href^="#"]') : null;
      const section = a && document.getElementById(a.hash.slice(1));
      if (section) hold(section.querySelector<HTMLElement>('[data-entry]'), true);
    };

    syncLamp();
    update();
    reduce.addEventListener('change', syncLamp);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('pointercancel', onCancel, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeaveDoc);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    document.addEventListener('click', onClick);
    document.addEventListener('light:hold', onHold);
    // Opening a disclosure changes entry heights.
    document.addEventListener('toggle', schedule, true);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(hoverTimer);
      window.clearTimeout(settleTimer);
      reduce.removeEventListener('change', syncLamp);
      lamp?.destroy();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointercancel', onCancel);
      document.documentElement.removeEventListener('pointerleave', onLeaveDoc);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
      document.removeEventListener('click', onClick);
      document.removeEventListener('light:hold', onHold);
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

/** Says something to screen readers through the page's one polite live region. */
export function announce(message: string) {
  const el = document.getElementById('announce');
  if (!el) return;
  el.textContent = '';
  window.setTimeout(() => (el.textContent = message), 50);
}

/** Copies through a one-off copy event: no hidden field, so focus stays put. */
function copyByEvent(text: string) {
  let wrote = false;
  const onCopy = (e: ClipboardEvent) => {
    e.clipboardData?.setData('text/plain', text);
    e.preventDefault();
    wrote = !!e.clipboardData;
  };
  document.addEventListener('copy', onCopy);
  try {
    return document.execCommand('copy') && wrote;
  } catch {
    return false;
  } finally {
    document.removeEventListener('copy', onCopy);
  }
}

async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers and blocked permissions.
    return copyByEvent(text);
  }
}

export type CopyState = 'idle' | 'copied' | 'failed';

/**
 * A copy button's state: "copied" for a moment after a copy, "failed" a little
 * longer when the browser refused. On failure the source text (if given) is
 * selected so it can be copied by hand. A copy pulses the lamp once.
 */
export function useCopy(ms = 1600) {
  const [state, setState] = useState<CopyState>('idle');
  useEffect(() => {
    if (state === 'idle') return;
    const t = window.setTimeout(() => setState('idle'), state === 'failed' ? ms * 2 : ms);
    return () => window.clearTimeout(t);
  }, [state, ms]);
  const copy = useCallback(async (text: string, message: string, source?: Element | null) => {
    const ok = await writeClipboard(text);
    setState('idle');
    requestAnimationFrame(() => setState(ok ? 'copied' : 'failed'));
    if (ok) {
      pulseLamp();
      announce(message);
    } else {
      if (source) window.getSelection()?.selectAllChildren(source);
      announce(source ? 'Copy did not work. The text is selected, ready to copy.' : 'Copy did not work.');
    }
  }, []);
  return { state, copy };
}
