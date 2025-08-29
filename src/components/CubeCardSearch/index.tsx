"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { searchCards, CubeCard } from "@/lib/cubeService";
import { Search, X } from "lucide-react";

interface CubeCardSearchProps {
  onClose?: () => void;
}

const getColorName = (color: string): string => {
  switch (color) {
    case "white": return "White";
    case "blue": return "Blue";
    case "black": return "Black";
    case "red": return "Red";
    case "green": return "Green";
    case "multicolor": return "Multicolor";
    case "colorless": return "Colorless";
    default: return color;
  }
};

const getRarityName = (rarity: string): string => {
  switch (rarity) {
    case "mithyc": return "Mythic";
    case "rare": return "Rare";
    case "uncommon": return "Uncommon";
    case "common": return "Common";
    default: return rarity;
  }
};

const getColorBackground = (color: string): string => {
  switch (color) {
    case "white":
      return "bg-amber-50 border-amber-200 text-amber-900";
    case "blue":
      return "bg-blue-50 border-blue-200 text-blue-900";
    case "black":
      return "bg-gray-700 border-gray-600 text-white";
    case "red":
      return "bg-red-50 border-red-200 text-red-900";
    case "green":
      return "bg-green-50 border-green-200 text-green-900";
    case "multicolor":
      return "bg-gradient-to-r from-yellow-200 via-blue-200 via-gray-500 via-red-200 to-green-200 border-purple-300 text-gray-900";
    default:
      return "bg-slate-50 border-slate-200 text-slate-800";
  }
};

const getRarityColor = (rarity: string, cardColor: string): string => {
  const isBlack = cardColor === "black";
  
  switch (rarity) {
    case "mithyc":
      return isBlack ? "text-orange-300 font-bold" : "text-orange-700 font-bold";
    case "rare":
      return isBlack ? "text-yellow-300 font-semibold" : "text-amber-700 font-semibold";
    case "uncommon":
      return isBlack ? "text-slate-300 font-medium" : "text-slate-700 font-medium";
    default:
      return isBlack ? "text-slate-400" : "text-slate-600";
  }
};

const CubeCardSearch = ({ onClose }: CubeCardSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CubeCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CubeCard | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim()) {
        setLoading(true);
        try {
          const searchResults = await searchCards(query);
          setResults(searchResults.slice(0, 20)); // Limit to 20 results
        } catch (error) {
          console.error("Search error:", error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleCardSelect = (card: CubeCard) => {
    setSelectedCard(card);
  };

  const handleClearSearch = () => {
    setQuery("");
    setResults([]);
    setSelectedCard(null);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full bg-card rounded-lg p-4 sm:p-6 border">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold text-center sm:text-left">Card Search</h3>
        {onClose && (
          <Button onClick={onClose} variant="ghost" size="sm" className="w-full sm:w-auto">
            <X size={16} className="mr-2 sm:mr-0" />
            <span className="sm:hidden">Close Search</span>
          </Button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for cards (e.g., Savannah, Lightning Bolt, Planeswalker...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {query && (
          <Button
            onClick={handleClearSearch}
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X size={14} />
          </Button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4 text-muted-foreground">
          Searching...
        </div>
      )}

      {/* Search Results */}
      {!loading && results.length > 0 && (
        <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
          <h4 className="text-sm font-medium text-muted-foreground">
            Found {results.length} card{results.length !== 1 ? 's' : ''}:
          </h4>
          {results.map((card, idx) => (
            <div
              key={idx}
              onClick={() => handleCardSelect(card)}
              className={`p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${getColorBackground(card.color)}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium">{card.name}</div>
                  <div className="text-sm opacity-80">
                    {card.type} • {card.set}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm ${getRarityColor(card.rarity, card.color)}`}>
                    {getRarityName(card.rarity)}
                  </div>
                  <div className="text-xs opacity-80">
                    {getColorName(card.color)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && query.trim() && results.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Search size={32} className="mx-auto mb-2 opacity-50" />
          <p>No cards found for "{query}"</p>
          <p className="text-sm">Try searching for a different term</p>
        </div>
      )}

      {/* Selected Card Details */}
      {selectedCard && (
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Card Details</h4>
          <div className={`p-3 sm:p-4 rounded-lg border-2 ${getColorBackground(selectedCard.color)}`}>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <h5 className="text-lg font-bold text-center sm:text-left">{selectedCard.name}</h5>
                <div className="text-center sm:text-right">
                  <div className={`text-sm ${getRarityColor(selectedCard.rarity, selectedCard.color)}`}>
                    {getRarityName(selectedCard.rarity)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm">
                <div className="text-center sm:text-left">
                  <span className="font-medium">Type:</span> {selectedCard.type}
                </div>
                <div className="text-center sm:text-left">
                  <span className="font-medium">Color:</span> {getColorName(selectedCard.color)}
                </div>
                <div className="text-center sm:text-left">
                  <span className="font-medium">CMC:</span> {selectedCard.cmc}
                </div>
                <div className="text-center sm:text-left">
                  <span className="font-medium">Set:</span> {selectedCard.set}
                </div>
              </div>
              
              {selectedCard.collectorNumber && (
                <div className="text-sm">
                  <span className="font-medium">Collector Number:</span> {selectedCard.collectorNumber}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      {!query.trim() && (
        <div className="text-center py-8 text-muted-foreground">
          <Search size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">Search for any card in the cube</p>
          <p className="text-xs mt-1">Try searching for card names, types, or sets</p>
        </div>
      )}
    </div>
  );
};

export default CubeCardSearch;