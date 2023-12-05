import * as fs from "fs";

const calibrationValues = ["1abc2", "pqr3stu8vwx", "a1b2c3d4e5f", "treb7uchet"];
const fileContent = fs.readFileSync("input.txt", "utf8").split("\n");

function getSum(values: string[]): number {
  let sum = 0;

  values.forEach((value) => {
    sum += getNumberFromString(value);
  });

  return sum;
}

function getNumberFromString(text: string): number {
  const textLength = text.length;
  let firstDigit: number | null = null;
  let lastDigit: number | null = null;

  for (let i = 0; i < textLength; i++) {
    const first = parseInt(text[i]);
    const last = parseInt(text[textLength - 1 - i]);
    if (firstDigit === null && first) {
      firstDigit = first;
    }
    if (lastDigit === null && last) {
      lastDigit = last;
    }
  }

  if (firstDigit === null || lastDigit === null) {
    return 0;
  }

  const hiddenNumber = firstDigit * 10 + lastDigit;
  return hiddenNumber;
}

console.log(getSum(calibrationValues));
console.log(getSum(fileContent));
