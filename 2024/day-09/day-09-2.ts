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

async function getBlocks(
  from: "example" | "input"
): Promise<(number | undefined)[]> {
  const file = await getFileContent(from);
  const datas = file.split("").map(Number);
  let blocks: (number | undefined)[] = [];
  for (let i = 0; i < datas.length / 2; i++) {
    const data = new Array(datas[i * 2]).fill(i);
    const free =
      datas[i * 2 + 1] !== undefined
        ? new Array(datas[i * 2 + 1]).fill(undefined)
        : [];
    blocks = [...blocks, ...data, ...free];
  }
  return blocks;
}

type BlockInfo = {
  size: number;
  content: number | undefined;
  moved: boolean;
};

async function main() {
  const blocks = await getBlocks("input");
  let blockMap = new Map<number, BlockInfo>();

  let chunkContent: number | undefined = undefined;
  let chunkSize = 0;
  let chunkIndex = 0;

  for (let i = 0; i < blocks.length; i++) {
    if (chunkSize === 0) {
      chunkContent = blocks[i];
      chunkIndex = i;
    }
    chunkSize++;
    if (blocks[i + 1] !== chunkContent) {
      switch (chunkContent) {
        case undefined:
          blockMap.set(chunkIndex, {
            size: chunkSize,
            content: undefined,
            moved: false,
          });
          break;
        default:
          blockMap.set(chunkIndex, {
            size: chunkSize,
            content: chunkContent,
            moved: false,
          });
          break;
      }
      chunkSize = 0;
    }
  }

  for (let cnt = 0; cnt < 10; cnt++) {
    let nextFileIndex: number = seekNextFile(blocks.length - 1, blockMap);
    let firstFreeSpaceIndex = seekFirstFreeSpace(blocks.length, blockMap);
    console.clear();
    const before = print(blockMap, blocks.length);

    Bun.write(
      `step-${cnt}.txt`,
      `blocks: ${blocks.length} size: ${before.length} sum: ${sumBlocks(
        blockMap
      )}\nblockMap: ${before}`
    );

    while (nextFileIndex >= 0) {
      blockMap = mergeFreeSpaces(blockMap, blocks.length);
      // await waitForSeconds(0.01);
      // console.clear();
      // print(blockMap, blocks.length);
      const nextFile = blockMap.get(nextFileIndex);
      if (!nextFile) break;
      firstFreeSpaceIndex = seekFirstFreeSpace(nextFile.size, blockMap);
      const firstFreeSpace = blockMap.get(firstFreeSpaceIndex);

      if (!firstFreeSpace || firstFreeSpaceIndex === -1 || nextFile.moved) {
        nextFileIndex = seekNextFile(nextFileIndex, blockMap);
        continue;
      }

      blockMap.delete(firstFreeSpaceIndex);

      if (firstFreeSpace.size - nextFile.size > 0)
        blockMap.set(firstFreeSpaceIndex + nextFile.size, {
          size: firstFreeSpace.size - nextFile.size,
          content: undefined,
          moved: true,
        });

      blockMap.set(firstFreeSpaceIndex, {
        size: nextFile.size,
        content: nextFile.content,
        moved: true,
      });

      blockMap.set(nextFileIndex, {
        size: nextFile.size,
        content: undefined,
        moved: true,
      });

      nextFileIndex = seekNextFile(nextFileIndex, blockMap);
    }
  }
  const after = print(blockMap, blocks.length);
  Bun.write(
    "after.txt",
    `blocks: ${blocks.length} size: ${after.length} sum: ${sumBlocks(
      blockMap
    )}\nblockMap: ${after}`
  );
  console.log(sumBlocks(blockMap));
}
main();
const seekNextFile = (
  startIndex: number,
  blockMap: Map<number, BlockInfo>
): number => {
  for (let i = startIndex - 1; i >= 0; i--) {
    const blockInfo = blockMap.get(i);

    if (blockInfo && blockInfo.content !== undefined) {
      return i;
    }
  }
  return -1;
};

const seekFirstFreeSpace = (
  fileSize: number,
  blockMap: Map<number, BlockInfo>
): number => {
  for (let i = 0; i < blockMap.size; i++) {
    const blockInfo = blockMap.get(i);
    if (
      blockInfo &&
      blockInfo.content === undefined &&
      blockInfo.size >= fileSize
    ) {
      return i;
    }
  }
  return -1;
};
function mergeFreeSpaces(
  blockMap: Map<number, BlockInfo>,
  size: number
): Map<number, BlockInfo> {
  for (let i = 0; i < size; i++) {
    const blockInfo = blockMap.get(i);
    if (blockInfo && blockInfo.content === undefined) {
      const nextBlockInfo = blockMap.get(blockInfo.size + i);
      if (nextBlockInfo && nextBlockInfo.content === undefined) {
        blockMap.set(i, {
          size: blockInfo.size + nextBlockInfo.size,
          content: undefined,
          moved: false,
        });
        blockMap.delete(blockInfo.size + i);
      }
    }
  }
  return blockMap;
}
function sumBlocks(blockMap: Map<number, BlockInfo>): number {
  let sum = 0;
  for (const [startIndex, blockInfo] of blockMap) {
    if (blockInfo.content !== undefined) {
      for (let i = 0; i < blockInfo.size; i++) {
        sum += (startIndex + i) * blockInfo.content;
      }
    }
  }
  return sum;
}
function print(blockMap: Map<number, BlockInfo>, size: number): string {
  let str = "";
  for (let i = 0; i < size; i++) {
    const blockInfo = blockMap.get(i);
    if (blockInfo) {
      const content = new Array(blockInfo.size)
        .fill(blockInfo.content ? "X" : ".")
        .join("|");
      str += `${content}|`;
    }
  }
  console.log(str);
  return str;
}
