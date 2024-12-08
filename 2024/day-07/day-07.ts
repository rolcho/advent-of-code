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

type Data = { result: number; numbers: number[] };
type DataArray = Data[];

export async function main() {
  let totalSum = 0;
  const lines = (await getFileContent("input")).split("\n") as string[];
  const datas: DataArray = lines.map((line) => {
    const [result, num] = line.split(": ");
    const numbers = num.split(" ").map(Number);
    return { result: Number(result), numbers };
  });

  for (const data of datas) {
    const isCorrect = checkResult(
      data.result,
      `${data.numbers[0]}`,
      data.numbers,
      1
    );
    if (isCorrect) totalSum += data.result;
  }
  console.log({ totalSum });
}

main();

function checkResult(
  result: number,
  equality: string,
  numbers: number[],
  index: number
): boolean {
  if (index === numbers.length) {
    const isCorrect = result === calculate(equality);
    return isCorrect;
  }
  return (
    checkResult(result, `${equality})+${numbers[index]}`, numbers, index + 1) ||
    checkResult(result, `${equality})*${numbers[index]}`, numbers, index + 1) ||
    // Part 2
    checkResult(result, `${equality})|${numbers[index]}`, numbers, index + 1)
  );
}

function calculate(line: string): number {
  const cals = line.split(")");
  let result = 0;
  for (const cal of cals) {
    switch (cal[0]) {
      case "+":
        result += Number(cal.slice(1));
        break;
      case "*":
        result *= Number(cal.slice(1));
        break;
      // Part 2
      case "|":
        result = Number(`${result}${cal.slice(1)}`);
        break;
      default:
        result = Number(cal);
    }
  }
  return result;
}
