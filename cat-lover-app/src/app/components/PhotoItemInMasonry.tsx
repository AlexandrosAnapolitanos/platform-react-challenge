import CatImage from "./CatImage";

type PhotoItemInMasonryProps = {
  photoObject: { id: string; url: string };
  handleClick: () => void;
};

export default function PhotoItemInMasonry({
  handleClick,
  photoObject,
}: PhotoItemInMasonryProps) {
  return (
    <li
      key={photoObject.id}
      className="mb-[20px] w-full h-auto rounded-lg"
      onClick={handleClick}
    >
      <CatImage width={180} height={0} url={photoObject.url} />
    </li>
  );
}
