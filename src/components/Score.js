import React, {useState} from 'react';

function Score(props) {


  return (
    <div className="score">
        <h1>Score:</h1>
        <span className='number'>{props.score}</span>
    </div>
  );
}

export default Score;