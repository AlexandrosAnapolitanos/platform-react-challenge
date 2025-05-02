import { breedDataType } from "./FirstView";

type TitleBreedProps = {
  breedData: breedDataType | null | undefined;
};

export default function TitleBreed({ breedData }: TitleBreedProps) {
  return (
    <div className="flex justify-center items-center mt-[20px] h-20">
      <h1 className="text-2xl text-black font-bold">
        {breedData?.breeds[0]?.name}
      </h1>
    </div>
  );
}
