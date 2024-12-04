import { log } from "node:console";
import { readFileSync } from "node:fs";

function day03opt() {
  const fileContent = readFileSync("./input.txt", "utf8").trim();

  const startTime = Date.now();
  for (let i = 0; i < 10_000; i++) {
    sumMultiply(fileContent);
  }
  const duration = Date.now() - startTime;
  log({ duration });
}
function sumMultiply(text: string) {
  let input = text;
  let sum = 0;
  let isMultiplying = true;
  while (input.length > 0) {
    if (input.startsWith("do()")) {
      input = input.slice(4);
      isMultiplying = true;
    }

    if (input.startsWith("don't()")) {
      input = input.slice(7);
      isMultiplying = false;
    }

    if (!input.startsWith("mul(")) {
      input = input.slice(1);
      continue;
    }
    input = input.slice(4);

    const numOneEnd = input.indexOf(",");
    if (numOneEnd === -1) break;

    const nOne = Number(input.substring(0, numOneEnd));
    if (Number.isNaN(nOne)) {
      input = input.slice(1);
      continue;
    }
    input = input.slice(numOneEnd + 1);

    const numTwoEnd = input.indexOf(")");
    if (numTwoEnd === -1) break;

    const nTwo = Number(input.substring(0, numTwoEnd));
    if (Number.isNaN(nTwo)) {
      input = input.slice(1);
      continue;
    }
    input = input.slice(numTwoEnd + 1);

    sum += isMultiplying ? nOne * nTwo : 0;
  }
}

day03opt();
