import { useState, useRef, useEffect } from "react";
import { useSiteContent } from "@/hooks/SiteContentContext";
import { Pencil, Check, X } from "lucide-react";

interface EditableTextProps {
  settingKey: string;
  defaultValue: string;
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p" | "div";
  className?: string;
  multiline?: boolean;
  children?: React.ReactNode;
}

export function EditableText({
  settingKey,
  defaultValue,
  as: Tag = "span",
  className = "",
  multiline = false,
}: EditableTextProps) {
  const { getContent, updateContent, isEditMode, isSaving } = useSiteContent();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const currentValue = getContent(settingKey, defaultValue);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setEditValue(currentValue);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editValue.trim() !== currentValue) {
      await updateContent(settingKey, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  // Normal mode — just render the text
  if (!isEditMode) {
    return <Tag className={className}>{currentValue}</Tag>;
  }

  // Edit mode but not actively editing — show text with edit overlay
  if (!isEditing) {
    return (
      <Tag
        className={`${className} relative group cursor-pointer`}
        onClick={handleStartEdit}
      >
        {currentValue}
        <span className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform">
            <Pencil className="w-3.5 h-3.5" />
          </span>
        </span>
        <span className="absolute inset-0 rounded border-2 border-dashed border-primary/0 group-hover:border-primary/40 transition-colors pointer-events-none" />
      </Tag>
    );
  }

  // Actively editing — show input/textarea
  return (
    <div className="relative inline-block w-full">
      {multiline ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-background border-2 border-primary rounded-lg p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y min-h-[80px]"
          rows={3}
          disabled={isSaving}
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`w-full bg-background border-2 border-primary rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${className}`}
          disabled={isSaving}
        />
      )}
      <div className="flex gap-1 mt-1.5 justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Check className="w-3.5 h-3.5" />
          Save
        </button>
        <button
          onClick={handleCancel}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-muted text-muted-foreground text-xs font-medium hover:bg-muted/80 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Cancel
        </button>
      </div>
    </div>
  );
}
