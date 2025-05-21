import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const photoId = searchParams.get("photoId");
    const userId = searchParams.get("userId");
    const rawBody = JSON.stringify({
      image_id: photoId,
      sub_id: userId,
    });

    const res = await fetch("https://api.thecatapi.com/v1/favourites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key":
          process.env.CAT_API_KEY ||
          "live_ahcwnjbZ7jyDagCWID8poLdWYBxjuUmUmuKqJnMFt9xhNBQwpUpECWKopSwlhLOY",
      },
      body: rawBody,
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await res.json();

    return NextResponse.json({ data }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { message: `There was an error in adding favorite: ${error.message}` },
      { status: 500 }
    );
  }
}
