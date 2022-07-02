import '../css/snake.css';
import React, { useEffect, useState, useRef } from 'react';
var _ = require('lodash');

function SnakeGame() {

  const GRID_ROWS = parseInt(getComputedStyle(document.body).getPropertyValue('--grid-rows'));

  const GRID_COLUMNS = parseInt(getComputedStyle(document.body).getPropertyValue('--grid-columns'));

  const KEY_DIRECTIONS = {
    'ArrowUp': { x: -1, y: 0 },
    'ArrowDown': { x: 1, y: 0 },
    'ArrowLeft': { x: 0, y: -1 },
    'ArrowRight': { x: 0, y: 1 },
  }

  const [grid, setGrid] = useState([]);

  const [snakeBody, setSnakeBody] = useState([{ x: 4, y: 4 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 5, y: 2 }, { x: 5, y: 1 }]);

  const [foodSpot, setFoodSpot] = useState({});

  const [direction, setDirection] = useState(KEY_DIRECTIONS['ArrowRight']);

  const interval = useRef(null)

  let gridItems = [];
  for (let i = 0; i < GRID_ROWS; i++) {
    gridItems[i] = [];
    for (let j = 0; j < GRID_COLUMNS; j++) {
      gridItems[i].push(j);
    }
  }

  useEffect(() => {
    setGrid(gridItems);
    window.addEventListener("keydown", (e) => {
      if (typeof KEY_DIRECTIONS[e.key] === 'undefined')
        return;

      setDirection(KEY_DIRECTIONS[e.key])
    })
    return () => {
      window.removeEventListener('keydown', () => { });
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      moveSnake();
    }, 500)

    return () => clearInterval(interval);
  }, [direction, snakeBody]);
  

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