import Game from "./Game";
import Djikstra from "./Djikstra";
import yargs from "yargs";

console.log("Starting Pony Challenge Solver");

const argv = yargs.argv;
// parse command line arguments;

let { width, height, name, difficulty } = argv;
if (!width || width < 15 || width > 25) {
  console.log("Invalid or no width provided. Defaulting to 15");
  width = 15;
}
if (!height || height < 15 || height > 25) {
  console.log("Invalid or no height provided. Defaulting to 15");
  height = 15;
}
if (!name) {
  console.log("Invalid or no name provided. Defaulting to 'Derpy Hooves'");
  name = "Derpy Hooves";
}
if (
  difficulty === undefined ||
  difficulty === null ||
  difficulty < 0 ||
  difficulty > 10
) {
  console.log(
    "Invalid or no difficulty provided. Let's make this easy: Defaulting to 0"
  );
  difficulty = 0;
}

let maze;
let move;
let g = new Game({
  width,
  height,
  playerName: name,
  difficulty
});

const calcMove = (maze, priorMove) => {
  let move = new Djikstra(maze, priorMove).solve();
  console.log(maze.print(move.pathway));
  return { nextMove: move.nextMove, legalMoves: move.legalMoves };
};

// count and priorMove available to promiseLoop via closure.
let count = 0;
let priorMove = null;
const promiseLoop = (g, maze) => {
  console.log("move#", count++);
  const { nextMove, legalMoves } = calcMove(maze, priorMove);
  priorMove = nextMove;
  return g.move(nextMove, legalMoves).then(postMove => {
    priorMove = postMove.lastMove;
    if (postMove.state !== "active") {
      if (postMove.state === "won") {
        return "CONGRATULATIONS!";
      }
      if (postMove.state === "over") {
        return "THE DOMOKUN HAS EATEN THE PONY. DISHONOR ON YOU. DISHONOR ON YOUR FAMILY. DISHONOR ON YOUR COW";
      }
      return postMove.state;
    } else {
      return delayLoop(g, postMove.maze);
    }
  });
};

const DELAY = 0; // for testing - if you want a delay, set it here
const delayLoop = (g, maze) =>
  new Promise(resolve => {
    if (DELAY) {
      setTimeout(() => resolve(promiseLoop(g, maze)), DELAY);
    } else {
      resolve(promiseLoop(g, maze));
    }
  });

// start the game
g
  .init()
  .then(({ maze, state }) => {
    return delayLoop(g, maze).then(status => console.log(status));
  })
  .catch(err => console.error({ err }));
