/*
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400
a 10 b 20 d 100 s 0
*/

type Coordinate = { x: number; y: number };
type Buttons = { a: Coordinate; b: Coordinate };

// const buttons: Buttons = { a: { x: 10, y: 10 }, b: { x: 20, y: 20 } };
// const destination = { x: 40, y: 40 };
const buttons: Buttons = { a: { x: 94, y: 34 }, b: { x: 22, y: 67 } };
const destination = { x: 8400, y: 5400 };
const start: Coordinate = { x: 0, y: 0 };

function getRouteSteps(
  buttons: Buttons,
  origin: Coordinate,
  destination: Coordinate,
  stepCounter: number
): number | undefined {
  //TODO: create deep equality helper function
  if (origin.x === destination.x && origin.y === destination.y) {
    return stepCounter;
  }
  if (origin.x > destination.x || origin.y > destination.y) {
    return undefined;
  }

  const { a, b } = buttons;
  const aInc = { x: origin.x + a.x, y: origin.y + a.y };
  const bInc = { x: origin.x + b.x, y: origin.y + b.y };

  const buttonPressA = getRouteSteps(
    buttons,
    aInc,
    destination,
    stepCounter + 1
  );
  const buttonPressB = getRouteSteps(
    buttons,
    bInc,
    destination,
    stepCounter + 1
  );

  if (!buttonPressA && !buttonPressB) {
    return undefined;
  }
  if (!buttonPressA) {
    return buttonPressB;
  }
  if (!buttonPressB) {
    return buttonPressA;
  }
  return Math.min(buttonPressA, buttonPressB);
}

const result = getRouteSteps(buttons, start, destination, 0);
console.log({ result });
