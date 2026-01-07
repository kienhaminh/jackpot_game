import { X } from "lucide-react";
import { ConfigPanel } from "./ConfigPanel";
import { BrandingPanel } from "./BrandingPanel";
import type { Prize } from "../types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rangeMax: number;
  setRangeMax: (value: number) => void;
  prizes: Prize[];
  addPrize: () => void;
  removePrize: (id: string) => void;
  updatePrize: (id: string, updates: Partial<Prize>) => void;
  onImportCSV: (content: string) => void;
  isSpinning: boolean;
  logoUrl: string | null;
  primaryColor: string;
  showLogoBorder: boolean;
  onUploadLogo: (file: File) => void;
  onRemoveLogo: () => void;
  onSetThemeColor: (color: string) => void;
  onToggleLogoBorder: () => void;
  onResetGame: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  rangeMax,
  setRangeMax,
  prizes,
  addPrize,
  removePrize,
  updatePrize,
  onImportCSV,
  isSpinning,
  logoUrl,
  primaryColor,
  showLogoBorder,
  onUploadLogo,
  onRemoveLogo,
  onSetThemeColor,
  onToggleLogoBorder,
  onResetGame,
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card rounded-2xl border border-border shadow-2xl m-4">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Cài đặt</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Branding Panel */}
          <BrandingPanel
            logoUrl={logoUrl}
            primaryColor={primaryColor}
            showLogoBorder={showLogoBorder}
            onUploadLogo={onUploadLogo}
            onRemoveLogo={onRemoveLogo}
            onSetThemeColor={onSetThemeColor}
            onToggleLogoBorder={onToggleLogoBorder}
          />

          {/* Prize Configuration */}
          <ConfigPanel
            rangeMax={rangeMax}
            setRangeMax={setRangeMax}
            prizes={prizes}
            addPrize={addPrize}
            removePrize={removePrize}
            updatePrize={updatePrize}
            onImportCSV={onImportCSV}
            isSpinning={isSpinning}
          />

          {/* Reset Game Button */}
          <div className="pt-4 border-t border-border">
            <button
              onClick={() => {
                onResetGame();
                onClose();
              }}
              disabled={isSpinning}
              className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold rounded-lg transition-colors disabled:opacity-50"
            >
              Đặt lại trò chơi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
