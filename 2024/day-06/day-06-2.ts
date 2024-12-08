function waitForSeconds(seconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

async function getFileContent(
  contentType: "example" | "input"
): Promise<string> {
  let fileContent = "";
  try {
    const input = Bun.file(`${__dirname}/${contentType}.txt`);
    fileContent = (await input.text()).trim();
  } catch (error) {
    console.error(error);
  }
  return fileContent;
}

const directions = "^>v<";
let width = 0;
let height = 0;
let data = "";

function getRotatedDirectionFor(d: string): string {
  const dPos = directions.indexOf(d);
  return dPos === 3 ? "^" : directions[dPos + 1];
}

function printMap(s: string) {
  let printM = "";
  for (let i = 0; i < s.length; i++) {
    printM += s[i];
    if ((i + 1) % width === 0) printM += "\n";
  }
  console.clear();
  console.log(printM);
}
function getStartingPositionFrom(s: string): number {
  return s.indexOf("^");
}
function getNextPositionData(from: number, d: string): string {
  let dataAtPosition = "";
  switch (d) {
    case "^":
      if (from - width > 0) dataAtPosition = data[from - width];
      break;
    case ">":
      if (Math.floor(from / width) === Math.floor((from + 1) / width))
        dataAtPosition = data[from + 1];
      break;
    case "v":
      if (from + width < data.length) dataAtPosition = data[from + width];
      break;
    case "<":
      if (Math.floor(from / width) === Math.floor((from - 1) / width))
        dataAtPosition = data[from - 1];
      break;
  }

  return dataAtPosition;
}
function moveToNextPosition(from: number, d: string): number {
  let nextPosition = from;

  switch (d) {
    case "^":
      if (nextPosition - width > 0) nextPosition -= width;
      else nextPosition = -1;
      break;
    case ">":
      if (
        Math.floor(nextPosition / width) ===
        Math.floor((nextPosition + 1) / width)
      )
        nextPosition++;
      else nextPosition = -1;

      break;
    case "v":
      if (nextPosition + width < data.length) nextPosition += width;
      else nextPosition = -1;
      break;
    case "<":
      if (
        Math.floor(nextPosition / width) ===
        Math.floor((nextPosition - 1) / width)
      )
        nextPosition--;
      else nextPosition - 1;
      break;
  }
  return nextPosition;
}
function moveData(from: number, d: string): [number, string] {
  let currentD = d;
  let currentP = from;
  const nextPositionData = getNextPositionData(from, d);
  if (nextPositionData === "#") currentD = getRotatedDirectionFor(d);
  currentP = moveToNextPosition(from, currentD);
  return [currentP, currentD];
}

export async function main() {
  const fileInput = (await getFileContent("input")).split("\n");
  width = fileInput[0].length ?? 0;
  height = fileInput.length ?? 0;
  data = fileInput.join("");
  let d = "^";
  let position = getStartingPositionFrom(data);
  while (position !== -1) {
    [position, d] = moveData(position, d);
    if (position !== -1) {
      data = data.slice(0, position) + d + data.slice(position + 1);
    }
  }
  const steps = data.split("").filter((d) => directions.includes(d)).length;
  console.log(steps);
}

main();
