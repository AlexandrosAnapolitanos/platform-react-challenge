import ReactModal from "react-modal";
import { RandomImageType } from "../../app/layout";
import AddFavorite from "./AddFavorite";
import BlockquoteDescription from "./BlockquoteDescription";
import { breedDataType } from "./FirstView";
import ImageInFirstModal from "./ImageInFirstModal";
import TitleBreed from "./TitleBreed";
import TwoPairsOfGauges from "./TwoPairsOfGauges";

type FirstViewModalProps = {
  randomImages: RandomImageType[];
  searchParamsId: string | null;
  breedData: breedDataType | null | undefined;
  url: string | null;
  isModalOpen: boolean;
  closeModal: () => void;
  markAsFavorite: () => void;
  userId: string | null | undefined;
};

export default function FirstViewModal({
  url,
  isModalOpen,
  closeModal,
  breedData,
  randomImages,
  searchParamsId,
  markAsFavorite,
  userId,
}: FirstViewModalProps) {
  return (
    <ReactModal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="FirstView Modal"
      className="bg-white p-6 rounded-md"
      overlayClassName="fixed inset-0 bg-black flex justify-center items-center"
      ariaHideApp={false}
    >
      <div className="h-[550px] w-[450px] overflow-y-auto">
        <ImageInFirstModal url={url} />
        <TitleBreed breedData={breedData} />
        <TwoPairsOfGauges breedData={breedData} />
        <BlockquoteDescription
          randomImages={randomImages}
          searchParamsId={searchParamsId}
          breedData={breedData}
        />
        <AddFavorite userId={userId} markAsFavorite={markAsFavorite} />
      </div>
    </ReactModal>
  );
}
