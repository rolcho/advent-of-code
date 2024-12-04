import { log } from "node:console";
import { readFileSync } from "node:fs";

const input = readFileSync("./input.txt", "utf8").trim();
let mulIndex = 0;
let numOne: number[] = [];
let numTwo: number[] = [];
let sum = 0;
let isMultiplying = true;

for (let i = 0; i < input.length; i++) {
  if (input.substring(i, i + 4) === "do()") {
    isMultiplying = true;
  }

  if (input.substring(i, i + 7) === "don't()") {
    isMultiplying = false;
  }

  //TODO: Need to refactor !!! while and splice() offset
  const currentNumber = Number.parseInt(input[i]);
  switch (mulIndex) {
    case 0:
      if (input[i] === "m" && isMultiplying) {
        mulIndex++;
      } else {
        mulIndex = 0;
      }
      break;
    case 1:
      if (input[i] === "u") {
        mulIndex++;
      } else {
        mulIndex = 0;
      }
      break;
    case 2:
      if (input[i] === "l") {
        mulIndex++;
      } else {
        mulIndex = 0;
      }
      break;
    case 3:
      if (input[i] === "(") {
        mulIndex = 4;
      } else {
        numOne = [];
        numTwo = [];
        mulIndex = 0;
      }
      break;
    case 4:
      if (!Number.isNaN(currentNumber)) {
        numOne.push(currentNumber);
      } else if (input[i] === ",") {
        mulIndex = 5;
      } else {
        numOne = [];
        numTwo = [];
        mulIndex = 0;
      }
      break;
    case 5:
      if (!Number.isNaN(currentNumber)) {
        numTwo.push(currentNumber);
      } else if (input[i] === ")") {
        sum +=
          numOne.reduce((prev, curr) => prev * 10 + curr, 0) *
          numTwo.reduce((prev, curr) => prev * 10 + curr, 0);
        numOne = [];
        numTwo = [];
        mulIndex = 0;
      } else {
        numOne = [];
        numTwo = [];
        mulIndex = 0;
      }
  }
}

log({ sum });
