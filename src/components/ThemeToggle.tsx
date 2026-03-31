import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun, Palette } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

const PRESET_COLORS = [
  { label: "Teal", primary: "172 50% 40%", accent: "172 50% 94%" },
  { label: "Blue", primary: "220 70% 50%", accent: "220 70% 94%" },
  { label: "Purple", primary: "270 60% 50%", accent: "270 60% 94%" },
  { label: "Rose", primary: "340 65% 50%", accent: "340 65% 94%" },
  { label: "Amber", primary: "38 92% 45%", accent: "38 92% 94%" },
];

export default function ThemeToggle() {
  const { mode, toggleMode, colors, setColors, resetColors } = useTheme();
  const [showPalette, setShowPalette] = useState(false);

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={toggleMode}
        className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
        aria-label="Toggle theme"
      >
        {mode === "light" ? <Moon size={18} className="text-muted-foreground" /> : <Sun size={18} className="text-muted-foreground" />}
      </button>

      <Popover open={showPalette} onOpenChange={setShowPalette}>
        <PopoverTrigger asChild>
          <button className="p-2 rounded-lg hover:bg-surface-hover transition-colors" aria-label="Customize colors">
            <Palette size={18} className="text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4" align="end">
          <p className="text-sm font-semibold text-foreground mb-3">Theme Colors</p>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Presets</p>
              <div className="flex gap-2">
                {PRESET_COLORS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setColors({ primary: p.primary, accent: p.accent })}
                    className="w-7 h-7 rounded-full border-2 border-border hover:scale-110 transition-transform"
                    style={{ backgroundColor: `hsl(${p.primary})` }}
                    title={p.label}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Sidebar Color (HSL)</p>
              <Input
                value={colors.sidebar}
                onChange={(e) => setColors({ sidebar: e.target.value })}
                placeholder="220 20% 10%"
                className="h-8 text-xs"
              />
            </div>
            <Button variant="ghost" size="sm" onClick={resetColors} className="w-full text-xs">
              Reset to Default
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
