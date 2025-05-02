import { scaleToPercentage } from "../utils/helperFunctions";
import { breedDataType } from "./FirstView";
import Gauge from "./RadialGauge";

type TwoPairsOfGaugesProps = {
  breedData: breedDataType | null | undefined;
};

export default function TwoPairsOfGauges({ breedData }: TwoPairsOfGaugesProps) {
  return (
    <div className="flex justify-center items-center my-[30px]">
      <div className="grid grid-cols-2 gap-4">
        <Gauge
          value={scaleToPercentage(breedData?.breeds[0]?.child_friendly)}
          property={"Child Friendly"}
        />
        <Gauge
          value={scaleToPercentage(breedData?.breeds[0]?.adaptability)}
          property={"Adaptability"}
        />
        <Gauge
          value={scaleToPercentage(breedData?.breeds[0]?.affection_level)}
          property={"Affection Level"}
        />
        <Gauge
          value={scaleToPercentage(breedData?.breeds[0]?.hypoallergenic)}
          property={"Hypoallergenic"}
        />
      </div>
    </div>
  );
}
