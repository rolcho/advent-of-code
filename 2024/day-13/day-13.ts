type Coordinate = { x: number; y: number };
type Buttons = { a: Coordinate; b: Coordinate };
type Machine = { buttons: Buttons; destination: Coordinate };

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

function processInput(input: string): Machine[] {
  const machines: Machine[] = [];
  const machinesRaw = input.split("\n\n").map((machine) => machine.split("\n"));
  for (const machine of machinesRaw) {
    const buttonA = machine[0].slice(12).split(", Y+").map(Number);
    const buttonB = machine[1].slice(12).split(", Y+").map(Number);
    const destination = machine[2].slice(9).split(", Y=").map(Number);
    machines.push({
      buttons: {
        a: { x: buttonA[0], y: buttonA[1] },
        b: { x: buttonB[0], y: buttonB[1] },
      },
      destination: { x: destination[0], y: destination[1] },
    });
  }
  return machines;
}

function getMinTokens(buttons: Buttons, destination: Coordinate): number {
  const { a, b } = buttons;
  const validTokenAmounts: number[] = [];

  for (let i = 1; i < 100; i++) {
    const remain = { x: destination.x - i * a.x, y: destination.y - i * a.y };
    const isRemainXDividable = remain.x % b.x === 0;
    const isRemainYDividable = remain.y % b.y === 0;
    const remainX = remain.x / b.x;
    const remainY = remain.y / b.y;
    if (
      isRemainXDividable &&
      isRemainYDividable &&
      remainX === remainY &&
      remainX < 100
    ) {
      validTokenAmounts.push(i * 3 + remainX);
    }
  }
  return validTokenAmounts.length === 0 ? 0 : Math.min(...validTokenAmounts);
}

async function main() {
  const input = await getFileContent("input");
  const machines = processInput(input);
  let sum = 0;
  for (const machine of machines) {
    const { buttons, destination } = machine;
    sum += getMinTokens(buttons, destination);
  }
  console.log(sum);
}
main();
