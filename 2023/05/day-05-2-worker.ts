import { parentPort } from "node:worker_threads";
type inputData = {
  itemMappings: ItemMapping;
  seedStart: number;
  seedLength: number;
};
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

function seekLowestLocation(
  itemMappings: ItemMapping,
  seedStart: number,
  seedLength: number
): number {
  let lowestLocation = Number.MAX_SAFE_INTEGER;
  for (let j = 0; j < seedLength; j++) {
    const seed = seedStart + j;
    const soil = linkItem(seed, itemMappings.seed);
    const fertilizer = linkItem(soil, itemMappings.soil);
    const water = linkItem(fertilizer, itemMappings.fertilizer);
    const light = linkItem(water, itemMappings.water);
    const temperature = linkItem(light, itemMappings.light);
    const humidity = linkItem(temperature, itemMappings.temperature);
    const location = linkItem(humidity, itemMappings.humidity);

    lowestLocation = Math.min(lowestLocation, location);
  }
  return lowestLocation;
}

function linkItem(itemId: number, map: Mapping[]): number {
  for (let i = 0; i < map.length; i++) {
    if (itemId >= map[i].from && itemId <= map[i].to) {
      return itemId + map[i].difference;
    }
  }
  return itemId;
}

parentPort?.on("message", (data: inputData) => {
  const result = seekLowestLocation(
    data.itemMappings,
    data.seedStart,
    data.seedLength
  );
  parentPort?.postMessage(result);
});
