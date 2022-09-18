import { Client } from "@notionhq/client";
import { getPlaces } from "./utils.js";
import { TAG_RULES } from "./constants.js";

import { config } from "dotenv";
config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export async function handler() {
  const places = await getPlaces(notion);

  let placesUpdatedCount = 0;

  for (const place of places) {
    placesUpdatedCount += await update_tags(place);
  }

  console.log(`Job Complete. ${placesUpdatedCount} places updated.`);
}

async function update_tags(place) {
  const placeName = place.properties.Name.title.length
    ? place.properties.Name.title[0].text.content
    : "Unnamed place";
  const existingTagNames = new Set(
    place.properties.Tags.multi_select.map((v) => v.name)
  );
  const nextTags = [...place.properties.Tags.multi_select];

  for (tag of place.properties.Tags.multi_select) {
    for (const rule of TAG_RULES) {
      for (const match of rule.match) {
        if (match === tag.name) {
          const tagNamesToAdd = rule.add.filter(
            (tagName) => !existingTagNames.has(tagName)
          );

          // All tags to add for this rule are already applied. nothing left to do
          if (!tagNamesToAdd.length) {
            break;
          }

          console.log(
            `${placeName} has tag '${match}' - adding missing ancestor tags: ${tagNamesToAdd.map(
              (t) => `${t},`
            )}`
          );
          nextTags.push(...tagNamesToAdd.map(toMultiSelectValue));
          break;
        }
      }
    }
  }

  if (nextTags.length === existingTagNames.size) {
    return 0;
  }

  res = await notion.pages.update({
    page_id: place.id,
    properties: {
      Tags: {
        multi_select: nextTags,
      },
    },
  });

  return 1;
}

function toMultiSelectValue(name) {
  return {
    name,
  };
}
