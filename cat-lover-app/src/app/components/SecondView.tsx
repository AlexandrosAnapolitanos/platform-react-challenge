"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ReactModal from "react-modal";
import BeatLoader from "react-spinners/ClipLoader";
import { useBreedNamesContext } from "./../layout";
import { showToast } from "./../utils/helperFunctions";

export default function SecondView() {
  const { breedNames, setBreedNames } = useBreedNamesContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingBreedList, setIsLoadingBreedList] = useState<boolean>(false);
  const [breedList, setBreedList] = useState<{ id: string; url: string }[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if "modal" exists in URL
  const isModalOpen2 = searchParams.get("modal2") === "true";
  const breedId = searchParams.get("breedId");

  useEffect(() => {
    if (!breedNames.length) {
      setIsLoading(true);
      fetch("https://api.thecatapi.com/v1/breeds", {
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
          setIsLoading(false);
          setBreedNames(newData); // handle the data from the API
        })
        .catch((error) => {
          setIsLoading(false);
          showToast("error", <p>{error.message}</p>);
        });
    }
  }, [setBreedNames, breedNames]);

  const openModal2 = useCallback(
    (breedId: string) => {
      router.push(`?modal2=true&breedId=${breedId}`, { scroll: false });
    },
    [router]
  );

  const openModal1 = useCallback(
    (id: string, url: string) => {
      router.push(`/?modal=true&id=${id}&url=${url}`, { scroll: false });
    },
    [router]
  );

  const closeModal = useCallback(
    () => router.push("/secondView", { scroll: false }),
    [router]
  );

  useEffect(() => {
    setIsLoadingBreedList(true);

    fetch(
      `https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${breedId}`,
      {
        method: "GET",
        headers: {
          // TODO: Security Consideration
          // Remember that including API keys in client-side code can expose them to users.
          // If possible, use a server-side proxy or other methods to protect sensitive keys,
          // especially in production environments.
          "x-api-key":
            "live_ahcwnjbZ7jyDagCWID8poLdWYBxjuUmUmuKqJnMFt9xhNBQwpUpECWKopSwlhLOY",
          "Content-Type": "application/json",
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
        setIsLoadingBreedList(false);
        setBreedList([...newData]);
      })
      .catch((error) => {
        setIsLoadingBreedList(false);
        showToast("error", <p>{error.message}</p>);
      });
  }, [openModal2, breedId]);

  return (
    <div className="w-screen h-screen flex justify-center items center">
      {isLoading ? (
        <button className="w-[180px] h-[80px] my-[40px] px-6 py-3 border-2 border-white text-white bg-white rounded-2xl transition-all duration-300 hover:border-orange-500">
          <BeatLoader />
        </button>
      ) : null}
      <ol>
        {breedNames.map((i) => {
          return (
            <li
              key={i.id}
              className="flex justify-center items center cursor-pointer"
              onClick={() => openModal2(i.id)}
            >
              <div className="w-[280px] mb-[20px] px-6 py-3 border-2 border-white text-white flex justify-center items center">
                <div>{i.name}</div>
              </div>
            </li>
          );
        })}
      </ol>

      <ReactModal
        isOpen={isModalOpen2}
        onRequestClose={closeModal}
        contentLabel="Scrollable Modal"
        className="bg-white p-6 rounded-md"
        overlayClassName="fixed inset-0 bg-black flex justify-center items-center"
        ariaHideApp={false}
      >
        <div className="h-[350px] w-[280px] overflow-y-auto flex justify-center items-center">
          {isLoadingBreedList ? (
            <BeatLoader />
          ) : (
            <ol className="h-[350px] w-[280px]">
              {breedList.map((i: { id: string; url: string }) => {
                return (
                  <li key={i.id} className="flex justify-center items center">
                    <div
                      className="mt-[20px] px-6 py-3 border-2 border-white text-white flex justify-center items center"
                      onClick={() => openModal1(i.id, i.url)}
                    >
                      <Link href={"/"}>
                        <Image
                          className="mt-[20px]"
                          src={
                            i.url || "https://cdn2.thecatapi.com/images/385.jpg"
                          }
                          alt="picture of a cute cat"
                          width={280}
                          height={280}
                          priority
                        />
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </ReactModal>
    </div>
  );
}
