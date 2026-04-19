import { useState, useRef, useCallback, useEffect } from "react";
import { useSiteContent } from "@/hooks/SiteContentContext";
import { useAuth } from "@/hooks/useAuth";
import { Pencil, Upload, Link, X, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface EditableImageProps {
  settingKey: string;
  defaultSrc: string;
  alt: string;
  className?: string;
}

export function EditableImage({
  settingKey,
  defaultSrc,
  alt,
  className = "",
}: EditableImageProps) {
  const { getContent, updateContent, isEditMode, isSaving } = useSiteContent();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const storedUrl = getContent(settingKey, "");
  const resolvedSrc = storedUrl.trim() ? storedUrl.trim() : defaultSrc;
  const [displaySrc, setDisplaySrc] = useState(resolvedSrc);

  useEffect(() => {
    setDisplaySrc(storedUrl.trim() ? storedUrl.trim() : defaultSrc);
  }, [storedUrl, defaultSrc]);

  const uploadToCloudinary = useCallback(
    async (file: File): Promise<string | null> => {
      if (!user?.access_token) {
        toast.error("You must be logged in to upload");
        return null;
      }

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
          body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        const result = await response.json();
        return result.url;
      } catch (error: any) {
        toast.error(error.message || "Failed to upload image");
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [user]
  );

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be smaller than 10MB");
      return;
    }

    const url = await uploadToCloudinary(file);
    if (url) {
      await updateContent(settingKey, url);
      setIsModalOpen(false);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) {
      toast.error("Please enter an image URL");
      return;
    }
    await updateContent(settingKey, urlInput.trim());
    setIsModalOpen(false);
    setUrlInput("");
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleImageError = () => {
    if (displaySrc !== defaultSrc) setDisplaySrc(defaultSrc);
  };

  // Normal mode — just render the image
  if (!isEditMode) {
    return (
      <img
        src={displaySrc}
        alt={alt}
        className={className}
        onError={handleImageError}
      />
    );
  }

  // Edit mode — show image with edit overlay
  return (
    <>
      <div className="relative group cursor-pointer" onClick={() => setIsModalOpen(true)}>
        <img src={displaySrc} alt={alt} className={className} onError={handleImageError} />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg font-medium text-sm">
            <Pencil className="w-4 h-4" />
            Change Image
          </span>
        </div>
        <span className="absolute inset-0 rounded border-2 border-dashed border-primary/0 group-hover:border-primary/40 transition-colors pointer-events-none" />
      </div>

      {/* Image Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden border border-border">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-serif text-lg font-bold text-foreground">Change Image</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab("upload")}
                className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  activeTab === "upload"
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>
              <button
                onClick={() => setActiveTab("url")}
                className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  activeTab === "url"
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Link className="w-4 h-4" />
                Paste URL
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === "upload" ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                    isDragging
                      ? "border-primary bg-primary/10 scale-[1.02]"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-10 h-10 text-primary animate-spin" />
                      <p className="text-sm font-medium text-foreground">
                        Uploading to Cloudinary...
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Drop an image here or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG, WEBP up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileInputChange}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUrlSubmit();
                      }}
                    />
                  </div>
                  {urlInput && (
                    <div className="rounded-lg overflow-hidden border border-border bg-muted/30">
                      <img
                        src={urlInput}
                        alt="Preview"
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  <button
                    onClick={handleUrlSubmit}
                    disabled={!urlInput.trim() || isSaving}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Save Image URL
                  </button>
                </div>
              )}

              {/* Current Image Preview */}
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2">Current Image</p>
                <div className="rounded-lg overflow-hidden border border-border">
                  <img
                    src={displaySrc}
                    alt="Current"
                    className="w-full h-32 object-cover"
                    onError={handleImageError}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
