"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  getCustomBoostersFromStorage,
  deleteCustomBoosterById,
  deleteCustomBoosterStorage,
  StoredCustomBooster,
} from "@/lib/booster";
import CubeBooster from "@/components/CubeBooster";
import { Trash2, History, X } from "lucide-react";

interface CustomPastBoostersProps {
  onClose?: () => void;
}

const CustomPastBoosters = ({ onClose }: CustomPastBoostersProps) => {
  const [storedBoosters, setStoredBoosters] = useState<StoredCustomBooster[]>(
    []
  );
  const [showCardNames, setShowCardNames] = useState(false);

  useEffect(() => {
    loadBoosters();
  }, []);

  const loadBoosters = () => {
    const boosters = getCustomBoostersFromStorage();
    setStoredBoosters(boosters);
  };

  const handleDeleteBooster = (id: string) => {
    deleteCustomBoosterById(id);
    loadBoosters();
  };

  const handleClearAll = () => {
    deleteCustomBoosterStorage();
    loadBoosters();
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSettingsSummary = (
    settings: StoredCustomBooster["settings"]
  ): string => {
    const total =
      settings.mythics + settings.rares + settings.uncommons + settings.commons;
    return `${settings.mythics}M, ${settings.rares}R, ${settings.uncommons}U, ${settings.commons}C (${total} total)`;
  };

  if (storedBoosters.length === 0) {
    return (
      <div className="w-full bg-card rounded-lg p-6 border text-center">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h3 className="text-lg font-semibold">Custom Booster History</h3>
          {onClose && (
            <Button onClick={onClose} variant="ghost" size="sm">
              <X size={16} className="mr-2" />
              Close
            </Button>
          )}
        </div>

        <div className="py-8 text-muted-foreground">
          <History size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">No custom boosters saved yet</p>
          <p className="text-sm">
            Generate some custom boosters to see them here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-card rounded-lg p-4 sm:p-6 border">
      {/* Controls */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <p className="text-sm text-muted-foreground">
          {storedBoosters.length} saved booster
          {storedBoosters.length !== 1 ? "s" : ""}
        </p>
        <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-2">
          <Button
            onClick={handleClearAll}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto text-red-600 hover:text-red-700"
          >
            <Trash2 size={16} className="mr-2" />
            Clear All
          </Button>
          {onClose && (
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="w-full sm:w-auto flex items-center justify-center"
            >
              <span>Close</span>
              <X size={16} className="ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Booster List */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {storedBoosters.map((storedBooster, index) => (
          <div key={storedBooster.id} className="bg-muted rounded-lg p-4">
            {/* Booster Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <div>
                <h4 className="font-medium">
                  Booster #{storedBoosters.length - index}
                </h4>
                <p className="text-sm text-muted-foreground">
                  Generated {formatDate(storedBooster.timestamp)}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="text-center sm:text-right">
                  <p className="text-sm font-medium">
                    {getSettingsSummary(storedBooster.settings)}
                  </p>
                  {storedBooster.settings.colorBalance && (
                    <p className="text-xs text-muted-foreground">
                      Color Balanced (max {storedBooster.settings.maxPerColor})
                    </p>
                  )}
                </div>
                <Button
                  onClick={() => handleDeleteBooster(storedBooster.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 w-full sm:w-auto"
                >
                  <Trash2 size={14} className="mr-1 sm:mr-0" />
                  <span className="sm:hidden">Delete</span>
                </Button>
              </div>
            </div>

            {/* Booster Display */}
            <CubeBooster
              booster={storedBooster.booster}
              showCardNames={showCardNames}
              isCustomBooster={true}
            />
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-4 border-t text-center">
        <p className="text-xs text-muted-foreground">
          Only the 20 most recent custom boosters are saved
        </p>
      </div>
    </div>
  );
};

export default CustomPastBoosters;
