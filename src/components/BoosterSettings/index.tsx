"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BoosterSettings, DEFAULT_BOOSTER_SETTINGS } from "@/lib/booster";
import { Settings } from "lucide-react";

interface BoosterSettingsProps {
  settings: BoosterSettings;
  onSettingsChange: (settings: BoosterSettings) => void;
  onClose?: () => void;
}

const BoosterSettingsComponent = ({
  settings,
  onSettingsChange,
  onClose,
}: BoosterSettingsProps) => {
  const [localSettings, setLocalSettings] = useState<BoosterSettings>(settings);

  const handleInputChange = (
    field: keyof BoosterSettings,
    value: number | boolean
  ) => {
    const updatedSettings = { ...localSettings, [field]: value };
    setLocalSettings(updatedSettings);
  };

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose?.();
  };

  const handleReset = () => {
    setLocalSettings(DEFAULT_BOOSTER_SETTINGS);
  };

  const totalCards =
    localSettings.mythics +
    localSettings.rares +
    localSettings.uncommons +
    localSettings.commons;

  return (
    <div className="w-full bg-card rounded-lg p-4 sm:p-6 border">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h3 className="text-lg font-semibold">Booster Settings</h3>

        {onClose && (
          <Button onClick={onClose} variant="ghost" size="sm">
            Close
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Rarity Distribution */}
        <div>
          <h4 className="font-medium mb-4">Card Distribution</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center justify-between">
                Mythics
                <span className="text-orange-600 font-bold">
                  {localSettings.mythics}
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={localSettings.mythics}
                onChange={(e) =>
                  handleInputChange("mythics", parseInt(e.target.value))
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>10</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center justify-between">
                Rares
                <span className="text-amber-600 font-semibold">
                  {localSettings.rares}
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="15"
                value={localSettings.rares}
                onChange={(e) =>
                  handleInputChange("rares", parseInt(e.target.value))
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>15</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center justify-between">
                Uncommons
                <span className="text-slate-600 font-medium">
                  {localSettings.uncommons}
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={localSettings.uncommons}
                onChange={(e) =>
                  handleInputChange("uncommons", parseInt(e.target.value))
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>10</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center justify-between">
                Commons
                <span className="text-slate-500">{localSettings.commons}</span>
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={localSettings.commons}
                onChange={(e) =>
                  handleInputChange("commons", parseInt(e.target.value))
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>10</span>
              </div>
            </div>
          </div>

          {/* Total Cards Display */}
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Cards:</span>
              <span
                className={`text-lg font-bold ${
                  totalCards === 15
                    ? "text-green-600"
                    : totalCards > 15
                    ? "text-red-600"
                    : "text-orange-600"
                }`}
              >
                {totalCards}
              </span>
            </div>
            {totalCards !== 15 && (
              <p className="text-xs text-muted-foreground mt-1">
                Recommended: 15 cards per booster
              </p>
            )}
          </div>
        </div>

        {/* Color Balance Settings */}
        <div>
          <h4 className="font-medium mb-4">Color Balance</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Enable Color Balance</span>
                <p className="text-xs text-muted-foreground">
                  Prevents too many cards of the same color
                </p>
              </div>
              <input
                type="checkbox"
                checked={localSettings.colorBalance}
                onChange={(e) =>
                  handleInputChange("colorBalance", e.target.checked)
                }
                className="w-4 h-4"
              />
            </div>

            {localSettings.colorBalance && (
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center justify-between">
                  Max Cards per Color
                  <span className="text-primary font-semibold">
                    {localSettings.maxPerColor}
                  </span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={localSettings.maxPerColor}
                  onChange={(e) =>
                    handleInputChange("maxPerColor", parseInt(e.target.value))
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1</span>
                  <span>6</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preset Configurations */}
        <div>
          <h4 className="font-medium mb-4">Quick Presets</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setLocalSettings({
                  mythics: 1,
                  rares: 3,
                  uncommons: 4,
                  commons: 7,
                  colorBalance: true,
                  maxPerColor: 3,
                })
              }
            >
              Traditional
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setLocalSettings({
                  mythics: 3,
                  rares: 6,
                  uncommons: 3,
                  commons: 3,
                  colorBalance: true,
                  maxPerColor: 3,
                })
              }
            >
              Rare Heavy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setLocalSettings({
                  mythics: 5,
                  rares: 5,
                  uncommons: 3,
                  commons: 2,
                  colorBalance: true,
                  maxPerColor: 3,
                })
              }
            >
              Mythic Focus
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
          <Button onClick={handleSave} className="flex-1">
            Apply Settings
          </Button>
          <Button onClick={handleReset} variant="outline" className="flex-1">
            Reset to Default
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BoosterSettingsComponent;
