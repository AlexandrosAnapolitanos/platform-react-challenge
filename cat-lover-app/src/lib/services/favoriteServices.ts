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
    `/api/favorite/fetchFavorites?sub_id=${userId}&page=${page}&limit=${limit}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch favorites");
  }

  return res.json();
}

export async function deleteFavorite(id: string, userId: string) {
  const res = await fetch(
    `/api/favorite/favoriteDelete?id=${id}&userId=${userId}`,
    {
      method: "DELETE",
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to delete favorite: ${id}`);
  }

  return res.json();
}

export async function addFavorite(photoId: string, userId: string) {
  const res = await fetch(
    `/api/favorite/markAsFavorite?photoId=${photoId}&userId=${userId}`,
    {
      method: "POST",
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to add favorite: ${photoId}`);
  }

  return res.json();
}
