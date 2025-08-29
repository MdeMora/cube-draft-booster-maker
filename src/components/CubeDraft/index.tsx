"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  generateAllBoosters,
  getCubeStatistics,
  CubeBooster as CubeBoosterType,
  resetDraftSession,
} from "@/lib/cubeService";
import CubeBooster from "@/components/CubeBooster";
import CubeStats from "@/components/CubeStats";
import CubeCardSearch from "@/components/CubeCardSearch";

interface CubeDraftProps {
  onBoostersGenerated?: (boosters: CubeBoosterType[]) => void;
}

const CubeDraft = ({ onBoostersGenerated }: CubeDraftProps) => {
  const [players, setPlayers] = useState(2);
  const [boostersPerPlayer, setBoostersPerPlayer] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedBoosters, setGeneratedBoosters] = useState<CubeBoosterType[]>(
    []
  );
  const [currentBoosterIndex, setCurrentBoosterIndex] = useState(0);
  const [cubeStats, setCubeStats] = useState<any>(null);
  const [showCardNames, setShowCardNames] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

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
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4">
      {/* Card Search Section */}
      <div className="w-full mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h3 className="text-lg font-semibold text-center sm:text-left">Cube Card Search</h3>
          <Button
            onClick={() => setShowSearch(!showSearch)}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
          >
            {showSearch ? "Hide Search" : "Search Cards"}
          </Button>
        </div>
        
        {showSearch && (
          <CubeCardSearch onClose={() => setShowSearch(false)} />
        )}
      </div>

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
          {/* Header - Mobile: Stack vertically, Desktop: Side by side */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h3 className="text-lg font-semibold text-center sm:text-left">
              Generated Boosters ({generatedBoosters.length})
            </h3>
            
            {/* Controls Container */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Toggle Names Button - Full width on mobile */}
              <Button
                onClick={() => setShowCardNames(!showCardNames)}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
              >
                {showCardNames ? "Hide Names" : "Show Names"}
              </Button>
              
              {/* Navigation Controls */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                <Button
                  onClick={() =>
                    setCurrentBoosterIndex(Math.max(0, currentBoosterIndex - 1))
                  }
                  disabled={currentBoosterIndex === 0}
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-initial"
                >
                  Previous
                </Button>
                
                <span className="text-sm text-muted-foreground whitespace-nowrap px-2">
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
                  className="flex-1 sm:flex-initial"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>

          {/* Current Booster Display */}
          {generatedBoosters[currentBoosterIndex] && (
            <CubeBooster
              booster={generatedBoosters[currentBoosterIndex]}
              boosterNumber={currentBoosterIndex + 1}
              showCardNames={showCardNames}
            />
          )}
        </div>
      )}

      {/* Cube Statistics */}
      {cubeStats && <CubeStats cubeStats={cubeStats} />}
    </div>
  );
};

export default CubeDraft;
