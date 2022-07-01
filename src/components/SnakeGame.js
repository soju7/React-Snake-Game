import '../css/snake.css';
import React, { useEffect, useState } from 'react';

function SnakeGame() {

  const GRID_ROWS=getComputedStyle(document.body).getPropertyValue('--grid-rows');

  const GRID_COLUMNS=getComputedStyle(document.body).getPropertyValue('--grid-columns');

  const [grid, setGrid] = useState([]);

  const [snakeBody,setSnakeBody]=useState([{x:4,y:4},{x:4,y:5},{x:5,y:5},{x:6,y:5},{x:6,y:6}]);

  const [foodSpot,setFoodSpot]=useState({x:8,y:2})
  
  let gridItems=[];
  for(let i=0;i<GRID_ROWS;i++){
    gridItems[i]=[];
    for(let j=0;j<GRID_COLUMNS;j++){
        gridItems[i].push(j);
    }
  }

  useEffect(() => {
    setGrid(gridItems);
  }, []);

  function isCellContainSnakeBody(x,y){
    return snakeBody.find(function(el) {
        return el.x == x && el.y==y;
    })
  }

  function isCellContainFood(x,y){
    return foodSpot.x == x && foodSpot.y==y;
  }

  return (
    <div className="container">        
      <div className='snake-grid'>
       {
            grid.map(function(rows,rowIndex) {
                return rows.map(function(column,columnIndex) {
                    
                    return <div className={`cell ${isCellContainSnakeBody(rowIndex,columnIndex) ? 'snake-body' : ''} ${isCellContainFood(rowIndex,columnIndex)? 'food' : ''}`}
                    key={[rowIndex, '-', columnIndex].join()}></div>
                })                
            })
       }
      </div>
    </div>
  );
}

export default SnakeGame;