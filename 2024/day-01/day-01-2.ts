import { log } from "console";
import { readFileSync } from "fs";

const input = readFileSync("./input.txt", "utf8").trim();
const lines = input.split("\n");
let similarity = 0;
const frequencyMap: { [key: number]: number } = {};

lines.forEach((line) => {
  const [_, right] = line.split("  ").map(Number);
  frequencyMap[right] = frequencyMap[right] + 1 || 1;
});

lines.forEach((line) => {
  const [left] = line.split("  ").map(Number);
  similarity += left * (frequencyMap[left] || 0);
});

log({ similarity });
