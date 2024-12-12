/*/
If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
If the stone is engraved with a number that has an even number of digits, it is replaced by two stones.
  The left half of the digits are engraved on the new left stone, and the right half of the digits are engraved on the new right stone.
  (The new numbers don't keep extra leading zeroes: 1000 would become stones 10 and 0.)
If none of the other rules apply, the stone is replaced by a new stone; the old stone's number multiplied by 2024 is engraved on the new stone.
*/
const input = "4189 413 82070 61 655813 7478611 0 8";

let nums = input.split(" ").map(Number);
const arrayToString = <T>(items: T[]): string => {
  return `[${items.map((i) => JSON.stringify(i)).join(", ")}]`;
};

for (let i = 0; i < 25; i++) {
  const newNums: number[] = [];
  for (const num of nums) {
    if (num === 0) {
      newNums.push(1);

      continue;
    }
    if (num.toString().length % 2 === 0) {
      const index = num.toString().length / 2;
      const a = Number(num.toString().slice(0, index));
      const b = Number(num.toString().slice(index));
      newNums.push(a, b);

      continue;
    }
    newNums.push(num * 2024);
  }
  nums = [...newNums];
}
console.log(nums.length);
