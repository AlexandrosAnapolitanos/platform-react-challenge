import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit");

    const response = await fetch(
      `https://api.thecatapi.com/v1/images/search?limit=${limit}&has_breeds=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key":
            process.env.CAT_API_KEY ||
            "live_ahcwnjbZ7jyDagCWID8poLdWYBxjuUmUmuKqJnMFt9xhNBQwpUpECWKopSwlhLOY",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return NextResponse.json({ data }, { status: 200 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { message: `There was an error in getting favorites: ${error.message}` },
      { status: 500 }
    );
  }
}
