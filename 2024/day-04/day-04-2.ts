import { log } from "node:console";
import { readFileSync } from "node:fs";

const input = readFileSync("./input.txt", "utf8").trim();

const center: { [key: string]: boolean } = {};
const matrix: string[][] = input.split("\n").map((line) => line.split(""));
const isXmas = (word: string, position: string): number => {
  if (!(word === "MAS" || word === "SAM")) return 0;
  if (!center[position]) {
    center[position] = true;
    return 0;
  }
  return 1;
};

let xmasSum = 0;

for (let i = 0; i < matrix.length - 2; i++) {
  for (let j = 0; j < matrix[i].length - 2; j++) {
    const word: string =
      matrix[i][j] + matrix[i + 1][j + 1] + matrix[i + 2][j + 2];
    xmasSum += isXmas(word, `${i + 1}-${j + 1}`);
  }
}

for (let i = 0; i < matrix.length - 2; i++) {
  for (let j = 2; j < matrix[i].length; j++) {
    const word: string =
      matrix[i][j] + matrix[i + 1][j - 1] + matrix[i + 2][j - 2];
    xmasSum += isXmas(word, `${i + 1}-${j - 1}`);
  }
}

log({ xmasSum });
