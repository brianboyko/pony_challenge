import Game from "./Game";
import djikstra from "./djikstra";

console.log("Starting Pony Challenge Solver");
let maze;
let move;
let g = new Game({
  width: 25,
  height: 20,
  playerName: "twilight sparkle",
  difficulty: 0
});

const end = ending => {
  console.log("Game Over:", ending);
};

const calcMove = (maze, priorMove) => {
  let d = djikstra(maze, priorMove);
  console.log(maze.print(d.path));
  return { nextMove: d.nextMove, legalMoves: d.legalMoves };
};

let count = 0;
let priorMove = null;
const promiseLoop = (g, maze) => {
  console.log("move#", count++);
  const { nextMove, legalMoves } = calcMove(maze, priorMove);
  console.log({ nextMove, legalMoves });
  priorMove = nextMove;
  return g.move(nextMove, legalMoves).then(postMove => {
    priorMove = postMove.lastMove;
    if (postMove.state !== "active") {
      console.log("postMove.state", postMove.state);
      if (postMove.state === "won") {
        return "CONGRATULATIONS!";
      }
      if (postMove.state === "over"){
        return "THE DOMOKUN HAS EATEN YOU. DISHONOR ON YOU. DISHONOR ON YOUR FAMILY. DISHONOR ON YOUR COW"
      }
      return postMove.state;
    } else {
      return delayLoop(g, postMove.maze);
    }
  });
};

const DELAY = 0;
const delayLoop = (g, maze) =>
  new Promise(resolve => {
    if (DELAY) {
      setTimeout(() => resolve(promiseLoop(g, maze)), 2000);
    } else {
      resolve(promiseLoop(g, maze));
    }
  });

g
  .init()
  .then(({ maze, state }) => {
    return delayLoop(g, maze).then(status => console.log(status));
  })
  .catch(err => console.error({ err }));
