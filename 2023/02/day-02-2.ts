import * as fs from "fs";

const gameText = fs.readFileSync("input.txt", "utf8");

// const gameText = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
// Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
// Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
// Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
// Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

type Pull = {
  [key in ColorNames]: number;
};

type Game = {
  id: number;
  pulls: Pull[];
};

type ColorNames = "red" | "green" | "blue";

const games: Game[] = createGameFromText(gameText);

function createGameFromText(gameText: string): Game[] {
  const createdGames: Game[] = [];

  gameText.split("\n").forEach((game) => {
    const currentGameText = game.split(": ");
    const currentGameId = parseInt(currentGameText[0].split(" ")[1]);
    const currentGame: Game = { id: currentGameId, pulls: [] };

    currentGameText[1].split("; ").forEach((pull) => {
      const pullColorValues: Pull = { red: 0, green: 0, blue: 0 };
      pull.split(", ").forEach((color) => {
        const amountColor = color.split(" ");
        pullColorValues[amountColor[1] as ColorNames] = parseInt(
          amountColor[0]
        );
      });
      currentGame.pulls.push(pullColorValues);
    });
    createdGames.push(currentGame);
  });
  return createdGames;
}

function maxPull(
  pull: Pull,
  maxValue: Pull = { red: 0, green: 0, blue: 0 }
): Pull {
  maxValue.blue = Math.max(maxValue.blue, pull.blue);
  maxValue.green = Math.max(maxValue.green, pull.green);
  maxValue.red = Math.max(maxValue.red, pull.red);
  return maxValue;
}

function sumGame(currentGame: Game): number {
  let maxValue: Pull = { red: 0, green: 0, blue: 0 };
  currentGame.pulls.forEach((pull) => {
    maxValue = maxPull(pull, maxValue);
  });
  return maxValue.blue * maxValue.red * maxValue.green;
}

function totalOfGames(games: Game[]): number {
  let sumTotal = 0;
  games.forEach((game) => {
    sumTotal += sumGame(game);
  });
  return sumTotal;
}

const totalCubes = totalOfGames(games);

console.log(totalCubes);
