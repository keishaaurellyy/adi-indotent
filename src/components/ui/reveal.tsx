"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type RevealProps = {
  /**
   * The element to render. A wrapper div would be wrong around list items, so
   * the class goes on the caller's own `ul`/`ol`/`dl` instead.
   */
  as?: "div" | "ul" | "ol" | "dl" | "section";
  /**
   * Stagger the direct children in sequence rather than moving the block as
   * one. For card grids; a block of prose should arrive whole.
   */
  group?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

/**
 * Fades its content up as it scrolls into view.
 *
 * The hidden state lives in CSS, not here, and only inside a
 * `prefers-reduced-motion: no-preference` and `scripting: enabled` query — so
 * a reader who asks for less motion, a browser that cannot run scripts, and a
 * browser too old to understand the query all get the finished layout with
 * nothing to undo. That is also why nothing here sets an inline opacity:
 * content hidden by JavaScript stays hidden when the JavaScript fails.
 *
 * There is deliberately no fallback for a missing IntersectionObserver. The
 * `scripting` media feature landed years after the observer did, so a browser
 * old enough to lack the observer also fails the query that hides anything —
 * such a reader sees the finished page, and a fallback here would be code
 * that can never run.
 */
export function Reveal({
  as: Tag = "div",
  group = false,
  className,
  style,
  children,
}: RevealProps) {
  // The node is state rather than a ref so the effect can depend on it: one
  // ref object cannot type-check against five different element types, and
  // casting it to one of them would be a lie about the other four.
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!node || revealed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setRevealed(true);
        // One-way: scrolling back up must not replay it. Anything already on
        // screen at load intersects immediately and animates in on arrival.
        observer.disconnect();
      },
      // Held back from the bottom edge so a block finishes arriving while the
      // reader is still travelling towards it, not after they have stopped.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [node, revealed]);

  return (
    <Tag
      ref={setNode}
      data-revealed={revealed || undefined}
      className={cn(group ? "reveal-group" : "reveal", className)}
      style={style}
    >
      {children}
    </Tag>
  );
}
