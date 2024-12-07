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

type Direction = "L" | "R" | "U" | "D";
type Position = { x: number; y: number };
type ItemInfo = Position & { nextDirection: Direction };
type Move = {
  [direction in Direction]: ItemInfo;
};
type GameMap = string[][];
const guardItem = "^";
const rockItem = "#";
const fieldItem = ".";
const moveUp = "U";
const moveDown = "D";
const moveLeft = "L";
const moveRight = "R";
const crossItem = "X";
const blockItem = "O";
const blockPositions: Set<string> = new Set();

const directions: Move = {
  U: {
    x: 0,
    y: -1,
    nextDirection: moveRight,
  },
  D: {
    x: 0,
    y: 1,
    nextDirection: moveLeft,
  },
  L: {
    x: -1,
    y: 0,
    nextDirection: moveUp,
  },
  R: {
    x: 1,
    y: 0,
    nextDirection: moveDown,
  },
};
async function main() {
  const input = await getFileContent("example");
  let gameMap: GameMap = input.split("\n").map((line) => line.split(""));
  let guardInfo: ItemInfo = {
    ...getStartPoint(gameMap),
    nextDirection: moveUp,
  };
  while (guardInfo.x !== -1 || guardInfo.y !== -1) {
    [gameMap, guardInfo] = moveGuard(gameMap, guardInfo);

    //TODO: Draw game map
    const drawGameMap = gameMap.map((row) => row.join("")).join("\n");
    console.clear();
    console.log(drawGameMap);
    const gameMapState = gameMap;
    const nextP = {
      x: guardInfo.x + directions[guardInfo.nextDirection].x,
      y: guardInfo.y + directions[guardInfo.nextDirection].y,
    };
    if (
      gameMap[guardInfo.y][guardInfo.x] === crossItem &&
      gameMap[nextP.y][nextP.x] === guardInfo.nextDirection
    ) {
      gameMap[nextP.y][nextP.x] = blockItem;
      await waitForSeconds(0.1);
      gameMap = gameMapState;
    }
    console.log({
      next: gameMap[nextP.y][nextP.x],
      guard: gameMap[guardInfo.y][guardInfo.x],
      guardMove: guardInfo.nextDirection,
    });
    await waitForSeconds(0.1);
  }
  const blockCount = blockPositions.size;
  for (let y = 0; y < gameMap.length; y++) {
    for (let x = 0; x < gameMap[0].length; x++) {
      if (blockPositions.has(`${x},${y}`)) {
        gameMap[y][x] = blockItem;
      }
    }
  }
  const drawGameMap = gameMap.map((row) => row.join("")).join("\n");
  console.clear();
  console.log(drawGameMap);
  console.log({ blockedCount: blockCount });
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
const getRightPosition = (item: ItemInfo): Position => {
  const nextPosition: Position = {
    x: item.x + directions[item.nextDirection].x,
    y: item.y + directions[item.nextDirection].y,
  };
  const turnRightDirection = directions[item.nextDirection].nextDirection;
  const rightPosition: Position = {
    x: item.x + directions[turnRightDirection].x,
    y: item.y + directions[turnRightDirection].y,
  };
  return rightPosition;
};

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
    gameMap[item.y][item.x] = item.nextDirection;
    currentItem = { ...item, x: -1, y: -1 };
    return [gameMap, currentItem];
  }

  if (gameMap[item.y][item.x] === crossItem) {
    const rightPosition = getRightPosition(item);
    console.log({ rightPosition });
    if (
      gameMap[rightPosition.y][rightPosition.x] === item.nextDirection
      // isRepeatPath(gameMap, item, moveUp) ||
      // isRepeatPath(gameMap, item, moveDown) ||
      // isRepeatPath(gameMap, item, moveLeft) ||
      // isRepeatPath(gameMap, item, moveRight)
    ) {
      const blockAtPosition: Position = {
        y: nextPosition.y + directions[item.nextDirection].y,
        x: nextPosition.x + directions[item.nextDirection].x,
      };
      const blockMap = gameMap;
      blockMap[blockAtPosition.y][blockAtPosition.x] = blockItem;
      console.log(blockMap);
      blockPositions.add(`${blockAtPosition.x},${blockAtPosition.y}`);
    }
  }
  switch (gameMap[nextPosition.y][nextPosition.x]) {
    case blockItem:
    case rockItem:
      {
        gameMap[item.y][item.x] = crossItem;
        const currentDirection = directions[item.nextDirection].nextDirection;
        currentItem = {
          ...item,
          nextDirection: currentDirection,
        };
      }
      break;
    case fieldItem:
      if (gameMap[item.y][item.x] !== crossItem) {
        gameMap[item.y][item.x] = item.nextDirection;
      }
      gameMap[nextPosition.y][nextPosition.x] = guardItem;
      currentItem = { ...item, x: nextPosition.x, y: nextPosition.y };
      break;
    case moveUp:
    case moveDown:
    case moveLeft:
    case moveRight:
      currentItem = { ...item, x: nextPosition.x, y: nextPosition.y };
      gameMap[item.y][item.x] = item.nextDirection;
      gameMap[nextPosition.y][nextPosition.x] = crossItem;
      break;
  }
  return [gameMap, currentItem];
}

main();

export default main();
