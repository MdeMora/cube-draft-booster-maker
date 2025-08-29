import { CARD_COLORS, CARD_RARITY } from "@/lib/booster";

const CubeStats = ({ cubeStats }: { cubeStats: any }) => {
  return (
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
                    <th className="text-center p-2 font-medium">Uncommons</th>
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
                      <tr key={color} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{colorName}</td>
                        <td className="text-center p-2">{mythics}</td>
                        <td className="text-center p-2">{rares}</td>
                        <td className="text-center p-2">{uncommons}</td>
                        <td className="text-center p-2">{commons}</td>
                        <td className="text-center p-2 font-medium">{total}</td>
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
  );
};

export default CubeStats;
