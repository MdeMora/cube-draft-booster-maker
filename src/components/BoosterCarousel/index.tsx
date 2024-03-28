import { Booster } from "@/lib/booster";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import BoosterCard from "../BoosterCard";
import { useState } from "react";

const BoosterCarousel = ({ booster }: { booster: Booster }) => {
  console.log(booster);

  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="w-full max-w-96 mt-12">
      <p>Booster:</p>
      <Carousel>
        <CarouselContent>
          {booster.map((card, idx) => (
            <CarouselItem key={idx}>
              <BoosterCard card={card} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious onClick={() => setCurrentSlide((prev) => prev - 1)} />
        <CarouselNext onClick={() => setCurrentSlide((prev) => prev + 1)} />
      </Carousel>
      <div className="text-right">
        {currentSlide + 1}/{booster.length}
      </div>
    </div>
  );
};

export default BoosterCarousel;
