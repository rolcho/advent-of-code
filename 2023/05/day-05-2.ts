/*
Föld->mag reláció 
50 föld 98 mag 2 variáció (50-98, 51-98)
52 föld 50 mag 48 variáció (52-50...99-97)
Ha nincs a relációban, akkor 1-1, 2-2, 3-3...

Logikai táblák:
Föld->Mag
Műtrágya->Föld
Víz->Műtrágya
Fény->Víz
Hőmérséklet->Fény
Páratartalom->Hőmérséklet
Hely->Páratartalom

Az alamanach a magokkal kezdődik:
79 14 55 13
*/
import * as fs from "node:fs";
type Items =
  | "seed"
  | "soil"
  | "fertilizer"
  | "water"
  | "light"
  | "temperature"
  | "humidity"
  | "location";
type Mapping = {
  from: number;
  to: number;
  difference: number;
};

type ItemMapping = {
  [key in Items]: Mapping[];
};

type Composition = {
  seed: number;
  soil: number;
  fertilizer: number;
  water: number;
  light: number;
  temperature: number;
  humidity: number;
  location: number;
};

const compositions: Composition[] = [];
const input = fs.readFileSync("input.txt", "utf8");
const sections = input.split("\n\n");
const seeds = sections[0].replace("seeds: ", "").split(" ").map(Number);
const seedArray: number[] = [];

let lowestLocation = Number.MAX_SAFE_INTEGER;

const itemMappings: ItemMapping = {
  seed: createConversionMap("seed", "soil", sections[1]),
  soil: createConversionMap("soil", "fertilizer", sections[2]),
  fertilizer: createConversionMap("fertilizer", "water", sections[3]),
  water: createConversionMap("water", "light", sections[4]),
  light: createConversionMap("light", "temperature", sections[5]),
  temperature: createConversionMap("temperature", "humidity", sections[6]),
  humidity: createConversionMap("humidity", "location", sections[7]),
  location: [],
};

for (let i = 0; i < seeds.length; i += 2) {
  for (let j = 0; j < seeds[i + 1]; j++) {
    const seed = seeds[i] + j;
    const soil = linkItem(seed, itemMappings.seed);
    const fertilizer = linkItem(soil, itemMappings.soil);
    const water = linkItem(fertilizer, itemMappings.fertilizer);
    const light = linkItem(water, itemMappings.water);
    const temperature = linkItem(light, itemMappings.light);
    const humidity = linkItem(temperature, itemMappings.temperature);
    const location = linkItem(humidity, itemMappings.humidity);
    lowestLocation = Math.min(lowestLocation, location);
  }
  console.log({ lowLoc: lowestLocation });
}

console.log({ lowestLocation });

function createConversionMap(
  from: Items,
  link: Items,
  rawText: string
): Mapping[] {
  const mapText = rawText.replace(`${from}-to-${link} map:\n`, "").split("\n");

  const conversionMap: Mapping[] = [];
  for (const line of mapText) {
    if (line === "") continue;
    const values = line.split(" ").map(Number);
    conversionMap.push({
      from: values[1],
      to: values[1] + values[2] - 1,
      difference: values[0] - values[1],
    });
  }
  return conversionMap;
}

function linkItem(itemId: number, map: Mapping[]): number {
  for (const item of map) {
    if (itemId >= item.from && itemId <= item.to) {
      return itemId + item.difference;
    }
  }
  return itemId;
}
