import type { Prize } from "../types";
import { Trash2, Plus, Dice5, Hash, Upload, Download } from "lucide-react";
import { useRef, useCallback } from "react";
import { cn } from "../lib/utils";

interface ConfigPanelProps {
  rangeMax: number;
  setRangeMax: (n: number) => void;
  prizes: Prize[];
  addPrize: () => void;
  removePrize: (id: string) => void;
  updatePrize: (id: string, data: Partial<Prize>) => void;
  onImportCSV: (csvContent: string) => void;
  isSpinning: boolean;
}

export function ConfigPanel({
  rangeMax,
  setRangeMax,
  prizes,
  addPrize,
  removePrize,
  updatePrize,
  onImportCSV,
  isSpinning,
}: ConfigPanelProps) {
  const csvInputRef = useRef<HTMLInputElement>(null);

  const handleCSVUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          if (content) {
            onImportCSV(content);
          }
        };
        reader.readAsText(file);
      }
      // Reset input so same file can be uploaded again
      e.target.value = "";
    },
    [onImportCSV]
  );

  return (
    <div className="bg-card w-full max-w-4xl mx-auto p-6 rounded-xl border border-border shadow-2xl">
      <h2 className="text-xl font-bold mb-4 text-primary flex items-center gap-2">
        <Dice5 className="w-6 h-6" /> Game Configuration
      </h2>

      {/* Global Range */}
      <div className="mb-8 p-4 bg-background/50 rounded-lg border border-border">
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Jackpot Range (1 - N)
        </label>
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold font-mono text-primary">1</span>
          <span className="text-muted-foreground">-</span>
          <input
            type="number"
            value={rangeMax}
            onChange={(e) => setRangeMax(Number(e.target.value))}
            className="bg-background border border-border rounded px-3 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none w-32 font-mono text-lg"
            disabled={isSpinning}
          />
        </div>
      </div>

      {/* Prize Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Prize List</h3>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              {/* CSV Upload */}
              <input
                ref={csvInputRef}
                type="file"
                accept=".csv,.txt"
                onChange={handleCSVUpload}
                className="hidden"
              />
              <button
                onClick={() => csvInputRef.current?.click()}
                disabled={isSpinning}
                className="flex items-center gap-2 bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                title="Import từ file CSV (name,type,number)"
              >
                <Upload className="w-4 h-4" /> Import CSV
              </button>
              <button
                onClick={addPrize}
                disabled={isSpinning}
                className="flex items-center gap-2 bg-primary/20 text-primary hover:bg-primary/30 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Add Prize
              </button>
            </div>
            <a
              href="/prizes_sample.csv"
              download
              className="text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 underline underline-offset-2"
            >
              <Download className="w-3 h-3" /> Tải file mẫu
            </a>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 px-2 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider backdrop-blur-sm bg-background/30 rounded-t-lg">
          <div className="col-span-5">Prize Name</div>
          <div className="col-span-4">Winning Logic</div>
          <div className="col-span-2">Number</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {prizes.map((prize) => (
            <div
              key={prize.id}
              className="grid grid-cols-12 gap-4 items-center p-3 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors group"
            >
              {/* Name Input */}
              <div className="col-span-5">
                <input
                  type="text"
                  placeholder="Prize Name (e.g. iPhone 15)"
                  value={prize.name}
                  onChange={(e) =>
                    updatePrize(prize.id, { name: e.target.value })
                  }
                  className="w-full bg-transparent border border-transparent hover:border-border focus:border-primary rounded px-2 py-1 outline-none transition-all placeholder:text-muted-foreground/50"
                  disabled={isSpinning}
                />
              </div>

              {/* Logic Type */}
              <div className="col-span-4 flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`type-${prize.id}`}
                    checked={prize.type === "random"}
                    onChange={() => updatePrize(prize.id, { type: "random" })}
                    className="accent-primary"
                    disabled={isSpinning}
                  />
                  <span
                    className={cn(
                      "text-sm transition-colors",
                      prize.type === "random"
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    Random
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`type-${prize.id}`}
                    checked={prize.type === "fixed"}
                    onChange={() => updatePrize(prize.id, { type: "fixed" })}
                    className="accent-primary"
                    disabled={isSpinning}
                  />
                  <span
                    className={cn(
                      "text-sm transition-colors",
                      prize.type === "fixed"
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    Fixed
                  </span>
                </label>
              </div>

              {/* Fixed Number Input */}
              <div className="col-span-2">
                {prize.type === "fixed" ? (
                  <div className="relative">
                    <Hash className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="number"
                      min={1}
                      max={rangeMax}
                      value={prize.fixedNumber || ""}
                      onChange={(e) =>
                        updatePrize(prize.id, {
                          fixedNumber: Number(e.target.value),
                        })
                      }
                      className={cn(
                        "w-full bg-background border rounded pl-7 pr-2 py-1 outline-none text-sm font-mono",
                        (prize.fixedNumber || 0) > rangeMax
                          ? "border-red-500 text-red-500"
                          : "border-border focus:border-primary text-primary"
                      )}
                      placeholder="Num"
                      disabled={isSpinning}
                    />
                  </div>
                ) : (
                  <div className="h-8 w-full bg-muted/20 rounded border border-dashed border-border flex items-center justify-center">
                    <span className="text-xs text-muted-foreground/50">
                      Auto
                    </span>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="col-span-1 text-right">
                <button
                  onClick={() => removePrize(prize.id)}
                  disabled={isSpinning}
                  className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove Prize"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {prizes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-muted rounded-lg">
              No prizes added yet. Click "Add Prize" to start.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
