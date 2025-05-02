type AddFavoriteProps = {
  userId: string | null | undefined;
  markAsFavorite: () => void;
};

export default function AddFavorite({
  userId,
  markAsFavorite,
}: AddFavoriteProps) {
  return (
    <div className="flex justify-center items center">
      {userId ? (
        <button
          onClick={markAsFavorite}
          className="border px-4 py-2 text-black"
          disabled={!userId}
        >
          Add to Favorites
        </button>
      ) : (
        <div className="w-[280px] my-[20px] text-black">
          In order to favorite a cat you need to log in
        </div>
      )}
    </div>
  );
}
