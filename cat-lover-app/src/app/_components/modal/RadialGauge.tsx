"use client";

import GaugeComponent from "react-gauge-component";

export default function Gauge({
  value,
  property,
}: {
  value: number;
  property: string;
}) {
  return (
    <div className="flex flex-col justify-center items-center w-[170px] bg-black rounded-md">
      <div className="flex flex-col justify-center items-center">
        <div className="w-[150px]">
          <GaugeComponent
            value={value}
            type="semicircle"
            arc={{
              colorArray: ["#FF2121", "#00FF15"],
              padding: 0.02,
              subArcs: [
                { limit: 40 },
                { limit: 60 },
                { limit: 70 },
                {},
                {},
                {},
                {},
              ],
            }}
            pointer={{ type: "blob", animationDelay: 0 }}
          />
        </div>
      </div>
      <div className="my-[10px] text-white">{property}</div>
    </div>
  );
}
