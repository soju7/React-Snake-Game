import '../css/snake.css';
import React, { useEffect, useState } from 'react';
var _ = require('lodash');

function SnakeGame(props) {

  const GRID_ROWS = parseInt(getComputedStyle(document.body).getPropertyValue('--grid-rows'));

  const GRID_COLUMNS = parseInt(getComputedStyle(document.body).getPropertyValue('--grid-columns'));

  const KEY_DIRECTIONS = {
    'ArrowUp': { x: -1, y: 0 },
    'ArrowDown': { x: 1, y: 0 },
    'ArrowLeft': { x: 0, y: -1 },
    'ArrowRight': { x: 0, y: 1 },
  }

  const [grid, setGrid] = useState([]);

  const [snakeBody, setSnakeBody] = useState([{ x: 4, y: 4 }]);

  const [foodSpot, setFoodSpot] = useState({});

  const [direction, setDirection] = useState(KEY_DIRECTIONS['ArrowRight']);

  const [score, setScore] = useState(0);

  const [timer, setTimer] = useState('');

  const [startGame, setStartGame] = useState(props.startGame);

  let gridItems = [];
  for (let i = 0; i < GRID_ROWS; i++) {
    gridItems[i] = [];
    for (let j = 0; j < GRID_COLUMNS; j++) {
      gridItems[i].push(j);
    }
  }


  useEffect(() => {
    setGrid(gridItems);
    setFoodSpot(calculateFoodSpot())
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!startGame) {
      clearInterval(timer);
      return;
    }

    const interval = setInterval(() => {
      moveSnake();
    }, 100)
    setTimer(interval);


    return () => clearInterval(interval);
  }, [direction, snakeBody, startGame]);

  useEffect(() => {
    setStartGame(props.startGame);
  }, [props])


  useEffect(() => {
    props.setScore(score);
  }, [score])




  function handleKeyDown(e) {
    if (typeof KEY_DIRECTIONS[e.key] === 'undefined')
      return;

    setDirection(KEY_DIRECTIONS[e.key])
  }

  function getDirection(x, y) {
    if (x == 0 && y == -1) {
      return 'ArrowLeft';
    }
    else if (x == 0 && y == 1) {
      return 'ArrowRight';
    }
    else if (x == -1 && y == 0) {
      return 'ArrowUp';
    }
    else if (x == 1 && y == 0) {
      return 'ArrowDown';
    }
  }

  function moveSnake() {
    if (isSnakeCollideItself()) {
      clearInterval(timer);
      return;
    }
    let { x: snakeHeadX, y: snakeHeadY } = snakeBody[0];

    let movement = getDirection(direction.x, direction.y);

    let newState = [...snakeBody];


    if (snakeHeadY >= GRID_COLUMNS && movement == 'ArrowRight') {
      snakeHeadY = -1;
    }

    if (snakeHeadY < 0 && movement == 'ArrowLeft') {
      snakeHeadY = GRID_COLUMNS;
    }

    if (snakeHeadX < 0 && movement == 'ArrowUp') {
      snakeHeadX = GRID_ROWS;
    }

    if (snakeHeadX >= GRID_ROWS && movement == 'ArrowDown') {
      snakeHeadX = -1;
    }

    snakeHeadX = snakeHeadX + direction.x;
    snakeHeadY = snakeHeadY + direction.y;

    if (isSnakeHeadAtFoodSpot(snakeHeadX, snakeHeadY)) {
      setFoodSpot(calculateFoodSpot())
      setScore(score + 1);
      newState.push({ x: snakeHeadX, y: snakeHeadY })
    }

    for (let i = newState.length - 1; i > 0; i--) {
      newState[i] = { ...newState[i - 1] };
    }

    newState[0].x = snakeHeadX;
    newState[0].y = snakeHeadY;

    setSnakeBody(newState);
  }

  function isCellContainSnakeBody(x, y) {
    return snakeBody.find(function (el) {
      return el.x == x && el.y == y;
    })
  }

  function isCellContainFood(x, y) {
    return foodSpot.x == x && foodSpot.y == y;
  }

  function calculateFoodSpot() {
    let x = Math.floor((Math.random() * (gridItems.length)));
    let y = gridItems[x][Math.floor((Math.random() * (gridItems[x].length)))];
    return { x, y };
  }

  function isSnakeHeadAtFoodSpot(snakeHeadX, snakeHeadY) {
    return foodSpot.x == snakeHeadX && foodSpot.y == snakeHeadY;
  }

  function isSnakeCollideItself() {
    let bodyOfSnake = snakeBody;
    let headOfSnake = snakeBody[0];
    return bodyOfSnake.some((bodyPart, index) => {
      return index != 0 && bodyPart.x == headOfSnake.x && bodyPart.y == headOfSnake.y
    });
  }

  return (
    <div className="container">
      <div className='snake-grid'>
        {
          grid.map(function (rows, rowIndex) {
            return rows.map(function (column, columnIndex) {

              return <div className={`cell ${isCellContainSnakeBody(rowIndex, columnIndex) ? 'snake-body' : ''} ${isCellContainFood(rowIndex, columnIndex) ? 'food' : ''}`}
                key={[rowIndex, '-', columnIndex].join()}></div>
            })
          })
        }
      </div>
    </div>
  );
}

export default SnakeGame;