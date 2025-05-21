export async function fetchSomeRandomCats({ limit }: { limit: number }) {
  const res = await fetch(`/api/someRandomCats?limit=${limit}`);
  if (!res.ok) {
    throw new Error("Failed to fetch favorites");
  }

  return res.json();
}
