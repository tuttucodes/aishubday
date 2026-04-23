"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Start rendering when this far (px) from viewport. */
  rootMargin?: string;
  /** Keep mounted once seen (avoid remount flicker). */
  keepMounted?: boolean;
  /** Placeholder while not yet in view — should match final size. */
  fallback?: ReactNode;
  className?: string;
};

/**
 * Delays rendering of children until the wrapper approaches the viewport.
 * Heavy R3F canvases mount / unmount on scroll, keeping the main-thread rAF
 * queue light when the user is far from them.
 */
export function InViewOnly({
  children,
  rootMargin = "400px 0px",
  keepMounted = false,
  fallback = null,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            if (keepMounted) io.disconnect();
          } else if (!keepMounted) {
            setVisible(false);
          }
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, keepMounted]);

  return (
    <div ref={ref} className={className} style={{ width: "100%", height: "100%" }}>
      {visible ? children : fallback}
    </div>
  );
}
