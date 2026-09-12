"use client";

import { useRef, useState } from "react";

export function useCarousel(n: number) {
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragX = useRef<number | null>(null);

  const go = (next: number) => setIndex(((next % n) + n) % n);

  const pointerHandlers = {
    onPointerDown: (e: React.PointerEvent) => {
      dragX.current = e.clientX;
      setDragging(true);
    },
    onPointerUp: (e: React.PointerEvent) => {
      setDragging(false);
      if (dragX.current === null) return;
      const d = e.clientX - dragX.current;
      dragX.current = null;
      if (Math.abs(d) > 40) go(index + (d < 0 ? 1 : -1));
    },
    onPointerCancel: () => {
      dragX.current = null;
      setDragging(false);
    },
    onDragStart: (e: React.DragEvent) => e.preventDefault(),
  };

  return { index, go, dragging, pointerHandlers };
}
