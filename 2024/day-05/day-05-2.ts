type Rule = [number, number];

async function main() {
  let fileContent = "";
  try {
    const file = Bun.file(`${__dirname}/input.txt`);
    fileContent = await file.text();
  } catch (error) {
    console.error(error);
    return;
  }
  const input = fileContent.trim();

  const [raw_rules, updates] = input.split("\n\n");

  const rules: Rule[] = fillRules(raw_rules);
  const updatesList: number[][] = fillUpdateList(updates);
  const updateSum = sumUpdates(updatesList, rules);
  console.log({ updateSum });
}

function sumUpdates(updatesList: number[][], rules: Rule[]): number {
  let sum = 0;
  for (const update of updatesList) {
    sum += checkUpdate(update, rules);
  }
  return sum;
}

function checkUpdate(updates: number[], rules: Rule[]): number {
  for (const [current, next] of rules) {
    if (
      updates.includes(current) &&
      updates.includes(next) &&
      !(updates.indexOf(current) < updates.indexOf(next))
    )
      return correctUpdate(updates, rules)[updates.length >> 1];
  }
  return 0;
}

function correctUpdate(updates: number[], rules: Rule[]): number[] {
  const myRules: Rule[] = rules.filter(
    ([current, next]) => updates.includes(current) && updates.includes(next)
  );

  const occurrence = new Map<number, number>();
  for (const [_, next] of myRules) {
    occurrence.set(next, (occurrence.get(next) ?? 0) + 1);
  }

  const fixedUpdate: number[] = [];

  while (fixedUpdate.length < updates.length) {
    const available = updates.find(
      (element) =>
        !fixedUpdate.includes(element) &&
        (!occurrence.has(element) || occurrence.get(element) === 0)
    );
    if (available === undefined) return [];

    fixedUpdate.push(available);

    for (const [current, next] of myRules) {
      if (current === available) {
        occurrence.set(next, (occurrence.get(next) ?? 0) - 1);
      }
    }
  }
  return fixedUpdate;
}

function fillUpdateList(input: string): number[][] {
  const updateLines = input.split("\n");
  const updateList: number[][] = [];
  for (const updateLine of updateLines) {
    const updates = updateLine.split(",").map(Number);
    updateList.push(updates);
  }
  return updateList;
}

function fillRules(input: string): Rule[] {
  const rules: Rule[] = [];
  const lines = input.split("\n");
  for (const line of lines) {
    const [before, after] = line.split("|").map(Number);
    rules.push([before, after]);
  }
  return rules;
}

main();
