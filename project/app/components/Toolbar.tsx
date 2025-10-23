"use client";

import { Upload, Plus, Type, Image, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface ToolbarProps {
  onImportHTML: (html: string) => void;
  onAddText: () => void;
  onAddImage: () => void;
  onDelete: () => void;
  onExport: () => void;
  hasSelection: boolean;
}

export function Toolbar({
  onImportHTML,
  onAddText,
  onAddImage,
  onDelete,
  onExport,
  hasSelection,
}: ToolbarProps) {
  const [htmlInput, setHtmlInput] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const html = event.target?.result as string;
        onImportHTML(html);
      };
      reader.readAsText(file);
    }
  };

  const handlePasteHTML = () => {
    onImportHTML(htmlInput);
    setHtmlInput("");
    setIsDialogOpen(false);
  };

  return (
    <div className="flex items-center gap-2 p-4 border-b bg-white">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import HTML
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import HTML</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Upload HTML File
              </label>
              <input
                type="file"
                accept=".html"
                onChange={handleFileUpload}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">Or</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Paste HTML Code
              </label>
              <Textarea
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
                placeholder="Paste your HTML code here..."
                className="min-h-[200px] font-mono text-sm"
              />
              <Button
                onClick={handlePasteHTML}
                className="mt-2"
                disabled={!htmlInput.trim()}
              >
                Load HTML
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="h-6 w-px bg-slate-200" />

      <Button variant="outline" size="sm" onClick={onAddText}>
        <Type className="w-4 h-4 mr-2" />
        Add Text
      </Button>

      <Button variant="outline" size="sm" onClick={onAddImage}>
        <Image className="w-4 h-4 mr-2" />
        Add Image
      </Button>

      <div className="h-6 w-px bg-slate-200" />

      <Button
        variant="outline"
        size="sm"
        onClick={onDelete}
        disabled={!hasSelection}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete
      </Button>

      <div className="ml-auto" />

      <Button variant="default" size="sm" onClick={onExport}>
        <Download className="w-4 h-4 mr-2" />
        Export HTML
      </Button>
    </div>
  );
}
