import { log } from "node:console";
import { readFileSync } from "node:fs";

const input = readFileSync("./input.txt", "utf8").trim();

const matrix: string[][] = input.split("\n").map((line) => line.split(""));
const isXmas = (word: string): number =>
  word === "XMAS" || word === "SAMX" ? 1 : 0;

let xmasSum = 0;

for (let i = 0; i < matrix.length; i++) {
  for (let j = 0; j < matrix[i].length - 3; j++) {
    const word: string =
      matrix[i][j] + matrix[i][j + 1] + matrix[i][j + 2] + matrix[i][j + 3];
    xmasSum += isXmas(word);
  }
}

for (let i = 0; i < matrix.length - 3; i++) {
  for (let j = 0; j < matrix[i].length; j++) {
    const word: string =
      matrix[i][j] + matrix[i + 1][j] + matrix[i + 2][j] + matrix[i + 3][j];
    xmasSum += isXmas(word);
  }
}

for (let i = 0; i < matrix.length - 3; i++) {
  for (let j = 0; j < matrix[i].length - 3; j++) {
    const word: string =
      matrix[i][j] +
      matrix[i + 1][j + 1] +
      matrix[i + 2][j + 2] +
      matrix[i + 3][j + 3];
    xmasSum += isXmas(word);
  }
}

for (let i = 0; i < matrix.length - 3; i++) {
  for (let j = 3; j < matrix[i].length; j++) {
    const word: string =
      matrix[i][j] +
      matrix[i + 1][j - 1] +
      matrix[i + 2][j - 2] +
      matrix[i + 3][j - 3];
    xmasSum += isXmas(word);
  }
}

log({ xmasSum });
