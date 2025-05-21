"use client";

import { fetchBreedData } from "@/lib/services/breedData";
import { addFavorite } from "@/lib/services/favoriteServices";
import { fetchSomeRandomCats } from "@/lib/services/someRandomCatsService";
import { useAuth } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import LoadingButton from "../components/LoadingButton";
import Masonry from "../components/Masonry";
import Pagination from "../components/Pagination";
import { showToast } from "../utils/helperFunctions";
import PhotoItemInMasonry from "./_components/mainView/PhotoItemInMasonry";
import FirstViewModal from "./_components/modal/FirstViewModal";
import {
  RandomImagesContextType,
  RandomImageType,
  useRandomImagesContext,
} from "./layout";

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

  const dataFetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: newData } = await fetchSomeRandomCats({ limit });
      setIsLoading(false);
      setRandomImages((prevData: RandomImagesContextType["randomImages"]) => [
        ...prevData,
        ...newData,
      ]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setIsLoading(false);
      showToast("error", <p>{error.message}</p>);
    }
  }, [setRandomImages, limit]);

  const markAsFavorite = useCallback(async () => {
    if (!!userId) {
      const photoId = searchParamsId || "placeholder";
      try {
        await addFavorite(photoId, userId);
        showToast("success", <p>Your Favorite has been added!</p>);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        showToast("error", <p>{error.message}</p>);
      }
    }
  }, [searchParamsId, userId]);

  useEffect(() => {
    if (randomImages.length === 0) {
      dataFetch();
    }
  }, [dataFetch, randomImages]);

  useEffect(() => {
    const loadBreedData = async () => {
      try {
        setBreedData(null);
        const { data: newData } = await fetchBreedData(
          searchParamsId as string
        );
        setBreedData(newData);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        showToast("error", <p>{error.message}</p>);
      }
    };

    if (isModalOpen && searchParamsId) {
      loadBreedData();
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
