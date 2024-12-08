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
        items.get(item)?.push({ x, y });
      }
    }
  }
  return items;
}
export async function main() {
  const fileContent = await getFileContent("example");
  const grid = fileContent.split("\n").map((line) => line.split(""));
  const items = fillGrid(grid);
  for (const [key, coordinates] of items) {
    console.log(`${key}:`);
    let coordinateString = "";
    for (const coordinate of coordinates)
      coordinateString += `${coordinate.x}:${coordinate.y} `;
    console.log(coordinateString);
  }
}
main();
