import FailedToFetchFavoritesError from "@/errorHandling/FailedToFetchFavoritesError";
import { CAT_API_KEY } from "@/utils/catApiKey";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("sub_id");
    const pageNumber = searchParams.get("page");
    const limit = searchParams.get("limit");

    const res = await fetch(
      `https://api.thecatapi.com/v1/favourites?limit=${limit}&sub_id=${userId}&order=ASC&page=${pageNumber}`,

      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": CAT_API_KEY,
        },
      }
    );

    const data = await res.json();
    const totalCount = res.headers.get("Pagination-Count") ?? "0";

    return NextResponse.json({ data, totalCount }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const typedError = new FailedToFetchFavoritesError(error.message);
    console.log("typedError", typedError);
    return NextResponse.json({ data: typedError });
  }
}
