const ROBOT = "@";
const BOX = "O";
const WALL = "#";
type Coordinate = { x: number; y: number };
type ItemType = "#" | "O" | "@";
type Item = { item: ItemType; id: number } & Coordinate;
type Items = Item[];
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

function preProcess(str: string): {
  items: Items;
  route: string[];
} {
  let id = 0;
  const items: Items = [];
  const [map, routeStr] = str.split("\n\n");
  const route = routeStr.split("");
  const data = map.split("\n").map((l) => l.split(""));
  for (let row = 0; row < data.length; row++) {
    for (let column = 0; column < data[0].length; column++) {
      if (
        data[row][column] === "#" ||
        data[row][column] === "O" ||
        data[row][column] === "@"
      ) {
        items.push({
          item: data[row][column] as ItemType,
          id: id++,
          x: column,
          y: row,
        });
      }
    }
  }
  return { items, route };
}

function getItemPositions(
  item: ItemType,
  items: Items
): Coordinate | Coordinate[] {
  const itemList = items.filter((i) => i.item === item);
  if (itemList.length === 0) return [];
  const coordinates: Coordinate[] = itemList.map((i) => ({ x: i.x, y: i.y }));
  return coordinates;
}
function getColumn(item: Item, items: Items, direction?: string) {
  if (direction === "v")
    return items.filter((i) => i.x === item.x && i.y > item.y);
  if (direction === "^")
    return items.filter((i) => i.x === item.x && i.y < item.y);
  return items.filter((i) => i.x === item.x);
}
function getRow(item: Item, items: Items, direction?: string) {
  if (direction === ">")
    return items.filter((i) => i.y === item.y && i.x > item.x);
  if (direction === "<")
    return items.filter((i) => i.y === item.y && i.x < item.x);
  return items.filter((i) => i.y === item.y);
}
async function main() {
  const fileContent = await getFileContent("example");
  const { items, route } = preProcess(fileContent);
  const robot = getItemPositions(ROBOT, items)[0];
  console.log({ items, route });
  console.log({ robot });
  route.forEach((r) => {
    let coords: Items = [];
    switch (r) {
      case "^":
        coords = getColumn(robot, items, "^");
        break;
      case "v":
        coords = getColumn(robot, items, "v");
        break;
      case ">":
        coords = getRow(robot, items, ">");
        break;
      case "<":
        coords = getRow(robot, items, "<");
        break;
    }
    console.log({ r, coords });
  });
}
main();
