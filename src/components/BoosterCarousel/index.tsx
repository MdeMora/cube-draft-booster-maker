import { Booster } from "@/lib/booster";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import BoosterCard from "../BoosterCard";

const BoosterCarousel = ({ booster }: { booster: Booster }) => {
  console.log(booster);

  return (
    <div className="w-full max-w-96 mt-12">
      <Carousel>
        <CarouselContent>
          {booster.map((card, idx) => (
            <CarouselItem key={idx}>
              <BoosterCard card={card} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default BoosterCarousel;
