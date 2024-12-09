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
type Coordinate = { x: number; y: number };
type ItemList = Map<string, Coordinate[]>;

function fillGrid(grid: string[][]): ItemList {
  const items: ItemList = new Map();
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      const item = grid[y][x];
      if (item !== ".") {
        if (!items.has(item)) items.set(item, []);
        const currentItem = items.get(item);
        if (currentItem !== undefined) currentItem.push({ x, y });
      }
    }
  }
  return items;
}
function isOnGrid(coordinate: Coordinate, grid: string[][]): boolean {
  return (
    coordinate.x > -1 &&
    coordinate.y > -1 &&
    coordinate.x < grid[0].length &&
    coordinate.y < grid.length
  );
}

export async function main() {
  const antinodeCollector: string[] = [];
  const antinodes: string[] = [];
  const fileContent = await getFileContent("input");
  const grid = fileContent.split("\n").map((line) => line.split(""));
  const items = fillGrid(grid);
  for (const [_, coordinates] of items) {
    for (let i = 0; i < coordinates.length - 1; i++) {
      for (let j = i + 1; j < coordinates.length; j++) {
        let shiftedCurrent = coordinates[i];
        let shiftedNext = coordinates[j];
        const shiftX = shiftedNext.x - shiftedCurrent.x;
        const shiftY = shiftedNext.y - shiftedCurrent.y;

        while (isOnGrid(shiftedCurrent, grid)) {
          antinodes.push(`${shiftedCurrent.x}:${shiftedCurrent.y}`);
          shiftedCurrent = {
            x: shiftedCurrent.x - shiftX,
            y: shiftedCurrent.y - shiftY,
          };
        }

        while (isOnGrid(shiftedNext, grid)) {
          antinodes.push(`${shiftedNext.x}:${shiftedNext.y}`);
          shiftedNext = {
            x: shiftedNext.x + shiftX,
            y: shiftedNext.y + shiftY,
          };
        }
      }
    }
  }
  const antinodesSet = new Set(antinodes);
  for (const antinode of antinodesSet) {
    if (!antinodeCollector.includes(antinode)) antinodeCollector.push(antinode);
  }
  console.log(antinodeCollector.length);
}
main();
