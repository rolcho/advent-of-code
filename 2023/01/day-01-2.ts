import * as fs from "fs";

const calibrationValues = [
  "two1nine",
  "eightwothree",
  "abcone2threexyz",
  "xtwone3four",
  "4nineeightseven2",
  "zoneight234",
  "7pqrstsixteen",
];

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

  type numberInfo = { value: number | null; index: number | null };

  let nums: { [key: string]: number } = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
  };

  let firstDigit: numberInfo = { value: null, index: null };
  let lastDigit: numberInfo = { value: null, index: null };

  for (let key in nums) {
    const firstIndex = text.indexOf(key);
    const lastIndex = text.lastIndexOf(key);

    if (firstIndex === -1 && lastIndex === -1) {
      continue;
    }

    if (firstDigit.index === null || firstDigit.index > firstIndex) {
      firstDigit.index = firstIndex;
      firstDigit.value = nums[key];
    }

    if (lastDigit.index === null || lastDigit.index < lastIndex) {
      lastDigit.index = lastIndex;
      lastDigit.value = nums[key];
    }
  }

  for (let i = 0; i < textLength; i++) {
    const first = parseInt(text[i]);
    const last = parseInt(text[textLength - 1 - i]);
    if ((firstDigit.index === null || firstDigit.index > i) && !isNaN(first)) {
      firstDigit.value = first;
      firstDigit.index = i;
    }
    if (
      (lastDigit.index === null || lastDigit.index < textLength - 1 - i) &&
      !isNaN(last)
    ) {
      lastDigit.value = last;
      lastDigit.index = textLength - 1 - i;
    }
  }

  if (firstDigit.value === null || lastDigit.value === null) {
    return 0;
  }

  const hiddenNumber = firstDigit.value * 10 + lastDigit.value;

  return hiddenNumber;
}

console.log(getSum(calibrationValues));
console.log(getSum(fileContent));
