import { log } from "node:console";
import { readFileSync } from "node:fs";

const input = readFileSync("./example.txt", "utf8").trim();
const lines = input.split("\n");

const maxDiff = 3;
const minDiff = 1;
const safeCount = Array<boolean>(lines.length).fill(true);

for (let i = 0; i < lines.length; i++) {
  const nums = lines[i].split(" ").map(Number);
  const increase = nums[0] < nums[1];
  for (let j = 0; j < nums.length - 1; j++) {
    const difference = Math.abs(nums[j] - nums[j + 1]);
    if (
      difference < minDiff ||
      difference > maxDiff ||
      nums[j] < nums[j + 1] !== increase
    ) {
      safeCount[i] = false;
      break;
    }
  }
}

const safe = safeCount.filter((index) => index).length;

log(safe);
