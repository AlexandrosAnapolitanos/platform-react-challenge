"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  RandomImagesContextType,
  RandomImageType,
  useRandomImagesContext,
} from "./../layout";
import { showToast } from "./../utils/helperFunctions";
import FirstViewModal from "./FirstViewModal";
import LoadingButton from "./LoadingButton";
import Masonry from "./Masonry";
import Pagination from "./Pagination";
import PhotoItemInMasonry from "./PhotoItemInMasonry";

export interface breedDataType {
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
        showToast("success", <p>Your Favorite has been added!</p>);
      })
      .catch((error) => {
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
        <LoadingButton handleClick={dataFetch} isLoading={isLoading} />

        <Pagination
          length={randomImages.length}
          limit={limit}
          handler={setPaginationNumber}
          paginationNumber={paginationNumber}
        />
      </div>

      <Masonry<
        RandomImageType,
        { openModal: (id: string, url: string) => void }
      >
        items={showingImgPagination}
        extraProps={{ openModal }}
        renderItem={(photo, { openModal }) => (
          <PhotoItemInMasonry
            key={photo.id}
            photoObject={photo}
            handleClick={() => openModal(photo.id, photo.url)}
          />
        )}
      />
      <FirstViewModal
        closeModal={closeModal}
        isModalOpen={isModalOpen}
        url={searchParams.get("url")}
        breedData={breedData}
        randomImages={randomImages}
        searchParamsId={searchParamsId}
        markAsFavorite={markAsFavorite}
        userId={userId}
      />
    </div>
  );
}
