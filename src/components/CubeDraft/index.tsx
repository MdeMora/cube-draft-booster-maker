"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  generateAllBoosters,
  getCubeStatistics,
  CubeBooster,
  resetDraftSession,
} from "@/lib/cubeService";
import { CARD_COLORS, CARD_RARITY } from "@/lib/booster";

interface CubeDraftProps {
  onBoostersGenerated?: (boosters: CubeBooster[]) => void;
}

const CubeDraft = ({ onBoostersGenerated }: CubeDraftProps) => {
  const [players, setPlayers] = useState(2);
  const [boostersPerPlayer, setBoostersPerPlayer] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedBoosters, setGeneratedBoosters] = useState<CubeBooster[]>([]);
  const [currentBoosterIndex, setCurrentBoosterIndex] = useState(0);
  const [cubeStats, setCubeStats] = useState<any>(null);
  const [showCardNames, setShowCardNames] = useState(false);

  // Calculate total boosters
  const totalBoosters = players * boostersPerPlayer;
  const maxBoosters = 36;
  const totalCards = totalBoosters * 15;

  // Load cube statistics on mount
  useEffect(() => {
    getCubeStatistics().then(setCubeStats);
  }, []);

  const handleGenerateBoosters = async () => {
    if (totalBoosters > maxBoosters) {
      setError(
        `Maximum ${maxBoosters} boosters allowed (${totalBoosters} requested)`
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      resetDraftSession(); // Reset previous session
      const boosters = await generateAllBoosters(players, boostersPerPlayer);
      setGeneratedBoosters(boosters);
      setCurrentBoosterIndex(0);
      onBoostersGenerated?.(boosters);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate boosters"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    resetDraftSession();
    setGeneratedBoosters([]);
    setCurrentBoosterIndex(0);
    setError(null);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4">
      {/* Configuration Section */}
      <div className="w-full bg-card rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Draft Configuration</h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Players</label>
            <input
              type="number"
              min="1"
              max="12"
              value={players}
              onChange={(e) =>
                setPlayers(
                  Math.max(1, Math.min(12, parseInt(e.target.value) || 1))
                )
              }
              className="w-full px-3 py-2 border rounded-md bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Boosters per Player</label>
            <input
              type="number"
              min="1"
              max="6"
              value={boostersPerPlayer}
              onChange={(e) =>
                setBoostersPerPlayer(
                  Math.max(1, Math.min(6, parseInt(e.target.value) || 1))
                )
              }
              className="w-full px-3 py-2 border rounded-md bg-background"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="text-sm text-muted-foreground space-y-1 mb-4">
          <p>
            Total Boosters: {totalBoosters} / {maxBoosters}
          </p>
          <p>Total Cards: {totalCards} / 540</p>
          {cubeStats && <p>Available: {cubeStats.totalCards} cards in cube</p>}
        </div>

        {/* Validation Warning */}
        {totalBoosters > maxBoosters && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
            Too many boosters! Maximum is {maxBoosters} boosters (
            {maxBoosters * 15} cards).
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleGenerateBoosters}
            disabled={loading || totalBoosters > maxBoosters}
            className="flex-1"
          >
            {loading ? "Generating..." : "Generate Draft"}
          </Button>

          {generatedBoosters.length > 0 && (
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Generated Boosters Section */}
      {generatedBoosters.length > 0 && (
        <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Generated Boosters ({generatedBoosters.length})
            </h3>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowCardNames(!showCardNames)}
                variant="outline"
                size="sm"
              >
                {showCardNames ? "Hide Names" : "Show Names"}
              </Button>
              <Button
                onClick={() =>
                  setCurrentBoosterIndex(Math.max(0, currentBoosterIndex - 1))
                }
                disabled={currentBoosterIndex === 0}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentBoosterIndex + 1} / {generatedBoosters.length}
              </span>
              <Button
                onClick={() =>
                  setCurrentBoosterIndex(
                    Math.min(
                      generatedBoosters.length - 1,
                      currentBoosterIndex + 1
                    )
                  )
                }
                disabled={currentBoosterIndex === generatedBoosters.length - 1}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>

          {/* Current Booster Display */}
          <div className="bg-card rounded-lg p-4">
            <h4 className="font-medium mb-3">
              Booster {currentBoosterIndex + 1}
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {generatedBoosters[currentBoosterIndex]?.map((card, idx) => {
                const colorName =
                  card.color === "white"
                    ? "White"
                    : card.color === "blue"
                    ? "Blue"
                    : card.color === "black"
                    ? "Black"
                    : card.color === "red"
                    ? "Red"
                    : card.color === "green"
                    ? "Green"
                    : card.color === "multicolor"
                    ? "Multicolor"
                    : card.color === "colorless"
                    ? "Colorless"
                    : card.color;

                const rarityName =
                  card.rarity === "mithyc"
                    ? "Mythic"
                    : card.rarity === "rare"
                    ? "Rare"
                    : card.rarity === "uncommon"
                    ? "Uncommon"
                    : card.rarity === "common"
                    ? "Common"
                    : card.rarity;

                const colorBg =
                  card.color === "white"
                    ? "bg-yellow-100 border-yellow-300"
                    : card.color === "blue"
                    ? "bg-blue-100 border-blue-300"
                    : card.color === "black"
                    ? "bg-gray-100 border-gray-400"
                    : card.color === "red"
                    ? "bg-red-100 border-red-300"
                    : card.color === "green"
                    ? "bg-green-100 border-green-300"
                    : card.color === "multicolor"
                    ? "bg-gradient-to-br from-blue-100 to-red-100 border-purple-300"
                    : "bg-gray-50 border-gray-200";

                const rarityColor =
                  card.rarity === "mithyc"
                    ? "text-orange-600 font-bold"
                    : card.rarity === "rare"
                    ? "text-yellow-600 font-semibold"
                    : card.rarity === "uncommon"
                    ? "text-gray-600 font-medium"
                    : "text-gray-500";

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border-2 text-xs transition-all ${colorBg} ${
                      !showCardNames
                        ? "h-20 flex flex-col justify-center items-center"
                        : ""
                    }`}
                    title={
                      showCardNames
                        ? card.name
                        : `${card.name} - ${colorName} ${rarityName}`
                    }
                  >
                    {showCardNames && (
                      <div
                        className="font-medium truncate mb-1 text-black text-center"
                        title={card.name}
                      >
                        {card.name}
                      </div>
                    )}
                    <div
                      className={`text-center ${
                        showCardNames
                          ? "text-muted-foreground text-xs"
                          : "space-y-1"
                      }`}
                    >
                      <div
                        className={`font-semibold ${rarityColor} ${
                          !showCardNames ? "text-sm" : ""
                        }`}
                      >
                        {rarityName}
                      </div>
                      <div
                        className={`font-medium ${
                          !showCardNames ? "text-sm text-gray-700" : ""
                        }`}
                      >
                        {colorName}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Cube Statistics */}
      {cubeStats && (
        <div className="w-full mt-6">
          <details className="bg-card rounded-lg p-4">
            <summary className="cursor-pointer font-medium mb-2">
              Cube Statistics ({cubeStats.totalCards} total cards)
            </summary>

            <div className="space-y-6 text-sm">
              {/* Color-Rarity Breakdown */}
              <div>
                <h5 className="font-semibold mb-3 text-base">
                  Distribution by Color and Rarity:
                </h5>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-medium">Color</th>
                        <th className="text-center p-2 font-medium">Mythics</th>
                        <th className="text-center p-2 font-medium">Rares</th>
                        <th className="text-center p-2 font-medium">
                          Uncommons
                        </th>
                        <th className="text-center p-2 font-medium">Commons</th>
                        <th className="text-center p-2 font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(CARD_COLORS).map((color) => {
                        const colorName =
                          color === "white"
                            ? "White"
                            : color === "blue"
                            ? "Blue"
                            : color === "black"
                            ? "Black"
                            : color === "red"
                            ? "Red"
                            : color === "green"
                            ? "Green"
                            : color === "multicolor"
                            ? "Multicolor"
                            : color === "colorless"
                            ? "Colorless"
                            : color;

                        const mythics =
                          cubeStats.byColorAndRarity[
                            `${color}-${CARD_RARITY.MITHYC}`
                          ] || 0;
                        const rares =
                          cubeStats.byColorAndRarity[
                            `${color}-${CARD_RARITY.RARE}`
                          ] || 0;
                        const uncommons =
                          cubeStats.byColorAndRarity[
                            `${color}-${CARD_RARITY.UNCOMMON}`
                          ] || 0;
                        const commons =
                          cubeStats.byColorAndRarity[
                            `${color}-${CARD_RARITY.COMMON}`
                          ] || 0;
                        const total = mythics + rares + uncommons + commons;

                        if (total === 0) return null;

                        return (
                          <tr
                            key={color}
                            className="border-b hover:bg-muted/50"
                          >
                            <td className="p-2 font-medium">{colorName}</td>
                            <td className="text-center p-2">{mythics}</td>
                            <td className="text-center p-2">{rares}</td>
                            <td className="text-center p-2">{uncommons}</td>
                            <td className="text-center p-2">{commons}</td>
                            <td className="text-center p-2 font-medium">
                              {total}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default CubeDraft;
