const { Client } = require("@notionhq/client");
require("dotenv").config();

const TAG_RULES = [
  {
    match: ["cocktails", "country"],
    add: ["bar", "entertainment"],
  },

  {
    match: [
      "dancing",
      "club",
      "live music",
      "comedy",
      "creative",
      "exercise",
      "brewery",
    ],
    add: ["entertainment"],
  },
  {
    match: [
      "coffee",
      "brunch",
      "moroccan",
      "korean",
      "thai",
      "french",
      "japanese",
      "bakery",
      "italian",
      "mediterranean",
      "breakfast",
      "burger",
      "ethiopian",
      "dim sum",
      "mexican",
      "seafood",
      "asian fusion",
      "korean",
      "pizza",
    ],
    add: ["food"],
  },
  {
    match: ["sushi"],
    add: ["japanese"],
  },
  {
    match: ["dim sum", "hot pot"],
    add: ["chinese"],
  },
  {
    match: ["pastries"],
    add: ["breakfast"],
  },
];


const notion = new Client({ auth: process.env.NOTION_TOKEN });

exports.handler = async () => {
  await getPlaces();
}

async function getUsers() {
  const res = await notion.users.list();
  console.log(res);
}

async function getPlacesDatabaseId() {
  const res = await notion.search({
    query: "places",
    filter: { property: "object", value: "database" },
  });
  return res.results[0].id;
}

async function getPlaces() {
  const { results: places } = await notion.databases.query({
    database_id: await getPlacesDatabaseId(),
  });

  let placesUpdatedCount = 0;

  for (const place of places) {
    placesUpdatedCount += await update_tags(place);
  }

  console.log(`Job Complete. ${placesUpdatedCount} places updated.`)
}

async function update_tags(place) {

  const placeName = place.properties.Name.title.length ? place.properties.Name.title[0].text.content : "Unnamed place"
  const existingTagNames = new Set(place.properties.Tags.multi_select.map(v => v.name));
  const nextTags = [...place.properties.Tags.multi_select];
  
  for (tag of place.properties.Tags.multi_select) {
    for (const rule of TAG_RULES) {
      for (const match of rule.match) {
        if (match === tag.name) {
          const tagNamesToAdd = rule.add.filter(tagName => !existingTagNames.has(tagName))

          // All tags to add for this rule are already applied. nothing left to do
          if (!tagNamesToAdd.length) {
            break
          }

          console.log(`${placeName} has tag '${match}' - adding missing ancestor tags: ${tagNamesToAdd.map(t => `${t},`)}`)
          nextTags.push(...tagNamesToAdd.map(toMultiSelectValue));
          break;
        }
      }
    }
  }

  if (nextTags.length === existingTagNames.size) {
    return 0
  }

  res = await notion.pages.update({
    page_id: place.id,
    properties: {
      Tags: {
        multi_select: nextTags,
      },
    },
  });

  return 1
}

function toMultiSelectValue(name) {
  return {
    name,
  };
}
