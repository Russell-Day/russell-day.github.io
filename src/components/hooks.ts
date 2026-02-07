import { useEffect, useRef, useState } from "react";
import { type MetricConfig } from "./types";

export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

export function useAnimatedMetrics(metrics: MetricConfig[], trigger: boolean) {
  const [values, setValues] = useState<number[]>(() => metrics.map(() => 0));

  useEffect(() => {
    setValues(metrics.map(() => 0));
    if (!trigger || metrics.length === 0) return;

    let frameId = 0;
    const start = performance.now();

    const animate = (timestamp: number) => {
      const next = metrics.map((metric) => {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / metric.duration, 1);
        const raw = metric.target * progress;
        return Number(raw.toFixed(metric.decimals));
      });

      setValues(next);

      const isDone = next.every((value, index) => value >= metrics[index].target);
      if (!isDone) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [metrics, trigger]);

  return values;
}
