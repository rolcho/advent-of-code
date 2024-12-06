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

type Direction = "left" | "right" | "up" | "down";
type Position = { x: number; y: number };
type ItemInfo = Position & { nextDirection: Direction };
type Move = {
  [direction in Direction]: ItemInfo;
};
type GameMap = string[][];
const guardItem = "^";
const rockItem = "#";
const fieldItem = ".";
const visitedItem = "X";

const directions: Move = {
  up: {
    x: 0,
    y: -1,
    nextDirection: "right",
  },
  down: {
    x: 0,
    y: 1,
    nextDirection: "left",
  },
  left: {
    x: -1,
    y: 0,
    nextDirection: "up",
  },
  right: {
    x: 1,
    y: 0,
    nextDirection: "down",
  },
};
async function main() {
  const input = await getFileContent("input");
  let gameMap: GameMap = input.split("\n").map((line) => line.split(""));
  let guardInfo: ItemInfo = {
    ...getStartPoint(gameMap),
    nextDirection: "up",
  };
  while (guardInfo.x !== -1 || guardInfo.y !== -1) {
    [gameMap, guardInfo] = moveGuard(gameMap, guardInfo);
  }
  const visitedPlaces = gameMap.flat(2).filter((item) => item === "X").length;
  console.log({ visitedPlaces });
}

function getStartPoint(gameMap: GameMap): Position {
  const height = gameMap.length;
  const width = gameMap[0].length;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (gameMap[y][x] === guardItem) return { x, y };
    }
  }
  return { x: -1, y: -1 };
}

function moveGuard(gameMap: GameMap, item: ItemInfo): [GameMap, ItemInfo] {
  let currentItem = item;

  const nextPosition: Position = {
    x: item.x + directions[item.nextDirection].x,
    y: item.y + directions[item.nextDirection].y,
  };
  const isOnMap = (position: Position): boolean => {
    return (
      position.x >= 0 &&
      position.x < gameMap[0].length &&
      position.y >= 0 &&
      position.y < gameMap.length
    );
  };

  if (!isOnMap(nextPosition)) {
    gameMap[item.y][item.x] = visitedItem;
    currentItem = { ...item, x: -1, y: -1 };
    return [gameMap, currentItem];
  }

  switch (gameMap[nextPosition.y][nextPosition.x]) {
    case rockItem:
      item.nextDirection = directions[item.nextDirection].nextDirection;
      break;
    case visitedItem:
    case fieldItem:
      gameMap[item.y][item.x] = visitedItem;
      gameMap[nextPosition.y][nextPosition.x] = guardItem;
      currentItem = { ...item, x: nextPosition.x, y: nextPosition.y };
      break;
  }
  return [gameMap, currentItem];
}
main();

export default main();
