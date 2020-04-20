import React, { useReducer, useEffect, useState } from 'react';

const colors = ['#9C27B0', '#2196f3', '#ff5722', '#009688', '#673ab7', '#b71c1c'];

const isClose = (state, y, x) => {
  let close = false;
  if (state[y - 1]) if (state[y - 1][x] === 0) close = true;
  if (state[y + 1]) if (state[y + 1][x] === 0) close = true;
  if (state[y][x - 1] === 0 || state[y][x + 1] === 0) close = true;
  return close;
};

const shuffle = grid => {
  let closeNumbers = [];
  let zeroPlace;
  for (let i = 0; i < grid.length; i++) {
    for (let e = 0; e < grid[i].length; e++) {
      if (isClose(grid, i, e)) closeNumbers.push({ y: i, x: e, number: grid[i][e] });
      if (grid[i][e] === 0) zeroPlace = { y: i, x: e, number: grid[i][e] };
    }
  }
  let randomCloseNumber = closeNumbers[Math.floor(Math.random() * closeNumbers.length)];
  grid[randomCloseNumber.y][randomCloseNumber.x] = zeroPlace.number;
  grid[zeroPlace.y][zeroPlace.x] = randomCloseNumber.number;
  return grid;
};

let initialState = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 0],
];

const reducer = (state, { y, x }) => {
  let newState = state.slice();
  let cleanY, cleanX;
  for (let i = 0; i < state.length; i++) {
    let e = state[i].findIndex(el => el === 0);
    if (e >= 0) {
      cleanY = i;
      cleanX = e;
    }
  }
  const close = isClose(state, y, x);
  if (close) {
    newState[cleanY][cleanX] = state[y][x];
    newState[y][x] = 0;
  }
  return newState;
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [color, setColor] = useState('');
  const [clicks, setClicks] = useState(0);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setColor(randomColor);
    for (let i = 0; i < 100; i++) {
      initialState = shuffle(initialState);
    }
  }, []);

  useEffect(() => {
    let grid = [...state];
    let arr = grid.flat(1);
    if (arr[arr.length - 1] === 0) arr.pop();
    let solved = arr.filter((a, b, c) => Math.max.apply(Math, c.slice(0, b)) > a);
    if (solved.length === 0) setSolved(true);
  }, [state]);

  return (
    <>
      {solved && <p className="solved">Solved in {clicks} steps!</p>}
      <div className="grid">
        {state.map((row, y) => (
          <div className="row" key={y}>
            {row.map((cell, x) =>
              cell > 0 ? (
                isClose(state, y, x) && !solved ? (
                  <div
                    key={x}
                    className="cell moveable"
                    onClick={e => {
                      setClicks(clicks + 1);
                      dispatch({ y, x });
                    }}
                    style={{ backgroundColor: color }}
                  >
                    {cell}
                  </div>
                ) : (
                  <div key={x} className="cell" style={{ backgroundColor: color }}>
                    {cell}
                  </div>
                )
              ) : (
                <div key={x} className="cell clean"></div>
              )
            )}
          </div>
        ))}
      </div>
      <p className="rules">To solve the puzzle, the numbers must be rearranged into order</p>

      <a target="_blank" rel="noopener noreferrer" href="https://github.com/antonKurtinDev/15-pazzle">
        <svg enableBackground="new 0 0 24 24" height="25" viewBox="0 0 24 24" width="25" xmlns="http://www.w3.org/2000/svg">
          <path d="m12 .5c-6.63 0-12 5.28-12 11.792 0 5.211 3.438 9.63 8.205 11.188.6.111.82-.254.82-.567 0-.28-.01-1.022-.015-2.005-3.338.711-4.042-1.582-4.042-1.582-.546-1.361-1.335-1.725-1.335-1.725-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.803 2.809 1.282 3.495.981.108-.763.417-1.282.76-1.577-2.665-.295-5.466-1.309-5.466-5.827 0-1.287.465-2.339 1.235-3.164-.135-.298-.54-1.497.105-3.121 0 0 1.005-.316 3.3 1.209.96-.262 1.98-.392 3-.398 1.02.006 2.04.136 3 .398 2.28-1.525 3.285-1.209 3.285-1.209.645 1.624.24 2.823.12 3.121.765.825 1.23 1.877 1.23 3.164 0 4.53-2.805 5.527-5.475 5.817.42.354.81 1.077.81 2.182 0 1.578-.015 2.846-.015 3.229 0 .309.21.678.825.56 4.801-1.548 8.236-5.97 8.236-11.173 0-6.512-5.373-11.792-12-11.792z" fill="#F5F5F5" />
        </svg>
      </a>
    </>
  );
};

export default App;
