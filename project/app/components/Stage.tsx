"use client";

import { useEffect, useRef, useState } from "react";

interface StageProps {
  htmlContent: string;
  selectedElement: HTMLElement | null;
  onElementSelect: (element: HTMLElement | null) => void;
}

export function Stage({ htmlContent, selectedElement, onElementSelect }: StageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [elementStart, setElementStart] = useState({ x: 0, y: 0 });
  const draggedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (stageRef.current) {
      stageRef.current.innerHTML = htmlContent;

      const elements = stageRef.current.querySelectorAll("*");
      elements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        htmlElement.style.cursor = "pointer";

        htmlElement.addEventListener("click", (e) => {
          e.stopPropagation();
          onElementSelect(htmlElement);
        });
      });
    }
  }, [htmlContent]);

  useEffect(() => {
    if (stageRef.current) {
      const elements = stageRef.current.querySelectorAll("*");
      elements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        if (htmlElement === selectedElement) {
          htmlElement.style.outline = "2px solid #3b82f6";
          htmlElement.style.outlineOffset = "2px";
        } else {
          htmlElement.style.outline = "none";
        }
      });
    }
  }, [selectedElement]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!selectedElement || e.button !== 0) return;

    const target = e.target as HTMLElement;
    if (!selectedElement.contains(target) && target !== selectedElement) return;

    e.preventDefault();
    e.stopPropagation();

    draggedElementRef.current = selectedElement;

    const rect = selectedElement.getBoundingClientRect();
    const stageRect = stageRef.current?.getBoundingClientRect();

    if (!stageRect) return;

    setDragStart({ x: e.clientX, y: e.clientY });

    const currentLeft = selectedElement.style.left
      ? parseInt(selectedElement.style.left)
      : rect.left - stageRect.left;
    const currentTop = selectedElement.style.top
      ? parseInt(selectedElement.style.top)
      : rect.top - stageRect.top;

    setElementStart({ x: currentLeft, y: currentTop });
    setIsDragging(true);

    if (selectedElement.style.position !== "absolute") {
      selectedElement.style.position = "absolute";
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !draggedElementRef.current || !stageRef.current) return;

    e.preventDefault();

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    const newLeft = elementStart.x + deltaX;
    const newTop = elementStart.y + deltaY;

    const stageRect = stageRef.current.getBoundingClientRect();
    const elementRect = draggedElementRef.current.getBoundingClientRect();

    const maxLeft = 720 - elementRect.width;
    const maxTop = 720 - elementRect.height;

    const constrainedLeft = Math.max(0, Math.min(newLeft, maxLeft));
    const constrainedTop = Math.max(0, Math.min(newTop, maxTop));

    draggedElementRef.current.style.left = `${constrainedLeft}px`;
    draggedElementRef.current.style.top = `${constrainedTop}px`;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    draggedElementRef.current = null;
  };

  const handleStageClick = (e: React.MouseEvent) => {
    if (e.target === stageRef.current) {
      onElementSelect(null);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-100 p-8 overflow-auto">
      <div
        ref={stageRef}
        className="bg-white shadow-lg"
        style={{
          width: "720px",
          height: "720px",
          position: "relative",
          overflow: "hidden",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleStageClick}
      />
    </div>
  );
}
