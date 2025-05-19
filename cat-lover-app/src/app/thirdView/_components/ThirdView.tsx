"use client";
import { useAuth } from "@clerk/nextjs";
import Error from "next/error";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FavoriteItemInMasonry, {
  FavoriteItemInMasonryProps,
} from "../../components/FavoriteItemInMasonry";
import LoadingButton from "../../components/LoadingButton";
import Masonry from "../../components/Masonry";
import Pagination from "../../components/Pagination";
import { useFavoritesContext } from "../../layout";
import {
  deleteFavorite,
  fetchFavorites,
} from "../../lib/services/favoriteServices";
import { showToast } from "../../utils/helperFunctions";
import FavoritesSignInMessage from "./FavoritesSignInMessage";

export default function ThirdView() {
  const [numberOfFavorites, setNumberOfFavorites] = useState<string | null>(
    null
  );
  const { paginationNumber3rdView, setPaginationNumber3rdView } =
    useFavoritesContext();
  const [data, setData] = useState<{ id: string; image: { url: string } }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { userId } = useAuth();
  const limit = 10;

  useEffect(() => {
    setIsLoading(true);
    if (isDeleting === false && userId) {
      const page =
        paginationNumber3rdView - 1 < 0 ? 0 : paginationNumber3rdView - 1;

      const load = async () => {
        try {
          const { data: newData, totalCount } = await fetchFavorites({
            userId,
            page,
            limit,
          });
          setNumberOfFavorites(totalCount);
          setData(newData);
          setIsLoading(false);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          setIsLoading(false);
          showToast("error", <p>{error?.message}</p>);
        }
      };
      load();
    }
  }, [
    userId,
    paginationNumber3rdView,
    isDeleting,
    setNumberOfFavorites,
    setPaginationNumber3rdView,
  ]);

  const handleDelete = async (id: string) => {
    if (!userId) return;
    const deletePromise = new Promise<void>(async (resolve, reject) => {
      setIsDeleting(true);
      setIsLoading(true);
      try {
        const response = await deleteFavorite(id, userId);

        console.log("Response Babe", response);

        if (!response.ok) {
          throw new Error({
            message: "Failed to delete favorite",
            statusCode: 500,
          });
        }
        resolve();
      } catch (error) {
        if (error instanceof Error) {
          reject("Error deleting favorite. Try again.");
        }
      } finally {
        setIsDeleting(false);
      }
    });

    toast.promise(deletePromise, {
      pending: "Deleting favorite...",
      success: "Favorite deleted! 🐱",
      error: "Failed to delete favorite!",
    });
  };

  if (!userId) {
    return <FavoritesSignInMessage />;
  }

  return (
    <div className="w-screen flex flex-col justify-center items center">
      <div className="flex justify-center items-center flex-col">
        {isLoading || isDeleting ? (
          <LoadingButton
            handleClick={() => {}}
            isLoading={isLoading || isDeleting}
          />
        ) : (
          <div>
            <div>
              <Pagination
                length={Number(numberOfFavorites)}
                limit={limit}
                handler={setPaginationNumber3rdView}
                paginationNumber={paginationNumber3rdView}
              />
            </div>
            <Masonry<
              FavoriteItemInMasonryProps["photoObject"],
              { handleDelete: (id: string) => void }
            >
              items={data}
              extraProps={{ handleDelete }}
              renderItem={(
                photoObject: FavoriteItemInMasonryProps["photoObject"],
                {
                  handleDelete,
                }: { handleDelete: (photoObjectId: string) => void }
              ) => (
                <FavoriteItemInMasonry
                  key={photoObject.id}
                  handleDelete={handleDelete}
                  photoObject={photoObject}
                />
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
