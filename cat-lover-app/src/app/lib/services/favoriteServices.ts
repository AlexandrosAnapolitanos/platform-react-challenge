export async function fetchFavorites({
  userId,
  page,
  limit,
}: {
  userId: string;
  page: number;
  limit: number;
}) {
  const res = await fetch(
    `/api/favorites?sub_id=${userId}&page=${page}&limit=${limit}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch favorites");
  }

  return res.json();
}

export async function deleteFavorite(id: string, userId: string) {
  const res = await fetch(`/api/favorites?id=${id}&userId=${userId}`);
  if (!res.ok) {
    throw new Error(`Failed to delete favorite: ${id}`);
  }

  return res.json();
}
