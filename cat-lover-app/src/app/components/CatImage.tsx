import Image from "next/image";

type CatImageProps = {
  width: number;
  height: number;
  url: string | null;
};

export default function CatImage({ width, height, url }: CatImageProps) {
  return (
    <Image
      src={url || "https://cdn2.thecatapi.com/images/385.jpg"}
      alt="picture of a cute cat"
      width={width}
      height={height} // Set height to auto
      style={{ height: "auto" }}
      priority
    />
  );
}
