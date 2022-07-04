import React, { useState } from 'react';
import Score from "./components/Score";
import SnakeGame from "./components/SnakeGame";

function App() {

  const [startGame, setStartGame] = useState(false);

  const [score, setScore] = useState(0);

  function changeGameStatus() {
    setStartGame(!startGame);
  }
  return (
    <div className="App">

      <div className="header">
        <Score score={score} />
        <h1>SNAKE GAME {startGame}</h1>
        <button className="start-game" onClick={() => changeGameStatus()}>{startGame ? 'Stop Game' : 'Start Game'}</button>

      </div>
      <SnakeGame startGame={startGame} setScore={setScore} />

    </div>
  );
}

export default App;
