type Coordinate = { x: number; y: number };

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

function processInput(
  input: string,
  size: Coordinate,
  times: number,
): Coordinate[] {
  const robots: Coordinate[] = [];
  const lines = input.split("\n");
  for (const line of lines) {
    const [position, velocity] = line
      .split(" ")
      .map((s) => s.slice(2).split(","));
    const [px, py] = position.map((c) => Number(c));
    const [vx, vy] = velocity.map((c) => Number(c) * times);
    const [nx, ny] = [(px + vx) % size.x, (py + vy) % size.y];
    // ha
    const rx =
      vx > 0 ? (px + vx) % size.x : nx < 0 ? size.x - Math.abs(nx) : nx;
    const ry =
      vy > 0 ? (py + vy) % size.y : ny < 0 ? size.y - Math.abs(ny) : ny;
    const r = { x: rx, y: ry };
    robots.push(r);
  }
  return robots;
}

function getMultiplicatonOfQuadrants(
  robots: Coordinate[],
  size: Coordinate,
): number {
  const mx = Math.floor(size.x / 2);
  const my = Math.floor(size.y / 2);
  const q1 = robots.filter((r) => r.x < mx && r.y < my);
  const q2 = robots.filter((r) => r.x > mx && r.y < my);
  const q3 = robots.filter((r) => r.x < mx && r.y > my);
  const q4 = robots.filter((r) => r.x > mx && r.y > my);
  console.log({ mx, my, q1, q2, q3, q4 });
  return q1.length * q2.length * q3.length * q4.length;
}

async function main() {
  const boardSize = { x: 101, y: 103 };
  const seconds = 100;
  const input = await getFileContent("input");
  const robots = processInput(input, boardSize, seconds);
  const result = getMultiplicatonOfQuadrants(robots, boardSize);
  console.log({ result });
}
main();
