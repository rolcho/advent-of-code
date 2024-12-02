import { log } from "node:console";
import { readFileSync } from "node:fs";

const input = readFileSync("./input.txt", "utf8").trim();
const lines = input.split("\n");

const safe = Array<boolean>(lines.length).fill(false);

function isSafe(nums: number[]): boolean {
  let increasing: boolean | null = null;
  let safeDiff = true;
  for (let i = 0; i < nums.length - 1; i++) {
    const diff = Math.abs(nums[i] - nums[i + 1]);

    if (diff === 0) {
      safeDiff = false;
      break;
    }

    if (increasing === null) {
      increasing = nums[i] < nums[i + 1];
    } else if (increasing !== nums[i] < nums[i + 1]) {
      safeDiff = false;
      break;
    }

    if (diff > 3 || diff < 1) {
      safeDiff = false;
      break;
    }
  }
  return safeDiff;
}

for (let i = 0; i < lines.length; i++) {
  const nums = lines[i].split(" ").map(Number);
  if (isSafe(nums)) {
    safe[i] = true;
    continue;
  }

  for (let j = 0; j < nums.length; j++) {
    const newNums = [...nums.slice(0, j), ...nums.slice(j + 1)];
    if (isSafe(newNums)) {
      safe[i] = true;
      break;
    }
  }
}

const safeCount = safe.filter(Boolean).length;

log({ safe, safeCount });
