import * as fs from "fs";

const schematicFile = fs.readFileSync("input.txt", "utf8");

// const sample = `467..114..
// ...*......
// ..35..633.
// ......#...
// 617*......
// .....+.58.
// ..592.....
// ......755.
// ...$.*....
// .664.598..`;

const schematic = createMatrix(schematicFile);
const sum = getParts(schematic).reduce((a, n) => a + n);
console.log(sum);

function createMatrix(input: string): string[][] {
  const rows = input.split("\n");
  const matrix: string[][] = [];

  for (let row of rows) {
    matrix.push(row.split(""));
  }

  return matrix;
}

function getParts(schematic: string[][]): number[] {
  type part = {
    value: number;
    isPart: boolean;
  };

  const numbers: part[] = [];

  for (let i = 0; i < schematic.length; i++) {
    let rowNumber = -1;
    let isPart = false;
    for (let j = 0; j < schematic[i].length; j++) {
      const digit = parseInt(schematic[i][j]);
      const around = [
        schematic[i - 1]?.[j - 1] ?? ".",
        schematic[i - 1]?.[j] ?? ".",
        schematic[i - 1]?.[j + 1] ?? ".",
        schematic[i]?.[j - 1] ?? ".",
        schematic[i]?.[j + 1] ?? ".",
        schematic[i + 1]?.[j - 1] ?? ".",
        schematic[i + 1]?.[j] ?? ".",
        schematic[i + 1]?.[j + 1] ?? ".",
      ];
      if (!isNaN(digit)) {
        if (!isPart) {
          isPart = validatePart(around);
        }
        if (rowNumber > -1) {
          rowNumber = rowNumber * 10 + digit;
        } else rowNumber = digit;
        continue;
      }
      if (rowNumber > -1) {
        numbers.push({ value: rowNumber, isPart: isPart });
        isPart = false;
        rowNumber = -1;
      }
    }
    if (rowNumber > -1) {
      numbers.push({ value: rowNumber, isPart: isPart });
      isPart = false;
      rowNumber = -1;
    }
  }
  return numbers.filter((part) => part.isPart).map((part) => part.value);
}

function validatePart(around: string[]): boolean {
  const aroundValues = around.join("").replace(/\.|\d/g, "");
  return aroundValues.length > 0;
}
