import { log } from "console";
import { readFileSync } from "fs";

const input = readFileSync("./input.txt", "utf8").trim();
const lines = input.split("\n");
const left: number[] = [];
const right: number[] = [];
let similarity = 0;

const map = new Map<number, number>();

lines.forEach((line) => {
  const [leftNumber, rightNumber] = line.split("  ").map(Number);
  left.push(leftNumber);
  map.set(rightNumber, (map.get(rightNumber) || 0) + 1);
});

for (let i = 0; i < left.length; i++) {
  similarity += left[i] * (map.get(left[i]) ?? 0);
}

log({ similarity });
