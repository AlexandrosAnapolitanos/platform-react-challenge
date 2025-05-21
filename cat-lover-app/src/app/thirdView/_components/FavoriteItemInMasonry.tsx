import { TiDeleteOutline } from "react-icons/ti";
import CatImage from "../../../components/CatImage";

export type FavoriteItemInMasonryProps = {
  photoObject: {
    id: string;
    image: {
      url: string;
    };
  };
  handleDelete: (photoObjectId: string) => void;
};

export default function FavoriteItemInMasonry({
  handleDelete,
  photoObject,
}: FavoriteItemInMasonryProps) {
  return (
    <li className="relative mb-[20px] w-full h-auto rounded-lg">
      <CatImage width={180} height={0} url={photoObject.image.url} />
      <button
        className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-100"
        onClick={() => handleDelete(photoObject.id)}
      >
        <TiDeleteOutline className="text-red-500 text-xl" />
      </button>
    </li>
  );
}
