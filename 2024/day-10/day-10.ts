type ElevationNode = {
  x: number;
  y: number;
  elevation: number;
  visited: boolean;
};

async function getFileContent(
  contentType: "example" | "input",
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

async function main() {
  const data = await getFileContent("input");
  let elevations: ElevationNode[] = data
    .split("\n")
    .map((line, y) =>
      line
        .split("")
        .map(
          (c, x) =>
            ({ x, y, elevation: Number(c), visited: false }) as ElevationNode,
        ),
    )
    .flat(2)
    .filter((n) => !Number.isNaN(n.elevation));
  const starts = elevations.filter((n) => n.elevation === 0);

  let trailHeadCount = 0;
  for (const start of starts) {
    trailHeadCount += connectedWith(start, 0, elevations);
    elevations = elevations.map((n) => ({
      x: n.x,
      y: n.y,
      elevation: n.elevation,
      visited: false,
    }));
  }
  const trailHeads = elevations.filter((n) => n.visited);
  console.log({ trailHeadCount });
}
main();

const dirs = [
  { x: 0, y: -1, elevation: 1 },
  { x: 0, y: 1, elevation: 1 },
  { x: -1, y: 0, elevation: 1 },
  { x: 1, y: 0, elevation: 1 },
] as const;

function connectedWith(
  cNode: ElevationNode,
  e: number,
  eNodes: ElevationNode[],
): number {
  if (e === 9) {
    const vNode = eNodes.find((n) => n.x === cNode.x && n.y === cNode.y);
    if (vNode) vNode.visited = true;
    return 1;
  }

  const connections: ElevationNode[] = [];

  const getConnectedNode = (
    n: ElevationNode,
    ns: ElevationNode[],
    dir: { x: number; y: number; elevation: number },
    e,
  ): ElevationNode | undefined => {
    const c: ElevationNode = {
      x: n.x + dir.x,
      y: n.y + dir.y,
      elevation: n.elevation + dir.elevation,
      visited: n.visited,
    };
    return ns.some(
      (n) =>
        n.x === c.x && n.y === c.y && n.elevation === c.elevation && !n.visited,
    )
      ? c
      : undefined;
  };

  for (const dir of dirs) {
    const c = getConnectedNode(cNode, eNodes, dir, e);
    if (c !== undefined) connections.push(c);
  }

  let trails = 0;

  if (connections.length === 0) return 0;

  for (const connection of connections) {
    trails += connectedWith(connection, e + 1, eNodes);
  }
  return trails;
}
