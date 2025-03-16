"use client";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TiDeleteOutline } from "react-icons/ti";
import BeatLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFavoritesContext } from "./../layout";
import { showToast } from "./../utils/helperFunctions";
import Pagination from "./Pagination";

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
    if (isDeleting === false) {
      const pageNumber =
        paginationNumber3rdView - 1 < 0 ? 0 : paginationNumber3rdView - 1;

      fetch(
        `https://api.thecatapi.com/v1/favourites?limit=${limit}&sub_id=${userId}&order=ASC&page=${pageNumber}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // TODO: Security Consideration
            // Remember that including API keys in client-side code can expose them to users.
            // If possible, use a server-side proxy or other methods to protect sensitive keys,
            // especially in production environments.
            "x-api-key":
              "live_ahcwnjbZ7jyDagCWID8poLdWYBxjuUmUmuKqJnMFt9xhNBQwpUpECWKopSwlhLOY",
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const totalCount = response.headers.get("Pagination-Count"); // Total items
          const totalCountString = totalCount ? totalCount : "0";

          setNumberOfFavorites(totalCountString);

          return response.json();
        })
        .then((newData) => {
          setIsLoading(false);
          setData(newData); // handle the data from the API
        })
        .catch((error) => {
          setIsLoading(false);
          showToast("error", <p>{error.message}</p>);
        });
    }
  }, [
    userId,
    paginationNumber3rdView,
    isDeleting,
    setNumberOfFavorites,
    setPaginationNumber3rdView,
  ]);

  const handleDelete = async (id: string) => {
    const deletePromise = new Promise<void>(async (resolve, reject) => {
      setIsDeleting(true);
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.thecatapi.com/v1/favourites/${id}?&sub_id=${userId}`,
          {
            method: "DELETE",
            // TODO: Security Consideration
            // Remember that including API keys in client-side code can expose them to users.
            // If possible, use a server-side proxy or other methods to protect sensitive keys,
            // especially in production environments.
            headers: {
              "x-api-key":
                "live_ahcwnjbZ7jyDagCWID8poLdWYBxjuUmUmuKqJnMFt9xhNBQwpUpECWKopSwlhLOY",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete favorite");
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
    return (
      <div className="w-screen flex flex-col justify-center items center">
        <div className="flex justify-center items-center flex-col">
          <div>
            In order to see and handle your Favorites, you need to log in.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen flex flex-col justify-center items center">
      <div className="flex justify-center items-center flex-col">
        {isLoading || isDeleting ? (
          <button className="w-[180px] h-[80px] my-[40px] px-6 py-3 border-2 border-white text-white bg-white rounded-2xl transition-all duration-300 hover:border-orange-500">
            <BeatLoader />
          </button>
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
            <div className="flex justify-center items center">
              <ol className="columns-2 md:columns-5 gap-4 p-4">
                {data.map((photoObject) => {
                  return (
                    <li key={photoObject.id} className="relative">
                      <Image
                        src={photoObject.image.url}
                        alt="picture of a cute favorite cat"
                        width={180}
                        height={0} // Set height to auto
                        style={{ height: "auto" }}
                        className="mb-[20px] w-full h-auto rounded-lg"
                        priority
                      />
                      <button
                        className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-100"
                        onClick={() => handleDelete(photoObject.id)}
                      >
                        <TiDeleteOutline className="text-red-500 text-xl" />
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
