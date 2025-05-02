import Link from "next/link";
import CatImage from "./CatImage";

type ImageInFirstModalProps = {
  url: string | null;
};

export default function ImageInFirstModal({ url }: ImageInFirstModalProps) {
  return (
    <div className="flex justify-center items-center mt-[20px]">
      <Link href={"/secondView"} className="cursor-pointer">
        <CatImage width={280} height={0} url={url} />
      </Link>
    </div>
  );
}
