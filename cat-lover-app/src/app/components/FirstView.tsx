"use client";

import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ReactModal from "react-modal";
import BeatLoader from "react-spinners/ClipLoader";
import {
  RandomImagesContextType,
  RandomImageType,
  useRandomImagesContext,
} from "./../layout";
import { scaleToPercentage, showToast } from "./../utils/helperFunctions";
import Pagination from "./Pagination";
import Gauge from "./RadialGauge";

interface breedDataType {
  breeds: [
    {
      name: string;
      description: string;
      child_friendly: number | undefined;
      adaptability: number | undefined;
      hypoallergenic: number | undefined;
      affection_level: number | undefined;
    },
  ];
}

export default function FirstView() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingFav, setIsLoadingFav] = useState<boolean>(false);
  const limit: number = 10;
  const [breedData, setBreedData] = useState<breedDataType | null>();
  const {
    randomImages,
    setRandomImages,
    paginationNumber,
    setPaginationNumber,
  } = useRandomImagesContext();
  const [showingImgPagination, setShowingImgPagination] = useState<
    RandomImagesContextType["randomImages"]
  >([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userId } = useAuth();

  // Check if "modal" exists in URL
  const isModalOpen = searchParams.get("modal") === "true";
  const searchParamsId = searchParams.get("id");

  const openModal = useCallback(
    (id: string, url: string) => {
      router.push(`?modal=true&id=${id}&url=${url}`, { scroll: false });
    },
    [router]
  );

  const closeModal = useCallback(
    () => router.push("/", { scroll: false }),
    [router]
  );

  useEffect(() => {
    const totalImages = structuredClone(randomImages);
    const newState = totalImages.slice(
      (paginationNumber - 1) * limit,
      paginationNumber * limit
    );

    setShowingImgPagination(newState);
  }, [randomImages, limit, paginationNumber]);

  const dataFetch = useCallback(() => {
    setIsLoading(true);
    fetch(
      `https://api.thecatapi.com/v1/images/search?limit=${limit}&has_breeds=1`,
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
        return response.json();
      })
      .then((newData) => {
        setIsLoading(false);
        setRandomImages((prevData: RandomImagesContextType["randomImages"]) => [
          ...prevData,
          ...newData,
        ]); // handle the data from the API
      })
      .catch((error) => {
        setIsLoading(false);
        showToast("error", <p>{error.message}</p>);
      });
  }, [setRandomImages, limit]);

  const markAsFavorite = useCallback(() => {
    setIsLoadingFav(true);
    const photoId = searchParamsId;
    const rawBody = JSON.stringify({
      image_id: photoId,
      sub_id: userId,
    });
    fetch("https://api.thecatapi.com/v1/favourites", {
      method: "POST",
      headers: {
        // TODO: Security Consideration
        // Remember that including API keys in client-side code can expose them to users.
        // If possible, use a server-side proxy or other methods to protect sensitive keys,
        // especially in production environments.
        "x-api-key":
          "live_ahcwnjbZ7jyDagCWID8poLdWYBxjuUmUmuKqJnMFt9xhNBQwpUpECWKopSwlhLOY",
        "Content-Type": "application/json",
      },
      body: rawBody,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(() => {
        setIsLoadingFav(false);
        showToast("success", <p>Your Favorite has been added!</p>);
      })
      .catch((error) => {
        setIsLoadingFav(false);
        showToast("error", <p>{error.message}</p>);
      });
  }, [searchParamsId, userId]);

  useEffect(() => {
    if (randomImages.length === 0) {
      dataFetch();
    }
  }, [dataFetch, randomImages]);

  useEffect(() => {
    setBreedData(null);

    if (isModalOpen && searchParamsId) {
      fetch(`https://api.thecatapi.com/v1/images/${searchParamsId}`, {
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
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((newData) => {
          setBreedData(newData); // handle the data from the API
        })
        .catch((error) => {
          showToast("error", <p>{error.message}</p>);
        });
    }
  }, [searchParamsId, isModalOpen]);

  return (
    <div className="w-screen flex flex-col justify-center items center">
      <div className="flex justify-center items-center flex-col">
        <div>
          <button
            onClick={dataFetch}
            className={`w-[180px] h-[80px] my-[40px] px-6 py-3 border-2 border-white text-white ${isLoading ? "bg-white" : "bg-transparent"} rounded-2xl transition-all duration-300 hover:border-orange-500`}
          >
            {isLoading ? <BeatLoader /> : "Load more"}
          </button>
        </div>
        <div>
          <Pagination
            length={randomImages.length}
            limit={limit}
            handler={setPaginationNumber}
            paginationNumber={paginationNumber}
          />
        </div>
      </div>

      <div className="flex justify-center items center">
        <ol className="columns-2 md:columns-5 gap-4 p-4">
          {showingImgPagination.map(
            (photoObject: { id: string; url: string }) => {
              return (
                <li key={photoObject.id}>
                  <Image
                    src={photoObject.url}
                    alt="picture of a cute cat"
                    width={180}
                    height={0} // Set height to auto
                    style={{ height: "auto" }}
                    className="mb-[20px] w-full h-auto rounded-lg"
                    priority
                    onClick={() => openModal(photoObject.id, photoObject.url)}
                  />
                </li>
              );
            }
          )}
        </ol>
      </div>

      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="FirstView Modal"
        className="bg-white p-6 rounded-md"
        overlayClassName="fixed inset-0 bg-black flex justify-center items-center"
        ariaHideApp={false}
      >
        <div className="h-[550px] w-[450px] overflow-y-auto">
          <div className="flex justify-center items-center">
            <Link href={"/secondView"} className="cursor-pointer">
              <Image
                className="mt-[20px]"
                src={
                  searchParams.get("url") ||
                  "https://cdn2.thecatapi.com/images/385.jpg"
                }
                alt="picture of a cute cat"
                width={280}
                height={0} // Set height to auto
                style={{ height: "auto" }}
                priority
              />
            </Link>
          </div>

          <div className="flex justify-center items-center mt-[20px] h-20">
            <h1 className="text-2xl text-black font-bold">
              {breedData?.breeds[0]?.name}
            </h1>
          </div>

          <div className="flex justify-center items-center my-[30px]">
            <div className="grid grid-cols-2 gap-4">
              <Gauge
                value={scaleToPercentage(breedData?.breeds[0]?.child_friendly)}
                property={"Child Friendly"}
              />
              <Gauge
                value={scaleToPercentage(breedData?.breeds[0]?.adaptability)}
                property={"Adaptability"}
              />
              <Gauge
                value={scaleToPercentage(breedData?.breeds[0]?.affection_level)}
                property={"Affection Level"}
              />
              <Gauge
                value={scaleToPercentage(breedData?.breeds[0]?.hypoallergenic)}
                property={"Hypoallergenic"}
              />
            </div>
          </div>

          <div className="relative p-6 bg-gray-100 rounded-lg max-w-lg mx-auto w-[280px] my-[20px]">
            <p className="text-8xl text-black absolute top-0 left-2">“</p>
            <blockquote className="text-lg text-black px-8 flex justify-center items-center">
              <div className="text-center">
                {randomImages.find(
                  (cat: RandomImageType) => cat.id === searchParamsId
                )?.breeds[0]?.description || breedData?.breeds[0]?.description}
              </div>
            </blockquote>
            <p className="text-8xl text-black absolute bottom-[-55px] right-2">
              ”
            </p>
          </div>

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

          {isLoadingFav ? (
            <div className="text-orange-500">Request have been sent...</div>
          ) : null}
        </div>
      </ReactModal>
    </div>
  );
}
