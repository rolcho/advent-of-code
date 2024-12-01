import { log } from "console";
import { readFileSync } from "fs";

const input = readFileSync("./input.txt", "utf8").trim();
const lines = input.split("\n");
const left: number[] = [];
const right: number[] = [];
let distance = 0;

lines.forEach((line) => {
  const [leftNumber, rightNumber] = line.split("  ").map(Number);
  left.push(leftNumber);
  right.push(rightNumber);
});

left.sort((a, b) => a - b);
right.sort((a, b) => a - b);

for (let i = 0; i < left.length; i++) {
  distance += Math.abs(left[i] - right[i]);
}
log({ distance });
