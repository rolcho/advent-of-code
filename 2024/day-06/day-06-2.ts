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
async function getNextPositionData(from: number, d: string): Promise<string> {
  let position = from;
  switch (d) {
    case "^":
      if (from - width > 0) position = from - width;
      break;
    case ">":
      if (Math.floor(from / width) === Math.floor((from + 1) / width))
        position = from + 1;
      break;
    case "v":
      if (from + width < data.length) position = from + width;
      break;
    case "<":
      if (Math.floor(from / width) === Math.floor((from - 1) / width))
        position = from - 1;
      break;
  }
  const dataAtPosition = data[position];

  return dataAtPosition;
}
async function moveToNextPosition(from: number, d: string): Promise<number> {
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
      else nextPosition = -1;
      break;
  }
  return nextPosition;
}
async function moveData(from: number, d: string): Promise<[number, string]> {
  let currentD = d;
  let currentP = from;
  const nextPositionData = await getNextPositionData(from, d);
  if (nextPositionData === "#" || nextPositionData === "O")
    currentD = await getRotatedDirectionFor(d);
  currentP = await moveToNextPosition(from, currentD);
  if (nextPositionData === d && currentP >= 0) {
    // printMap(data);
    // console.log({ from, currentP, currentD, nextPositionData });
    // await waitForSeconds(5);
    return [-11, currentD];
  }
  return [currentP, currentD];
}

export async function main() {
  const fileInput = (await getFileContent("input")).split("\n");
  let loopCount = 0;
  width = fileInput[0].length ?? 0;
  height = fileInput.length ?? 0;
  data = fileInput.join("");
  let d = "^";
  for (let i = 0; i < data.length; i++) {
    data = `${data.slice(0, i)}O${data.slice(i + 1)}`;
    let position = getStartingPositionFrom(data);
    console.log(`${data.length}/${i} loops: ${loopCount}`);

    while (position >= 0) {
      [position, d] = await moveData(position, d);
      if (position >= 0) {
        data = data.slice(0, position) + d + data.slice(position + 1);
      }
      if (position === -11) {
        loopCount++;
        break;
      }
    }
    data = fileInput.join("");
    d = "^";
  }

  // for (let i = 0; i < loops.length; i++) {
  //   printMap(loops[i]);
  //   console.log({ i });
  //   await waitForSeconds(1);
  // }
  console.log({ loopCount });
}

main();
