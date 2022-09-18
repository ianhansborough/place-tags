import { Client } from "@notionhq/client";
import { getPlaces } from "./utils.js";
import { TAG_RULES } from "./constants.js";

import { config } from "dotenv";
config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function main() {
  const places = await getPlaces(notion);
  const tags = new Set();
  for (const place of places) {
    place.properties.Tags.multi_select.forEach((v) => tags.add(v.name));
  }

  for (const rule of TAG_RULES) {
    rule.match.forEach((match) => {
      tags.delete(match);
    });
  }

  console.log("These tags are not currently represented in a rule:");
  console.log(tags);
}

await main();
