import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const id = searchParams.get("id");

    const res = await fetch(
      `https://api.thecatapi.com/v1/favourites/${id}?&sub_id=${userId}`,
      {
        method: "DELETE",
        headers: {
          "x-api-key":
            process.env.CAT_API_KEY ||
            "live_ahcwnjbZ7jyDagCWID8poLdWYBxjuUmUmuKqJnMFt9xhNBQwpUpECWKopSwlhLOY",
          "Content-Type": "application/json",
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
      { message: `There was an error in delete of favorite: ${error.message}` },
      { status: 500 }
    );
  }
}
