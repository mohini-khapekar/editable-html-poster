"use client";

import { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { Toolbar } from "./components/Toolbar";
import { Stage } from "./components/Stage";
import { PropertiesPanel } from "./components/PropertiesPanel";

export default function Home() {
  const [htmlContent, setHtmlContent] = useState("");
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(
    null
  );
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedElement &&
        !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)
      ) {
        e.preventDefault();
        handleDelete();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElement]);

  const handleImportHTML = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const bodyContent = doc.body.innerHTML || html;
    const styleContent = Array.from(doc.head.querySelectorAll("style"))
      .map((style) => style.innerHTML)
      .join("\n");

    let sanitizedHTML = DOMPurify.sanitize(bodyContent, {
      ADD_TAGS: ["style"],
      ADD_ATTR: ["class"],
    });

    if (styleContent) {
      sanitizedHTML = `<style>${styleContent}</style>${sanitizedHTML}`;
    }

    setHtmlContent(sanitizedHTML);
    setSelectedElement(null);
  };

  const handleAddText = () => {
    const newText = `<p style="position: absolute; top: 50px; left: 50px; font-size: 16px; color: #000000;">New Text Block</p>`;
    setHtmlContent((prev) => prev + newText);
    setSelectedElement(null);
  };

  const handleAddImage = () => {
    const newImage = `<img src="https://via.placeholder.com/150" alt="New Image" style="position: absolute; top: 100px; left: 100px; width: 150px; height: 150px;" />`;
    setHtmlContent((prev) => prev + newImage);
    setSelectedElement(null);
  };

  const handleDelete = () => {
    if (selectedElement && selectedElement.parentNode) {
      selectedElement.parentNode.removeChild(selectedElement);
      setSelectedElement(null);
      triggerUpdate();
    }
  };

  const handleExport = () => {
    const stageElement = document.querySelector('[style*="720px"]');
    if (!stageElement) return;

    const clonedStage = stageElement.cloneNode(true) as HTMLElement;

    const allElements = clonedStage.querySelectorAll("*");
    allElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.outline = "none";
      htmlElement.style.cursor = "";
    });

    const styles = document.querySelectorAll("style");
    let collectedStyles = "";
    styles.forEach((style) => {
      if (style.innerHTML.includes(".poster") || style.innerHTML.includes("body")) {
        collectedStyles += style.innerHTML + "\n";
      }
    });

    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta data-generated-by="editable-html-poster" />
  <title>Exported Poster</title>
  <style>
    body { margin: 0; padding: 0; }
    ${collectedStyles}
  </style>
</head>
<body>
  ${clonedStage.innerHTML}
</body>
</html>`;

    const blob = new Blob([fullHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "poster.html";
    link.click();
    URL.revokeObjectURL(url);
  };

  const triggerUpdate = () => {
    setUpdateTrigger((prev) => prev + 1);
  };

  return (
    <div className="h-screen flex flex-col">
      <Toolbar
        onImportHTML={handleImportHTML}
        onAddText={handleAddText}
        onAddImage={handleAddImage}
        onDelete={handleDelete}
        onExport={handleExport}
        hasSelection={!!selectedElement}
      />
      <div className="flex flex-1 overflow-hidden">
        <Stage
          htmlContent={htmlContent}
          selectedElement={selectedElement}
          onElementSelect={setSelectedElement}
        />
        <PropertiesPanel
          selectedElement={selectedElement}
          onUpdate={triggerUpdate}
        />
      </div>
    </div>
  );
}
