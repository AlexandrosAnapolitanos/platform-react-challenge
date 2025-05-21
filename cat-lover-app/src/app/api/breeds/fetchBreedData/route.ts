import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const searchParamsId = searchParams.get("searchParamsId");

    const res = await fetch(
      `https://api.thecatapi.com/v1/images/${searchParamsId}`,
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

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await res.json();

    return NextResponse.json({ data }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { message: `There was an error in getting favorites: ${error.message}` },
      { status: 500 }
    );
  }
}
