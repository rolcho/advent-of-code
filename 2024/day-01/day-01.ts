import { log } from "node:console";
import { readFileSync } from "node:fs";

const input = readFileSync("./input.txt", "utf8").trim();
const lines = input.split("\n");
const left = new Array<number>(lines.length);
const right = new Array<number>(lines.length);
let distance = 0;

while (distance < lines.length) {
  const line = lines[distance];
  const [leftNumber, rightNumber] = line.split("  ").map(Number);
  left[distance] = leftNumber;
  right[distance] = rightNumber;
  distance++;
}

distance = 0;

left.sort((a, b) => a - b);
right.sort((a, b) => a - b);

for (let i = 0; i < left.length; i++) {
  distance += Math.abs(left[i] - right[i]);
}
log({ distance });
