import { log } from "node:console";
import { readFileSync } from "node:fs";

type OrderMap = { [key: number]: number[] };

function main() {
  const input = readFileSync("./input.txt", "utf8").trim();
  const [orders, updates] = input.split("\n\n");

  const orderMap: OrderMap = fillOrderMap(orders);
  const updatesList: number[][] = fillUpdateList(updates);
  const updateSum = sumUpdates(updatesList, orderMap);
  log({ updateSum });
}

function sumUpdates(updatesList: number[][], orderMap: OrderMap): number {
  let sum = 0;
  for (const update of updatesList) {
    sum += checkUpdates(update, orderMap);
  }
  return sum;
}

function checkUpdates(updates: number[], orderMap: OrderMap): number {
  for (let i = 0; i < updates.length - 1; i++) {
    const current = updates[i];
    const next = updates[i + 1];
    if (!orderMap[current].includes(next)) {
      return 0;
    }
  }
  return updates[Math.floor(updates.length / 2)];
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

function fillOrderMap(input: string): OrderMap {
  const orderMap: OrderMap = {};
  const lines = input.split("\n");
  for (const line of lines) {
    const [before, after] = line.split("|").map(Number);
    if (!orderMap[before]) orderMap[before] = [];
    if (!orderMap[after]) orderMap[after] = [];
    orderMap[before].push(after);
  }
  return orderMap;
}

main();
