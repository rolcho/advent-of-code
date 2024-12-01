import { log } from "node:console";
import { readFileSync } from "node:fs";

const input = readFileSync("./input.txt", "utf8").trim();
const lines = input.split("\n");
let similarity = 0;
const frequencyMap: { [key: number]: number } = {};

for (const line of lines) {
  const [_, right] = line.split("  ").map(Number);
  frequencyMap[right] = (frequencyMap[right] ?? 0) + 1;
}

for (const line of lines) {
  const [left] = line.split("  ").map(Number);
  similarity += left * (frequencyMap[left] ?? 0);
}

log({ similarity });
