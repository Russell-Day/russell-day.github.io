/**
 * The lamp: one amber wash behind the entry being read. It lives inside
 * <main> (behind the text) and is placed in main's coordinates, so scrolling
 * moves it with the page for free.
 *
 * Moving light stays mid-screen. The lamp glides only from an entry to its
 * neighbour, and only when both sit in the middle band of the screen. Any
 * other change (a hover near the edge of the screen, a jump, a tap) fades it
 * in at the new place, so the light never sweeps across the page.
 *
 * With a mouse, a soft glow follows the pointer inside the lit entry and dims
 * towards the top and bottom of the screen. A confirmed tap blooms the glow
 * at the finger. Under reduced motion there is no lamp: the entry's own
 * .is-lit background is used instead, instantly.
 */

const BAND = [0.25, 0.75]; // the middle band a glide must stay inside (share of viewport height)
const GLIDE_MAX = 0.4; // and the longest glide (share of viewport height)
const BLOOM_MS = 700;

export type Lamp = {
  /** Light this element. `fade` skips any glide (taps, jumps). */
  place: (el: HTMLElement | null, how?: 'auto' | 'fade') => void;
  /** Blooms the glow at a viewport point inside the lit element. */
  bloom: (x: number, y: number) => void;
  pulse: () => void;
  destroy: () => void;
};

let active: Lamp | null = null;

/** Brightens the lamp once (the 光 easter egg, the evening switch, a copy). */
export function pulseLamp() {
  active?.pulse();
}

/** Centre of the visible part of a box, in viewport y. */
function visibleCentre(top: number, height: number, vh: number) {
  const a = Math.max(top, 0);
  const b = Math.min(top + height, vh);
  return b > a ? (a + b) / 2 : top + height / 2;
}

const inBand = (y: number, vh: number) => y >= vh * BAND[0] && y <= vh * BAND[1];

/** True when a and b are next to each other in reading order. */
function neighbours(main: HTMLElement, a: HTMLElement | null, b: HTMLElement) {
  if (!a) return false;
  const list = Array.from(main.querySelectorAll('[data-entry]'));
  const i = list.indexOf(a);
  const j = list.indexOf(b);
  return i >= 0 && j >= 0 && Math.abs(i - j) === 1;
}

export function createLamp(main: HTMLElement, lamp: HTMLElement, glow: HTMLElement): Lamp {
  const root = document.documentElement;
  let target: HTMLElement | null = null;
  let placed: HTMLElement | null = null; // the element the lamp last settled on
  let fadeNext = false;
  let shown = false;
  let last = { x: 0, y: 0, w: 0, h: 0 };
  let frame = 0;
  let glowFrame = 0;
  let bloomTimer = 0;
  let pointer: { x: number; y: number } | null = null;
  let bloomAt: { x: number; y: number } | null = null;

  const write = (x: number, y: number, w: number, h: number) => {
    lamp.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    lamp.style.width = `${w}px`;
    lamp.style.height = `${h}px`;
    last = { x, y, w, h };
  };

  /** Puts the glow at a viewport point, measured against the lit element. The
   *  lamp ends up exactly on that element, so the glow lands where it should
   *  even while the lamp is still on its way. It uses `translate`, which is
   *  applied after the bloom's `scale`, so the bloom grows around the point. */
  const setGlow = (x: number, y: number) => {
    if (!target) return;
    const r = target.getBoundingClientRect();
    glow.style.translate = `${Math.round(x - r.left)}px ${Math.round(y - r.top)}px`;
  };

  const startBloom = () => {
    if (!bloomAt || !target) return;
    setGlow(bloomAt.x, bloomAt.y);
    bloomAt = null;
    lamp.classList.remove('is-bloom');
    void lamp.offsetWidth;
    lamp.classList.add('is-bloom');
    clearTimeout(bloomTimer);
    bloomTimer = window.setTimeout(() => lamp.classList.remove('is-bloom'), BLOOM_MS);
  };

  const measure = () => {
    frame = 0;
    if (!target || !target.isConnected) {
      if (shown) {
        lamp.classList.remove('is-on');
        shown = false;
      }
      placed = null;
      bloomAt = null;
      return;
    }
    const m = main.getBoundingClientRect();
    const r = target.getBoundingClientRect();
    const x = Math.round(r.left - m.left);
    const y = Math.round(r.top - m.top);
    const w = Math.round(r.width);
    const h = Math.round(r.height);
    const fade = fadeNext;
    fadeNext = false;

    if (shown && placed === target && x === last.x && y === last.y && w === last.w && h === last.h) {
      startBloom();
      return;
    }

    let glide = shown && !fade;
    if (glide && placed !== target) {
      // A new element: glide only between neighbours, both mid-screen, and not far.
      const vh = window.innerHeight;
      const from = visibleCentre(m.top + last.y, last.h, vh);
      const to = visibleCentre(r.top, r.height, vh);
      glide =
        neighbours(main, placed, target) &&
        inBand(from, vh) &&
        inBand(to, vh) &&
        Math.abs(to - from) <= vh * GLIDE_MAX;
    }

    if (!glide) {
      // Appear in place: no travel from wherever the lamp was before.
      lamp.classList.add('is-placing');
      lamp.classList.remove('is-on', 'is-glow');
      write(x, y, w, h);
      void lamp.offsetWidth;
      lamp.classList.remove('is-placing');
      lamp.classList.add('is-on');
      shown = true;
    } else {
      write(x, y, w, h);
    }
    placed = target;
    startBloom();
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(measure);
  };

  // Sizes change when a disclosure opens, fonts load or the window resizes.
  const ro = 'ResizeObserver' in window ? new ResizeObserver(schedule) : null;
  ro?.observe(main);

  const moveGlow = () => {
    glowFrame = 0;
    if (!pointer) return;
    setGlow(pointer.x, pointer.y);
    // Full strength in the middle of the screen, none near its edges.
    const vh = window.innerHeight;
    const off = Math.abs(pointer.y / vh - 0.5);
    const reach = Math.min(1, Math.max(0, (0.4 - off) / 0.2));
    lamp.style.setProperty('--reach', reach.toFixed(2));
  };

  const inTarget = (e: PointerEvent) => !!target && e.target instanceof Node && target.contains(e.target);

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    if (inTarget(e)) {
      pointer = { x: e.clientX, y: e.clientY };
      lamp.classList.add('is-glow');
      if (!glowFrame) glowFrame = requestAnimationFrame(moveGlow);
    } else if (lamp.classList.contains('is-glow')) {
      lamp.classList.remove('is-glow');
      pointer = null;
    }
  };

  document.addEventListener('pointermove', onMove, { passive: true });
  root.classList.add('has-lamp');

  const self: Lamp = {
    place(el, how = 'auto') {
      if (el !== target) {
        target = el;
        lamp.classList.remove('is-glow');
        pointer = null;
      }
      if (how === 'fade' && el !== placed) fadeNext = true;
      schedule();
    },
    bloom(x, y) {
      bloomAt = { x, y };
      schedule();
    },
    pulse() {
      lamp.classList.remove('is-pulse');
      void lamp.offsetWidth;
      lamp.classList.add('is-pulse');
    },
    destroy() {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(glowFrame);
      clearTimeout(bloomTimer);
      ro?.disconnect();
      document.removeEventListener('pointermove', onMove);
      root.classList.remove('has-lamp');
      lamp.className = 'lamp';
      lamp.style.removeProperty('--reach');
      if (active === self) active = null;
    },
  };
  active = self;
  return self;
}
