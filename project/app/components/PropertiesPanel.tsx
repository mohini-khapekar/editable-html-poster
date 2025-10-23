"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PropertiesPanelProps {
  selectedElement: HTMLElement | null;
  onUpdate: () => void;
}

export function PropertiesPanel({
  selectedElement,
  onUpdate,
}: PropertiesPanelProps) {
  const [properties, setProperties] = useState<{
    tagName: string;
    textContent: string;
    src: string;
    alt: string;
    width: string;
    height: string;
    fontSize: string;
    color: string;
    fontWeight: string;
    top: string;
    left: string;
  }>({
    tagName: "",
    textContent: "",
    src: "",
    alt: "",
    width: "",
    height: "",
    fontSize: "",
    color: "",
    fontWeight: "",
    top: "",
    left: "",
  });

  useEffect(() => {
    if (selectedElement) {
      const computedStyle = window.getComputedStyle(selectedElement);
      const isImage = selectedElement.tagName.toLowerCase() === "img";

      setProperties({
        tagName: selectedElement.tagName.toLowerCase(),
        textContent: isImage ? "" : selectedElement.textContent || "",
        src: isImage ? (selectedElement as HTMLImageElement).src : "",
        alt: isImage ? (selectedElement as HTMLImageElement).alt : "",
        width: isImage
          ? (selectedElement as HTMLImageElement).width.toString()
          : "",
        height: isImage
          ? (selectedElement as HTMLImageElement).height.toString()
          : "",
        fontSize: computedStyle.fontSize,
        color: computedStyle.color,
        fontWeight: computedStyle.fontWeight,
        top: selectedElement.style.top || "",
        left: selectedElement.style.left || "",
      });
    }
  }, [selectedElement]);

  const handleTextContentChange = (value: string) => {
    if (selectedElement) {
      selectedElement.textContent = value;
      setProperties((prev) => ({ ...prev, textContent: value }));
      onUpdate();
    }
  };

  const handleImageSrcChange = (value: string) => {
    if (selectedElement && selectedElement.tagName.toLowerCase() === "img") {
      (selectedElement as HTMLImageElement).src = value;
      setProperties((prev) => ({ ...prev, src: value }));
      onUpdate();
    }
  };

  const handleImageAltChange = (value: string) => {
    if (selectedElement && selectedElement.tagName.toLowerCase() === "img") {
      (selectedElement as HTMLImageElement).alt = value;
      setProperties((prev) => ({ ...prev, alt: value }));
      onUpdate();
    }
  };

  const handleImageDimensionChange = (
    dimension: "width" | "height",
    value: string
  ) => {
    if (selectedElement && selectedElement.tagName.toLowerCase() === "img") {
      const numValue = parseInt(value) || 0;
      if (dimension === "width") {
        (selectedElement as HTMLImageElement).width = numValue;
      } else {
        (selectedElement as HTMLImageElement).height = numValue;
      }
      setProperties((prev) => ({ ...prev, [dimension]: value }));
      onUpdate();
    }
  };

  const handleStyleChange = (property: string, value: string) => {
    if (selectedElement) {
      (selectedElement.style as any)[property] = value;
      setProperties((prev) => ({ ...prev, [property]: value }));
      onUpdate();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedElement) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        handleImageSrcChange(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!selectedElement) {
    return (
      <div className="w-80 border-l bg-white p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              Select an element to edit its properties
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isImage = selectedElement.tagName.toLowerCase() === "img";

  return (
    <div className="w-80 border-l bg-white p-4 overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Properties</CardTitle>
          <p className="text-xs text-slate-500">
            Element: &lt;{properties.tagName}&gt;
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {isImage ? (
            <>
              <div>
                <Label htmlFor="img-src" className="text-xs">
                  Image Source (URL)
                </Label>
                <Input
                  id="img-src"
                  value={properties.src}
                  onChange={(e) => handleImageSrcChange(e.target.value)}
                  className="mt-1"
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label htmlFor="img-upload" className="text-xs">
                  Upload New Image
                </Label>
                <input
                  id="img-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-1 block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                />
              </div>

              <div>
                <Label htmlFor="img-alt" className="text-xs">
                  Alt Text
                </Label>
                <Input
                  id="img-alt"
                  value={properties.alt}
                  onChange={(e) => handleImageAltChange(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="img-width" className="text-xs">
                    Width
                  </Label>
                  <Input
                    id="img-width"
                    type="number"
                    value={properties.width}
                    onChange={(e) =>
                      handleImageDimensionChange("width", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="img-height" className="text-xs">
                    Height
                  </Label>
                  <Input
                    id="img-height"
                    type="number"
                    value={properties.height}
                    onChange={(e) =>
                      handleImageDimensionChange("height", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <Label htmlFor="text-content" className="text-xs">
                  Text Content
                </Label>
                <Textarea
                  id="text-content"
                  value={properties.textContent}
                  onChange={(e) => handleTextContentChange(e.target.value)}
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="font-size" className="text-xs">
                  Font Size
                </Label>
                <Input
                  id="font-size"
                  value={properties.fontSize}
                  onChange={(e) => handleStyleChange("fontSize", e.target.value)}
                  className="mt-1"
                  placeholder="16px"
                />
              </div>

              <div>
                <Label htmlFor="color" className="text-xs">
                  Color
                </Label>
                <Input
                  id="color"
                  value={properties.color}
                  onChange={(e) => handleStyleChange("color", e.target.value)}
                  className="mt-1"
                  placeholder="#000000"
                />
              </div>

              <div>
                <Label htmlFor="font-weight" className="text-xs">
                  Font Weight
                </Label>
                <Input
                  id="font-weight"
                  value={properties.fontWeight}
                  onChange={(e) =>
                    handleStyleChange("fontWeight", e.target.value)
                  }
                  className="mt-1"
                  placeholder="400, 700, bold"
                />
              </div>
            </>
          )}

          <div className="pt-4 border-t">
            <p className="text-xs font-semibold mb-2">Position</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="pos-left" className="text-xs">
                  Left
                </Label>
                <Input
                  id="pos-left"
                  value={properties.left}
                  onChange={(e) => handleStyleChange("left", e.target.value)}
                  className="mt-1"
                  placeholder="0px"
                />
              </div>
              <div>
                <Label htmlFor="pos-top" className="text-xs">
                  Top
                </Label>
                <Input
                  id="pos-top"
                  value={properties.top}
                  onChange={(e) => handleStyleChange("top", e.target.value)}
                  className="mt-1"
                  placeholder="0px"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
