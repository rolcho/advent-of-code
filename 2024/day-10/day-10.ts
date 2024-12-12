type ElevationNode = {
  x: number;
  y: number;
  elevation: number;
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
  const data = await getFileContent("example");
  const elevations: ElevationNode[] = data
    .split("\n")
    .map((line, y) =>
      line
        .split("")
        .map((c, x) => ({ x, y, elevation: Number(c) }) as ElevationNode),
    )
    .flat(2)
    .filter((n) => !Number.isNaN(n.elevation));
  const starts = elevations.filter((n) => n.elevation === 0);

  let countFullRoute = 0;
  for (const start of starts) {
    countFullRoute += isFullRoute(start) ? 1 : 0;
  }

  console.log({ starts });
}
main();

function isFullRoute(startNode: ElevationNode): boolean {}
