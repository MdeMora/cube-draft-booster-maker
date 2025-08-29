"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useEffect, useRef } from "react";

interface NumberStepperProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

const NumberStepper = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  label,
  className = "",
  disabled = false,
}: NumberStepperProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDecrease = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  };

  const handleIncrease = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      handleIncrease();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      handleDecrease();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === "") return;

    const newValue = parseInt(inputValue);
    if (!isNaN(newValue)) {
      const clampedValue = Math.max(min, Math.min(max, newValue));
      onChange(clampedValue);
    }
  };

  const handleInputBlur = () => {
    // Ensure value is within bounds when input loses focus
    const clampedValue = Math.max(min, Math.min(max, value));
    if (clampedValue !== value) {
      onChange(clampedValue);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium flex items-center justify-between">
          {label}
        </label>
      )}

      <div className="flex items-center border rounded-md bg-background overflow-hidden">
        <Button
          onClick={handleDecrease}
          disabled={disabled || value <= min}
          variant="ghost"
          size="sm"
          className="h-10 w-10 rounded-none border-0 hover:bg-muted"
          type="button"
        >
          <Minus size={16} />
        </Button>

        <input
          ref={inputRef}
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          disabled
          className="flex-1 h-10 px-3 text-center border-0 bg-transparent focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          inputMode="numeric"
        />

        <Button
          onClick={handleIncrease}
          disabled={disabled || value >= max}
          variant="ghost"
          size="sm"
          className="h-10 w-10 rounded-none border-0 hover:bg-muted"
          type="button"
        >
          <Plus size={16} />
        </Button>
      </div>
    </div>
  );
};

export default NumberStepper;
