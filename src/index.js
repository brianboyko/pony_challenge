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

const calcMove = maze => {
  let move = djikstra(maze);
  console.log(maze.print(move.path));
  return move.nextMove;
};
let count = 0;

const promiseLoop = (g, maze) => {
  console.log("move#", count++);
  const move = calcMove(maze);
  return g.move(move).then(postMove => {
    if (postMove.state !== "active") {
      console.log("postMove.state", postMove.state)
      return "done";
    } else {
      return delayLoop(g, postMove.maze);
    }
  });
};

const delayLoop = (g, maze) => new Promise((resolve) => {
  setTimeout(() => resolve(promiseLoop(g, maze)), 2000)
})

g.init().then(({ maze, state }) => {
  return delayLoop(g, maze).then(status => console.log(status));
}).catch((err) => console.error({err}))
