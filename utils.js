export async function getPlaces(notion) {
  const { results: places } = await notion.databases.query({
    database_id: await getPlacesDatabaseId(notion),
  });

  return places;
}

export async function getPlacesDatabaseId(notion) {
  const res = await notion.search({
    query: "places",
    filter: { property: "object", value: "database" },
  });
  return res.results[0].id;
}
