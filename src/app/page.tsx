"use client";

import BoosterCarousel from "@/components/BoosterCarousel";
import Dialog from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Booster, generateBooster, saveBoosterToStorage } from "@/lib/booster";
import { SeparatorHorizontal, Settings } from "lucide-react";
import { useState } from "react";
import SettingsForm from "@/components/SettingsForm/SettingsForm";
import PastBooster from "@/components/PastBooster";
import CubeDraft from "@/components/CubeDraft";

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
      
      <Tabs defaultValue="custom" className="w-full max-w-4xl mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="custom">Custom Booster</TabsTrigger>
          <TabsTrigger value="cube">Cube List Booster</TabsTrigger>
        </TabsList>
        
        <TabsContent value="custom" className="flex flex-col items-center">
          <div className="flex items-center gap-2 mt-4">
            <Button onClick={handleClick}>
              {loading ? "Loading ..." : "Generate Booster +"}
            </Button>
          </div>

          {booster && <BoosterCarousel booster={booster} />}
          <PastBooster booster={booster} />
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
