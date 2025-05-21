import { RandomImageType } from "../../layout";
import { breedDataType } from "../../page";

type BlockquoteDescriptionProps = {
  randomImages: RandomImageType[];
  searchParamsId: string | null;
  breedData: breedDataType | null | undefined;
};

export default function BlockquoteDescription({
  randomImages,
  searchParamsId,
  breedData,
}: BlockquoteDescriptionProps) {
  return (
    <div className="relative p-6 bg-gray-100 rounded-lg max-w-lg mx-auto w-[280px] my-[20px]">
      <p className="text-8xl text-black absolute top-0 left-2">“</p>
      <blockquote className="text-lg text-black px-8 flex justify-center items-center">
        <div className="text-center">
          {randomImages.find(
            (cat: RandomImageType) => cat.id === searchParamsId
          )?.breeds[0]?.description || breedData?.breeds[0]?.description}
        </div>
      </blockquote>
      <p className="text-8xl text-black absolute bottom-[-55px] right-2">”</p>
    </div>
  );
}
