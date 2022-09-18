export const TAG_RULES = [
  {
    // root tags
    match: ["food", "entertainment", "seasonal"],
    add: [],
  },
  {
    match: ["cocktails", "country", "wine"],
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
      "bar",
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
      "sandwich",
      "boba",
      "chinese",
      "ice cream",
      "caribbean",
      "russian",
      "vietnamese",
      "vegan",
    ],
    add: ["food"],
  },
  {
    match: ["sushi", "shabu"],
    add: ["japanese"],
  },
  {
    match: ["dim sum", "hot pot", "dumplings"],
    add: ["chinese"],
  },
  {
    match: ["pastries"],
    add: ["breakfast"],
  },
];
