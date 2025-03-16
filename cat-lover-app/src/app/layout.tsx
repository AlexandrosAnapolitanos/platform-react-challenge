"use client";

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import ReactModal from "react-modal";
import Navigation from "./components/Navigation";
import ToastProvider from "./components/ToastProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export interface RandomImageType {
  id: string;
  url: string;
  breeds: [{ description: string }];
}

export interface BreedNameType {
  id: string;
  name: string;
}

// Define the type for the context
export interface RandomImagesContextType {
  randomImages: RandomImageType[];
  setRandomImages: Dispatch<SetStateAction<RandomImageType[]>>;
  paginationNumber: number;
  setPaginationNumber: Dispatch<SetStateAction<number>>;
}

export interface BreedNamesContextType {
  breedNames: BreedNameType[];
  setBreedNames: Dispatch<SetStateAction<BreedNameType[]>>;
}

export interface FavoritesContextType {
  paginationNumber3rdView: number;
  setPaginationNumber3rdView: Dispatch<SetStateAction<number>>;
}

const RandomImagesContext = createContext<RandomImagesContextType | null>(null);
const BreedNamesContext = createContext<BreedNamesContextType | null>(null);
const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const useRandomImagesContext = () => {
  const context = useContext(RandomImagesContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const useBreedNamesContext = () => {
  const context = useContext(BreedNamesContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      ReactModal.setAppElement(document.body);
    }
  }, []);
  const [randomImages, setRandomImages] = useState<
    RandomImagesContextType["randomImages"]
  >([]);
  const [breedNames, setBreedNames] = useState<
    BreedNamesContextType["breedNames"]
  >([]);
  const [paginationNumber, setPaginationNumber] = useState<number>(1);
  const [paginationNumber3rdView, setPaginationNumber3rdView] =
    useState<number>(1);

  return (
    <ClerkProvider>
      <ToastProvider>
        <RandomImagesContext.Provider
          value={{
            randomImages,
            setRandomImages,
            paginationNumber,
            setPaginationNumber,
          }}
        >
          <BreedNamesContext.Provider value={{ breedNames, setBreedNames }}>
            <FavoritesContext.Provider
              value={{ paginationNumber3rdView, setPaginationNumber3rdView }}
            >
              <html lang="en">
                <body
                  className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                  <header className="flex flex-col justify-center items-center my-[50px] border-b border-white">
                    <div className="mb-[45px]">
                      <div className="flex justify-center items-center">
                        <SignedOut>
                          <div className="mx-[25px]">
                            <SignInButton />
                          </div>
                          <div className="mx-[25px]">
                            <SignUpButton />
                          </div>
                        </SignedOut>
                      </div>
                      <div className="mx-[25px]">
                        <SignedIn>
                          <UserButton />
                        </SignedIn>
                      </div>
                    </div>
                    <Navigation />
                  </header>
                  {children}
                </body>
              </html>
            </FavoritesContext.Provider>
          </BreedNamesContext.Provider>
        </RandomImagesContext.Provider>
      </ToastProvider>
    </ClerkProvider>
  );
}
