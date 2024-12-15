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

type PlotCoordinates = [number, number];

function findPlants(coordinates: PlotCoordinates[]): PlotCoordinates[][] {
  const groups: PlotCoordinates[][] = [];
  const visited: Set<string> = new Set();
  const getKey = (coord: PlotCoordinates) => `${coord[0]},${coord[1]}`;
  const dfs = (coord: PlotCoordinates, group: PlotCoordinates[]) => {
    const key = getKey(coord);
    if (visited.has(key)) return;
    visited.add(key);
    group.push(coord);
    for (const [dx, dy] of [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ]) {
      const newCoord: PlotCoordinates = [coord[0] + dx, coord[1] + dy];
      const newKey = getKey(newCoord);
      if (coordinates.some((c) => getKey(c) === newKey)) {
        dfs(newCoord, group);
      }
    }
  };
  for (const coord of coordinates) {
    const key = getKey(coord);
    if (!visited.has(key)) {
      const group: PlotCoordinates[] = [];
      dfs(coord, group);
      groups.push(group);
    }
  }
  return groups;
}

async function main() {
  const fileContent = await getFileContent("input");
  const plotMatrix = fileContent.split("\n").map((l) => l.split(""));
  const plots: { [key: string]: PlotCoordinates[] } = {};

  for (let row = 0; row < plotMatrix.length; row++) {
    for (let column = 0; column < plotMatrix[0].length; column++) {
      const currentPlot = plotMatrix[row][column];
      if (plots[currentPlot] === undefined) {
        plots[currentPlot] = [];
      }
      plots[currentPlot].push([row, column]);
    }
  }

  let sum = 0;
  for (const [_, plot] of Object.entries(plots)) {
    const plants = findPlants(plot);
    for (const plant of plants) {
      const size = plant.length;
      let perimeter = 0;
      for (const [x, y] of plant) {
        if (!plant.some((p) => p[0] === x + 1 && p[1] === y)) perimeter++;
        if (!plant.some((p) => p[0] === x - 1 && p[1] === y)) perimeter++;
        if (!plant.some((p) => p[0] === x && p[1] === y + 1)) perimeter++;
        if (!plant.some((p) => p[0] === x && p[1] === y - 1)) perimeter++;
      }
      sum += size * perimeter;
    }
  }
  console.log({ sum });
}
main();
