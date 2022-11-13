import React, { useCallback, useState } from 'react';
import { Board } from './board';
import Button from 'react-bootstrap/Button';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const GAME_WIDTH = 800;

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState([0, 0]);
  const [speed, setSpeed] = useState(1.5);
  const [leftPlayerName, setLeftPlayerName] = useState("Left");
  const [rightPlayerName, setRightPlayerName] = useState("Right");

  const toggleRunning = useCallback(() => {
    setIsRunning(currentIsRunning => !currentIsRunning);
  }, []);

  const onHit = useCallback((toLeft: boolean) => {
    alert(`HIT!!!\nPlayer "${toLeft ? rightPlayerName : leftPlayerName}" gets one point!`);
    setScore(currentScore =>
      toLeft
        ? [currentScore[0], currentScore[1] + 1]
        : [currentScore[0] + 1, currentScore[1]]
    )
  }, [leftPlayerName, rightPlayerName]);

  return (
    <div className="App">
      <div className="App__main-container" style={{ width: GAME_WIDTH }}>
        <div className="App__control-panel">
          <ToggleButtonGroup type="radio" value={speed} onChange={setSpeed} name="speed">
            <ToggleButton id="tbg-btn-1" value={1} variant="outline-info" size="sm" type="radio">
              Slow
            </ToggleButton>
            <ToggleButton id="tbg-btn-2" value={1.5} variant="outline-success" size="sm" type="radio">
              Normal
            </ToggleButton>
            <ToggleButton id="tbg-btn-3" value={2} variant="outline-warning" size="sm" type="radio">
              Fast
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div className="App__control-panel">
          <div className="App__score">{score[0]}</div>
          <Button
            className="App__pause-button"
            onClick={toggleRunning}
            variant={isRunning ? 'outline-danger' : 'outline-success'}
            size="sm"
          >
            {isRunning ? 'Pause' : 'Run'}
          </Button>
          <div className="App__score">{score[1]}</div>
        </div>
        <Board
          width={GAME_WIDTH}
          height={400}
          leftPanelColor="red"
          rightPanelColor="blue"
          panelHeight={100}
          isRunning={isRunning}
          onHit={onHit}
          speed={speed}
        />
      </div>
    </div>
  );
}

export default App;
