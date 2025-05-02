import { RandomImagesContextType } from "../layout";
import PhotoItemInMasonry from "./PhotoItemInMasonry";

type MasonryProps = {
  showingImgPagination: RandomImagesContextType["randomImages"];
  openModal: (id: string, url: string) => void;
};

export default function Masonry({
  showingImgPagination,
  openModal,
}: MasonryProps) {
  return (
    <div className="flex justify-center items center">
      <ol className="columns-2 md:columns-5 gap-4 p-4">
        {showingImgPagination.map(
          (photoObject: { id: string; url: string }) => {
            return (
              <PhotoItemInMasonry
                key={photoObject.id}
                handleClick={() => openModal(photoObject.id, photoObject.url)}
                photoObject={photoObject}
              />
            );
          }
        )}
      </ol>
    </div>
  );
}
