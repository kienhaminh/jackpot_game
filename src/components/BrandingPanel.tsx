import { useCallback, useRef } from "react";
import { THEME_PRESETS } from "../hooks/useBranding";
import { X, Palette, ImageIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface BrandingPanelProps {
  logoUrl: string | null;
  primaryColor: string;
  showLogoBorder: boolean;
  onUploadLogo: (file: File) => void;
  onRemoveLogo: () => void;
  onSetThemeColor: (color: string) => void;
  onToggleLogoBorder: () => void;
}

export function BrandingPanel({
  logoUrl,
  primaryColor,
  showLogoBorder,
  onUploadLogo,
  onRemoveLogo,
  onSetThemeColor,
  onToggleLogoBorder,
}: BrandingPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onUploadLogo(file);
      }
    },
    [onUploadLogo]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        onUploadLogo(file);
      }
    },
    [onUploadLogo]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="bg-card w-full max-w-4xl mx-auto p-6 rounded-xl border border-border shadow-2xl mb-6">
      <h2 className="text-xl font-bold mb-6 text-primary flex items-center gap-2">
        <Palette className="w-6 h-6" /> Tuỳ Chỉnh Thương Hiệu
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Logo Upload Section */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-3">
            Logo Công Ty / Tổ Chức
          </label>

          {logoUrl ? (
            <div className="relative group">
              <div className="w-full h-40 bg-background rounded-xl border border-border flex items-center justify-center p-4">
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <button
                onClick={onRemoveLogo}
                className="absolute top-2 right-2 p-2 bg-red-500/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Xoá logo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-40 bg-background rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  Kéo thả hoặc nhấn để tải lên
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, SVG (tối đa 2MB)
                </p>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Logo Border Toggle */}
          {logoUrl && (
            <div className="mt-4 flex items-center justify-between">
              <label className="text-sm text-muted-foreground">
                Hiển thị viền mềm
              </label>
              <button
                onClick={onToggleLogoBorder}
                className={cn(
                  "relative w-12 h-6 rounded-full transition-colors",
                  showLogoBorder ? "bg-primary" : "bg-muted"
                )}
              >
                <div
                  className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                    showLogoBorder ? "left-7" : "left-1"
                  )}
                />
              </button>
            </div>
          )}
        </div>

        {/* Theme Color Section */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-3">
            Màu Chủ Đạo
          </label>

          <div className="grid grid-cols-4 gap-3">
            {THEME_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => onSetThemeColor(preset.color)}
                className={cn(
                  "relative w-full aspect-square rounded-xl transition-all hover:scale-105",
                  primaryColor === preset.color
                    ? "ring-2 ring-white ring-offset-2 ring-offset-card scale-105"
                    : ""
                )}
                style={{ backgroundColor: preset.color }}
                title={preset.name}
              >
                {primaryColor === preset.color && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Custom Color Input */}
          <div className="mt-4">
            <label className="block text-xs text-muted-foreground mb-2">
              Hoặc nhập mã màu tuỳ chỉnh:
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => onSetThemeColor(e.target.value)}
                className="w-12 h-10 rounded cursor-pointer border-0 bg-transparent"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => onSetThemeColor(e.target.value)}
                placeholder="#f59e0b"
                className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm font-mono text-foreground focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
