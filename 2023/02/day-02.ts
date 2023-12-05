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

function isValidPull(
  pull: Pull,
  maxValue: Pull = { red: 0, green: 0, blue: 0 }
): boolean {
  return (
    pull.blue <= maxValue.blue &&
    pull.green <= maxValue.green &&
    pull.red <= maxValue.red
  );
}

function isValidGame(
  currentGame: Game,
  maxValue: Pull = { red: 0, green: 0, blue: 0 }
): boolean {
  return (
    currentGame.pulls.length ===
    currentGame.pulls.filter((pull) => isValidPull(pull, maxValue)).length
  );
}

function engoughColorSum(
  maxValue: Pull = { red: 0, green: 0, blue: 0 },
  games: Game[]
): number {
  let sumGoodGames = 0;
  games.forEach((game) => {
    if (isValidGame(game, maxValue)) {
      sumGoodGames += game.id;
    }
  });
  return sumGoodGames;
}

const sumGoodGames = engoughColorSum({ red: 12, green: 13, blue: 14 }, games);

console.log(sumGoodGames);
