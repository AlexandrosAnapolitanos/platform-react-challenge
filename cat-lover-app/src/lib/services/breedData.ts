export async function fetchBreedData(searchParamsId: string) {
  const res = await fetch(
    `/api/breeds/fetchBreedData?searchParamsId=${searchParamsId}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch favorites");
  }

  return res.json();
}
