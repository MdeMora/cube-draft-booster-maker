"use client";

import BoosterCarousel from "@/components/BoosterCarousel";
import Dialog from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Booster, generateBooster, saveBoosterToStorage } from "@/lib/booster";
import { SeparatorHorizontal, Settings } from "lucide-react";
import { useState } from "react";
import SettingsForm from "@/components/SettingsForm/SettingsForm";
import PastBooster from "@/components/PastBooster";

export default function Home() {
  const [booster, setBooster] = useState<Booster | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const handleClick = () => {
    setBooster(undefined);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const newBooster = generateBooster();
      setBooster(newBooster);
      saveBoosterToStorage(newBooster);
    }, 1000);
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  return (
    <main className="dark flex min-h-screen flex-col items-center p-4 container relative">
      <p className="text-4xl text-center font-bold mt-4">
        Cube draft booster generator
      </p>
      <div className="flex items-center gap-2 mt-4">
        <Button onClick={handleClick}>
          {loading ? "Loading ..." : "Generate Booster +"}
        </Button>
        {/* <Button>
          <Settings onClick={handleSettingsClick} />
        </Button> */}
      </div>

      {booster && <BoosterCarousel booster={booster} />}
      <PastBooster booster={booster} />
      <Dialog open={showSettings} onClose={() => setShowSettings(false)}>
        <SettingsForm />
      </Dialog>
    </main>
  );
}
