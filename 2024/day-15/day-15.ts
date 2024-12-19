type Coordinate = { x: number; y: number };
type Items = {
  walls: Coordinate[];
  boxes: Coordinate[];
  robot: Coordinate;
};
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
  const walls: Coordinate[] = [];
  const boxes: Coordinate[] = [];
  const robot: Coordinate = { x: 0, y: 0 };
  const [map, routeStr] = str.split("\n\n");
  const route = routeStr.split("");
  const data = map.split("\n").map((l) => l.split(""));
  for (let row = 0; row < data.length; row++) {
    for (let column = 0; column < data[0].length; column++) {
      switch (data[row][column]) {
        case "#":
          walls.push({ x: column, y: row });
          break;
        case "O":
          boxes.push({ x: column, y: row });
          break;
        case "@":
          robot.x = column;
          robot.y = row;
          break;
      }
    }
  }
  const items = { walls, boxes, robot };
  return { items, route };
}

function moveItems(items: Items, route: string[]): Coordinate {
  const { robot, boxes, walls } = items;
  const directions = {
    up: { x: 0, y: -1 },
    down: { x: 1, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  } as const;
  const executeMove = (direction: Coordinate) => {
    const closestWall = walls
      .filter(
        (w) => w.x === robot.x + direction.x && w.y === robot.y + direction.y
      )
      .sort(
        (a, b) =>
          Math.abs(robot.x - a.x) +
          Math.abs(robot.y - a.y) -
          Math.abs(robot.x - b.x) -
          Math.abs(robot.y - b.y)
      )[0];
    if (
      closestWall.x === robot.x + direction.x &&
      closestWall.y === robot.y + direction.y
    )
      return;
  };
  while (route.length > 0) {
    const nextMove = route.shift();
    switch (nextMove) {
      case "v":
        executeMove(directions.down);
        break;
      case "^":
        executeMove(directions.up);
        break;
      case "<":
        executeMove(directions.left);
        break;
      case ">":
        executeMove(directions.right);
        break;
    }
  }
  return {} as Coordinate;
}
async function main() {
  const fileContent = await getFileContent("example");
  const { items, route } = preProcess(fileContent);
  console.log({ w: items.walls, b: items.boxes, r: items.robot, route });
  const endPosition = moveItems(items, route);
}
main();
