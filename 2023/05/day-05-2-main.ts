import * as fs from "node:fs";
import { Worker } from "node:worker_threads";

type inputData = {
  itemMappings: ItemMapping;
  seedStart: number;
  seedLength: number;
};

function runWorker(data: inputData): Promise<number> {
  return new Promise((resolve, reject) => {
    // Create a new worker
    const worker = new Worker("./day-05-2-worker.ts");

    // Listen for messages from the worker
    worker.on("message", (result) => {
      resolve(result);
      worker.terminate(); // Clean up the worker when done
    });

    // Listen for errors
    worker.on("error", (error) => {
      reject(error);
      worker.terminate();
    });

    // Listen for worker exit
    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });

    // Send data to the worker
    worker.postMessage(data);
  });
}
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

function createConversionMap(
  from: Items,
  link: Items,
  rawText: string
): Mapping[] {
  const mapText = rawText.replace(`${from}-to-${link} map:\n`, "").split("\n");

  const conversionMap: Mapping[] = [];
  for (let i = 0; i < mapText.length; i++) {
    if (mapText[i] === "") continue;
    const values = mapText[i].split(" ").map(Number);
    conversionMap.push({
      from: values[1],
      to: values[1] + values[2] - 1,
      difference: values[0] - values[1],
    });
  }
  return conversionMap;
}

async function main() {
  const input = fs.readFileSync("input.txt", "utf8");
  const sections = input.split("\n\n");
  const seeds = sections[0].replace("seeds: ", "").split(" ").map(Number);

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
  } as const;
  const workerPromises: Promise<number>[] = [];

  const start = new Date().getTime();

  // Create all workers at once
  for (let i = 0; i < seeds.length; i += 2) {
    workerPromises.push(
      runWorker({ itemMappings, seedStart: seeds[i], seedLength: seeds[i + 1] })
    );
  }

  // Wait for all workers to complete simultaneously
  try {
    const results = await Promise.all(workerPromises);
    lowestLocation = Math.min(...results);
  } catch (error) {
    console.error("Error:", error);
  }

  const end = new Date().getTime();
  const minutes = Math.floor((end - start) / 60000);
  const seconds = Math.floor((end - start) / 1000) % 60;
  const milliseconds = (end - start) % 1000;
  console.log(
    `Lowest location: ${lowestLocation} in ${minutes}m ${seconds}s ${milliseconds}ms`
  );
}

main();
