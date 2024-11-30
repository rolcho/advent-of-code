import * as fs from "node:fs";

type Range = { start: number; end: number };
type Mapping = { sourceStart: number; sourceEnd: number; offset: number };

const input = fs.readFileSync("example.txt", "utf8");
const sections = input.split("\n\n");
const seedNumbers = sections[0].replace("seeds: ", "").split(" ").map(Number);

// Convert seed numbers to ranges
const seedRanges: Range[] = [];
for (let i = 0; i < seedNumbers.length; i += 2) {
  seedRanges.push({
    start: seedNumbers[i],
    end: seedNumbers[i] + seedNumbers[i + 1] - 1,
  });
}
// Parse mappings
const maps: Mapping[][] = sections.slice(1).map((section) => {
  return section
    .split("\n")
    .slice(1)
    .filter((line) => line.length > 0)
    .map((line) => {
      const [dest, source, length] = line.split(" ").map(Number);
      return {
        sourceStart: source,
        sourceEnd: source + length - 1,
        offset: dest - source,
      };
    })
    .sort((a, b) => a.sourceStart - b.sourceStart);
});

function applyMapping(ranges: Range[], mappings: Mapping[]): Range[] {
  const result: Range[] = [];
  const toProcess = [...ranges];

  while (toProcess.length > 0) {
    const range = toProcess.pop() ?? ([] as unknown as Range);
    let mapped = false;

    for (const mapping of mappings) {
      // Check if range overlaps with mapping
      if (
        range.start <= mapping.sourceEnd &&
        range.end >= mapping.sourceStart
      ) {
        // Calculate overlap
        const overlapStart = Math.max(range.start, mapping.sourceStart);
        const overlapEnd = Math.min(range.end, mapping.sourceEnd);

        // Add mapped range to result
        result.push({
          start: overlapStart + mapping.offset,
          end: overlapEnd + mapping.offset,
        });

        // Add unmapped portions back to toProcess if they exist
        if (range.start < mapping.sourceStart) {
          toProcess.push({
            start: range.start,
            end: mapping.sourceStart - 1,
          });
        }
        if (range.end > mapping.sourceEnd) {
          toProcess.push({
            start: mapping.sourceEnd + 1,
            end: range.end,
          });
        }
        mapped = true;
        break;
      }
    }

    // If range wasn't mapped, add it unchanged
    if (!mapped) {
      result.push(range);
    }
  }
  console.log({ result });
  return result;
}

const start = new Date().getTime();

let currentRanges = seedRanges;
for (const map of maps) {
  currentRanges = applyMapping(currentRanges, map);
}

const lowestLocation = Math.min(...currentRanges.map((range) => range.start));

const end = new Date().getTime();
const minutes = Math.floor((end - start) / 60000);
const seconds = Math.floor((end - start) / 1000) % 60;
const milliseconds = (end - start) % 1000;

console.log(
  `Lowest location: ${lowestLocation} in ${minutes}m ${seconds}s ${milliseconds}ms`
);
