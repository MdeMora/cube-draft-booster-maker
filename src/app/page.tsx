"use client";

import Dialog from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Booster,
  generateCustomBooster,
  saveBoosterToStorage,
  BoosterSettings,
  DEFAULT_BOOSTER_SETTINGS,
  saveCustomBoosterToStorage,
} from "@/lib/booster";
import { History, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import SettingsForm from "@/components/SettingsForm/SettingsForm";
import CubeDraft from "@/components/CubeDraft";
import CubeBooster from "@/components/CubeBooster";
import BoosterSettingsComponent from "@/components/BoosterSettings";
import CustomPastBoosters from "@/components/CustomPastBoosters";

export default function Home() {
  const [boosters, setBoosters] = useState<Booster[]>([]);
  const [currentBoosterIndex, setCurrentBoosterIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [boosterSettings, setBoosterSettings] = useState<BoosterSettings>(
    DEFAULT_BOOSTER_SETTINGS
  );
  const [showBoosterSettings, setShowBoosterSettings] = useState(false);
  const [showCardNames, setShowCardNames] = useState(false);
  const [showCustomHistory, setShowCustomHistory] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("boosterSettings");
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setBoosterSettings(parsedSettings);
      } catch (error) {
        console.error("Error loading booster settings:", error);
      }
    }
  }, []);

  const handleGenerateBooster = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const newBooster = generateCustomBooster(boosterSettings);

      // Add to end of boosters array and set as current
      setBoosters((prev) => [...prev, newBooster]);
      setCurrentBoosterIndex((prev) => boosters.length); // Will be the new last index

      // Save to both custom booster storage and legacy storage
      saveCustomBoosterToStorage(newBooster, boosterSettings);
      saveBoosterToStorage(newBooster);
    }, 1000);
  };

  const handleSettingsChange = (newSettings: BoosterSettings) => {
    setBoosterSettings(newSettings);
    // Save to localStorage
    localStorage.setItem("boosterSettings", JSON.stringify(newSettings));
  };

  // Navigation functions
  const navigateToPreviousBooster = () => {
    setCurrentBoosterIndex((prev) => Math.max(prev - 1, 0));
  };

  const navigateToNextBooster = () => {
    setCurrentBoosterIndex((prev) => Math.min(prev + 1, boosters.length - 1));
  };

  // Get current booster
  const currentBooster = boosters[currentBoosterIndex];

  return (
    <main className="dark flex min-h-screen flex-col items-center p-4 container relative">
      <p className="text-4xl text-center font-bold mt-4">
        Cube draft booster generator
      </p>

      <Tabs defaultValue="custom" className="w-full max-w-4xl mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="custom">Custom Booster</TabsTrigger>
          <TabsTrigger value="cube">Cube List Booster</TabsTrigger>
        </TabsList>

        <TabsContent
          value="custom"
          className="flex flex-col items-center w-full max-w-4xl mx-auto p-4"
        >
          {/* Booster Settings Section */}
          <div className="w-full mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4"></div>

            {showBoosterSettings && (
              <BoosterSettingsComponent
                settings={boosterSettings}
                onSettingsChange={handleSettingsChange}
                onClose={() => setShowBoosterSettings(false)}
              />
            )}
          </div>

          {/* Generation Section */}
          <div className="w-full bg-card rounded-lg mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h3 className="text-lg font-semibold mb-4 text-center sm:text-left">
                Generate Custom Booster
              </h3>

              <Button
                onClick={() => setShowBoosterSettings(!showBoosterSettings)}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
              >
                <Settings size={16} className="mr-2" />
                {showBoosterSettings ? "Hide Settings" : "Configure Booster"}
              </Button>
            </div>

            {/* Current Settings Summary */}
            <div className="bg-muted rounded-lg p-4 mb-4">
              <h4 className="font-medium mb-2">Current Settings</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                <div className="text-center">
                  <div className="text-orange-600 font-bold text-lg">
                    {boosterSettings.mythics}
                  </div>
                  <div>Mythics</div>
                </div>
                <div className="text-center">
                  <div className="text-amber-600 font-semibold text-lg">
                    {boosterSettings.rares}
                  </div>
                  <div>Rares</div>
                </div>
                <div className="text-center">
                  <div className="text-slate-600 font-medium text-lg">
                    {boosterSettings.uncommons}
                  </div>
                  <div>Uncommons</div>
                </div>
                <div className="text-center">
                  <div className="text-slate-500 text-lg">
                    {boosterSettings.commons}
                  </div>
                  <div>Commons</div>
                </div>
              </div>
              <div className="text-center mt-2 text-sm text-muted-foreground">
                Total:{" "}
                {boosterSettings.mythics +
                  boosterSettings.rares +
                  boosterSettings.uncommons +
                  boosterSettings.commons}{" "}
                cards
                {boosterSettings.colorBalance &&
                  ` • Color Balanced (max ${boosterSettings.maxPerColor} per color)`}
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center">
              <Button onClick={handleGenerateBooster} size="lg">
                {loading ? "Generating..." : "Generate Custom Booster"}
              </Button>
            </div>
          </div>

          {/* Generated Booster Display */}
          {currentBooster && (
            <div className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h3 className="text-lg font-semibold text-center sm:text-left">
                  Generated Boosters
                </h3>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between mb-4 bg-muted rounded-lg p-3">
                <Button
                  onClick={navigateToPreviousBooster}
                  disabled={currentBoosterIndex <= 0}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ChevronLeft size={16} />
                  <span className="hidden sm:inline">Previous</span>
                </Button>

                <div className="text-center">
                  <div className="text-sm font-medium">
                    Booster {currentBoosterIndex + 1} of {boosters.length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {boosters.length === 1
                      ? "Latest generated"
                      : currentBoosterIndex === boosters.length - 1
                      ? "Latest generated"
                      : `Generated ${boosters.length - currentBoosterIndex} ${
                          boosters.length - currentBoosterIndex === 1
                            ? "booster"
                            : "boosters"
                        } ago`}
                  </div>
                </div>

                <Button
                  onClick={navigateToNextBooster}
                  disabled={currentBoosterIndex >= boosters.length - 1}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={16} />
                </Button>
              </div>

              <CubeBooster
                booster={currentBooster}
                boosterNumber={currentBoosterIndex + 1}
                showCardNames={showCardNames}
                isCustomBooster={true}
              />
            </div>
          )}

          {/* Custom Booster History Section */}
          <div className="w-full mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h3 className="text-lg font-semibold text-center sm:text-left">
                Booster History
              </h3>
              <Button
                onClick={() => setShowCustomHistory(!showCustomHistory)}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
              >
                <History size={16} className="mr-2" />
                {showCustomHistory ? "Hide History" : "View History"}
              </Button>
            </div>

            {showCustomHistory && (
              <CustomPastBoosters onClose={() => setShowCustomHistory(false)} />
            )}
          </div>
        </TabsContent>

        <TabsContent value="cube" className="flex flex-col items-center">
          <CubeDraft />
        </TabsContent>
      </Tabs>

      <Dialog open={showSettings} onClose={() => setShowSettings(false)}>
        <SettingsForm />
      </Dialog>
    </main>
  );
}
