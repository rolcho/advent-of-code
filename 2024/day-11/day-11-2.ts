/*/
If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
If the stone is engraved with a number that has an even number of digits, it is replaced by two stones.
  The left half of the digits are engraved on the new left stone, and the right half of the digits are engraved on the new right stone.
  (The new numbers don't keep extra leading zeroes: 1000 would become stones 10 and 0.)
If none of the other rules apply, the stone is replaced by a new stone; the old stone's number multiplied by 2024 is engraved on the new stone.
*/
//const input = "125 17";
const input = "4189 413 82070 61 655813 7478611 0 8";

const nums = input.split(" ").map(Number);
const cache = new Map<string, number>();

function getNumbersFrom(n: number, l: number, r: number): number {
  const key = `${n},${l},${r}`;
  if (cache.has(key)) return cache.get(key)!;

  let result: number;
  if (l === 0) {
    result = 1;
  } else if (n === 0) {
    result = r + getNumbersFrom(1, l - 1, r);
  } else if (String(n).length % 2 === 0) {
    const index = n.toString().length / 2;
    const a = Number(n.toString().slice(0, index));
    const b = Number(n.toString().slice(index));
    result = r + getNumbersFrom(a, l - 1, r) + getNumbersFrom(b, l - 1, r);
  } else {
    result = r + getNumbersFrom(n * 2024, l - 1, r);
  }

  cache.set(key, result);
  return result;
}

let result = 0;
for (const num of nums) {
  result += getNumbersFrom(num, 75, 0);
}

console.log({ result });
