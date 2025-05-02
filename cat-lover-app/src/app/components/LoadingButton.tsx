import BeatLoader from "react-spinners/ClipLoader";

type LoadingButtonProps = {
  isLoading: boolean;
  handleClick: () => void;
};

export default function LoadingButton({
  handleClick,
  isLoading,
}: LoadingButtonProps) {
  return (
    <button
      onClick={handleClick}
      className={`w-[180px] h-[80px] my-[40px] px-6 py-3 border-2 border-white text-white ${isLoading ? "bg-white" : "bg-transparent"} rounded-2xl transition-all duration-300 hover:border-orange-500`}
    >
      {isLoading ? <BeatLoader /> : "Load more"}
    </button>
  );
}
