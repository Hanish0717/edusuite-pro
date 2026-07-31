import * as React from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Code,
  Heading1,
  Heading2,
  Quote,
  Undo2,
  Redo2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Write something amazing...",
  className,
}: RichTextEditorProps) {
  const [content, setContent] = React.useState(value);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    setContent(value);
  }, [value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    if (onChange) onChange(val);
  };

  // Helper to wrap selected text in formatting symbols
  const applyFormat = (syntaxBefore: string, syntaxAfter = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const selectedText = text.substring(start, end);
    const replacement = syntaxBefore + (selectedText || "text") + (syntaxAfter || syntaxBefore);

    const nextContent = text.substring(0, start) + replacement + text.substring(end);
    setContent(nextContent);
    if (onChange) onChange(nextContent);

    // Refocus and select the newly inserted format
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + syntaxBefore.length,
        start + syntaxBefore.length + (selectedText || "text").length,
      );
    }, 10);
  };

  const toolbarButtons = [
    { icon: Bold, label: "Bold", onClick: () => applyFormat("**") },
    { icon: Italic, label: "Italic", onClick: () => applyFormat("*") },
    { icon: Underline, label: "Underline", onClick: () => applyFormat("<u>", "</u>") },
    { icon: Heading1, label: "Heading 1", onClick: () => applyFormat("# ") },
    { icon: Heading2, label: "Heading 2", onClick: () => applyFormat("## ") },
    { icon: Quote, label: "Quote", onClick: () => applyFormat("> ") },
    { icon: List, label: "Bullet List", onClick: () => applyFormat("- ") },
    { icon: ListOrdered, label: "Numbered List", onClick: () => applyFormat("1. ") },
    { icon: Link, label: "Insert Link", onClick: () => applyFormat("[", "](https://)") },
    { icon: Code, label: "Code Block", onClick: () => applyFormat("```\n", "\n```") },
  ];

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 overflow-hidden flex flex-col w-full",
        className,
      )}
    >
      {/* Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 bg-muted/30 border-b border-border p-1.5 shrink-0">
        {toolbarButtons.map((btn, idx) => (
          <Button
            key={idx}
            type="button"
            variant="ghost"
            size="icon"
            onClick={btn.onClick}
            title={btn.label}
            className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-transform"
          >
            <btn.icon className="size-4" />
          </Button>
        ))}
        <div className="h-4 w-px bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Undo"
          className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
        >
          <Undo2 className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Redo"
          className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
        >
          <Redo2 className="size-4" />
        </Button>
      </div>

      {/* Editor Textarea */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleTextChange}
        placeholder={placeholder}
        className="flex-1 w-full min-h-[160px] p-4 bg-transparent border-0 outline-none focus:ring-0 focus:outline-none text-sm leading-relaxed resize-y font-sans"
      />
    </div>
  );
}
